import MessageID from "./MessageID"
import MessageRef from "./MessageRef"
import StreamMessage from "./StreamMessage"
import { StreamMessageType } from "./StreamMessage"
import GroupKeyRequest, { GroupKeyRequestSerialized } from "./GroupKeyRequest"
import GroupKeyResponse, { GroupKeyResponseSerialized } from "./GroupKeyResponse"
import EncryptedGroupKey from "./EncryptedGroupKey"
import { createSignaturePayload } from './signature'

export * from './StreamMessage'

// Serializers are imported because of their side effects: they statically register themselves to the factory class
import './StreamMessageSerializerV32'
import GroupKeyMessage from "./GroupKeyMessage"

export {
    MessageID,
    MessageRef,
    StreamMessage,
    StreamMessageType,
    GroupKeyMessage,
    GroupKeyRequest,
    GroupKeyRequestSerialized,
    GroupKeyResponse,
    GroupKeyResponseSerialized,
    EncryptedGroupKey,
    createSignaturePayload
}
