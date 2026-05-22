import type { Redis } from 'ioredis'

type MemoryMessage = {
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

const MEMORY_TTL = 60 * 60 * 2  // 2 hours
const MEMORY_MAX_MESSAGES = 20

function key(tenantId: string, conversationId: string): string {
  return `scs:${tenantId}:conv_memory:${conversationId}`
}

export class ConvMemoryCache {
  constructor(private readonly redis: Redis) {}

  async push(tenantId: string, conversationId: string, message: MemoryMessage): Promise<void> {
    const k = key(tenantId, conversationId)
    await this.redis
      .pipeline()
      .rpush(k, JSON.stringify(message))
      .ltrim(k, -MEMORY_MAX_MESSAGES, -1)
      .expire(k, MEMORY_TTL)
      .exec()
  }

  async getHistory(tenantId: string, conversationId: string): Promise<MemoryMessage[]> {
    const k = key(tenantId, conversationId)
    const raw = await this.redis.lrange(k, 0, -1)
    return raw.map((s) => JSON.parse(s) as MemoryMessage)
  }

  async clear(tenantId: string, conversationId: string): Promise<void> {
    await this.redis.del(key(tenantId, conversationId))
  }

  async resetTtl(tenantId: string, conversationId: string): Promise<void> {
    await this.redis.expire(key(tenantId, conversationId), MEMORY_TTL)
  }
}
