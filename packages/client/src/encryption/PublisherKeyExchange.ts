import debug from 'debug'
import { EthereumAddress, MessageID, StreamID, StreamMessage, StreamMessageType } from 'streamr-client-protocol'
import { inject, Lifecycle, scoped } from 'tsyringe'
import { Authentication, AuthenticationInjectionToken } from '../Authentication'
import { NetworkNodeFacade, NodeID } from '../NetworkNodeFacade'
import { createRandomMsgChainId } from '../publish/MessageChain'
import { StreamRegistryCached } from '../registry/StreamRegistryCached'
import { Validator } from '../Validator'
import { GroupKeyStoreFactory } from './GroupKeyStoreFactory'
import { createGroupKeyResponse } from './_PublisherKeyExchange'

/*
 * Sends group key responses
 */

const log = debug('StreamrClient:PublisherKeyExchange')

// TODO rename to PublisherKeyExchange
@scoped(Lifecycle.ContainerScoped)
export class PublisherKeyExchange {

    private groupKeyStoreFactory: GroupKeyStoreFactory
    private networkNodeFacade: NetworkNodeFacade
    private streamRegistryCached: StreamRegistryCached
    private authentication: Authentication
    private validator: Validator

    constructor(
        groupKeyStoreFactory: GroupKeyStoreFactory,
        networkNodeFacade: NetworkNodeFacade,
        streamRegistryCached: StreamRegistryCached,
        @inject(AuthenticationInjectionToken) authentication: Authentication,
        validator: Validator
    ) {
        this.groupKeyStoreFactory = groupKeyStoreFactory
        this.networkNodeFacade = networkNodeFacade
        this.streamRegistryCached = streamRegistryCached
        this.authentication = authentication
        this.validator = validator
        networkNodeFacade.once('start', async () => {
            const node = await networkNodeFacade.getNode()
            node.addMessageListener((msg: StreamMessage, sender?: NodeID) => this.onMessage(msg, sender))
        })
    }

    private async onMessage(request: StreamMessage<any>, sender?: NodeID): Promise<void> {
        if (request.messageType === StreamMessage.MESSAGE_TYPES.GROUP_KEY_REQUEST) {
            //console.log('Group key request received')
            try {
                await this.validator.validate(request)  // TODO pitää päivittää tätä metodia, koska stream ei ole enää keyexchange-stream (entä onko mitään tarvetta tutkia sender-arvoa, ehkä riittääk että tutkitaan vain viestin julkaisija eli sama toteutus kuin validator-luokassa)
                const node = await this.networkNodeFacade.getNode()
                const responseContent = (await createGroupKeyResponse(
                    request,
                    async (groupKeyId: string, streamId: StreamID) => {
                        const store = await this.groupKeyStoreFactory.getStore(streamId)
                        return store.get(groupKeyId)
                    },
                    (streamId: StreamID, address: EthereumAddress) => this.streamRegistryCached.isStreamSubscriber(streamId, address),
                    log
                )).toArray()
                const response = new StreamMessage({
                    messageId: new MessageID(
                        request.getMessageID().streamId,
                        request.getMessageID().streamPartition,
                        Date.now(),
                        0,
                        await this.authentication.getAddress(),
                        createRandomMsgChainId()
                    ),
                    messageType: StreamMessageType.GROUP_KEY_RESPONSE,
                    encryptionType: StreamMessage.ENCRYPTION_TYPES.RSA,
                    content: responseContent,
                    signatureType: StreamMessage.SIGNATURE_TYPES.ETH,
                })
                response.signature = await this.authentication.createMessagePayloadSignature(response.getPayloadToSign())
                //console.log('Sent group key request response')
                node.sendUnicastMessage(response, sender!)
            } catch (e) {
                console.log('TGTEST', e)
                // TODO send group key response error (StreamMessage.ENCRYPTION_TYPES.NONE)
                // TODO send an event to StreamrClient's eventEmitter so that user can observe errors?
            }
        }
    }
}
