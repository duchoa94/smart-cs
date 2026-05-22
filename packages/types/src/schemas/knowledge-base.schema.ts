import { z } from 'zod'

export const KbSourceTypeSchema = z.enum(['file', 'url', 'faq', 'manual'])

export const KbDocumentStatusSchema = z.enum(['pending', 'processing', 'indexed', 'error'])

export const KbDocumentSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  agentId: z.string().uuid().nullable(),
  title: z.string().max(500),
  sourceType: KbSourceTypeSchema,
  sourceUrl: z.string().url().nullable(),
  filePath: z.string().nullable(),
  mimeType: z.string().nullable(),
  status: KbDocumentStatusSchema,
  chunkCount: z.number().int(),
  metadata: z.record(z.unknown()).default({}),
  createdBy: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  indexedAt: z.coerce.date().nullable(),
})

export const KbChunkSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  tenantId: z.string().uuid(),
  chunkIndex: z.number().int(),
  content: z.string(),
  tokenCount: z.number().int().nullable(),
  milvusId: z.bigint().nullable(),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.coerce.date(),
})

export const IngestUrlSchema = z.object({
  url: z.string().url(),
  agentId: z.string().uuid().optional(),
  title: z.string().max(500).optional(),
})

export const IngestFaqSchema = z.object({
  agentId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .min(1)
    .max(500),
})

export const KbSearchSchema = z.object({
  query: z.string().min(1).max(1000),
  agentId: z.string().uuid(),
  topK: z.number().int().min(1).max(20).default(5),
})
