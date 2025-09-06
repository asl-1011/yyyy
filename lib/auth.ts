// lib/auth.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

// --- Types ---
export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  role: "admin" | "user"
  image?: string | null
}

export interface Session {
  user: SessionUser
  expires?: string
}

export type AppSession = Session

// --- Export auth options ---
export { authOptions }

// --- Get current session ---
export async function getSession(): Promise<AppSession | null> {
  const session = (await getServerSession(authOptions)) as AppSession | null
  return session
}

// --- Get current user ---
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession()
  return session?.user ?? null
}

// --- Server-side redirect helpers ---
export async function requireAuth(): Promise<AppSession> {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}

export async function requireAdmin(): Promise<AppSession> {
  const session = await getSession()
  if (!session || session.user.role !== "admin") redirect("/login")
  return session
}

// --- API helpers ---
export async function requireAuthAPI(): Promise<AppSession | NextResponse> {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return session
}

export async function requireAdminAPI(): Promise<AppSession | NextResponse> {
  const session = await getSession()
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return session
}
