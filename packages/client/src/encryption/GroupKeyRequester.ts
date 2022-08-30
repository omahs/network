import { EthereumAddress, GroupKeyRequest, MessageID, StreamMessage, StreamMessageType, StreamPartID, StreamPartIDUtils } from 'streamr-client-protocol'
import { Lifecycle, scoped } from 'tsyringe'
import { Authentication } from '../Authentication'
import { NetworkNodeFacade } from '../NetworkNodeFacade'
import { createRandomMsgChainId } from '../publish/MessageChain'
import { uuid } from '../utils/uuid'
import { GroupKey } from './GroupKey'
import { RSAKeyPair } from './RSAKeyPair'

@scoped(Lifecycle.ContainerScoped)
export class GroupKeyRequester {

    private networkNodeFacade: NetworkNodeFacade
    private authentication: Authentication
    private rsaKeyPair: RSAKeyPair

    constructor(
        networkNodeFacade: NetworkNodeFacade,
        authentication: Authentication,
        rsaKeyPair: RSAKeyPair
    ) {
        this.networkNodeFacade = networkNodeFacade
        this.authentication = authentication
        this.rsaKeyPair = rsaKeyPair // TODO would it make sense to create the key pair only if it is needed (if publisher doesn't do any group key requests, we waste the CPU)
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