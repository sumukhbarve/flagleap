import express from 'express'
import cors from 'cors'

const app = express().use(cors(), express.json())

export { app }
