import { z } from 'zod'

export const MessageRoleSchema = z.enum(['user', 'assistant', 'system', 'human_agent'])

export const MessageContentTypeSchema = z.enum(['text', 'image', 'file', 'template'])

export const AttachmentSchema = z.object({
  type: z.enum(['image', 'file', 'audio', 'video']),
  url: z.string().url(),
  name: z.string(),
  size: z.number().int().optional(),
  mimeType: z.string().optional(),
})

export const RagContextChunkSchema = z.object({
  milvusId: z.string(),
  chunkPgId: z.string(),
  score: z.number(),
  content: z.string(),
  docTitle: z.string(),
})

export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  tenantId: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  contentType: MessageContentTypeSchema,
  attachments: z.array(AttachmentSchema).nullable(),
  metadata: z.record(z.unknown()).default({}),
  ragContext: z.array(RagContextChunkSchema).nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  externalMsgId: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.coerce.date(),
})

export const SendMessageSchema = z.object({
  content: z.string().min(1).max(32768),
  contentType: MessageContentTypeSchema.default('text'),
  attachments: z.array(AttachmentSchema).optional(),
})
