import { pgTable, uuid, varchar, jsonb, timestamp, index } from 'drizzle-orm/pg-core'

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: uuid('id').notNull().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    agentId: uuid('agent_id'),
    conversationId: uuid('conversation_id'),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    properties: jsonb('properties').notNull().default({}),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_analytics_tenant_time').on(t.tenantId, t.occurredAt),
    index('idx_analytics_type').on(t.eventType),
  ],
)

export type AnalyticsEventRow = typeof analyticsEvents.$inferSelect
export type NewAnalyticsEventRow = typeof analyticsEvents.$inferInsert
