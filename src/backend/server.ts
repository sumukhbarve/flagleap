// api-base.ts defines empty app, then controllers add routes.
import { app } from './controllers/api-base'
import './controllers/misc-api'
import './controllers/member-api'

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT} ...`)
})
