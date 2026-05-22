import { eq, and, desc, lt } from 'drizzle-orm'
import type { Db } from '../client.js'
import { conversations, type ConversationRow, type NewConversationRow } from '../schema/index.js'

export type ConversationFilters = {
  status?: string
  agentId?: string
  channelId?: string
  channelType?: string
  assigneeId?: string
  cursor?: string
  limit?: number
}

export class ConversationRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string, tenantId: string): Promise<ConversationRow | null> {
    const rows = await this.db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.tenantId, tenantId)))
      .limit(1)
    return rows[0] ?? null
  }

  async findByExternalId(
    tenantId: string,
    channelType: string,
    externalId: string,
  ): Promise<ConversationRow | null> {
    const rows = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, tenantId),
          eq(conversations.channelType, channelType),
          eq(conversations.externalId, externalId),
          eq(conversations.status, 'open'),
        ),
      )
      .limit(1)
    return rows[0] ?? null
  }

  async findMany(
    tenantId: string,
    filters: ConversationFilters,
  ): Promise<{ data: ConversationRow[]; hasMore: boolean }> {
    const limit = filters.limit ?? 20
    const conditions = [eq(conversations.tenantId, tenantId)]

    if (filters.status) conditions.push(eq(conversations.status, filters.status))
    if (filters.agentId) conditions.push(eq(conversations.agentId, filters.agentId))
    if (filters.channelType) conditions.push(eq(conversations.channelType, filters.channelType))
    if (filters.cursor) conditions.push(lt(conversations.lastMessageAt, new Date(filters.cursor)))

    const rows = await this.db
      .select()
      .from(conversations)
      .where(and(...conditions))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit + 1)

    const hasMore = rows.length > limit
    return { data: rows.slice(0, limit), hasMore }
  }

  async create(data: NewConversationRow): Promise<ConversationRow> {
    const rows = await this.db.insert(conversations).values(data).returning()
    const row = rows[0]
    if (!row) throw new Error('Insert failed')
    return row
  }

  async update(
    id: string,
    tenantId: string,
    data: Partial<NewConversationRow>,
  ): Promise<ConversationRow | null> {
    const rows = await this.db
      .update(conversations)
      .set(data)
      .where(and(eq(conversations.id, id), eq(conversations.tenantId, tenantId)))
      .returning()
    return rows[0] ?? null
  }
}
