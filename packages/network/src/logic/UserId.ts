/*
 * Node id is one of these formats:
 * - userId
 * - userId#sessionId
 */

import { NodeId } from '../identifiers'

export type UserId = string // typically an Ethereum address

export const parseUserIdFromNodeId = (nodeId: NodeId) => {
    const parts = nodeId.split('#')
    return parts[0]
}