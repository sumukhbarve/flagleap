import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server as SocketIoServer } from 'socket.io'
import { _, tapiduck } from 'monoduck'
import { config } from '../config'
import { zodToJsonSchema } from 'zod-to-json-schema'

const app = express().use(cors(), express.json())

if (config.EXTRA_LATENCY > 0) {
  app.use(async function (_req, _res, next) {
    await _.sleep(config.EXTRA_LATENCY)
    next()
  })
}

tapiduck.swaggerfy(app, zodToJsonSchema)

const httpServer = http.createServer(app)
const io = new SocketIoServer(httpServer, {
  transports: ['websocket']
})

export { app, httpServer, io }
