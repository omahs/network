// run with: npx ts-node src/swash-debug.ts 5 docker-dev publisher 0 1
// if connecting to remote: STREAMR_DOCKER_DEV_HOST=1.2.3.4 npx ts-node src/swash-debug.ts 5 docker-dev publisher 0 1
import { padStart } from 'lodash'
import { waitForCondition } from 'streamr-test-utils'
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
const PUBLIC_STREAM = true
const GRANT_PERMISSIONS = false // (ENVIRONMENT === 'fake')
const MIN_PUBLISHER_ID = 1
const DELAYS = {
    actualMessage: 50,
    keyRequest: 200,
    keyResponse: 200,
    publisherSubscribe: 100
}

//let fakeEnvironment: FakeEnvironment
//if (ENVIRONMENT === 'fake') fakeEnvironment = new FakeEnvironment()

const getPublisherPrivateKey = (id: number) => '0x' + padStart(String(id), 64, '0')

const getTopologySize = async (streamId: StreamID): Promise<number> => {
    const url = `http://${process.env.STREAMR_DOCKER_DEV_HOST || '10.200.10.1'}:30302/topology/${encodeURIComponent(streamId)}`
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
const myPublisherShard = Number(process.argv[5] ?? 0)
const publisherShardCount = Number(process.argv[6] ?? 1)
const getPublisherShard = (publisherId: number) => (publisherId % publisherShardCount)
const isMyPublisherShard = (publisherId: number) => getPublisherShard(publisherId) === myPublisherShard

const main = async () => {
    log('Init')
    const publisherCount = Number(process.argv[2])

    const ownerPrivateKey = '0x00000000000000000000000000000000000000000000000000000000000003E6'
    const subscriberPrivateKey = '0x00000000000000000000000000000000000000000000000000000000000003E7'
    log('Owner: ' + new Wallet(ownerPrivateKey).address)
    log('Subscriber: ' + new Wallet(subscriberPrivateKey).address)
    log('Roles: publisher=' + isPublisher() + ', subscriber=' + isSubscriber())
    log('Delays: ' + JSON.stringify(DELAYS))

    log('Get or create stream')
    const owner = createClient(ownerPrivateKey)
    const stream = await owner.getOrCreateStream({
        id: '/test1'
    })

    let actualMessageSentCount = 0
    let keyRequestSentCount = 0
    let keyResponseSentCount = 0

    setInterval(() => {
        log(`actualMessageSentCount=${actualMessageSentCount}, keyRequestSentCount=${keyRequestSentCount}, keyResponseSentCount=${keyResponseSentCount}`)
    }, 6000)

    if (GRANT_PERMISSIONS) {
        if (PUBLIC_STREAM) {
            await stream.grantPermissions({
                permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                public: true
            })
        } else {
            const BATCH_COUNT = 5
            for (let batchId = 0; batchId < BATCH_COUNT; batchId++) {
                log('Grant permissions: batch ' + batchId)
                let permissionAssignments = []
                for (let publisherId = MIN_PUBLISHER_ID; publisherId < MIN_PUBLISHER_ID + publisherCount; publisherId++) {
                    const privateKey = getPublisherPrivateKey(publisherId)
                    if (publisherId % BATCH_COUNT === batchId) {
                        permissionAssignments.push({
                            permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                            user: new Wallet(privateKey).address
                        })
                    }
                }
                if (permissionAssignments.length > 0) {
                    log('- publishers: ' + permissionAssignments.map(a => a.user).join(', '))
                    await owner.setPermissions({
                        streamId: stream.id,
                        assignments: permissionAssignments
                    })
                }
            }
        }
    }
    
    let publishers: { id: number, client: StreamrClient }[] = []
    if (isPublisher()) {
        log('Create ' + publisherCount + ' publishers')
        for (let publisherId = MIN_PUBLISHER_ID; publisherId < MIN_PUBLISHER_ID + publisherCount; publisherId++) {
            if (isMyPublisherShard(publisherId)) {
                const privateKey = getPublisherPrivateKey(publisherId)
                log('Publisher' + publisherId + ': ' + new Wallet(privateKey).address)
                publishers.push({
                    id: publisherId,
                    client: createClient(privateKey)
                })    
            }
        }
    }

    let receivedMessageCount = 0
    if (isSubscriber()) {
        log('Create subscriber')
        const subscriber = createClient(subscriberPrivateKey)
        if (GRANT_PERMISSIONS) {
            await stream.grantPermissions({
                permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                user: await subscriber.getAddress()
            })
        }
        const deliveries: any[] = []
        setInterval(() => {
            for (const delivery of deliveries) {
                log('Delivery: ' + JSON.stringify(delivery))
            }
        }, 20000)
        const sub = await subscriber.subscribe(stream.id, async (content: any) => {
            let ignorable = true
            if (content.simulationMessageType === 'actualMessage') {
                log('Publish keyRequest')
                await wait(DELAYS.keyRequest)
                subscriber.publish(stream.id, {
                    simulationMessageType: 'keyRequest',
                    publisherId: content.publisherId,
                    timestamp: Date.now()
                })
                keyRequestSentCount++
                ignorable = false
                deliveries.push({
                    publisherId: content.publisherId,
                    shardId: getPublisherShard(content.publisherId),
                    actualMessageSent: content.timestamp,
                    actualMessageReceived: Date.now()
                })
            } else if (content.simulationMessageType === 'keyResponse') {
                receivedMessageCount++
                log('ActualMessage ' + receivedMessageCount + '/' + publisherCount + ': ' + JSON.stringify(content))
                const item: any = deliveries.find((d => d.publisherId === content.publisherId))!
                item.keyResponseReceived = Date.now()
                item.totalTime = item.keyResponseReceived - item.actualMessageSent
                ignorable = false
            }
            if (!ignorable) {
                log('Msg sent to subscriber: ' + content.simulationMessageType + ' from ' + content.publisherId + ' ignorable=' + ignorable)
            }
        })
        sub.on('error', (e) => {
            console.log(e)
        })
    }

    if (ENVIRONMENT === 'docker-dev') {
        log('Wait for joins (the subscriber, and trigger publishers to join)')
        if (isPublisher()) {
            for await (const p of publishers) {
                log('Subscribe for key request')
                p.client.subscribe(stream.id, async (content: any) => {
                    let ignorable = true
                    if (content.simulationMessageType === 'keyRequest') {
                        if (content.publisherId === p.id) {
                            log('Received keyRequest from ' + content.publisherId + ' after ' + (Date.now() - content.timestamp) + 'ms')
                            keyResponseSentCount++
                            await wait(DELAYS.keyResponse)
                            p.client.publish(stream.id, {
                                simulationMessageType: 'keyResponse',
                                publisherId: p.id,
                                timestamp: Date.now()
                            })
                            ignorable = false
                        }
                    }
                    if (!ignorable) {
                        log('Msg sent to publisher' + p.id + ': ' + content.simulationMessageType + ' from ' + content.publisherId + ' ignorable=' + ignorable)
                    }
                })
                await wait(DELAYS.publisherSubscribe)
            }
            /*publishers.forEach(async (p) => {
                log('Warmup: ' + p.id)
                p.client.publish(stream.id, {
                    simulationMessageType: 'warmup',
                    publisherId: p.id
                })
            })*/
        }
        await waitForCondition(async () => {
            const topologySize = await getTopologySize(stream.id)
            log('Topology size: ' + topologySize)
            return topologySize === publisherCount + 1
        }, 10 * 60 * 1000, 2000)
    }
    const topologyReadyStartTime = Date.now()

    if (isPublisher()) {
        for await (const p of publishers) {
            log('Publish')
            p.client.publish(stream.id, {
                simulationMessageType: 'actualMessage',
                publisherId: p.id,
                timestamp: Date.now(),
                address: await p.client.getAddress()
            })
            actualMessageSentCount++
            await wait(DELAYS.actualMessage)
        }
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