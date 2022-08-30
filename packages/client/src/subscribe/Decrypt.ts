/**
 * Decrypt StreamMessages in-place.
 */
import { StreamMessage } from 'streamr-client-protocol'

import { EncryptionUtil, UnableToDecryptError } from '../encryption/EncryptionUtil'
import { StreamRegistryCached } from '../registry/StreamRegistryCached'
import { Context } from '../utils/Context'
import { DestroySignal } from '../DestroySignal'
import { instanceId } from '../utils/utils'
import { GroupKeyRequester } from '../encryption/GroupKeyRequester'
import { GroupKeyStoreFactory } from '../encryption/GroupKeyStoreFactory'

const waitForCondition = async ( // TODO remove this when we implement the non-polling key retrieval
    conditionFn: () => (boolean | Promise<boolean>),
    timeout = 5000,
    retryInterval = 100,
    onTimeoutContext?: () => string
): Promise<void> => {
    // create error beforehand to capture more usable stack
    const err = new Error(`waitForCondition: timed out before "${conditionFn.toString()}" became true`)
    return new Promise((resolve, reject) => {
        let poller: NodeJS.Timeout | undefined = undefined
        const clearPoller = () => {
            if (poller !== undefined) {
                clearInterval(poller)
            }
        }
        const maxTime = Date.now() + timeout
        const poll = async () => {
            if (Date.now() < maxTime) {
                let result
                try {
                    result = await conditionFn()
                } catch (err) {
                    clearPoller()
                    reject(err)
                }
                if (result) {
                    clearPoller()
                    resolve()
                }
            } else {
                clearPoller()
                if (onTimeoutContext) {
                    err.message += `\n${onTimeoutContext()}`
                }
                reject(err)
            }
        }
        setTimeout(poll, 0)
        poller = setInterval(poll, retryInterval)
    })
}

export class Decrypt<T> implements Context {
    readonly id
    readonly debug
    private isStopped = false

    constructor(
        context: Context,
        private groupKeyStoreFactory: GroupKeyStoreFactory,
        private groupKeyRequester: GroupKeyRequester,
        private streamRegistryCached: StreamRegistryCached,
        private destroySignal: DestroySignal,
    ) {
        this.id = instanceId(this)
        this.debug = context.debug.extend(this.id)
        this.decrypt = this.decrypt.bind(this)
        this.destroySignal.onDestroy.listen(async () => {
            if (!this.isStopped) {
                await this.stop()
            }
        })
    }

    async decrypt(streamMessage: StreamMessage<T>): Promise<StreamMessage<T>> {
        if (this.isStopped) {
            return streamMessage
        }

        if (!streamMessage.groupKeyId) {
            return streamMessage
        }

        if (streamMessage.encryptionType !== StreamMessage.ENCRYPTION_TYPES.AES) {
            return streamMessage
        }

        try {
            await this.groupKeyRequester.getGroupKey(
                streamMessage.groupKeyId,
                streamMessage.getPublisherId(),
                streamMessage.getStreamPartID()
            ).catch((err) => {
                throw new UnableToDecryptError(streamMessage, `Could not get GroupKey: ${streamMessage.groupKeyId} – ${err.stack}`)
            })
            const store = await this.groupKeyStoreFactory.getStore(streamMessage.getStreamId())
            await waitForCondition(() => {  // TODO and implement without polling (and wrap with "withTimeout")
                return store.has(streamMessage.groupKeyId!)
            }) 
            const groupKey = await store.get(streamMessage.groupKeyId!)!

            if (!groupKey) { // TODO tämä ei siis tässä pollauksessa voi toteutua (paitsi jos pollaus timeouttaa)
                throw new UnableToDecryptError(streamMessage, [
                    `Could not get GroupKey: ${streamMessage.groupKeyId}`,
                    'Publisher is offline, key does not exist or no permission to access key.',
                ].join(' '))
            }

            if (this.isStopped) { 
                return streamMessage
            }
            const clone = StreamMessage.deserialize(streamMessage.serialize())
            EncryptionUtil.decryptStreamMessage(clone, groupKey)
            return clone as StreamMessage<T>
        } catch (err) {
            if (this.isStopped) { 
                return streamMessage
            }
            this.debug('Decrypt Error', err)
            // clear cached permissions if cannot decrypt, likely permissions need updating
            this.streamRegistryCached.clearStream(streamMessage.getStreamId())
            throw err
        }
    }

    async stop(): Promise<void> {
        this.debug('stop')
        this.isStopped = true
    }
}
