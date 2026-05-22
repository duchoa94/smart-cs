import type { AgentRepository } from '@smart-cs/db'
import type { Agent, CreateAgent, UpdateAgent } from '@smart-cs/types'
import { AgentSchema } from '@smart-cs/types'
import type { AgentRow } from '@smart-cs/db'

function toAgent(row: AgentRow): Agent {
  return AgentSchema.parse({
    ...row,
    temperature: Number(row.temperature),
    handoffThreshold: Number(row.handoffThreshold),
    metadata: row.metadata as Record<string, unknown>,
  })
}

export class AgentService {
  constructor(private readonly agentRepo: AgentRepository) {}

  async getById(id: string, tenantId: string): Promise<Agent | null> {
    const row = await this.agentRepo.findById(id, tenantId)
    return row ? toAgent(row) : null
  }

  async list(tenantId: string): Promise<Agent[]> {
    const rows = await this.agentRepo.findByTenant(tenantId)
    return rows.map(toAgent)
  }

  async create(tenantId: string, data: CreateAgent, userId: string): Promise<Agent> {
    const row = await this.agentRepo.create({
      tenantId,
      name: data.name,
      description: data.description ?? null,
      llmProvider: data.llmProvider,
      llmModel: data.llmModel,
      systemPrompt: data.systemPrompt ?? null,
      temperature: String(data.temperature),
      maxTokens: data.maxTokens,
      handoffThreshold: String(data.handoffThreshold),
      language: data.language,
      fallbackMessage: data.fallbackMessage ?? null,
      createdBy: userId,
    })
    return toAgent(row)
  }

  async update(id: string, tenantId: string, data: UpdateAgent): Promise<Agent | null> {
    const patch: Record<string, unknown> = { ...data }
    if (data.temperature !== undefined) patch['temperature'] = String(data.temperature)
    if (data.handoffThreshold !== undefined) patch['handoffThreshold'] = String(data.handoffThreshold)

    const row = await this.agentRepo.update(id, tenantId, patch)
    return row ? toAgent(row) : null
  }

  async deploy(id: string, tenantId: string): Promise<Agent | null> {
    return this.update(id, tenantId, { status: 'active' })
  }

  async pause(id: string, tenantId: string): Promise<Agent | null> {
    return this.update(id, tenantId, { status: 'paused' })
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    return this.agentRepo.delete(id, tenantId)
  }
}
