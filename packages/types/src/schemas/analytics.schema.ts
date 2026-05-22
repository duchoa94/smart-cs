import { z } from 'zod'

export const AnalyticsEventTypeSchema = z.enum([
  'conversation_started',
  'message_sent',
  'handoff_triggered',
  'handoff_accepted',
  'handoff_resolved',
  'resolution_confirmed',
  'document_indexed',
  'widget_loaded',
])

export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  agentId: z.string().uuid().nullable(),
  conversationId: z.string().uuid().nullable(),
  eventType: AnalyticsEventTypeSchema,
  properties: z.record(z.unknown()).default({}),
  occurredAt: z.coerce.date(),
})

export const AnalyticsQuerySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  agentId: z.string().uuid().optional(),
  channelType: z.string().optional(),
})

export const AnalyticsOverviewSchema = z.object({
  totalConversations: z.number().int(),
  resolvedByAi: z.number().int(),
  handoffCount: z.number().int(),
  handoffRate: z.number(),
  avgResponseTimeMs: z.number(),
  avgConversationLength: z.number(),
  resolutionRate: z.number(),
})
