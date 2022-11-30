import { Server } from 'http'
import { once } from 'events'
import { Wallet } from 'ethers'
import express, { Request, Response } from 'express'
import { Logger, toEthereumAddress, waitForCondition } from '@streamr/utils'
import { Tracker } from '@streamr/network-tracker'
import { Stream, StreamPermission, StreamrClient } from 'streamr-client'
import { fastWallet } from '@streamr/test-utils'

import { Broker } from '../../../../src/broker'
import { createClient, createTestStream, startBroker, startTestTracker } from '../../../utils'
import { version as CURRENT_VERSION } from '../../../../package.json'

jest.setTimeout(30000)

const logger = new Logger(module)

const TRACKER_PORT = 12461
const CLAIM_SERVER_PORT = 12463
const MOCK_REWARD_CODE = 'mock-reward-code'

const rewardPublisherPrivateKey = '0x5e98cce00cff5dea6b454889f359a4ec06b9fa6b88e9d69b86de8e1c81887da0'

class MockClaimServer {

    server?: Server
    pingEndpointCalled = false
    claimRequestBody: any

    async start(): Promise<Server> {
        const app = express()
        app.use(express.json())
        app.post('/claim', (req: Request, res: Response) => {
            logger.info('Claim endpoint called')
            this.claimRequestBody = req.body
            res.status(200).end()
        })
        app.get('/ping', (_req: Request, res: Response) => {
            logger.info('Ping endpoint called')
            this.pingEndpointCalled = true
            res.status(200).end()
        })
        this.server = app.listen(CLAIM_SERVER_PORT)
        await once(this.server, 'listening')
        return this.server
    }

    async stop(): Promise<void> {
        this.server!.close()
        await once(this.server!, 'close')
    }
}

const createRewardStream = async (client: StreamrClient): Promise<Stream> => {
    const stream = await createTestStream(client, module)
    await stream.grantPermissions({ permissions: [StreamPermission.SUBSCRIBE], public: true })
    return stream
}

describe('BrubeckMinerPlugin', () => {
    let brokerWallet: Wallet
    let tracker: Tracker
    let broker: Broker
    let claimServer: MockClaimServer
    let rewardStreamId: string
    let client: StreamrClient

    const publishRewardCode = async (rewardStreamId: string) => {
        await client.publish(rewardStreamId, {
            rewardCode: MOCK_REWARD_CODE
        })
    }

    beforeAll(async () => {
        tracker = await startTestTracker(TRACKER_PORT)
        client = await createClient(tracker, rewardPublisherPrivateKey)
        const rewardStream = await createRewardStream(client)
        rewardStreamId = rewardStream.id
        claimServer = new MockClaimServer()
        await claimServer.start()
        brokerWallet = fastWallet()
        broker = await startBroker({
            privateKey: brokerWallet.privateKey,
            trackerPort: TRACKER_PORT,
            extraPlugins: {
                brubeckMiner: {
                    rewardStreamIds: [rewardStreamId],
                    claimServerUrl: `http://127.0.0.1:${CLAIM_SERVER_PORT}`,
                    stunServerHost: null,
                    maxClaimDelay: 100
                }
            }
        })
    })

    afterAll(async () => {
        await Promise.allSettled([
            broker?.stop(),
            tracker?.stop(),
            claimServer?.stop(),
            client.destroy()
        ])
    })

    it('happy path', async () => {
        expect(claimServer!.pingEndpointCalled).toBeTruthy()
        await publishRewardCode(rewardStreamId)
        await waitForCondition(() => claimServer.claimRequestBody !== undefined, 30000)
        expect(claimServer.claimRequestBody.rewardCode).toBe(MOCK_REWARD_CODE)
        expect(claimServer.claimRequestBody.nodeAddress).toBe(toEthereumAddress(brokerWallet.address))
        expect(claimServer.claimRequestBody.clientServerLatency).toBeGreaterThanOrEqual(0)
        expect(claimServer.claimRequestBody.waitTime).toBeGreaterThanOrEqual(0)
        // will have broker as peer
        expect(claimServer.claimRequestBody.peers).toHaveLength(1)
        expect(claimServer.claimRequestBody.beneficiaryAddress).toBeNull()
    })

    it('tracker is supplied metadata about broker version and nat type', async () => {
        // don't know key names because node ids are private and auto-generated by client.
        expect(Object.values(tracker.getAllExtraMetadatas())).toEqual([
            {
                natType: null,
                brokerVersion: CURRENT_VERSION,
                nodeJs: process.version
            },
            {}, // broker metadata is empty
        ])
    })
})
