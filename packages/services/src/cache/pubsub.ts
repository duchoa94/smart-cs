import type { Redis } from 'ioredis'

export class PubSubService {
  constructor(
    private readonly pub: Redis,
    private readonly sub: Redis,
  ) {}

  async publish(channel: string, payload: unknown): Promise<void> {
    await this.pub.publish(channel, JSON.stringify(payload))
  }

  async subscribe(channel: string, handler: (payload: unknown) => void): Promise<void> {
    await this.sub.subscribe(channel)
    this.sub.on('message', (ch, message) => {
      if (ch === channel) {
        try {
          handler(JSON.parse(message))
        } catch {
          // malformed message — ignore
        }
      }
    })
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.sub.unsubscribe(channel)
  }

  // Channel name helpers
  static convMessages(conversationId: string): string {
    return `scs:conv:${conversationId}:messages`
  }

  static tenantHandoffs(tenantId: string): string {
    return `scs:tenant:${tenantId}:handoffs`
  }

  static tenantAgentStatus(tenantId: string): string {
    return `scs:tenant:${tenantId}:agent_status`
  }
}
