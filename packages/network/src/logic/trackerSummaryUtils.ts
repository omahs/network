import { StreamIdAndPartition } from '../identifiers'
import { NodeId } from './Node'
import { OverlayPerStream, OverlayConnectionRtts } from './Tracker'

type OverLayWithRtts = { [key: string]: Record<NodeId,{ neighborId: NodeId, rtt: number | null }[] > }
type OverlaySizes = { streamId: string, partition: number, nodeCount: number }[]

export function getTopology(
    overlayPerStream: OverlayPerStream,
    connectionRtts: OverlayConnectionRtts,
    streamId: string | null = null,
    partition: number | null = null
): OverLayWithRtts {
    const topology: OverLayWithRtts = {}

    const streamKeys = findStreamKeys(overlayPerStream, streamId, partition)

    streamKeys.forEach((streamKey) => {
        const streamOverlay = overlayPerStream[streamKey].state()
        topology[streamKey] = Object.assign({}, ...Object.entries(streamOverlay).map(([nodeId, neighbors]) => {
            return addRttsToNodeConnections(nodeId, neighbors, connectionRtts)
        }))
    })

    return topology
}

export function getStreamSizes(overlayPerStream: OverlayPerStream, streamId: string | null = null, partition: number | null = null): OverlaySizes {
    const streamKeys = findStreamKeys(overlayPerStream, streamId, partition)

    const streamSizes: OverlaySizes = streamKeys.map((streamKey) => {
        const key = StreamIdAndPartition.fromKey(streamKey)
        return {
            streamId: key.id,
            partition: key.partition,
            nodeCount: overlayPerStream[streamKey].getNumberOfNodes()
        }
    })
    return streamSizes
}

export function getNodeConnections(nodes: readonly NodeId[], overlayPerStream: OverlayPerStream): Record<NodeId,Set<NodeId>> {
    const result: Record<NodeId,Set<NodeId>> = {}
    nodes.forEach((node) => {
        result[node] = new Set<NodeId>()
    })
    Object.values(overlayPerStream).forEach((overlayTopology) => {
        Object.entries(overlayTopology.getNodes()).forEach(([nodeId, neighbors]) => {
            neighbors.forEach((neighborNode) => {
                if (!(nodeId in result)) {
                    result[nodeId] = new Set<NodeId>()
                }
                result[nodeId].add(neighborNode)
            })
        })
    })
    return result
}

export function addRttsToNodeConnections(
    nodeId: NodeId,
    neighbors: Array<NodeId>,
    connectionRtts: OverlayConnectionRtts
): Record<NodeId,{ neighborId: NodeId, rtt: number | null }[]> {
    return {
        [nodeId]: neighbors.map((neighborId) => {
            return {
                neighborId,
                rtt: getNodeToNodeConnectionRtts(nodeId, neighborId, connectionRtts[nodeId], connectionRtts[neighborId])
            }
        })
    }
}

export function findStreamsForNode(
    overlayPerStream: OverlayPerStream,
    nodeId: NodeId
): Array<{ streamId: string, partition: number, topologySize: number}> {
    return Object.entries(overlayPerStream)
        .filter(([_, overlayTopology]) => overlayTopology.hasNode(nodeId))
        .map(([streamKey, overlayTopology]) => {
            const streamIdAndPartition = StreamIdAndPartition.fromKey(streamKey)
            return {
                streamId: streamIdAndPartition.id,
                partition: streamIdAndPartition.partition,
                topologySize: overlayTopology.getNumberOfNodes()
            }
        })
}

function getNodeToNodeConnectionRtts(
    nodeOne: NodeId,
    nodeTwo: NodeId,
    nodeOneRtts: Record<NodeId,number>,
    nodeTwoRtts: Record<NodeId,number>
): number | null {
    try {
        return nodeOneRtts[nodeTwo] || nodeTwoRtts[nodeOne] || null
    } catch (err) {
        return null
    }
}

function findStreamKeys(overlayPerStream: OverlayPerStream, streamId: string | null = null, partition: number | null = null): string[] {
    let streamKeys

    if (streamId && partition === null) {
        streamKeys = Object.keys(overlayPerStream).filter((streamKey) => streamKey.includes(streamId))
    } else {
        let askedStreamKey: StreamIdAndPartition | null = null
        if (streamId && partition != null && Number.isSafeInteger(partition) && partition >= 0) {
            askedStreamKey = new StreamIdAndPartition(streamId, partition)
        }

        streamKeys = askedStreamKey
            ? Object.keys(overlayPerStream).filter((streamKey) => streamKey === askedStreamKey!.toString())
            : Object.keys(overlayPerStream)
    }

    return streamKeys
}