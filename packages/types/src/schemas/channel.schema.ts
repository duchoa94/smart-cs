import { z } from 'zod'

export const ChannelTypeSchema = z.enum(['web', 'zalo', 'whatsapp'])

export const ChannelStatusSchema = z.enum(['active', 'inactive', 'error'])

export const WebChannelConfigSchema = z.object({
  widgetColor: z.string().default('#6366f1'),
  greetingMessage: z.string().default('Xin chào! Tôi có thể giúp gì cho bạn?'),
  position: z.enum(['bottom-right', 'bottom-left']).default('bottom-right'),
  showBranding: z.boolean().default(true),
})

export const ZaloChannelConfigSchema = z.object({
  oaId: z.string(),
  webhookUrl: z.string().url(),
})

export const WhatsAppChannelConfigSchema = z.object({
  phoneNumberId: z.string(),
  displayPhoneNumber: z.string().optional(),
  webhookVerifyToken: z.string(),
})

export const ChannelSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  agentId: z.string().uuid(),
  type: ChannelTypeSchema,
  name: z.string().min(1).max(255),
  status: ChannelStatusSchema,
  config: z.record(z.unknown()).default({}),
  webhookSecret: z.string().nullable(),
  lastError: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const CreateChannelSchema = z.object({
  agentId: z.string().uuid(),
  type: ChannelTypeSchema,
  name: z.string().min(1).max(255),
  config: z.record(z.unknown()).default({}),
})

export const UpdateChannelSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  config: z.record(z.unknown()).optional(),
})
