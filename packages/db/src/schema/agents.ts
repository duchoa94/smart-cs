import { pgTable, uuid, varchar, text, numeric, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { tenants } from './tenants.js'
import { users } from './users.js'

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  llmProvider: varchar('llm_provider', { length: 50 }).notNull().default('claude'),
  llmModel: varchar('llm_model', { length: 100 }).notNull().default('claude-sonnet-4-6'),
  systemPrompt: text('system_prompt'),
  temperature: numeric('temperature', { precision: 3, scale: 2 }).notNull().default('0.7'),
  maxTokens: integer('max_tokens').notNull().default(1024),
  handoffThreshold: numeric('handoff_threshold', { precision: 3, scale: 2 }).notNull().default('0.4'),
  language: varchar('language', { length: 10 }).notNull().default('vi'),
  fallbackMessage: text('fallback_message'),
  metadata: jsonb('metadata').notNull().default({}),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type AgentRow = typeof agents.$inferSelect
export type NewAgentRow = typeof agents.$inferInsert
