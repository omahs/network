import { EthereumAddress, GroupKeyRequest, MessageID, StreamMessage, StreamMessageType, StreamPartID, StreamPartIDUtils } from 'streamr-client-protocol'
import { inject, Lifecycle, scoped } from 'tsyringe'
import { Authentication, AuthenticationInjectionToken } from '../Authentication'
import { NetworkNodeFacade } from '../NetworkNodeFacade'
import { createRandomMsgChainId } from '../publish/MessageChain'
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
    private rsaKeyPair: RSAKeyPair
    private validator: Validator

    constructor(
        networkNodeFacade: NetworkNodeFacade,
        groupKeyStoreFactory: GroupKeyStoreFactory,
        @inject(AuthenticationInjectionToken) authentication: Authentication,
        rsaKeyPair: RSAKeyPair,
        validator: Validator
    ) {
        this.networkNodeFacade = networkNodeFacade
        this.groupKeyStoreFactory = groupKeyStoreFactory
        this.authentication = authentication
        this.rsaKeyPair = rsaKeyPair // TODO would it make sense to create the key pair only if it is needed (if publisher doesn't do any group key requests, we waste the CPU)
        this.validator = validator
        networkNodeFacade.once('start', async () => {
            const node = await networkNodeFacade.getNode()
            node.addMessageListener((msg: StreamMessage) => this.onMessage(msg))
        })
    }

    private async onMessage(msg: StreamMessage<any>): Promise<void> {
        if (msg.messageType === StreamMessage.MESSAGE_TYPES.GROUP_KEY_RESPONSE) { // TODO voisi kuunnella myös GROUP_KEY_RESPONSE_ERRORia
            try {
                await this.validator.validate(msg)  // TODO pitää päivittää tätä metodia, koska stream ei ole enää keyexchange-stream (entä onko mitään tarvetta tutkia sender-arvoa, ehkä riittääk että tutkitaan vain viestin julkaisija eli sama toteutus kuin validator-luokassa)
                const keys = await getGroupKeysFromStreamMessage(msg, this.rsaKeyPair.getPrivateKey())
                const store = await this.groupKeyStoreFactory.getStore(msg.getStreamId())
                await Promise.all(keys.map((key) => store.add(key))) // TODO we could have a test to check that GroupKeyStore supports concurrency?
            } catch (e) {
                // TODO log
            }
        }
    }


    async requestGroupKey(groupKeyId: string, publisherId: EthereumAddress, streamPartId: StreamPartID): Promise<void> {
        const node = await this.networkNodeFacade.getNode()
        const requestId = uuid('GroupKeyRequest')
        const rsaPublicKey = this.rsaKeyPair.getPublicKey()
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
            encryptionType: StreamMessage.ENCRYPTION_TYPES.RSA,
            content: requestContent,
            signatureType: StreamMessage.SIGNATURE_TYPES.ETH,
        })
        request.signature = await this.authentication.createMessagePayloadSignature(request.getPayloadToSign())
        node.sendMulticastMessage(request, publisherId)
        // TODO store the key to GroupKeyStore (or the GroupKeyStoreFactory listens)
    }
}