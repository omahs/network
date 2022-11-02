import cassandra, { Client } from 'cassandra-driver'
import { Logger } from '@streamr/utils'

interface Options {
    cassandraUsername: string
    cassandraPassword: string
    cassandraHosts: string[]
    cassandraDatacenter: string
    cassandraKeyspace: string
}

export class LargestBucketsCmd {
    private cassandraClient: Client

    constructor({
        cassandraUsername,
        cassandraPassword,
        cassandraHosts,
        cassandraDatacenter,
        cassandraKeyspace,
    }: Options) {
        const authProvider = new cassandra.auth.PlainTextAuthProvider(cassandraUsername, cassandraPassword)
        this.cassandraClient = new cassandra.Client({
            contactPoints: [...cassandraHosts],
            localDataCenter: cassandraDatacenter,
            keyspace: cassandraKeyspace,
            authProvider,
        })
    }

    async run(): Promise<void> {
        const query = 'SELECT stream_id, partition, COUNT(*) as bytes FROM bucket GROUP BY stream_id, partition'
        const resultSet = await this.cassandraClient.execute(query, [])
        const results = resultSet.rows.map((row) => ({
            streamId: row.stream_id,
            partition: row.partition,
            bytes: row.bytes
        }))
        const sortedResults = results.sort((e1, e2) => e1.bytes - e2.bytes)
        // eslint-disable-next-line no-console
        console.table(sortedResults)

        await this.cassandraClient.shutdown()
    }
}
