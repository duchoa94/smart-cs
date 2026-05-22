import { eq, and } from 'drizzle-orm'
import type { Db } from '../client.js'
import { users, type UserRow, type NewUserRow } from '../schema/index.js'

export class UserRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string, tenantId: string): Promise<UserRow | null> {
    const rows = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)))
      .limit(1)
    return rows[0] ?? null
  }

  async findByEmail(email: string, tenantId: string): Promise<UserRow | null> {
    const rows = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.tenantId, tenantId)))
      .limit(1)
    return rows[0] ?? null
  }

  async findByTenant(tenantId: string): Promise<UserRow[]> {
    return this.db.select().from(users).where(eq(users.tenantId, tenantId))
  }

  async create(data: NewUserRow): Promise<UserRow> {
    const rows = await this.db.insert(users).values(data).returning()
    const row = rows[0]
    if (!row) throw new Error('Insert failed')
    return row
  }

  async update(id: string, tenantId: string, data: Partial<NewUserRow>): Promise<UserRow | null> {
    const rows = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)))
      .returning()
    return rows[0] ?? null
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id))
  }
}
