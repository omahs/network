import { Tracker, startTracker } from '@streamr/network-tracker'
import { NetworkNode } from '../../src/logic/NetworkNode'

import { StreamPartID, toStreamID, StreamPartIDUtils, StreamMessage, MessageID } from 'streamr-client-protocol'
import { waitForEvent } from '../../src/helpers/waitForEvent3'

import { createNetworkNode } from '../../src/composition'

const streamPartOne = StreamPartIDUtils.parse('s#1')
const streamPartTwo = StreamPartIDUtils.parse('s#2')

describe('node unsubscribing from a stream', () => {
    let tracker: Tracker
    let nodeA: NetworkNode
    let nodeB: NetworkNode

    beforeEach(async () => {
        tracker = await startTracker({
            listen: {
                hostname: '127.0.0.1',
                port: 30450
            }
        })
        const trackerInfo = tracker.getConfigRecord()

        nodeA = createNetworkNode({
            id: 'a',
            trackers: [trackerInfo],
            disconnectionWaitTime: 200,
            webrtcDisallowPrivateAddresses: false
        })
        nodeB = createNetworkNode({
            id: 'b',
            trackers: [trackerInfo],
            disconnectionWaitTime: 200,
            webrtcDisallowPrivateAddresses: false
        })

        nodeA.start()
        nodeB.start()

        nodeA.subscribe(streamPartTwo)
        nodeB.subscribe(streamPartTwo)
        await Promise.all([
            waitForEvent(nodeA.eventEmitter, 'nodeSubscribed'),
            waitForEvent(nodeB.eventEmitter, 'nodeSubscribed'),
        ])

        nodeA.subscribe(streamPartOne)
        nodeB.subscribe(streamPartOne)
        await Promise.all([
            waitForEvent(nodeA.eventEmitter, 'nodeSubscribed'),
            waitForEvent(nodeB.eventEmitter, 'nodeSubscribed'),
        ])
    })

    afterEach(async () => {
        await nodeA.stop()
        await nodeB.stop()
        await tracker.stop()
    })

    test('node still receives data for subscribed streams thru existing connections', async () => {
        const actual: StreamPartID[] = []
        nodeB.addMessageListener((streamMessage) => {
            actual.push(streamMessage.getStreamPartID())
        })

        nodeB.unsubscribe(streamPartTwo)
        await waitForEvent(nodeA.eventEmitter, 'nodeUnsubscribed')

        nodeA.publish(new StreamMessage({
            messageId: new MessageID(toStreamID('s'), 2, 0, 0, 'publisherId', 'msgChainId'),
            content: {},
        }))
        nodeA.publish(new StreamMessage({
            messageId: new MessageID(toStreamID('s'), 1, 0, 0, 'publisherId', 'msgChainId'),
            content: {},
        }))
        await waitForEvent(nodeB.eventEmitter, 'unseenMessageReceived')
        expect(actual).toEqual(['s#1'])
    })

    test('connection between nodes is not kept if no shared streams', async () => {
        nodeB.unsubscribe(streamPartTwo)
        await waitForEvent(nodeA.eventEmitter, 'nodeUnsubscribed')

        nodeA.unsubscribe(streamPartOne)
        await waitForEvent(nodeB.eventEmitter, 'nodeUnsubscribed')

        const [aEventArgs, bEventArgs] = await Promise.all([
            waitForEvent(nodeA.eventEmitter, 'nodeDisconnected'),
            waitForEvent(nodeB.eventEmitter, 'nodeDisconnected')
        ])

        expect(aEventArgs).toEqual(['b'])
        expect(bEventArgs).toEqual(['a'])
    })
})
