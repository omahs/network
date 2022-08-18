// run with: npx ts-node src/swash-debug.ts 5 docker-dev
import { padStart } from 'lodash'
import { KeyServer, waitForCondition } from 'streamr-test-utils'
import { wait } from '@streamr/utils'
import { StreamrClient } from './StreamrClient'
import { StreamPermission } from './permission'
import { ConfigTest } from './ConfigTest'
import { Wallet } from 'ethers'
import { ClientFactory, createClientFactory } from '../test/test-utils/fake/fakeEnvironment'

const log = (msg: string) => console.log(new Date().toISOString() + '   ' + msg)

const ENVIRONMENT: 'docker-dev' | 'fake' = process.argv[3] as any
const GRANT_PERMISSIONS = (ENVIRONMENT === 'fake')
const MIN_PUBLISHER_ID = 100

let fakeClientFactory: ClientFactory
if (ENVIRONMENT === 'fake') fakeClientFactory = createClientFactory()

const getPublisherPrivateKey = (id: number) => '0x' + padStart(String(id), 64, '0')

const createClient = (privateKey: string): StreamrClient => {
    if (ENVIRONMENT === 'docker-dev') {
        return new StreamrClient({
            ...ConfigTest,
            auth: {
                privateKey
            }
        })
    } else if (ENVIRONMENT === 'fake') {
        return fakeClientFactory!.createClient({
            auth: {
                privateKey
            }
        })
    }
    throw new Error('assertion failed')
}

const main = async () => {
    log('Init')
    const publisherCount = Number(process.argv[2])
    if (ENVIRONMENT === 'docker-dev') await KeyServer.startIfNotRunning()

    const ownerPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
    const subscriberPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000002'
    log('Owner: ' + new Wallet(ownerPrivateKey).address)
    log('Subscriber: ' + new Wallet(subscriberPrivateKey).address)

    log('Create stream')
    const owner = createClient(ownerPrivateKey)
    const stream = await owner.createStream({ // getOrCreateStream in docker-dev
        id: '/test1'
    })

    if (GRANT_PERMISSIONS) {
        const BATCH_COUNT = 1 
        for (let batchId = 0; batchId < BATCH_COUNT; batchId++) {
            log('Grant permissions: batch ' + batchId)
            let permissionAssignments = []
            for (let publisherId = MIN_PUBLISHER_ID; publisherId < MIN_PUBLISHER_ID + publisherCount; publisherId++) {
                const privateKey = getPublisherPrivateKey(publisherId)
                if (publisherId % BATCH_COUNT === batchId) {
                    permissionAssignments.push({
                        permissions: [StreamPermission.PUBLISH],
                        user: new Wallet(privateKey).address
                    })
                }
            }
            await owner.setPermissions({
                streamId: stream.id,
                assignments: permissionAssignments
            })
        }
    }
    
    log('Create ' + publisherCount + ' publishers')
    let publishers: { id: number, client: StreamrClient }[] = []
    for (let publisherId = MIN_PUBLISHER_ID; publisherId < MIN_PUBLISHER_ID + publisherCount; publisherId++) {
        const privateKey = getPublisherPrivateKey(publisherId)
        log('Publisher' + publisherId + ': ' + new Wallet(privateKey).address)
        publishers.push({
            id: publisherId,
            client: createClient(privateKey)
        })
    }

    log('Create subscriber')
    const subscriber = createClient(subscriberPrivateKey)
    await stream.grantPermissions({
        permissions: [StreamPermission.SUBSCRIBE],
        user: await subscriber.getAddress()
    })

    let receivedMessageCount = 0
    await subscriber.subscribe(stream.id, (content: any) => {
        log('Received ' + receivedMessageCount + '/' + publisherCount + ': ' + JSON.stringify(content))
        receivedMessageCount++
    })

    log('Wait for subscriber to join')
    await wait(5000)

    const publishStartTime = Date.now()
    publishers.forEach(async (p) => {
        log('Publish')
        p.client.publish(stream.id, {
            id: p.id,
            timestamp: new Date().toISOString(),
            address: await p.client.getAddress()
        })
    })
    
    log('Wait for ' + publishers.length + ' message')
    await waitForCondition(() => receivedMessageCount >= publishers.length, 10 * 60 * 1000)

    log('Done: all messages received ' + ((Date.now() - publishStartTime) / 1000) + ' seconds after publishers started to publish')
    if (ENVIRONMENT === 'docker-dev') await KeyServer.stopIfRunning()
}

main()