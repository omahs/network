/* eslint-disable max-len */

export enum ErrorCode {
    CONNECTION_FAILED = 'CONNECTION_FAILED',
    COULD_NOT_ROUTE = 'COULD_NOT_ROUTE',
    STARTING_WEBSOCKET_SERVER_FAILED = 'STARTING_WEBSOCKET_SERVER_FAILED',
    WEBSOCKET_CONNECTION_REQUEST_REJECTED = 'WEBSOCKET_CONNECTION_REQUEST_REJECTED',
    COULD_NOT_START = 'COULD_NOT_START',
    COULD_NOT_STOP = 'COULD_NOT_STOP',
    CANNOT_CONNECT_TO_SELF = 'CANNOT_CONNECT_TO_SELF',
    NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
    ILLEGAL_RTC_PEER_CONNECTION_STATE = 'ILLEGAL_RTC_PEER_CONNECTION_STATE',
    ILLEGAL_ARGUMENTS = 'ILLEGAL_ARGUMENTS',
    CONNECTIVITY_RESPONSE_NOT_RECEIVED_BEFORE_TIMEOUT = 'CONNECTIVITY_RESPONSE_NOT_RECEIVED_BEFORE_TIMEOUT',
    DHT_JOIN_TIMEOUT = 'DHT_JOIN_TIMEOUT' 
}

class Err extends Error {
    
    public code: ErrorCode
    public originalError?: Error | string

    constructor(code: ErrorCode, message?: string, originalError?: Error | string) {
        super(message)
        this.code = code
        this.originalError = originalError
    }
}

export class ConnectionFailed extends Err { constructor( message?: string, originalError?: Error | string) { super(ErrorCode.CONNECTION_FAILED, message, originalError) } }
export class CouldNotRoute extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.COULD_NOT_ROUTE, message, originalError) } }
export class StartingWebSocketServerFailed extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.STARTING_WEBSOCKET_SERVER_FAILED, message, originalError) } }
export class WebSocketConnectionRequestRejected extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.WEBSOCKET_CONNECTION_REQUEST_REJECTED, message, originalError) } }
export class CouldNotStart extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.COULD_NOT_START, message, originalError) } }
export class CouldNotStop extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.COULD_NOT_STOP, message, originalError) } }
export class CannotConnectToSelf extends Err { constructor(message?: string, originalError?: Error | string) {super(ErrorCode.CANNOT_CONNECT_TO_SELF, message, originalError) } }
export class NotImplemented extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.NOT_IMPLEMENTED, message, originalError) } }
export class IllegalRTCPeerConnectionState extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.ILLEGAL_RTC_PEER_CONNECTION_STATE, message, originalError) } }
export class IllegalArguments extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.ILLEGAL_ARGUMENTS, message, originalError) } }
export class ConnectivityResponseTimeout extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.CONNECTIVITY_RESPONSE_NOT_RECEIVED_BEFORE_TIMEOUT, message, originalError) } }
export class DhtJoinTimeout extends Err { constructor(message?: string, originalError?: Error | string) { super(ErrorCode.DHT_JOIN_TIMEOUT, message, originalError) } }
