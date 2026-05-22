import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { UserRepository } from '@smart-cs/db'
import type { CreateUser, User, LoginInput } from '@smart-cs/types'
import { UserSchema } from '@smart-cs/types'
import type { UserRow } from '@smart-cs/db'

function toUser(row: UserRow): User {
  return UserSchema.parse(row)
}

type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async login(tenantId: string, input: LoginInput): Promise<{ user: User; tokens: AuthTokens }> {
    const row = await this.userRepo.findByEmail(input.email, tenantId)
    if (!row || !row.isActive) throw new Error('Invalid credentials')

    const valid = await bcrypt.compare(input.password, row.passwordHash)
    if (!valid) throw new Error('Invalid credentials')

    await this.userRepo.updateLastLogin(row.id)

    const user = toUser(row)
    const tokens = this.signTokens(user)
    return { user, tokens }
  }

  async create(tenantId: string, data: CreateUser, createdBy?: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(data.email, tenantId)
    if (existing) throw new Error('Email already in use')

    const passwordHash = await bcrypt.hash(data.password, 12)
    const row = await this.userRepo.create({
      tenantId,
      email: data.email,
      passwordHash,
      fullName: data.fullName ?? null,
      role: data.role,
    })
    return toUser(row)
  }

  async getById(id: string, tenantId: string): Promise<User | null> {
    const row = await this.userRepo.findById(id, tenantId)
    return row ? toUser(row) : null
  }

  async listByTenant(tenantId: string): Promise<User[]> {
    const rows = await this.userRepo.findByTenant(tenantId)
    return rows.map(toUser)
  }

  private signTokens(user: User): AuthTokens {
    const payload = { sub: user.id, tenantId: user.tenantId, role: user.role }
    const accessSecret = process.env['JWT_ACCESS_SECRET']!
    const refreshSecret = process.env['JWT_REFRESH_SECRET']!
    // Cast to any to avoid StringValue type mismatch across @types/jsonwebtoken versions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: (process.env['JWT_ACCESS_EXPIRES_IN'] ?? '15m') as any })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: (process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d') as any })
    return { accessToken, refreshToken }
  }
}
