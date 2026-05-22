import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  plan: varchar('plan', { length: 50 }).notNull().default('free'),
  settings: jsonb('settings').notNull().default({}),
  apiKey: varchar('api_key', { length: 128 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export type TenantRow = typeof tenants.$inferSelect
export type NewTenantRow = typeof tenants.$inferInsert
