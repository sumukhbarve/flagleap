import express from 'express'
import { app } from './api-base'
import { config } from '../config'
import { tapiduck } from 'monoduck'
import { api } from '../../shared/endpoints'

app.use(express.static(config.distFrontendDir))

app.get('/', (_req, res) => res.redirect('/client.html'))

tapiduck.route(app, api.common.ping, async function (reqdata) {
  return { pong: reqdata.ping }
})
