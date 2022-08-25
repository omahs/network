import { startTracker } from '@streamr/network-tracker'
import { MessageID, StreamMessage, StreamPartIDUtils } from 'streamr-client-protocol'
import { waitForCondition } from 'streamr-test-utils'
import { createNetworkNode } from '../../src/createNetworkNode'

const trackerPort = 32901

describe('unicast message', () => {
    it('happy path', async () => {
        const tracker = await startTracker({
            listen: {
                hostname: '127.0.0.1',
                port: trackerPort
            }
        })
        const trackerConfig = tracker.getConfigRecord()
        const senderNode = createNetworkNode({
            id: 'sender#mock-session-123',
            trackers: [trackerConfig],
            webrtcDisallowPrivateAddresses: false
        })
        const recipientNode = createNetworkNode({
            id: 'recipient#mock-session-456',
            trackers: [trackerConfig],
            webrtcDisallowPrivateAddresses: false
        })
        const streamPartId = StreamPartIDUtils.parse('mock-stream#3')
        await recipientNode.subscribeAndWaitForJoin(streamPartId)
        const onUnicastMessage = jest.fn()
        recipientNode.addUnicastMessageListener(onUnicastMessage)

        const message = new StreamMessage({
            messageId: new MessageID(
                StreamPartIDUtils.getStreamID(streamPartId),
                StreamPartIDUtils.getStreamPartition(streamPartId),
                Date.now(),
                0,
                'sender',
                'mock-msgChainId'
            ),
            content: {
                foo: 'bar'
            }
        })
        await senderNode.sendUnicastMessage(message as any, 'recipient#mock-session-456')

        await waitForCondition(() => onUnicastMessage.mock.calls.length > 0)
        expect(onUnicastMessage).toBeCalledTimes(1)
        const receivedMessage: StreamMessage = onUnicastMessage.mock.calls[0][0]
        expect(receivedMessage.getParsedContent()).toEqual({
            foo: 'bar'
        })
    })
})