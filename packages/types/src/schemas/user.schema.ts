import { z } from 'zod'

export const UserRoleSchema = z.enum(['admin', 'agent', 'viewer'])

export const UserSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  email: z.string().email().max(320),
  fullName: z.string().max(255).nullable(),
  role: UserRoleSchema,
  isActive: z.boolean(),
  lastLoginAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const CreateUserSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
  fullName: z.string().max(255).optional(),
  role: UserRoleSchema.default('agent'),
})

export const UpdateUserSchema = z.object({
  fullName: z.string().max(255).optional(),
  role: UserRoleSchema.optional(),
  isActive: z.boolean().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
