import { EthereumAddress, StreamMessage, StreamMessageType } from 'streamr-client-protocol'
import { waitForCondition } from 'streamr-test-utils'
import { NodeID } from '../../../src/NetworkNodeFacade'
import { FakeNetworkNode } from './FakeNetworkNode'

interface Send {
    message: StreamMessage
    sender: NodeID
    recipients: NodeID[]
}

interface SentMessagesFilter {
    messageType?: StreamMessageType
    count?: number
}

export class FakeNetwork {

    private readonly nodes: Map<NodeID, FakeNetworkNode> = new Map()
    private sends: Send[] = []

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

    send(msg: StreamMessage, sender: NodeID, isBroadcastMessage: boolean, isRecipient: (networkNode: FakeNetworkNode) => boolean): void {
        const recipients = this.getNodes().filter(n => isRecipient(n))
        /*
        * This serialization+serialization is needed in test/integration/Encryption.ts
        * as it expects that the EncryptedGroupKey format changes in the process.
        * TODO: should we change the serialization or the test? Or keep this hack?
        */
        const serialized = msg.serialize()
        recipients.forEach(n => {
            n.messageListeners.forEach((listener) => {
                // return a clone as client mutates message when it decrypts messages
                const deserialized = StreamMessage.deserialize(serialized)
                listener(deserialized, isBroadcastMessage ? undefined : sender)
            })
        })
        this.sends.push({
            message: msg,
            sender,
            recipients: recipients.map(n => n.id)
        })
    }

    getSentMessages(predicate: SentMessagesFilter): StreamMessage[] {
        return this.sends
            .filter((send: Send) => {
                const msg = send.message
                return (predicate.messageType === undefined) || (msg.messageType === predicate.messageType)
            })
            .map(m => m.message)
    }

    async waitForSentMessages(opts: SentMessagesFilter & { count: number }, timeout = 60 * 1000): Promise<StreamMessage[]> { 
        let found: StreamMessage[] = []
        const count = opts.count
        await waitForCondition(() => {
            found = this.getSentMessages(opts)
            return found.length >= count
        }, timeout, timeout / 100, () => {
            return `waitForSentMessages timed out: ${JSON.stringify(opts)} matches ${found.length}/${count}`
        })
        return found.slice(0, count)
    }
    
    async waitForSentMessage(opts: SentMessagesFilter, timeout?: number): Promise<StreamMessage> {
        const messages = await this.waitForSentMessages({
            ...opts,
            count: 1
        }, timeout)
        return messages[0]
    }
}
