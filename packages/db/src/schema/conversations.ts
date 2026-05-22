import { pgTable, uuid, varchar, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { agents } from './agents.js'
import { channels } from './channels.js'
import { users } from './users.js'

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    agentId: uuid('agent_id')
      .notNull()
      .references(() => agents.id),
    channelId: uuid('channel_id')
      .notNull()
      .references(() => channels.id),
    channelType: varchar('channel_type', { length: 50 }).notNull(),
    externalId: varchar('external_id', { length: 255 }),
    status: varchar('status', { length: 50 }).notNull().default('open'),
    assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
    endUserName: varchar('end_user_name', { length: 255 }),
    endUserAvatar: varchar('end_user_avatar', { length: 500 }),
    metadata: jsonb('metadata').notNull().default({}),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    handoffAt: timestamp('handoff_at', { withTimezone: true }),
    handoffReason: text('handoff_reason'),
    messageCount: integer('message_count').notNull().default(0),
    aiMessageCount: integer('ai_message_count').notNull().default(0),
  },
  (t) => [
    index('idx_conversations_tenant').on(t.tenantId),
    index('idx_conversations_agent').on(t.agentId),
    index('idx_conversations_status').on(t.status),
    index('idx_conversations_last_msg').on(t.lastMessageAt),
    index('idx_conversations_external').on(t.tenantId, t.channelType, t.externalId),
  ],
)

export type ConversationRow = typeof conversations.$inferSelect
export type NewConversationRow = typeof conversations.$inferInsert
