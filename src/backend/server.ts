// api-base.ts defines empty app, then controllers add routes.
import { app } from './api-routes/api-base'
import './api-routes/misc-api'

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT} ...`)
})
