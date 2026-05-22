import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import 'express-async-errors'
import { errorHandler } from './shared/middleware/error.handler.js'
import { widgetRouter } from './modules/widget/widget.router.js'

export function createApp(): express.Application {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: process.env['WEB_URL'], credentials: true }))
  app.use(express.json({ limit: '10mb' }))

  app.get('/health', (_req, res) => { res.json({ status: 'ok' }) })

  app.use(widgetRouter)

  // TODO: mount routers
  // app.use('/api/v1/auth', authRouter)
  // app.use('/api/v1/agents', agentsRouter)
  // ...

  app.use(errorHandler)

  return app
}
