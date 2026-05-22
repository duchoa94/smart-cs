import { eq, and, isNull } from 'drizzle-orm'
import type { Db } from '../client.js'
import { agents, type AgentRow, type NewAgentRow } from '../schema/index.js'

export class AgentRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string, tenantId: string): Promise<AgentRow | null> {
    const rows = await this.db
      .select()
      .from(agents)
      .where(and(eq(agents.id, id), eq(agents.tenantId, tenantId)))
      .limit(1)
    return rows[0] ?? null
  }

  async findByTenant(tenantId: string): Promise<AgentRow[]> {
    return this.db.select().from(agents).where(eq(agents.tenantId, tenantId))
  }

  async findActive(tenantId: string): Promise<AgentRow[]> {
    return this.db
      .select()
      .from(agents)
      .where(and(eq(agents.tenantId, tenantId), eq(agents.status, 'active')))
  }

  async create(data: NewAgentRow): Promise<AgentRow> {
    const rows = await this.db.insert(agents).values(data).returning()
    const row = rows[0]
    if (!row) throw new Error('Insert failed')
    return row
  }

  async update(id: string, tenantId: string, data: Partial<NewAgentRow>): Promise<AgentRow | null> {
    const rows = await this.db
      .update(agents)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(agents.id, id), eq(agents.tenantId, tenantId)))
      .returning()
    return rows[0] ?? null
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const result = await this.db
      .delete(agents)
      .where(and(eq(agents.id, id), eq(agents.tenantId, tenantId)))
    return (result.rowCount ?? 0) > 0
  }
}
