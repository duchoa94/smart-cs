import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema/index.js'

const pool = new pg.Pool({
  connectionString: process.env['DATABASE_URL'],
  max: Number(process.env['DATABASE_POOL_SIZE'] ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

export const db = drizzle(pool, { schema, logger: process.env['NODE_ENV'] === 'development' })

export type Db = typeof db
