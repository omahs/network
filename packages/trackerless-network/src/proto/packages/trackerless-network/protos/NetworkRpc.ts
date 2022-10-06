// @generated by protobuf-ts 2.8.0 with parameter server_generic,generate_dependencies
// @generated from protobuf file "packages/trackerless-network/protos/NetworkRpc.proto" (syntax proto3)
// tslint:disable
import { Empty } from "../../../google/protobuf/empty";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { PeerDescriptor } from "../../dht/protos/DhtRpc";
/**
 * @generated from protobuf message MessageRef
 */
export interface MessageRef {
    /**
     * @generated from protobuf field: int64 timestamp = 1;
     */
    timestamp: bigint;
    /**
     * @generated from protobuf field: int32 sequenceNumber = 2;
     */
    sequenceNumber: number;
}
/**
 * @generated from protobuf message DataMessage
 */
export interface DataMessage {
    /**
     * @generated from protobuf field: string content = 1;
     */
    content: string;
    /**
     * @generated from protobuf field: string senderId = 2;
     */
    senderId: string;
    /**
     * @generated from protobuf field: string streamPartId = 3;
     */
    streamPartId: string;
    /**
     * @generated from protobuf field: MessageRef messageRef = 4;
     */
    messageRef?: MessageRef;
    /**
     * @generated from protobuf field: optional MessageRef previousMessageRef = 5;
     */
    previousMessageRef?: MessageRef;
    /**
     * @generated from protobuf field: optional string previousPeer = 6;
     */
    previousPeer?: string;
}
/**
 * @generated from protobuf message Layer2Message
 */
export interface Layer2Message {
    /**
     * @generated from protobuf field: Layer2Type type = 1;
     */
    type: Layer2Type;
}
/**
 * @generated from protobuf message HandshakeRequest
 */
export interface HandshakeRequest {
    /**
     * @generated from protobuf field: string randomGraphId = 1;
     */
    randomGraphId: string;
    /**
     * @generated from protobuf field: string senderId = 2;
     */
    senderId: string;
    /**
     * @generated from protobuf field: string requestId = 3;
     */
    requestId: string;
    /**
     * @generated from protobuf field: optional string concurrentHandshakeTargetId = 4;
     */
    concurrentHandshakeTargetId?: string;
    /**
     * @generated from protobuf field: repeated string neighbors = 5;
     */
    neighbors: string[];
    /**
     * @generated from protobuf field: repeated string peerView = 6;
     */
    peerView: string[];
    /**
     * @generated from protobuf field: PeerDescriptor senderDescriptor = 7;
     */
    senderDescriptor?: PeerDescriptor;
    /**
     * @generated from protobuf field: bool interleaving = 8;
     */
    interleaving: boolean;
}
/**
 * @generated from protobuf message HandshakeResponse
 */
export interface HandshakeResponse {
    /**
     * @generated from protobuf field: bool accepted = 1;
     */
    accepted: boolean;
    /**
     * @generated from protobuf field: string requestId = 2;
     */
    requestId: string;
    /**
     * @generated from protobuf field: optional PeerDescriptor interleaveTarget = 3;
     */
    interleaveTarget?: PeerDescriptor;
}
/**
 * @generated from protobuf message InterleaveNotice
 */
export interface InterleaveNotice {
    /**
     * @generated from protobuf field: string senderId = 1;
     */
    senderId: string;
    /**
     * @generated from protobuf field: string randomGraphId = 2;
     */
    randomGraphId: string;
    /**
     * @generated from protobuf field: PeerDescriptor interleaveTarget = 3;
     */
    interleaveTarget?: PeerDescriptor;
}
/**
 * @generated from protobuf message LeaveNotice
 */
export interface LeaveNotice {
    /**
     * @generated from protobuf field: string randomGraphId = 1;
     */
    randomGraphId: string;
    /**
     * @generated from protobuf field: string senderId = 2;
     */
    senderId: string;
}
/**
 * @generated from protobuf message NeighborUpdate
 */
export interface NeighborUpdate {
    /**
     * @generated from protobuf field: string senderId = 1;
     */
    senderId: string;
    /**
     * @generated from protobuf field: string randomGraphId = 2;
     */
    randomGraphId: string;
    /**
     * @generated from protobuf field: repeated PeerDescriptor neighborDescriptors = 4;
     */
    neighborDescriptors: PeerDescriptor[];
}
/**
 * @generated from protobuf enum Layer2Type
 */
export enum Layer2Type {
    /**
     * @generated from protobuf enum value: Data = 0;
     */
    Data = 0
}
// @generated message type with reflection information, may provide speed optimized methods
class MessageRef$Type extends MessageType<MessageRef> {
    constructor() {
        super("MessageRef", [
            { no: 1, name: "timestamp", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 2, name: "sequenceNumber", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message MessageRef
 */
export const MessageRef = new MessageRef$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DataMessage$Type extends MessageType<DataMessage> {
    constructor() {
        super("DataMessage", [
            { no: 1, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "senderId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "streamPartId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "messageRef", kind: "message", T: () => MessageRef },
            { no: 5, name: "previousMessageRef", kind: "message", T: () => MessageRef },
            { no: 6, name: "previousPeer", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message DataMessage
 */
export const DataMessage = new DataMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Layer2Message$Type extends MessageType<Layer2Message> {
    constructor() {
        super("Layer2Message", [
            { no: 1, name: "type", kind: "enum", T: () => ["Layer2Type", Layer2Type] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message Layer2Message
 */
export const Layer2Message = new Layer2Message$Type();
// @generated message type with reflection information, may provide speed optimized methods
class HandshakeRequest$Type extends MessageType<HandshakeRequest> {
    constructor() {
        super("HandshakeRequest", [
            { no: 1, name: "randomGraphId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "senderId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "requestId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "concurrentHandshakeTargetId", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "neighbors", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "peerView", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "senderDescriptor", kind: "message", T: () => PeerDescriptor },
            { no: 8, name: "interleaving", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message HandshakeRequest
 */
export const HandshakeRequest = new HandshakeRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class HandshakeResponse$Type extends MessageType<HandshakeResponse> {
    constructor() {
        super("HandshakeResponse", [
            { no: 1, name: "accepted", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "requestId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "interleaveTarget", kind: "message", T: () => PeerDescriptor }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message HandshakeResponse
 */
export const HandshakeResponse = new HandshakeResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class InterleaveNotice$Type extends MessageType<InterleaveNotice> {
    constructor() {
        super("InterleaveNotice", [
            { no: 1, name: "senderId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "randomGraphId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "interleaveTarget", kind: "message", T: () => PeerDescriptor }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message InterleaveNotice
 */
export const InterleaveNotice = new InterleaveNotice$Type();
// @generated message type with reflection information, may provide speed optimized methods
class LeaveNotice$Type extends MessageType<LeaveNotice> {
    constructor() {
        super("LeaveNotice", [
            { no: 1, name: "randomGraphId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "senderId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message LeaveNotice
 */
export const LeaveNotice = new LeaveNotice$Type();
// @generated message type with reflection information, may provide speed optimized methods
class NeighborUpdate$Type extends MessageType<NeighborUpdate> {
    constructor() {
        super("NeighborUpdate", [
            { no: 1, name: "senderId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "randomGraphId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "neighborDescriptors", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PeerDescriptor }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message NeighborUpdate
 */
export const NeighborUpdate = new NeighborUpdate$Type();
/**
 * @generated ServiceType for protobuf service NetworkRpc
 */
export const NetworkRpc = new ServiceType("NetworkRpc", [
    { name: "sendData", options: {}, I: DataMessage, O: Empty },
    { name: "handshake", options: {}, I: HandshakeRequest, O: HandshakeResponse },
    { name: "leaveNotice", options: {}, I: LeaveNotice, O: Empty },
    { name: "interleaveNotice", options: {}, I: InterleaveNotice, O: Empty },
    { name: "neighborUpdate", options: {}, I: NeighborUpdate, O: NeighborUpdate }
]);