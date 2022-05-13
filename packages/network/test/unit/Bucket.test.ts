import {
    Bucket,
    formBucketID,
    getBucketID,
    getWindowNumber,
    getWindowStartTime,
    WINDOW_LENGTH
} from '../../src/logic/receipts/Bucket'
import { MessageID, toStreamID, toStreamPartID } from 'streamr-client-protocol'

describe(getWindowNumber, () => {
    const TIMESTAMP = 1652252054325
    const WINDOW_NUMBER = getWindowNumber(TIMESTAMP)
    const WINDOW_LOWER_BOUND = getWindowStartTime(WINDOW_NUMBER)
    const WINDOW_UPPER_BOUND = getWindowStartTime(WINDOW_NUMBER + 1)

    it('timestamp lies within its window range', () => {
        expect(TIMESTAMP).toBeWithin(WINDOW_LOWER_BOUND, WINDOW_UPPER_BOUND)
    })

    it('window range is of expected length', () => {
        expect(WINDOW_UPPER_BOUND - WINDOW_LOWER_BOUND).toEqual(WINDOW_LENGTH)
    })

    it('WINDOW_LOWER_BOUND maps to current window (inclusive lower range)', () => {
        expect(getWindowNumber(WINDOW_LOWER_BOUND)).toEqual(WINDOW_NUMBER)
    })

    it('WINDOW_UPPER_BOUND maps to next window (exclusive upper range)', () => {
        expect(getWindowNumber(WINDOW_UPPER_BOUND)).toEqual(WINDOW_NUMBER + 1)
    })

    it('WINDOW_LOWER_BOUND - 1 maps to previous window', () => {
        expect(getWindowNumber(WINDOW_LOWER_BOUND - 1)).toEqual(WINDOW_NUMBER - 1)
    })

    it('WINDOW_UPPER_BOUND - 1 maps to current window', () => {
        expect(getWindowNumber(WINDOW_UPPER_BOUND - 1)).toEqual(WINDOW_NUMBER)
    })
})

describe(formBucketID, () => {
    it('forms expected bucketID', () => {
        const bucketId = formBucketID({
            nodeId: 'nodeId',
            streamPartId: toStreamPartID(toStreamID('stream'), 62),
            publisherId: 'publisher',
            msgChainId: 'xaxaxa',
            windowNumber: 31352
        })
        expect(bucketId).toEqual('nodeId_stream#62_publisher_xaxaxa_31352')
    })
})

describe(getBucketID, () => {
    it('forms expected bucketID', () => {
        const messageId = new MessageID(
            toStreamID('stream'),
            62,
            getWindowStartTime(31352),
            0,
            'publisher',
            'xaxaxa'
        )
        expect(getBucketID(messageId, 'nodeId')).toEqual(formBucketID({
            nodeId: 'nodeId',
            streamPartId: toStreamPartID(toStreamID('stream'), 62),
            publisherId: 'publisher',
            msgChainId: 'xaxaxa',
            windowNumber: 31352
        }))
    })
})

describe(Bucket, () => {
    it('creating and recording some data', () => {
        const messageId = new MessageID(
            toStreamID('stream'),
            62,
            getWindowStartTime(31352),
            0,
            'publisher',
            'xaxaxa'
        )
        const bucket = new Bucket(messageId, 'nodeId')
        bucket.record(3154)
        bucket.record(6662)
        expect(bucket.getId()).toEqual(getBucketID(messageId, 'nodeId'))
        expect(bucket.getMessageCount()).toEqual(2)
        expect(bucket.getTotalPayloadSize()).toEqual(3154 + 6662)
    })
})
