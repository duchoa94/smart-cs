import { Redis } from 'ioredis'

let _client: Redis | null = null

export function getRedisClient(): Redis {
  if (!_client) {
    _client = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
    _client.on('error', (err) => console.error('[Redis] error', err))
  }
  return _client
}

export function getQueueRedisClient(): Redis {
  return new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
    db: Number(process.env['REDIS_QUEUE_DB'] ?? 1),
    maxRetriesPerRequest: null,
    lazyConnect: true,
  })
}
