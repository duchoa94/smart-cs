import type { Redis } from 'ioredis'

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

// Sliding window rate limiter using sorted sets
const SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
local count = redis.call('ZCARD', key)
if count < limit then
  redis.call('ZADD', key, now, now .. math.random())
  redis.call('EXPIRE', key, math.ceil(window / 1000))
  return {1, limit - count - 1, now + window}
end
return {0, 0, now + window}
`

export class RateLimiter {
  constructor(private readonly redis: Redis) {}

  async check(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<RateLimitResult> {
    const now = Date.now()
    const result = await this.redis.eval(SCRIPT, 1, key, now, windowMs, limit) as [number, number, number]
    return {
      allowed: result[0] === 1,
      remaining: result[1] ?? 0,
      resetAt: result[2] ?? now + windowMs,
    }
  }

  apiKey(tenantId: string, userId: string): string {
    return `scs:ratelimit:${tenantId}:api:${userId}`
  }

  chatKey(tenantId: string, channelId: string): string {
    return `scs:ratelimit:${tenantId}:chat:${channelId}`
  }

  webhookKey(ip: string): string {
    return `scs:ratelimit:webhook:${ip}`
  }
}
