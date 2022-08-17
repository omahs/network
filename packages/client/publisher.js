const fs = require("fs");
const winston = require("winston");
const StreamrClient = require('streamr-client');

require('winston-daily-rotate-file');

const streamId = '0xba6e5d88bf3f85a4f90622ed3fa56fe8d486648e/test';
const proxyNode = ['0xf52dcd1cc9a18fbd58848cadd4716e5475fe9f55', '0x194eb3124d543b6286325d35fbdb6d0f7e5f1c94'];

const wallets = fs.readFileSync('chosen-wallets').toString().split('\n');
const id = process.env.ID || 0;
const count = process.env.COUNT || 250;

const logger = winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'info',
            filename: `publishers-${id}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            zippedArchive: true,
            handleExceptions: true,
            maxSize: '100mb',
            maxFiles: 100,
            json: false,
            format: winston.format.simple(),
        })
    ],
});

let stream = null

const run = async (index) => {
    logger.info(`${new Date().toISOString()} - ${id} -  Publisher ${index} started`);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 60000));
    const streamr = new StreamrClient({
        auth: {
            privateKey: wallets[index].split(',')[0]
        },
        network: {
            trackers: [
                {
                    "id": "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf",
                    "ws": "ws://88.99.36.74:30300",
                    "http": "http://88.99.36.74:30300"
                }
            ]
        }
    })

    if (stream === null)
        stream = await streamr.getStream(streamId)
    try {
        await streamr.setPublishProxy(stream, proxyNode[id % proxyNode.length])

        let num = 0
        while (num < 1000) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 120000));
            await streamr.publish(stream, {
                message: num,
            })
            logger.info(`${new Date().toISOString()} - ${id} - Publisher ${index}: message ${num++} published`)
        }
    } catch (err) {
        logger.error(`${new Date().toISOString()} - ${id} -  Publisher ${index}: ${err}`)
        logger.error(`${new Date().toISOString()} - ${id} -  Publisher ${index}: ${wallets[index].split(',')[0]} failed to start/publish`)
    }
}

(async () => {
    for (let i = 0; i < count; i++) {
        run(id * count + i)
    }
})()
