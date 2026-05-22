import { pgTable, uuid, varchar, text, numeric, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { conversations } from './conversations.js'

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    role: varchar('role', { length: 20 }).notNull(),
    content: text('content').notNull(),
    contentType: varchar('content_type', { length: 50 }).notNull().default('text'),
    attachments: jsonb('attachments'),
    metadata: jsonb('metadata').notNull().default({}),
    ragContext: jsonb('rag_context'),
    confidence: numeric('confidence', { precision: 4, scale: 3 }),
    externalMsgId: varchar('external_msg_id', { length: 255 }),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_messages_conversation').on(t.conversationId, t.createdAt),
    index('idx_messages_tenant').on(t.tenantId),
  ],
)

export type MessageRow = typeof messages.$inferSelect
export type NewMessageRow = typeof messages.$inferInsert
