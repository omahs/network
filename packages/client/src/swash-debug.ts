// run with: npx ts-node src/swash-debug.ts 5 docker-dev publisher
// if connecting to remote: STREAMR_DOCKER_DEV_HOST=1.2.3.4 npx ts-node src/swash-debug.ts 5 docker-dev publisher
import { padStart } from 'lodash'
import { KeyServer, waitForCondition } from 'streamr-test-utils'
import fetch from 'node-fetch'
import { StreamrClient } from './StreamrClient'
import { StreamPermission } from './permission'
import { ConfigTest } from './ConfigTest'
import { Wallet } from 'ethers'
//import { FakeEnvironment } from '../test/test-utils/fake/FakeEnvironment'
import { log } from './utils/timedLog'
import { StreamID, toStreamPartID } from 'streamr-client-protocol'
import { wait } from '@streamr/utils'

const ENVIRONMENT: 'docker-dev' | 'fake' = process.argv[3] as any
const GRANT_PERMISSIONS = (ENVIRONMENT === 'fake')
const MIN_PUBLISHER_ID = 100

//let fakeEnvironment: FakeEnvironment
//if (ENVIRONMENT === 'fake') fakeEnvironment = new FakeEnvironment()

const getPublisherPrivateKey = (id: number) => '0x' + padStart(String(id), 64, '0')

const getTopologySize = async (streamId: StreamID): Promise<number> => {
    const url = `http://${process.env.STREAMR_DOCKER_DEV_HOST || '10.200.10.1'}:30301/topology/${encodeURIComponent(streamId)}`
    const topology = await (await fetch(url)).json()
    const nodes = topology[toStreamPartID(streamId, 0)]
    if (nodes !== undefined) {
        return Object.keys(nodes).length
    } else {
        return 0
    }
}

const createClient = (privateKey: string): StreamrClient => {
    if (ENVIRONMENT === 'docker-dev') {
        return new StreamrClient({
            ...ConfigTest,
            auth: {
                privateKey
            },
            network: {
                ...ConfigTest.network,
                stunUrls: ['stun:stun.streamr.network:5349']
            }
        })
    } /*else if (ENVIRONMENT === 'fake') {
        return fakeEnvironment!.createClient({
            auth: {
                privateKey
            }
        })
    }*/
    throw new Error('assertion failed')
}

const role = process.argv[4]
const isSubscriber = () => (role === 'subscriber') || (role === 'both')
const isPublisher = () => (role === 'publisher') || (role === 'both')

const main = async () => {
    log('Init')
    const publisherCount = Number(process.argv[2])

    const ownerPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
    const subscriberPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000002'
    log('Owner: ' + new Wallet(ownerPrivateKey).address)
    log('Subscriber: ' + new Wallet(subscriberPrivateKey).address)
    log('Roles: publisher=' + isPublisher() + ', subscriber=' + isSubscriber())

    log('Create stream')
    const owner = createClient(ownerPrivateKey)
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
    
    let publishers: { id: number, client: StreamrClient }[] = []
    if (isPublisher()) {
        log('Create ' + publisherCount + ' publishers')
        for (let publisherId = MIN_PUBLISHER_ID; publisherId < MIN_PUBLISHER_ID + publisherCount; publisherId++) {
            const privateKey = getPublisherPrivateKey(publisherId)
            log('Publisher' + publisherId + ': ' + new Wallet(privateKey).address)
            publishers.push({
                id: publisherId,
                client: createClient(privateKey)
            })
        }
    }

    let receivedMessageCount = 0
    if (isSubscriber()) {
        log('Create subscriber')
        const subscriber = createClient(subscriberPrivateKey)
        await stream.grantPermissions({
            permissions: [StreamPermission.SUBSCRIBE],
            user: await subscriber.getAddress()
        })

        const sub = await subscriber.subscribe(stream.id, (content: any) => {
            if (content.warmUpTrigger === undefined) {
                receivedMessageCount++
                log('Received ' + receivedMessageCount + '/' + publisherCount + ': ' + JSON.stringify(content))
            }
        })
        sub.on('error', (e) => {
            console.log(e)
        })
    }

    if (ENVIRONMENT === 'docker-dev') {
        log('Wait for joins (the subscriber, and trigger publishers to join)')
        if (isPublisher()) {
            publishers.forEach(async (p) => {
                log('Warmup: ' + p.id)
                p.client.publish(stream.id, {
                    warmUpTrigger: 'to-trigger-topology-join'
                })
            })
        }
        await waitForCondition(async () => {
            const topologySize = await getTopologySize(stream.id)
            log('Topology size: ' + topologySize)
            return topologySize === publisherCount + 1
        }, 10 * 60 * 1000, 2000)
    }
    const topologyReadyStartTime = Date.now()

    if (isPublisher()) {
        publishers.forEach(async (p) => {
            log('Publish')
            p.client.publish(stream.id, {
                id: p.id,
                timestamp: new Date().toISOString(),
                address: await p.client.getAddress()
            })
        })
    }
    
    if (isSubscriber()) {
        log('Wait for ' + publisherCount + ' message')
        await waitForCondition(() => receivedMessageCount >= publisherCount, 60 * 60 * 1000)
    
        log('Done: all messages received ')
        log(`- ${(Date.now() - topologyReadyStartTime) / 1000} seconds after topology ready`)
    } else if (isPublisher()) {
        log('Need to stay online to respond to group key requests')
        await wait(60 * 60 * 1000)
    }

    process.exit(0)
}

main()