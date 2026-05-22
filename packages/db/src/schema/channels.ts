import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { agents } from './agents.js'

export const channels = pgTable('channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('inactive'),
  config: jsonb('config').notNull().default({}),
  credentials: jsonb('credentials').notNull().default({}),
  webhookSecret: varchar('webhook_secret', { length: 255 }),
  lastError: text('last_error'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ChannelRow = typeof channels.$inferSelect
export type NewChannelRow = typeof channels.$inferInsert
