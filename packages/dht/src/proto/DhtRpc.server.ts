// @generated by protobuf-ts 2.8.0 with parameter server_generic,generate_dependencies
// @generated from protobuf file "DhtRpc.proto" (syntax proto3)
// tslint:disable
import { IceCandidate } from "./DhtRpc";
import { RtcAnswer } from "./DhtRpc";
import { RtcOffer } from "./DhtRpc";
import { Empty } from "./google/protobuf/empty";
import { WebRtcConnectionRequest } from "./DhtRpc";
import { WebSocketConnectionResponse } from "./DhtRpc";
import { WebSocketConnectionRequest } from "./DhtRpc";
import { RouteMessageAck } from "./DhtRpc";
import { RouteMessageWrapper } from "./DhtRpc";
import { PingResponse } from "./DhtRpc";
import { PingRequest } from "./DhtRpc";
import { ClosestPeersResponse } from "./DhtRpc";
import { ClosestPeersRequest } from "./DhtRpc";
import { ServerCallContext } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service DhtRpcService
 */
export interface IDhtRpcService<T = ServerCallContext> {
    /**
     * @generated from protobuf rpc: getClosestPeers(ClosestPeersRequest) returns (ClosestPeersResponse);
     */
    getClosestPeers(request: ClosestPeersRequest, context: T): Promise<ClosestPeersResponse>;
    /**
     * @generated from protobuf rpc: ping(PingRequest) returns (PingResponse);
     */
    ping(request: PingRequest, context: T): Promise<PingResponse>;
    /**
     * @generated from protobuf rpc: routeMessage(RouteMessageWrapper) returns (RouteMessageAck);
     */
    routeMessage(request: RouteMessageWrapper, context: T): Promise<RouteMessageAck>;
}
/**
 * @generated from protobuf service WebSocketConnectorService
 */
export interface IWebSocketConnectorService<T = ServerCallContext> {
    /**
     * @generated from protobuf rpc: requestConnection(WebSocketConnectionRequest) returns (WebSocketConnectionResponse);
     */
    requestConnection(request: WebSocketConnectionRequest, context: T): Promise<WebSocketConnectionResponse>;
}
/**
 * @generated from protobuf service WebRtcConnectorService
 */
export interface IWebRtcConnectorService<T = ServerCallContext> {
    /**
     * @generated from protobuf rpc: requestConnection(WebRtcConnectionRequest) returns (google.protobuf.Empty);
     */
    requestConnection(request: WebRtcConnectionRequest, context: T): Promise<Empty>;
    /**
     * @generated from protobuf rpc: rtcOffer(RtcOffer) returns (google.protobuf.Empty);
     */
    rtcOffer(request: RtcOffer, context: T): Promise<Empty>;
    /**
     * @generated from protobuf rpc: rtcAnswer(RtcAnswer) returns (google.protobuf.Empty);
     */
    rtcAnswer(request: RtcAnswer, context: T): Promise<Empty>;
    /**
     * @generated from protobuf rpc: iceCandidate(IceCandidate) returns (google.protobuf.Empty);
     */
    iceCandidate(request: IceCandidate, context: T): Promise<Empty>;
}
