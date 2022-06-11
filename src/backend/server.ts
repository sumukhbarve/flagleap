import { config } from './config'
import { models } from './models'

// api-base.ts defines empty app, then controllers add routes.
import { httpServer } from './controllers/api-base'
import './controllers/misc-api'
import './controllers/member-api'
import './controllers/flag-inapi'
import './controllers/flag-exapi'
import './controllers/rule-inapi'

const main = async function (): Promise<void> {
  await models.autoMigrate()
  console.log('Auto-migration complete.')

  httpServer.listen(config.PORT, function () {
    console.log(`Listening at port ${config.PORT} ...`)
  })
}
main().catch(error => { throw new Error(error) })
