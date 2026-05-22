import { eq, isNull } from 'drizzle-orm'
import type { Db } from '../client.js'
import { tenants, type TenantRow, type NewTenantRow } from '../schema/index.js'

export class TenantRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<TenantRow | null> {
    const rows = await this.db
      .select()
      .from(tenants)
      .where(eq(tenants.id, id))
      .limit(1)
    return rows[0] ?? null
  }

  async findBySlug(slug: string): Promise<TenantRow | null> {
    const rows = await this.db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1)
    return rows[0] ?? null
  }

  async findByApiKey(apiKey: string): Promise<TenantRow | null> {
    const rows = await this.db
      .select()
      .from(tenants)
      .where(eq(tenants.apiKey, apiKey))
      .limit(1)
    return rows[0] ?? null
  }

  async create(data: NewTenantRow): Promise<TenantRow> {
    const rows = await this.db.insert(tenants).values(data).returning()
    const row = rows[0]
    if (!row) throw new Error('Insert failed')
    return row
  }

  async update(id: string, data: Partial<NewTenantRow>): Promise<TenantRow | null> {
    const rows = await this.db
      .update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning()
    return rows[0] ?? null
  }

  async softDelete(id: string): Promise<void> {
    await this.db.update(tenants).set({ deletedAt: new Date() }).where(eq(tenants.id, id))
  }
}
