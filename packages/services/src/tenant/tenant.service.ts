import { randomBytes } from 'crypto'
import type { TenantRepository } from '@smart-cs/db'
import type { CreateTenant, UpdateTenant, Tenant } from '@smart-cs/types'
import { TenantSchema } from '@smart-cs/types'
import type { TenantRow } from '@smart-cs/db'

function toTenant(row: TenantRow): Tenant {
  return TenantSchema.parse({
    ...row,
    settings: row.settings as Record<string, unknown>,
  })
}

function generateApiKey(): string {
  return `scs_${randomBytes(32).toString('hex')}`
}

export class TenantService {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async getById(id: string): Promise<Tenant | null> {
    const row = await this.tenantRepo.findById(id)
    return row ? toTenant(row) : null
  }

  async getByApiKey(apiKey: string): Promise<Tenant | null> {
    const row = await this.tenantRepo.findByApiKey(apiKey)
    return row ? toTenant(row) : null
  }

  async create(data: CreateTenant): Promise<Tenant> {
    const existing = await this.tenantRepo.findBySlug(data.slug)
    if (existing) throw new Error('Slug already taken')

    const row = await this.tenantRepo.create({
      name: data.name,
      slug: data.slug,
      plan: data.plan,
      apiKey: generateApiKey(),
    })
    return toTenant(row)
  }

  async update(id: string, data: UpdateTenant): Promise<Tenant | null> {
    const patch: Record<string, unknown> = {}
    if (data.name !== undefined) patch['name'] = data.name
    if (data.settings !== undefined) patch['settings'] = data.settings
    const row = await this.tenantRepo.update(id, patch)
    return row ? toTenant(row) : null
  }

  async rotateApiKey(id: string): Promise<string> {
    const newKey = generateApiKey()
    await this.tenantRepo.update(id, { apiKey: newKey })
    return newKey
  }
}
