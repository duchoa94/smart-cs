import { pgTable, uuid, text, integer, bigint, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { kbDocuments } from './kb-documents.js'

export const kbChunks = pgTable(
  'kb_chunks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    documentId: uuid('document_id')
      .notNull()
      .references(() => kbDocuments.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    chunkIndex: integer('chunk_index').notNull(),
    content: text('content').notNull(),
    tokenCount: integer('token_count'),
    milvusId: bigint('milvus_id', { mode: 'bigint' }),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_kb_chunks_document').on(t.documentId),
    index('idx_kb_chunks_tenant').on(t.tenantId),
    index('idx_kb_chunks_milvus').on(t.milvusId),
  ],
)

export type KbChunkRow = typeof kbChunks.$inferSelect
export type NewKbChunkRow = typeof kbChunks.$inferInsert
