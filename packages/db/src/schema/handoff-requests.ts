import { pgTable, uuid, varchar, numeric, timestamp } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { conversations } from './conversations.js'
import { messages } from './messages.js'
import { users } from './users.js'

export const handoffRequests = pgTable('handoff_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  triggerType: varchar('trigger_type', { length: 50 }).notNull(),
  triggerMessageId: uuid('trigger_message_id').references(() => messages.id),
  aiConfidence: numeric('ai_confidence', { precision: 4, scale: 3 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
})

export type HandoffRequestRow = typeof handoffRequests.$inferSelect
export type NewHandoffRequestRow = typeof handoffRequests.$inferInsert
