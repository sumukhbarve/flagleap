import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server as SocketIoServer } from 'socket.io'

const app = express().use(cors(), express.json())
const httpServer = http.createServer(app)
const io = new SocketIoServer(httpServer, {
  transports: ['websocket']
})

export { app, httpServer, io }
