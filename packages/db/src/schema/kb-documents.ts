import { pgTable, uuid, varchar, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { agents } from './agents.js'
import { users } from './users.js'

export const kbDocuments = pgTable(
  'kb_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    agentId: uuid('agent_id').references(() => agents.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 500 }).notNull(),
    sourceType: varchar('source_type', { length: 50 }).notNull(),
    sourceUrl: text('source_url'),
    filePath: text('file_path'),
    mimeType: varchar('mime_type', { length: 100 }),
    content: text('content'),
    status: varchar('status', { length: 50 }).notNull().default('pending'),
    chunkCount: integer('chunk_count').notNull().default(0),
    metadata: jsonb('metadata').notNull().default({}),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    indexedAt: timestamp('indexed_at', { withTimezone: true }),
  },
  (t) => [
    index('idx_kb_docs_tenant').on(t.tenantId),
    index('idx_kb_docs_agent').on(t.agentId),
    index('idx_kb_docs_status').on(t.status),
  ],
)

export type KbDocumentRow = typeof kbDocuments.$inferSelect
export type NewKbDocumentRow = typeof kbDocuments.$inferInsert
