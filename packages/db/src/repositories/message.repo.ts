import { eq, and, asc, lt } from 'drizzle-orm'
import type { Db } from '../client.js'
import { messages, type MessageRow, type NewMessageRow } from '../schema/index.js'

export class MessageRepository {
  constructor(private readonly db: Db) {}

  async findByConversation(
    conversationId: string,
    opts: { cursor?: string; limit?: number } = {},
  ): Promise<{ data: MessageRow[]; hasMore: boolean }> {
    const limit = opts.limit ?? 50
    const conditions = [eq(messages.conversationId, conversationId)]
    if (opts.cursor) conditions.push(lt(messages.createdAt, new Date(opts.cursor)))

    const rows = await this.db
      .select()
      .from(messages)
      .where(and(...conditions))
      .orderBy(asc(messages.createdAt))
      .limit(limit + 1)

    return { data: rows.slice(0, limit), hasMore: rows.length > limit }
  }

  async findRecent(conversationId: string, limit = 20): Promise<MessageRow[]> {
    return this.db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
      .limit(limit)
  }

  async create(data: NewMessageRow): Promise<MessageRow> {
    const rows = await this.db.insert(messages).values(data).returning()
    const row = rows[0]
    if (!row) throw new Error('Insert failed')
    return row
  }

  async markRead(conversationId: string, tenantId: string): Promise<void> {
    await this.db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.tenantId, tenantId),
          eq(messages.isRead, false),
        ),
      )
  }
}
