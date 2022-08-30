import { EthereumAddress, StreamMessage, StreamMessageType } from 'streamr-client-protocol'
import { waitForCondition } from 'streamr-test-utils'
import { NodeID } from '../../../src/NetworkNodeFacade'
import { debuglog } from '../../../src/utils/debuglog'
import { FakeNetworkNode } from './FakeNetworkNode'

export const waitForResponse = async (messageType: StreamMessageType, network: FakeNetwork): Promise<StreamMessage> => { // TODO could use iterables (like addSubcriber)
    const predicate = (msg: StreamMessage) => msg.messageType === messageType
    await waitForCondition(() => {
        const messages = network.getSentMessages()
        return messages.find(predicate) !== undefined
    })
    return network.getSentMessages().find(predicate)!
}

export class FakeNetwork {

    private readonly nodes: Map<NodeID, FakeNetworkNode> = new Map()
    private sentMessages: StreamMessage[] = []

    addNode(node: FakeNetworkNode): void {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node)
        } else {
            throw new Error(`Duplicate node: ${node.id}`)
        }
    }

    removeNode(address: EthereumAddress): void {
        this.nodes.delete(address)
    }

    getNode(address: EthereumAddress): FakeNetworkNode | undefined {
        return this.nodes.get(address)
    }

    getNodes(): FakeNetworkNode[] {
        return Array.from(this.nodes.values())
    }

    sendMessage(msg: StreamMessage, sender: NodeID | undefined, isRecipient: (networkNode: FakeNetworkNode) => boolean): void {
        /*
        * This serialization+serialization is needed in test/integration/Encryption.ts
        * as it expects that the EncryptedGroupKey format changes in the process.
        * TODO: should we change the serialization or the test? Or keep this hack?
        */
        debuglog('Send: ' + msg.messageType + ' ' + msg.getStreamPartID())
        const serialized = msg.serialize()
        this.getNodes().forEach(async (networkNode) => {
            if (isRecipient(networkNode)) {
                networkNode.messageListeners.forEach((listener) => {
                    // return a clone as client mutates message when it decrypts messages
                    const deserialized = StreamMessage.deserialize(serialized)
                    listener(deserialized, sender)
                    debuglog(msg.messageType + ' ' + msg.getStreamPartID() + ' to ' + networkNode.id)
                })
            } else {
                debuglog('No recipient: ' + networkNode.id)
            }
        })
        this.sentMessages.push(msg)
    }

    getSentMessages(): StreamMessage[] {
        return this.sentMessages
    }
}
