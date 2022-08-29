import LeakDetector from 'jest-leak-detector' // requires weak-napi
import crypto from 'crypto'
import { GroupKey } from '../../src/encryption/GroupKey'
import { GroupKeyStore } from '../../src/encryption/GroupKeyStore'
import { uid, mockContext } from '../test-utils/utils'
import { describeRepeats } from '../test-utils/jest-utils'
import { StreamID, toStreamID } from 'streamr-client-protocol'

describeRepeats('GroupKeyStore', () => {
    let clientId: string
    let streamId: StreamID
    let store: GroupKeyStore
    let leakDetector: LeakDetector

    beforeEach(() => {
        clientId = `0x${crypto.randomBytes(20).toString('hex')}`
        streamId = toStreamID(uid('stream'))
        store = new GroupKeyStore({
            context: mockContext(),
            clientId,
            streamId,
            groupKeys: [],
        })

        leakDetector = new LeakDetector(store)
    })

    afterEach(async () => {
        if (!store) { return }
        await store.clear()
        // @ts-expect-error doesn't want us to unassign, but it's ok
        store = undefined // eslint-disable-line require-atomic-updates
    })

    afterEach(async () => {
        expect(await leakDetector.isLeaking()).toBeFalsy()
    })

    it('can get set and delete', async () => {
        const groupKey = GroupKey.generate()
        expect(await store.exists()).toBeFalsy()
        expect(await store.get(groupKey.id)).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        expect(await store.clear()).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        expect(await store.close()).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        // should only start existing now
        expect(await store.add(groupKey)).toBeTruthy()
        expect(await store.exists()).toBeTruthy()
        expect(await store.get(groupKey.id)).toEqual(groupKey)
        expect(await store.clear()).toBeTruthy()
        expect(await store.clear()).toBeFalsy()
        expect(await store.get(groupKey.id)).toBeFalsy()
    })

    it('does not exist until write', async () => {
        const groupKey = GroupKey.generate()
        expect(await store.exists()).toBeFalsy()

        expect(await store.isEmpty()).toBeTruthy()
        expect(await store.exists()).toBeFalsy()
        expect(await store.has(groupKey.id)).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        expect(await store.get(groupKey.id)).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        expect(await store.clear()).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        expect(await store.close()).toBeFalsy()
        expect(await store.exists()).toBeFalsy()
        // should only start existing now
        expect(await store.add(groupKey)).toBeTruthy()
        expect(await store.exists()).toBeTruthy()
    })

    it('can set next and use', async () => {
        const groupKey = GroupKey.generate()
        expect(await store.exists()).toBeFalsy()
        await store.setNextGroupKey(groupKey)
        expect(await store.exists()).toBeTruthy()
        expect(await store.useGroupKey()).toEqual([groupKey, undefined])
        expect(await store.useGroupKey()).toEqual([groupKey, undefined])
        const groupKey2 = GroupKey.generate()
        await store.setNextGroupKey(groupKey2)
        expect(await store.useGroupKey()).toEqual([groupKey, groupKey2])
        expect(await store.useGroupKey()).toEqual([groupKey2, undefined])
    })

    it('can set next in parallel and use', async () => {
        const groupKey = GroupKey.generate()
        const groupKey2 = GroupKey.generate()
        await Promise.all([
            store.setNextGroupKey(groupKey),
            store.setNextGroupKey(groupKey2),
        ])
        expect(await store.useGroupKey()).toEqual([groupKey, undefined])
    })

    describe('can set multiple times', () => {
        describe('the behaviour before the changes in this branch', () => {
            it('rotate before any messages published', async () => {
                const key1 = GroupKey.generate('key1')
                const key2 = GroupKey.generate('key2')
                const key3 = GroupKey.generate('key3')
                await store.setNextGroupKey(key1)
                await store.setNextGroupKey(key2)
                await store.setNextGroupKey(key3)
                expect(await store.useGroupKey()).toEqual([key2, undefined])
                expect(await store.useGroupKey()).toEqual([key2, key3])
                expect(await store.useGroupKey()).toEqual([key3, undefined])
            })
        
            it('rotate after some messages published', async () => {
                const [key0] = await store.useGroupKey()
                const key1 = GroupKey.generate('key1')
                const key2 = GroupKey.generate('key2')
                const key3 = GroupKey.generate('key3')
                await store.setNextGroupKey(key1)
                await store.setNextGroupKey(key2)
                await store.setNextGroupKey(key3)
                expect(await store.useGroupKey()).toEqual([key0, key2])
                expect(await store.useGroupKey()).toEqual([key2, key3])
                expect(await store.useGroupKey()).toEqual([key3, undefined])
            })    
        })
    
        describe('the behavior if we don\'t have a limit of max 2 nextGroupKeys and change the first if block in useGroupKey', () => {
            it('rotate before any messages published', async () => {
                const key1 = GroupKey.generate('key1')
                const key2 = GroupKey.generate('key2')
                const key3 = GroupKey.generate('key3')
                await store.setNextGroupKey(key1)
                await store.setNextGroupKey(key2)
                await store.setNextGroupKey(key3)
                expect(await store.useGroupKey()).toEqual([key1, key2])
                expect(await store.useGroupKey()).toEqual([key2, key3])
                expect(await store.useGroupKey()).toEqual([key3, undefined])
            })
        
            it('rotate after some messages published', async () => {
                const [key0] = await store.useGroupKey()
                const key1 = GroupKey.generate('key1')
                const key2 = GroupKey.generate('key2')
                const key3 = GroupKey.generate('key3')
                await store.setNextGroupKey(key1)
                await store.setNextGroupKey(key2)
                await store.setNextGroupKey(key3)
                expect(await store.useGroupKey()).toEqual([key0, key1])
                expect(await store.useGroupKey()).toEqual([key1, key2])
                expect(await store.useGroupKey()).toEqual([key2, key3])
                expect(await store.useGroupKey()).toEqual([key3, undefined])
            })    
        })
    
    })
})
