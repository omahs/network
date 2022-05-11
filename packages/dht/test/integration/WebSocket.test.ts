/* eslint-disable no-console */

import { WebSocketConnector } from "../../src/connection/WebSocket/WebSocketConnector"
import { WebSocketServer } from "../../src/connection/WebSocket/WebSocketServer"
import { Event as ConnectionSourceEvent } from '../../src/connection/ConnectionSource'
import { Connection, Event as ConnectionEvent } from "../../src/connection/Connection"

describe('WebSocket', () => {
    
    const webSocketServer = new WebSocketServer()
    const webSocketConnector = new WebSocketConnector()

    beforeAll(async () => {
        await webSocketServer.start({port: 9999})
    })

    it('Happy path', (done) => {
            
        webSocketServer.on(ConnectionSourceEvent.CONNECTED, (serverConnection: Connection) => {
            const time = Date.now()
            console.log('server side sendind msg at ' + time)
            serverConnection.send(Uint8Array.from([1,2,3,4]))
        
            const time2 = Date.now()
            console.log('server side setting listeners at ' + time2)
            
            serverConnection.on(ConnectionEvent.DATA, (bytes: Uint8Array) => {
                const time = Date.now()
                console.log('server side receiving message at ' + time)

                console.log(JSON.stringify(bytes))
               
                expect(bytes.toString()).toBe('1,2,3,4')
                console.log('calling done()')
                done()
            })
        })
        
        webSocketConnector.on(ConnectionSourceEvent.CONNECTED, (clientConnection: Connection) => {
            const time = Date.now()
            console.log('client side setting listeners at ' + time)
            
            clientConnection.on(ConnectionEvent.DATA, (bytes: Uint8Array) => {
                const time = Date.now()
                console.log('client side receiving message at ' + time)

                console.log(JSON.stringify(bytes))
                expect(bytes.toString()).toBe('1,2,3,4')
                
                const time2 = Date.now()
                console.log('client side sendind msg at ' + time2)
                clientConnection.send(Uint8Array.from([1,2,3,4]))
            })
        })

        webSocketConnector.connect({url: 'ws://localhost:9999'})    
    })

    afterAll(async () => {
        await webSocketServer.stop()
    })

})