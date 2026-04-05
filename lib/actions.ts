'use server'

import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { hashPassword, verifyPassword, signToken, getCurrentUser } from './auth'

// ====================== AUTH ACTIONS ======================
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new Error('Invalid email or password')
  }

  const token = signToken({ userId: user.id })
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return { success: true }
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'USER'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('User already exists')

  const hashed = await hashPassword(password)

  await prisma.user.create({
    data: {
      name,
      username: username || null,
      email,
      phone: phone || null,
      password: hashed,
      role: role as 'USER' | 'VOLUNTEER' | 'ADMIN',
    },
  })
  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// ====================== COMPLAINT ACTIONS ======================
export async function createComplaintAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in to report an issue')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const photo = formData.get('photo') as string | null
  const lat = formData.get('lat') as string
  const lng = formData.get('lng') as string

  await prisma.complaint.create({
    data: {
      userId: user.id,
      title,
      description,
      photo: photo || null,
      locationCoords: `${lat},${lng}`,
      address: address || "No address provided",
      status: 'RECEIVED',
    }
  })
  return { success: true }
}

export async function voteAction(complaintId: string, voteType: 'UPVOTE' | 'DOWNVOTE') {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in to vote')

  await prisma.vote.create({
    data: { userId: user.id, complaintId, voteType }
  })
  return { success: true }
}

export async function addCommentAction(complaintId: string, content: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in to comment')

  await prisma.comment.create({
    data: { userId: user.id, complaintId, content }
  })
  return { success: true }
}

export async function updateStatusAction(complaintId: string, newStatus: 'IN_REVIEW' | 'RESOLVED') {
  await prisma.complaint.update({
    where: { id: complaintId },
    data: { status: newStatus }
  })
  return { success: true }
}