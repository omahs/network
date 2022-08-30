import { EthereumAddress, GroupKeyRequest, MessageID, StreamMessage, StreamMessageType, StreamPartID, StreamPartIDUtils } from 'streamr-client-protocol'
import { inject, Lifecycle, scoped } from 'tsyringe'
import { debuglog } from '../utils/debuglog'
import { Authentication, AuthenticationInjectionToken } from '../Authentication'
import { NetworkNodeFacade } from '../NetworkNodeFacade'
import { createRandomMsgChainId } from '../publish/MessageChain'
import { pOnce } from '../utils/promises'
import { uuid } from '../utils/uuid'
import { Validator } from '../Validator'
import { GroupKeyStoreFactory } from './GroupKeyStoreFactory'
import { RSAKeyPair } from './RSAKeyPair'
import { getGroupKeysFromStreamMessage } from './SubscriberKeyExchange'

@scoped(Lifecycle.ContainerScoped)
export class GroupKeyRequester {

    private networkNodeFacade: NetworkNodeFacade
    private groupKeyStoreFactory: GroupKeyStoreFactory
    private authentication: Authentication
    private validator: Validator
    private getRsaKeyPair: () => Promise<RSAKeyPair>

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
        networkNodeFacade.once('start', async () => {
            const node = await networkNodeFacade.getNode()
            node.addMessageListener((msg: StreamMessage) => this.onMessage(msg))
        })
    }

    private async onMessage(msg: StreamMessage<any>): Promise<void> {
        if (msg.messageType === StreamMessage.MESSAGE_TYPES.GROUP_KEY_RESPONSE) { // TODO voisi kuunnella myös GROUP_KEY_RESPONSE_ERRORia
            debuglog('Received group key response')
            try {
                await this.validator.validate(msg)  // TODO pitää päivittää tätä metodia, koska stream ei ole enää keyexchange-stream (entä onko mitään tarvetta tutkia sender-arvoa, ehkä riittääk että tutkitaan vain viestin julkaisija eli sama toteutus kuin validator-luokassa)
                const rsaKeyPair = await this.getRsaKeyPair()
                const keys = await getGroupKeysFromStreamMessage(msg, rsaKeyPair.getPrivateKey())
                const store = await this.groupKeyStoreFactory.getStore(msg.getStreamId())
                debuglog('Storing ' + keys.length + ' keys: ' + keys.map((k) => k.id).join(', '))
                await Promise.all(keys.map((key) => store.add(key))) // TODO we could have a test to check that GroupKeyStore supports concurrency?
            } catch (e) {
                debuglog('TODO error', e)
                // TODO log
            }
        }
    }

    async requestGroupKey(groupKeyId: string, publisherId: EthereumAddress, streamPartId: StreamPartID): Promise<void> {
        debuglog('Request group key ' + groupKeyId + ' (p=' + publisherId + ', s=' + streamPartId)
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
        debuglog('Send group key request to ' + publisherId)
        node.sendMulticastMessage(request, publisherId)
    }
}
