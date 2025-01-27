import assert from 'assert'
import ValidationError from '../../../../src/errors/ValidationError'
import InstructionMessage from '../../../../src/protocol/tracker_layer/instruction_message/InstructionMessage'
import TrackerMessage from '../../../../src/protocol/tracker_layer/TrackerMessage'
import { toStreamID } from '../../../../src/utils/StreamID'

describe('InstructionMessage', () => {
    describe('constructor', () => {
        it('throws on null counter', () => {
            assert.throws(() => new InstructionMessage({
                requestId: 'requestId',
                streamId: toStreamID('streamId'),
                streamPartition: 0,
                nodeIds: [],
                counter: null as any
            }), ValidationError)
        })
        it('throws on null nodeIds', () => {
            assert.throws(() => new InstructionMessage({
                requestId: 'requestId',
                streamId: toStreamID('streamId'),
                streamPartition: 0,
                nodeIds: null as any,
                counter: 1
            }), ValidationError)
        })
        it('throws on null streamPartition', () => {
            assert.throws(() => new InstructionMessage({
                requestId: 'requestId',
                streamId: toStreamID('streamId'),
                streamPartition: null as any,
                nodeIds: [],
                counter: 1
            }), ValidationError)
        })
        it('throws on null streamId', () => {
            assert.throws(() => new InstructionMessage({
                requestId: 'requestId',
                streamId: null as any,
                streamPartition: 0,
                nodeIds: [],
                counter: 1
            }), ValidationError)
        })
        it('throws on null requestId', () => {
            assert.throws(() => new InstructionMessage({
                requestId: null as any,
                streamId: toStreamID('streamId'),
                streamPartition: 0,
                nodeIds: [],
                counter: 1
            }), ValidationError)
        })
        it('should create the latest version', () => {
            const msg = new InstructionMessage({
                requestId: 'requestId',
                streamId: toStreamID('streamId'),
                streamPartition: 0,
                nodeIds: [],
                counter: 1
            })
            assert(msg instanceof InstructionMessage)
            assert.strictEqual(msg.version, TrackerMessage.LATEST_VERSION)
            assert.strictEqual(msg.requestId, 'requestId')
            assert.strictEqual(msg.streamId, 'streamId')
            assert.strictEqual(msg.streamPartition, 0)
            assert.deepStrictEqual(msg.nodeIds, [])
            assert.strictEqual(msg.counter, 1)
        })
    })
})
