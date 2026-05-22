import express, { type Request, type Response } from 'express'
import { Storage } from '@google-cloud/storage'
import { AppError } from '../../shared/errors.js'

const router: express.Router = express.Router()
const storage = new Storage()

type WidgetCache = { content: Buffer; fetchedAt: number }
let widgetCache: WidgetCache | null = null
const CACHE_TTL_MS = 5 * 60 * 1000

router.get('/widget.js', async (_req: Request, res: Response) => {
  const bucket = process.env['GCS_CDN_BUCKET']
  if (!bucket) {
    throw new AppError(503, 'NOT_CONFIGURED', 'Widget is not available')
  }

  if (widgetCache && Date.now() - widgetCache.fetchedAt < CACHE_TTL_MS) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.send(widgetCache.content)
    return
  }

  const [content] = await storage
    .bucket(bucket)
    .file('widget/latest/widget.min.js')
    .download()

  widgetCache = { content, fetchedAt: Date.now() }

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.send(content)
})

export { router as widgetRouter }
