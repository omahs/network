import 'reflect-metadata'
import { StreamPartIDUtils } from 'streamr-client-protocol'
import { fastWallet } from 'streamr-test-utils'
import { GroupKey } from '../../src/encryption/GroupKey'
import { Decrypt } from '../../src/subscribe/Decrypt'
import { Signal } from '../../src/utils/Signal'
import { createMockMessage, mockContext } from '../test-utils/utils'

describe('Decrypt', () => {

    describe.each([
        [true, /Could not get GroupKey.*mock-error/],
        [false, /Could not get GroupKey.*no permission/]
    ])('group key not available', (isError: boolean, expectedErrorMessage: RegExp) => {
        it(`error: ${isError}`, async () => {
            const groupKeyStoreFactory = {
                getStore: () => ({
                    has: async () => true, // TODO as there is no key, this should be return false
                    get: async () => {
                        if (isError) {
                            throw new Error('mock-error')
                        } else {
                            return undefined
                        }
                    }
                })
            }
            const groupKeyRequester = {
                requestGroupKey: async () => {}
            }
            const decrypt = new Decrypt(
                mockContext(),
                groupKeyStoreFactory as any,
                groupKeyRequester as any,
                {
                    clearStream: jest.fn()
                } as any,
                {
                    onDestroy: Signal.create()
                } as any,
                {} as any
            )
            const msg = createMockMessage({
                streamPartId: StreamPartIDUtils.parse('stream#0'),
                publisher: fastWallet(),
                encryptionKey: GroupKey.generate()
            })
            await expect(() => decrypt.decrypt(msg)).rejects.toThrow(expectedErrorMessage)
        })
    })
})
