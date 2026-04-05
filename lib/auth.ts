import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SECRET = 'cleanstreet-super-secret-2026'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed)
}

export function signToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export async function getCurrentUser() {
  const cookieStore = await cookies()                    // ← Added await
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null

  try {
    const payload = jwt.verify(token, SECRET) as { userId: string }
    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        role: true,
        profilePhoto: true,
      },
    })
  } catch {
    return null
  }
}