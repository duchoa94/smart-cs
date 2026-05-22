import { z } from 'zod'

export const TenantPlanSchema = z.enum(['free', 'starter', 'pro', 'enterprise'])

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  plan: TenantPlanSchema,
  settings: z.record(z.unknown()).default({}),
  apiKey: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export const CreateTenantSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  plan: TenantPlanSchema.default('free'),
})

export const UpdateTenantSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  settings: z.record(z.unknown()).optional(),
})
