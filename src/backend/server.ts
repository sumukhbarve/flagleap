import { config } from './config'
import { models } from './models'

// api-base.ts defines empty app, then controllers add routes.
import { app } from './controllers/api-base'
import './controllers/misc-api'
import './controllers/member-api'
import './controllers/flag-inapi'

const main = async function (): Promise<void> {
  await models.autoMigrate()
  console.log('Auto-migration complete.')

  app.listen(config.PORT, function () {
    console.log(`Listening at port ${config.PORT} ...`)
  })
}
main().catch(error => { throw new Error(error) })
