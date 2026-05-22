import { z } from 'zod'

export const LlmProviderSchema = z.enum(['claude', 'openai'])

export const AgentStatusSchema = z.enum(['draft', 'active', 'paused', 'archived'])

export const AgentSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  status: AgentStatusSchema,
  llmProvider: LlmProviderSchema,
  llmModel: z.string().max(100),
  systemPrompt: z.string().nullable(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().int().min(256).max(32768),
  handoffThreshold: z.number().min(0).max(1),
  language: z.string().max(10),
  fallbackMessage: z.string().nullable(),
  metadata: z.record(z.unknown()).default({}),
  createdBy: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const CreateAgentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  llmProvider: LlmProviderSchema.default('claude'),
  llmModel: z.string().default('claude-sonnet-4-6'),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().int().min(256).max(32768).default(1024),
  handoffThreshold: z.number().min(0).max(1).default(0.4),
  language: z.string().max(10).default('vi'),
  fallbackMessage: z.string().optional(),
})

export const UpdateAgentSchema = CreateAgentSchema.partial().extend({
  status: AgentStatusSchema.optional(),
})

export const AgentTestSchema = z.object({
  message: z.string().min(1).max(4096),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      }),
    )
    .default([]),
})
