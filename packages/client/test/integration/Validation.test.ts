import { wait } from 'streamr-test-utils'

import { getPublishTestMessages, fakePrivateKey, describeRepeats, createTestStream } from '../utils'
import { BrubeckClient as StreamrClient } from '../../src/BrubeckClient'

import clientOptions from './config'
import { Stream } from '../../src/Stream'
import Subscriber from '../../src/Subscriber'
import Subscription from '../../src/Subscription'

const MAX_MESSAGES = 10

describeRepeats('Validation', () => {
    let publishTestMessages: ReturnType<typeof getPublishTestMessages>
    let client: StreamrClient
    let stream: Stream
    let subscriber: Subscriber

    const createClient = (opts = {}) => {
        const c = new StreamrClient({
            ...clientOptions,
            auth: {
                privateKey: fakePrivateKey(),
            },
            autoConnect: false,
            autoDisconnect: false,
            maxRetries: 2,
            ...opts,
        })
        return c
    }

    async function setupClient(opts: any) {
        // eslint-disable-next-line require-atomic-updates
        client = createClient(opts)
        subscriber = client.subscriber
        client.debug('connecting before test >>')
        await client.getSessionToken()
        stream = await createTestStream(client, module, {
            requireSignedData: client.options.publishWithSignature !== 'never'
        })

        client.debug('connecting before test <<')
        publishTestMessages = getPublishTestMessages(client, stream.id)
        return client
    }

    afterEach(() => {
        if (!subscriber) { return }
        expect(subscriber.count(stream.id)).toBe(0)
        if (!client) { return }
        expect(client.getSubscriptions(stream.id)).toEqual([])
    })

    afterEach(async () => {
        await wait(0)
        if (client) {
            client.debug('disconnecting after test >>')
            await client.destroy()
            client.debug('disconnecting after test <<')
        }
    })

    let subs: Subscription[] = []

    beforeEach(async () => {
        const existingSubs = subs
        subs = []
        await Promise.all(existingSubs.map((sub) => (
            sub.return()
        )))
    })

    describe('signature validation', () => {
        beforeEach(async () => {
            await setupClient({
                gapFillTimeout: 1000,
                retryResendAfter: 1000,
            })
            await client.connect()
        })

        it('subscribe fails gracefully when signature bad', async () => {
            const sub = await client.subscribe(stream.id)

            const errs: Error[] = []
            const onSubError = jest.fn((err) => {
                errs.push(err)
            })
            sub.onError(onSubError)

            const BAD_INDEX = 2
            sub.context.pipeline.forEachBefore((streamMessage, index) => {
                if (index === BAD_INDEX) {
                    // eslint-disable-next-line no-param-reassign
                    streamMessage.signature = 'badsignature'
                    sub.debug('inserting bad signature', streamMessage)
                }
            })

            const published = await publishTestMessages(MAX_MESSAGES, {
                timestamp: 111111,
            })

            let t!: ReturnType<typeof setTimeout>
            const received = []
            for await (const m of sub) {
                received.push(m.getParsedContent())
                if (received.length === published.length - 1) {
                    clearTimeout(t)
                    // give it a chance to fail
                    t = setTimeout(() => {
                        sub.return()
                    }, 500)
                }

                if (received.length === published.length) {
                    // failed
                    clearTimeout(t)
                    break
                }
            }

            clearTimeout(t)

            const expectedMessages = [
                // remove bad message
                ...published.slice(0, BAD_INDEX),
                ...published.slice(BAD_INDEX + 1, MAX_MESSAGES)
            ]

            expect(received).toEqual(expectedMessages)
            expect(onSubError).toHaveBeenCalledTimes(1)
            expect(errs).toHaveLength(1)
            errs.forEach((err) => {
                expect(err).toBeInstanceOf(Error)
                expect(err.message).toMatch('signature')
            })
        }, 10000)
    })

    describe('content parsing', () => {
        beforeEach(async () => {
            await setupClient({
                gapFillTimeout: 1000,
                retryResendAfter: 1000,
            })
            await client.connect()
        })

        it('subscribe fails gracefully when content bad', async () => {
            await client.connect()
            const sub = await client.subscribe(stream.id)
            const errs: Error[] = []
            const onSubError = jest.fn((err) => {
                errs.push(err)
            })
            sub.onError(onSubError)

            const BAD_INDEX = 2
            sub.context.pipeline.mapBefore(async (streamMessage, index) => {
                if (index === BAD_INDEX) {
                    const msg = streamMessage.clone()
                    // eslint-disable-next-line no-param-reassign
                    msg.serializedContent = '{ badcontent'
                    msg.parsedContent = undefined
                    msg.signature = null
                    // @ts-expect-error signer is private
                    await client.publisher.pipeline.signer.sign(msg)
                    return msg
                }
                return streamMessage
            })

            const published = await publishTestMessages(MAX_MESSAGES, {
                timestamp: 1111111,
            })

            const received = []
            for await (const m of sub) {
                received.push(m.getParsedContent())
                if (received.length === published.length - 1) {
                    break
                }
            }

            expect(received).toEqual([
                ...published.slice(0, BAD_INDEX),
                ...published.slice(BAD_INDEX + 1, MAX_MESSAGES)
            ])
            expect(onSubError).toHaveBeenCalledTimes(1)
            expect(() => { throw errs[0] }).toThrow('JSON')
            expect(errs).toHaveLength(1)
        }, 10000)
    })
})