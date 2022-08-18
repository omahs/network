// run with: npx ts-node src/swash-debug.ts 5
import { padStart } from 'lodash'
import { KeyServer, waitForCondition } from 'streamr-test-utils'
import { wait } from '@streamr/utils'
import { StreamrClient } from './StreamrClient'
import { StreamPermission } from './permission'
import { ConfigTest } from './ConfigTest'
import { Wallet } from 'ethers'

const log = (msg: string) => console.log(new Date().toISOString() + '   ' + msg)

const GRANT_PERMISSIONS = true
const MIN_PUBLISHER_ID = 100

const getPublisherPrivateKey = (id: number) => '0x' + padStart(String(id), 64, '0')

const main = async () => {
    const publisherCount = Number(process.argv[2])
    await KeyServer.startIfNotRunning()

    const ownerPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
    const subscriberPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000002'
    log('Owner: ' + new Wallet(ownerPrivateKey).address)
    log('Subscriber: ' + new Wallet(subscriberPrivateKey).address)

    log('Create stream')
    const owner = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: ownerPrivateKey
        }
    })
    const stream = await owner.getOrCreateStream({
        id: '/test1'
    })

    if (GRANT_PERMISSIONS) {
        const BATCH_COUNT = 10 
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
            client: new StreamrClient({
                ...ConfigTest,
                auth: {
                    privateKey
                }
            })
        })
    }

    log('Create subscriber')
    const subscriber = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: subscriberPrivateKey
        }
    })
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
    await KeyServer.stopIfRunning()
}

main()