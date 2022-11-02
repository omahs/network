#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const program = require('commander')
const { LargestBucketsCmd } = require('../dist/src/plugins/storage/LargestBucketsCmd')

const CURRENT_VERSION = require('../package.json').version

program
    .version(CURRENT_VERSION)
    .requiredOption('--cassandra-username <username>')
    .requiredOption('--cassandra-password <password>')
    .requiredOption('--cassandra-hosts <hosts_delimited_by_comma>')
    .requiredOption('--cassandra-datacenter <datacenter>')
    .requiredOption('--cassandra-keyspace <keyspace>')
    .description('Analyze largest buckets')
    .parse(process.argv)

const largestBucketsCmd = new LargestBucketsCmd({
    cassandraUsername: program.opts().cassandraUsername,
    cassandraPassword: program.opts().cassandraPassword,
    cassandraHosts: program.opts().cassandraHosts.split(','),
    cassandraDatacenter: program.opts().cassandraDatacenter,
    cassandraKeyspace: program.opts().cassandraKeyspace,
})

async function run() {
    try {
        await largestBucketsCmd.run()
        return {}
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

run()
