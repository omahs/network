// @generated by protobuf-ts 2.8.0 with parameter server_generic,generate_dependencies
// @generated from protobuf file "TestProtos.proto" (syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { DhtRpcService } from "./TestProtos";
import type { RouteMessageAck } from "./TestProtos";
import type { RouteMessageWrapper } from "./TestProtos";
import type { PingResponse } from "./TestProtos";
import type { PingRequest } from "./TestProtos";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { ClosestPeersResponse } from "./TestProtos";
import type { ClosestPeersRequest } from "./TestProtos";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service DhtRpcService
 */
export interface IDhtRpcServiceClient {
    /**
     * @generated from protobuf rpc: getClosestPeers(ClosestPeersRequest) returns (ClosestPeersResponse);
     */
    getClosestPeers(input: ClosestPeersRequest, options?: RpcOptions): UnaryCall<ClosestPeersRequest, ClosestPeersResponse>;
    /**
     * @generated from protobuf rpc: ping(PingRequest) returns (PingResponse);
     */
    ping(input: PingRequest, options?: RpcOptions): UnaryCall<PingRequest, PingResponse>;
    /**
     * @generated from protobuf rpc: routeMessage(RouteMessageWrapper) returns (RouteMessageAck);
     */
    routeMessage(input: RouteMessageWrapper, options?: RpcOptions): UnaryCall<RouteMessageWrapper, RouteMessageAck>;
}
/**
 * @generated from protobuf service DhtRpcService
 */
export class DhtRpcServiceClient implements IDhtRpcServiceClient, ServiceInfo {
    typeName = DhtRpcService.typeName;
    methods = DhtRpcService.methods;
    options = DhtRpcService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: getClosestPeers(ClosestPeersRequest) returns (ClosestPeersResponse);
     */
    getClosestPeers(input: ClosestPeersRequest, options?: RpcOptions): UnaryCall<ClosestPeersRequest, ClosestPeersResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<ClosestPeersRequest, ClosestPeersResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ping(PingRequest) returns (PingResponse);
     */
    ping(input: PingRequest, options?: RpcOptions): UnaryCall<PingRequest, PingResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<PingRequest, PingResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: routeMessage(RouteMessageWrapper) returns (RouteMessageAck);
     */
    routeMessage(input: RouteMessageWrapper, options?: RpcOptions): UnaryCall<RouteMessageWrapper, RouteMessageAck> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<RouteMessageWrapper, RouteMessageAck>("unary", this._transport, method, opt, input);
    }
}
