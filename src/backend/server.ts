import express from 'express'
import cors from 'cors'
import { tapiduck } from 'monoduck'
import { distFrontendDir } from '../shared/dir-paths'
import { api } from '../shared/endpoints'

const app = express().use(cors(), express.json())
app.use(express.static(distFrontendDir))
app.get('/', (_req, res) => res.redirect('/client.html'))

tapiduck.route(app, api.ping, async function (reqdata) {
  return { pong: reqdata.ping }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT} ...`)
})
