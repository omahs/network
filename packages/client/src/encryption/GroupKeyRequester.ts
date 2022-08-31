import { EthereumAddress, GroupKeyRequest, MessageID, StreamMessage, StreamMessageType, StreamPartID, StreamPartIDUtils } from 'streamr-client-protocol'
import { inject, Lifecycle, scoped } from 'tsyringe'
import { Authentication, AuthenticationInjectionToken } from '../Authentication'
import { NetworkNodeFacade } from '../NetworkNodeFacade'
import { createRandomMsgChainId } from '../publish/MessageChain'
import { pOnce } from '../utils/promises'
import { uuid } from '../utils/uuid'
import { Validator } from '../Validator'
import { GroupKeyStoreFactory } from './GroupKeyStoreFactory'
import { RSAKeyPair } from './RSAKeyPair'
import { getGroupKeysFromStreamMessage } from './SubscriberKeyExchange'

const MIN_INTERVAL = 60 * 1000 // TODO some good value for this?

// TODO rename to SubscriberKeyExchange
@scoped(Lifecycle.ContainerScoped)
export class GroupKeyRequester {

    private networkNodeFacade: NetworkNodeFacade
    private groupKeyStoreFactory: GroupKeyStoreFactory
    private authentication: Authentication
    private validator: Validator
    private getRsaKeyPair: () => Promise<RSAKeyPair>
    private latestTimestamps: Map<string,number>  // TODO not just groupKey but groupKeyId+streamPartId+publisher (or something), and we should limit the size of this... -> it is actually a cache

    constructor(
        networkNodeFacade: NetworkNodeFacade,
        groupKeyStoreFactory: GroupKeyStoreFactory,
        @inject(AuthenticationInjectionToken) authentication: Authentication,
        validator: Validator
    ) {
        this.networkNodeFacade = networkNodeFacade
        this.groupKeyStoreFactory = groupKeyStoreFactory
        this.authentication = authentication
        this.validator = validator
        this.getRsaKeyPair = pOnce(() => RSAKeyPair.create())
        this.latestTimestamps = new Map()
        networkNodeFacade.once('start', async () => {
            const node = await networkNodeFacade.getNode()
            node.addMessageListener((msg: StreamMessage) => this.onMessage(msg))
        })
    }

    private async onMessage(msg: StreamMessage<any>): Promise<void> {
        if (msg.messageType === StreamMessage.MESSAGE_TYPES.GROUP_KEY_RESPONSE) { // TODO voisi kuunnella myös GROUP_KEY_RESPONSE_ERRORia
            try {
                await this.validator.validate(msg)  // TODO pitää päivittää tätä metodia, koska stream ei ole enää keyexchange-stream (entä onko mitään tarvetta tutkia sender-arvoa, ehkä riittääk että tutkitaan vain viestin julkaisija eli sama toteutus kuin validator-luokassa)
                const rsaKeyPair = await this.getRsaKeyPair()
                const keys = await getGroupKeysFromStreamMessage(msg, rsaKeyPair.getPrivateKey())
                const store = await this.groupKeyStoreFactory.getStore(msg.getStreamId())
                //console.log('TGTEST store group keys: ' + keys.length)
                await Promise.all(keys.map((key) => store.add(key))) // TODO we could have a test to check that GroupKeyStore supports concurrency?
            } catch (e) {
                // TODO log
            }
        }
    }

    /**
     * Returns false if we have very recently requested a group key and therefore we don't process this request
     */
    async requestGroupKey(groupKeyId: string, publisherId: EthereumAddress, streamPartId: StreamPartID): Promise<boolean> {
        if (this.hasRecentAcceptedRequest(groupKeyId)) {
            return false
        }
        //console.log('TGTEST requestGroupKey')
        const node = await this.networkNodeFacade.getNode()
        const requestId = uuid('GroupKeyRequest')
        const rsaKeyPair = await this.getRsaKeyPair()
        const rsaPublicKey = rsaKeyPair.getPublicKey()
        const requestContent = new GroupKeyRequest({
            streamId: StreamPartIDUtils.getStreamID(streamPartId),
            requestId,
            rsaPublicKey,
            groupKeyIds: [groupKeyId],
        }).toArray()
        const request = new StreamMessage({
            messageId: new MessageID(
                StreamPartIDUtils.getStreamID(streamPartId),
                StreamPartIDUtils.getStreamPartition(streamPartId),
                Date.now(),
                0,
                await this.authentication.getAddress(),
                createRandomMsgChainId()
            ),
            messageType: StreamMessageType.GROUP_KEY_REQUEST,
            encryptionType: StreamMessage.ENCRYPTION_TYPES.NONE,
            content: requestContent,
            signatureType: StreamMessage.SIGNATURE_TYPES.ETH,
        })
        request.signature = await this.authentication.createMessagePayloadSignature(request.getPayloadToSign())
        node.sendMulticastMessage(request, publisherId)
        return true
    }

    private hasRecentAcceptedRequest(groupKeyId: string) {
        const latestTimestamp = this.latestTimestamps.get(groupKeyId)
        if (latestTimestamp !== undefined) {
            return (Date.now() - latestTimestamp) < MIN_INTERVAL
        } else {
            return false
        }
    }
}
