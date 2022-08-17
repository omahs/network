// run with: npx ts-node src/swash-debug.ts 5
import { padStart, range } from 'lodash'
import fetch from 'node-fetch'
import { KeyServer, waitForCondition } from 'streamr-test-utils'
import { wait } from '@streamr/utils'
import { StreamrClient } from './StreamrClient'
import { StreamPermission } from './permission'
import { ConfigTest } from './ConfigTest'
import { StreamMessage } from 'streamr-client-protocol'
import { Wallet } from 'ethers'

const log = (msg: string) => console.log(new Date().toISOString() + '   ' + msg)

export async function fetchPrivateKeyWithGas(): Promise<string> {
    let response
    try {
        response = await fetch(`http://localhost:${KeyServer.KEY_SERVER_PORT}/key`)
    } catch (_e) {
        try {
            await KeyServer.startIfNotRunning() // may throw if parallel attempts at starting server
        } catch (_e2) {
        } finally {
            response = await fetch(`http://localhost:${KeyServer.KEY_SERVER_PORT}/key`)
        }
    }

    if (!response.ok) {
        throw new Error(`fetchPrivateKeyWithGas failed ${response.status} ${response.statusText}: ${response.text()}`)
    }

    return response.text()
}


const MIN_PUBLISHER_ID = 100

const main = async () => {
    const publisherCount = Number(process.argv[2])
    await KeyServer.startIfNotRunning()

    const ownerPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000001'

    log('Create stream')
    const owner = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: ownerPrivateKey
        }
    })
    const stream = await owner.createStream('/test1')

    console.log(ownerPrivateKey)
    let permissionAssignments = []
    for (let publisherId = MIN_PUBLISHER_ID; publisherId < MIN_PUBLISHER_ID + publisherCount; publisherId++) {
        const privateKey = '0x' + padStart(String(publisherId), 64, '0')
        permissionAssignments.push({
            permissions: [StreamPermission.PUBLISH],
            user: new Wallet(privateKey).address
        })
    }
    await owner.setPermissions({
        streamId: stream.id,
        assignments: permissionAssignments
    })
    process.exit(0)
    
    
    
    /*log('Create ' + publisherCount + ' publishers')
    const publishers = await Promise.all(range(publisherCount).map(async () => {
        return new StreamrClient({
            ...ConfigTest,
            auth: {
                privateKey: await fetchPrivateKeyWithGas()
            }
        })
    }))

    log('Grant publish permissions')
    const permissionAssignments = await Promise.all(publishers.map(async (p, i) => {

    }))
    await owner.setPermissions({
        streamId: stream.id, 
        assignments: permissionAssignments
    })
    
    log('Create subscriber')
    const subscriber = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: await fetchPrivateKeyWithGas()
        }
    })
    await stream.grantPermissions({
        permissions: [StreamPermission.SUBSCRIBE],
        user: await subscriber.getAddress()
    })

    let receivedMessageCount = 0
    const sub = await subscriber.subscribe(stream.id, (content: any, msg: StreamMessage) => {
        log('Received: ' + JSON.stringify(content))
        receivedMessageCount++
    })

    log('Wait for subscriber to join')
    await wait(5000)

    const publishStartTime = Date.now()
    publishers.forEach(p => {
        log('Publish')
        p.publish(stream.id, {
            fromPublisher: new Date().toISOString()
        })
    })
    
    log('Wait for ' + publishers.length + ' message')
    await waitForCondition(() => receivedMessageCount >= publishers.length, 10 * 60 * 1000)

    log('Done: all messages received ' + ((Date.now() - publishStartTime) / 1000) + ' seconds after publishers started to publish')
    await KeyServer.stopIfRunning()*/
}

/*const main = async () => {
    //node dist/bin/streamr-stream-grant-permission 0x7e5f4552091a69125d5dfcb7b8c2659029395bdf/test/20220605/225818 0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A publish subscribe --dev
    //node dist/bin/streamr-stream-grant-permission 0x7e5f4552091a69125d5dfcb7b8c2659029395bdf/test/20220605/225818 0x1563915e194D8CfBA1943570603F7606A3115508 publish subscribe --dev
    const streamId = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf/test/20220605/225818'
    const publisher = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: '0x1111111111111111111111111111111111111111111111111111111111111111'
        }
    })
    const subscriber = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: '0x2222222222222222222222222222222222222222222222222222222222222222'
        }
    })
    subscriber.subscribe(streamId, (msg: any) => {
        console.log(msg)
    })
    await wait(2000)
    publisher.publish(streamId, { foo: 'bar '})
}

/*const NUM_OF_MESSAGES = 20
const MESSAGE_STORE_TIMEOUT = 9 * 1000
const TIMEOUT = 20 * 1000
const publisher = new Wallet('0x0000000000000000000000000000000000000000000000000000000000000001')
const resender = new Wallet('0x0000000000000000000000000000000000000000000000000000000000000002')

const log = (msg: string) => {
    console.log(new Date().toISOString() + '   ' + msg)
}

const msgContents: any[] = []
for (const idx of range(NUM_OF_MESSAGES)) {
    const partition = idx % 3
    msgContents.push({
        messageNoInPartition: Math.floor(idx / 3),
        partition,
        messageNo: idx
    })
}

const createStreamAndContent = async (streamPath: string, publisherClient: StreamrClient, isPublic: boolean) => {
    const stream = await publisherClient.createStream({
        id: streamPath,
        partitions: 3 
    })
    if (isPublic) {
        await stream.grantPermissions({
            permissions: [StreamPermission.SUBSCRIBE],
            public: true
        })
    } else {
        await stream.grantPermissions({
            permissions: [StreamPermission.SUBSCRIBE],
            user: resender.address
        })
    }

    await stream.addToStorageNode(DOCKER_DEV_STORAGE_NODE)

    for (const idx of range(NUM_OF_MESSAGES)) {
        console.log('publish')
        const partition = idx % 3
        await publisherClient.publish({
            id: stream.id,
            partition,
        }, msgContents[idx], Date.now())
    }
    await wait(MESSAGE_STORE_TIMEOUT)
}

const fetchResend = async (streamPath: string) => {
    const resenderClient = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: resender.privateKey
        }
    })
    const messages: unknown[] = []
    await resenderClient.resendAll(toStreamID(streamPath, publisher.address), { last: NUM_OF_MESSAGES }, (msg) => {
        messages.push(msg)
    })
    await wait(TIMEOUT - 1000)
    console.log('messages.length = ' + messages.length)
    console.log('missing:')
    msgContents.forEach(c => {
        if (!messages.find(m => isEqual(m, c))) {
            console.log(JSON.stringify(c))
        }
    })
    await resenderClient.destroy()
}

const main = async () => {
    const isPublic = true
    const streamPath = '/resend20220516b-public'
    const publisherClient = new StreamrClient({
        ...ConfigTest,
        auth: {
            privateKey: publisher.privateKey
        }
    })
    console.log(publisher.address.toLowerCase() + streamPath)
    //await createStreamAndContent(streamPath, publisherClient, isPublic)
    await fetchResend(streamPath)
    await publisherClient.destroy()
}*/

main()