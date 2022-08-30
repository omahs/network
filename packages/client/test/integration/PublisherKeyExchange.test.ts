import 'reflect-metadata'
import { v4 as uuid } from 'uuid'
import {
    GroupKeyErrorResponse,
    KeyExchangeStreamIDUtils,
    StreamMessage,
    StreamMessageType,
    StreamPartID,
    StreamPartIDUtils,
} from 'streamr-client-protocol'
import { GroupKey } from '../../src/encryption/GroupKey'
import { Wallet } from 'ethers'
import { RSAKeyPair } from '../../src/encryption/RSAKeyPair'
import { StreamPermission } from '../../src/permission'
import { 
    addSubscriber,
    createMockMessage,
    createRelativeTestStreamId,
    getGroupKeyStore,
    startPublisherKeyExchangeSubscription
} from '../test-utils/utils'
import { getGroupKeysFromStreamMessage } from '../../src/encryption/SubscriberKeyExchange'
import { FakeEnvironment } from '../test-utils/fake/FakeEnvironment'
import { FakeNetworkNode } from '../test-utils/fake/FakeNetworkNode'
import { nextValue } from '../../src/utils/iterators'
import { fastWallet, waitForCondition } from 'streamr-test-utils'
import { StreamrClient } from '../../src/StreamrClient'
import { waitForResponse } from '../test-utils/fake/FakeNetwork'

describe('PublisherKeyExchange', () => {

    let publisherWallet: Wallet
    let publisherClient: StreamrClient
    let subscriberWallet: Wallet
    let subscriberRSAKeyPair: RSAKeyPair
    let subscriberNode: FakeNetworkNode
    let streamPartId: StreamPartID
    let environment: FakeEnvironment

    const createStream = async () => {
        const stream = await publisherClient.createStream(createRelativeTestStreamId(module))
        await publisherClient.grantPermissions(stream.id, {
            permissions: [StreamPermission.SUBSCRIBE],
            user: subscriberWallet.address
        })
        return stream
    }

    const createGroupKeyRequest = (
        groupKeyId: string,
        publisher = subscriberWallet,
        rsaPublicKey = subscriberRSAKeyPair.getPublicKey()
    ): StreamMessage => {
        return createMockMessage({
            streamPartId,
            publisher,
            content: JSON.stringify([
                uuid(),
                StreamPartIDUtils.getStreamID(streamPartId),
                rsaPublicKey,
                [groupKeyId]
            ]),
            messageType: StreamMessage.MESSAGE_TYPES.GROUP_KEY_REQUEST,
            encryptionType: StreamMessage.ENCRYPTION_TYPES.NONE,
            contentType: StreamMessage.CONTENT_TYPES.JSON,
        })
    }

    const testSuccessResponse = async (actualResponse: StreamMessage, expectedGroupKeys: GroupKey[]): Promise<void> => {
        expect(actualResponse).toMatchObject({
            messageId: {
                streamId: StreamPartIDUtils.getStreamID(streamPartId),
                streamPartition: StreamPartIDUtils.getStreamPartition(streamPartId),
                publisherId: publisherWallet.address.toLowerCase(),
            },
            messageType: StreamMessage.MESSAGE_TYPES.GROUP_KEY_RESPONSE,
            contentType: StreamMessage.CONTENT_TYPES.JSON,
            encryptionType: StreamMessage.ENCRYPTION_TYPES.RSA,
            signatureType: StreamMessage.SIGNATURE_TYPES.ETH,
            signature: expect.any(String)
        })
        const actualKeys = await getGroupKeysFromStreamMessage(actualResponse, subscriberRSAKeyPair.getPrivateKey())
        expect(actualKeys).toEqual(expectedGroupKeys)
    }

    const testErrorResponse = async (
        actualResponse: StreamMessage,
        expectedGroupKeyIds: string[],
        expectedRecipientAddress = subscriberWallet.address
    ): Promise<void> => {
        expect(actualResponse).toMatchObject({
            messageId: {
                streamId: StreamPartIDUtils.getStreamID(streamPartId),
                streamPartition: StreamPartIDUtils.getStreamPartition(streamPartId),
                publisherId: publisherWallet.address.toLowerCase(),
            },
            messageType: StreamMessage.MESSAGE_TYPES.GROUP_KEY_ERROR_RESPONSE,
            contentType: StreamMessage.CONTENT_TYPES.JSON,
            encryptionType: StreamMessage.ENCRYPTION_TYPES.NONE,
            signatureType: StreamMessage.SIGNATURE_TYPES.ETH,
            signature: expect.any(String)
        })
        expect(GroupKeyErrorResponse.fromArray(actualResponse!.getParsedContent() as any)).toMatchObject({
            requestId: expect.any(String),
            errorCode: expect.any(String),
            errorMessage: expect.any(String),
            groupKeyIds: expectedGroupKeyIds
        })
    }

    beforeEach(async () => {
        publisherWallet = fastWallet()
        subscriberWallet = fastWallet()
        subscriberRSAKeyPair = await RSAKeyPair.create()
        environment = new FakeEnvironment()
        publisherClient = environment.createClient({
            auth: {
                privateKey: publisherWallet.privateKey
            }
        })
        const stream = await createStream()
        streamPartId = stream.getStreamParts()[0]
        subscriberNode = environment.startNode(subscriberWallet.address)
        await startPublisherKeyExchangeSubscription(publisherClient)
    })

    describe('responds to a group key request', () => {

        /*
         * A publisher node starts a subscription to receive group key requests
         * - tests that a correct kind of response message is sent to a subscriber node
         */
        it('happy path', async () => {
            const key = GroupKey.generate()
            await getGroupKeyStore(StreamPartIDUtils.getStreamID(streamPartId), publisherWallet.address).add(key)

            const request = createGroupKeyRequest(key.id)
            subscriberNode.sendMulticastMessage(request, publisherWallet.address)

            const response = await waitForResponse(StreamMessage.MESSAGE_TYPES.GROUP_KEY_RESPONSE, environment.getNetwork())
            await testSuccessResponse(response!, [key])
        })

        it('no group key in store', async () => {
            const request = createGroupKeyRequest(GroupKey.generate().id)
            subscriberNode.sendMulticastMessage(request, publisherWallet.address)

            const response = await waitForResponse(StreamMessage.MESSAGE_TYPES.GROUP_KEY_RESPONSE, environment.getNetwork())
            await testSuccessResponse(response!, [])
        })

        it('request from non-subscriber', async () => {
            const groupKey = GroupKey.generate()
            const otherWallet = fastWallet()
            const otherNode = environment.startNode(otherWallet.address)

            const request = createGroupKeyRequest(groupKey.id, otherWallet, (await RSAKeyPair.create()).getPublicKey())
            otherNode.sendMulticastMessage(request, publisherWallet.address)

            const response = await waitForResponse(StreamMessage.MESSAGE_TYPES.GROUP_KEY_ERROR_RESPONSE, environment.getNetwork())
            await testErrorResponse(response!, [ groupKey.id ], otherWallet.address)
        })

        it('invalid request', async () => {
            const groupKey = GroupKey.generate()

            const request: any = createGroupKeyRequest(groupKey.id)
            delete request.signature
            subscriberNode.sendMulticastMessage(request, publisherWallet.address)

            const response = await waitForResponse(StreamMessage.MESSAGE_TYPES.GROUP_KEY_ERROR_RESPONSE, environment.getNetwork())
            await testErrorResponse(response!, [ groupKey.id ])
        })
    })
})
