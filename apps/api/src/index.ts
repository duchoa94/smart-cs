import { createServer } from 'http'
import { createApp } from './app.js'

const PORT = Number(process.env['PORT'] ?? 4000)

const app = createApp()
const server = createServer(app)

server.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})

process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})
