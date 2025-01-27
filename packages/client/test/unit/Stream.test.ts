import 'reflect-metadata'

import { toStreamID } from '@streamr/protocol'
import { StreamRegistry } from '../../src/registry/StreamRegistry'
import { StreamRegistryCached } from '../../src/registry/StreamRegistryCached'
import { StreamFactory } from './../../src/StreamFactory'

const createStreamFactory = (streamRegistry?: StreamRegistry, streamRegistryCached?: StreamRegistryCached) => {
    return new StreamFactory(
        undefined as any,
        undefined as any,
        undefined as any,
        streamRegistryCached as any,
        streamRegistry as any,
        undefined as any,
        undefined as any,
        undefined as any,
        undefined as any
    )
}

describe('Stream', () => {

    it('initial fields', () => {
        const factory = createStreamFactory()
        const stream = factory.createStream(toStreamID('mock-id'), {})
        expect(stream.getMetadata().config?.fields).toEqual([])
    })

    it('getMetadata', () => {
        const factory = createStreamFactory()
        const stream = factory.createStream(toStreamID('mock-id'), {
            partitions: 10,
            storageDays: 20
        })
        expect(stream.getMetadata()).toEqual({
            partitions: 10,
            storageDays: 20,
            // currently we get also this field, which was not set by the user
            // (maybe the test should pass also if this field is not present)
            config: {
                fields: []
            }
        })
    })

    describe('update', () => {
        it('fields not updated if transaction fails', async () => {
            const clearStream = jest.fn()
            const streamRegistryCached: Partial<StreamRegistryCached> = {
                clearStream
            }
            const streamRegistry: Partial<StreamRegistry> = {
                updateStream: jest.fn().mockRejectedValue(new Error('mock-error'))
            } 
            const factory = createStreamFactory(streamRegistry as any, streamRegistryCached as any)
                
            const stream = factory.createStream(toStreamID('mock-id'), {
                description: 'original-description'
            })

            await expect(() => {
                return stream.update({
                    description: 'updated-description'
                })
            }).rejects.toThrow('mock-error')
            expect(stream.getMetadata().description).toBe('original-description')
            expect(clearStream).toBeCalledWith('mock-id')
        })
    })
})
