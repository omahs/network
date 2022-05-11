import { DhtNode } from '../src/dht/DhtNode'
import { DhtTransportClient } from '../src/transport/DhtTransportClient'
import { DhtTransportServer } from '../src/transport/DhtTransportServer'
import { MockConnectionManager } from '../src/connection/MockConnectionManager'
import { RpcCommunicator } from '../src/transport/RpcCommunicator'
import { DhtRpcClient } from '../src/proto/DhtRpc.client'
import { Event as ITransportEvent } from '../src/transport/ITransport'
import {
    ClosestPeersRequest,
    ConnectivityResponseMessage,
    Message,
    NodeType,
    PeerDescriptor,
    RpcMessage
} from '../src/proto/DhtRpc'
import { PeerID } from '../src/PeerID'
import { ConnectionManager } from '../src/connection/ConnectionManager'

export const createMockConnectionDhtNode = (stringId: string): DhtNode => {
    const id = PeerID.fromString(stringId)
    const peerDescriptor: PeerDescriptor = {
        peerId: id.value,
        type: NodeType.NODEJS
    }
    const clientTransport = new DhtTransportClient(2000)
    const serverTransport = new DhtTransportServer()
    const mockConnectionLayer = new MockConnectionManager()
    const rpcCommunicator = new RpcCommunicator({
        connectionLayer: mockConnectionLayer,
        dhtTransportClient: clientTransport,
        dhtTransportServer: serverTransport
    })
    const client = new DhtRpcClient(clientTransport)
    return new DhtNode(peerDescriptor, client, clientTransport, serverTransport, rpcCommunicator)
}

export const createMockConnectionLayer1Node = (stringId: string, layer0Node: DhtNode): DhtNode => {
    const id = PeerID.fromString(stringId)
    const descriptor: PeerDescriptor = {
        peerId: id.value,
        type: 0
    }
    const clientTransport = new DhtTransportClient(5000)
    const serverTransport = new DhtTransportServer()
    const mockConnectionLayer = new MockConnectionManager()
    const rpcCommunicator = new RpcCommunicator({
        connectionLayer: mockConnectionLayer,
        dhtTransportClient: clientTransport,
        dhtTransportServer: serverTransport,
        rpcRequestTimeout: 5000
    })
    rpcCommunicator.setSendFn(async (peerDescriptor, message) => {
        await layer0Node.routeMessage({
            message: Message.toBinary(message),
            destinationPeer: peerDescriptor,
            appId: 'Layer1',
            sourcePeer: descriptor
        })
    })
    const client = new DhtRpcClient(clientTransport)
    layer0Node.on(ITransportEvent.DATA, async (peerDescriptor: PeerDescriptor, message: Message) => {
        await rpcCommunicator.onIncomingMessage(peerDescriptor, message)
    })
    return new DhtNode(descriptor, client, clientTransport, serverTransport, rpcCommunicator)
}

export const createWrappedClosestPeersRequest = (
    sourceDescriptor: PeerDescriptor,
    destinationDescriptor: PeerDescriptor
): RpcMessage => {

    const routedMessage: ClosestPeersRequest = {
        peerDescriptor: sourceDescriptor,
        nonce: '11111'
    }
    const rpcWrapper: RpcMessage = {
        body: ClosestPeersRequest.toBinary(routedMessage),
        header: {
            method: 'closestPeersRequest',
            request: 'request'
        },
        requestId: 'testId',
        sourceDescriptor: sourceDescriptor,
        targetDescriptor: destinationDescriptor
    }
    return rpcWrapper
}

export const createPeerDescriptor = (msg: ConnectivityResponseMessage, peerIdString?: string): PeerDescriptor => {
    const ret: PeerDescriptor = {
        peerId: peerIdString ? PeerID.fromString(peerIdString).value : PeerID.fromIp(msg.ip).value,
        type: NodeType.NODEJS,
        websocket: {ip: msg.websocket!.ip, port: msg.websocket!.port}
    }
    return ret
}

export const createLayer0Peer = (peerDescriptor: PeerDescriptor, connectionManager: ConnectionManager): DhtNode => {
    const clientTransport = new DhtTransportClient()
    const serverTransport = new DhtTransportServer()
    const rpcCommunicator = new RpcCommunicator({
        connectionLayer: connectionManager,
        dhtTransportClient: clientTransport,
        dhtTransportServer: serverTransport
    })
    const client = new DhtRpcClient(clientTransport)
    rpcCommunicator.setSendFn((peerDescriptor, message) => {
        connectionManager.send(peerDescriptor, message)
    })
    return new DhtNode(peerDescriptor, client, clientTransport, serverTransport, rpcCommunicator)
}

export const createLayer1Peer = (peerDescriptor: PeerDescriptor, layer0Node: DhtNode, streamId: string): DhtNode => {
    const clientTransport = new DhtTransportClient(10000)
    const serverTransport = new DhtTransportServer()
    const rpcCommunicator = new RpcCommunicator({
        connectionLayer: layer0Node,
        dhtTransportServer: serverTransport,
        dhtTransportClient: clientTransport,
        appId: streamId,
        rpcRequestTimeout: 10000
    })
    const client = new DhtRpcClient(clientTransport)
    rpcCommunicator.setSendFn((peerDescriptor, message) => {
        layer0Node.send(peerDescriptor, message, streamId)
    })
    return new DhtNode(peerDescriptor, client, clientTransport, serverTransport, rpcCommunicator, streamId)
}