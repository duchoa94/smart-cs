// Schemas
export * from './schemas/tenant.schema.js'
export * from './schemas/user.schema.js'
export * from './schemas/agent.schema.js'
export * from './schemas/channel.schema.js'
export * from './schemas/conversation.schema.js'
export * from './schemas/message.schema.js'
export * from './schemas/knowledge-base.schema.js'
export * from './schemas/analytics.schema.js'
export * from './schemas/ws-events.schema.js'

// Inferred types — re-exported for convenience
import type { z } from 'zod'
import type {
  TenantSchema,
  CreateTenantSchema,
  UpdateTenantSchema,
  TenantPlanSchema,
} from './schemas/tenant.schema.js'
import type {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  LoginSchema,
  UserRoleSchema,
} from './schemas/user.schema.js'
import type {
  AgentSchema,
  CreateAgentSchema,
  UpdateAgentSchema,
  AgentTestSchema,
  LlmProviderSchema,
  AgentStatusSchema,
} from './schemas/agent.schema.js'
import type {
  ChannelSchema,
  CreateChannelSchema,
  UpdateChannelSchema,
  ChannelTypeSchema,
  ChannelStatusSchema,
} from './schemas/channel.schema.js'
import type {
  ConversationSchema,
  ConversationFiltersSchema,
  ConversationStatusSchema,
} from './schemas/conversation.schema.js'
import type {
  MessageSchema,
  SendMessageSchema,
  AttachmentSchema,
  RagContextChunkSchema,
  MessageRoleSchema,
} from './schemas/message.schema.js'
import type {
  KbDocumentSchema,
  KbChunkSchema,
  IngestUrlSchema,
  IngestFaqSchema,
  KbSearchSchema,
  KbSourceTypeSchema,
  KbDocumentStatusSchema,
} from './schemas/knowledge-base.schema.js'
import type {
  AnalyticsEventSchema,
  AnalyticsQuerySchema,
  AnalyticsOverviewSchema,
} from './schemas/analytics.schema.js'

export type Tenant = z.infer<typeof TenantSchema>
export type CreateTenant = z.infer<typeof CreateTenantSchema>
export type UpdateTenant = z.infer<typeof UpdateTenantSchema>
export type TenantPlan = z.infer<typeof TenantPlanSchema>

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type UserRole = z.infer<typeof UserRoleSchema>

export type Agent = z.infer<typeof AgentSchema>
export type CreateAgent = z.infer<typeof CreateAgentSchema>
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>
export type AgentTestInput = z.infer<typeof AgentTestSchema>
export type LlmProvider = z.infer<typeof LlmProviderSchema>
export type AgentStatus = z.infer<typeof AgentStatusSchema>

export type Channel = z.infer<typeof ChannelSchema>
export type CreateChannel = z.infer<typeof CreateChannelSchema>
export type UpdateChannel = z.infer<typeof UpdateChannelSchema>
export type ChannelType = z.infer<typeof ChannelTypeSchema>
export type ChannelStatus = z.infer<typeof ChannelStatusSchema>

export type Conversation = z.infer<typeof ConversationSchema>
export type ConversationFilters = z.infer<typeof ConversationFiltersSchema>
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>

export type Message = z.infer<typeof MessageSchema>
export type SendMessage = z.infer<typeof SendMessageSchema>
export type Attachment = z.infer<typeof AttachmentSchema>
export type RagContextChunk = z.infer<typeof RagContextChunkSchema>
export type MessageRole = z.infer<typeof MessageRoleSchema>

export type KbDocument = z.infer<typeof KbDocumentSchema>
export type KbChunk = z.infer<typeof KbChunkSchema>
export type IngestUrl = z.infer<typeof IngestUrlSchema>
export type IngestFaq = z.infer<typeof IngestFaqSchema>
export type KbSearch = z.infer<typeof KbSearchSchema>
export type KbSourceType = z.infer<typeof KbSourceTypeSchema>
export type KbDocumentStatus = z.infer<typeof KbDocumentStatusSchema>

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>
export type AnalyticsOverview = z.infer<typeof AnalyticsOverviewSchema>

// Utility types
export type PaginatedResult<T> = {
  data: T[]
  total: number
  cursor: string | null
  hasMore: boolean
}

export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}
