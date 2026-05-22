import { z } from 'zod'
import { MessageSchema, SendMessageSchema } from './message.schema.js'
import { ConversationSchema } from './conversation.schema.js'

// ── Widget → Server ───────────────────────────────────────────────────────────

export const WidgetInitSchema = z.object({
  agentId: z.string().uuid(),
  anonymousId: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

export const WidgetSendMessageSchema = SendMessageSchema.extend({
  conversationId: z.string().uuid().optional(),
})

export const WidgetTypingSchema = z.object({
  conversationId: z.string().uuid(),
})

// ── Server → Widget ───────────────────────────────────────────────────────────

export const WidgetMessageEventSchema = z.object({
  conversationId: z.string().uuid(),
  message: MessageSchema,
})

export const WidgetHandoffEventSchema = z.object({
  conversationId: z.string().uuid(),
  agentName: z.string().nullable(),
  waitTime: z.number().int().nullable(),
})

// ── Dashboard → Server ────────────────────────────────────────────────────────

export const DashboardSendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1),
})

export const DashboardSubscribeSchema = z.object({
  conversationId: z.string().uuid(),
})

export const DashboardAgentStatusSchema = z.object({
  status: z.enum(['online', 'away', 'offline']),
})

// ── Server → Dashboard ────────────────────────────────────────────────────────

export const ConvNewMessageEventSchema = z.object({
  conversationId: z.string().uuid(),
  message: MessageSchema,
})

export const ConvNewEventSchema = z.object({
  conversation: ConversationSchema,
})

export const HandoffRequestEventSchema = z.object({
  handoffId: z.string().uuid(),
  conversationId: z.string().uuid(),
  triggerType: z.string(),
  aiConfidence: z.number().nullable(),
})
