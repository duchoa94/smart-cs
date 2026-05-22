import { z } from 'zod'
import { ChannelTypeSchema } from './channel.schema.js'

export const ConversationStatusSchema = z.enum(['open', 'resolved', 'handed_off', 'abandoned'])

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  agentId: z.string().uuid(),
  channelId: z.string().uuid(),
  channelType: ChannelTypeSchema,
  externalId: z.string().nullable(),
  status: ConversationStatusSchema,
  assigneeId: z.string().uuid().nullable(),
  endUserName: z.string().nullable(),
  endUserAvatar: z.string().url().nullable(),
  metadata: z.record(z.unknown()).default({}),
  startedAt: z.coerce.date(),
  lastMessageAt: z.coerce.date(),
  resolvedAt: z.coerce.date().nullable(),
  handoffAt: z.coerce.date().nullable(),
  handoffReason: z.string().nullable(),
  messageCount: z.number().int(),
  aiMessageCount: z.number().int(),
})

export const ConversationFiltersSchema = z.object({
  status: ConversationStatusSchema.optional(),
  agentId: z.string().uuid().optional(),
  channelId: z.string().uuid().optional(),
  channelType: ChannelTypeSchema.optional(),
  assigneeId: z.string().uuid().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
})
