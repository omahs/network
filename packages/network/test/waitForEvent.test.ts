import EventEmitter from 'eventemitter3'
import { TimeoutError } from '@streamr/utils'
import { waitForEvent } from '../src/helpers/waitForEvent3'

interface Events {
    correctEvent: (n: number, s: string) => void
    wrongEvent: (n: number, s: string) => void
    zeroArgsEvent: () => void
}

describe(waitForEvent, () => {
    it("waits for correct event and records the arguments of invocation", async () => {
        const emitter = new EventEmitter<Events>()
        setTimeout(() => {
            emitter.emit("wrongEvent", 666, "beast")
        }, 0)
        setTimeout(() => {
            emitter.emit("correctEvent", 1337, "leet")
        }, 5)
        const recordedArgs = await waitForEvent(emitter, "correctEvent")
        expect(recordedArgs).toEqual([1337, "leet"])
    })

    it("works on events with zero arguments", async () => {
        const emitter = new EventEmitter<Events>()
        setTimeout(() => {
            emitter.emit("wrongEvent", 666, "beast")
        }, 0)
        setTimeout(() => {
            emitter.emit("zeroArgsEvent")
        }, 5)
        const recordedArgs = await waitForEvent(emitter, "zeroArgsEvent")
        expect(recordedArgs).toEqual([])
    })

    it("rejects if not event occurs within timeout", () => {
        const emitter = new EventEmitter<Events>()
        return expect(waitForEvent(emitter, "correctEvent", 20))
            .rejects
            .toEqual(new TimeoutError(20, 'waitForEvent'))
    })
})
