"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function AuthStatus() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <a href="/login">Sign In</a>
        </Button>
        <Button asChild>
          <a href="/signup">Sign Up</a>
        </Button>
      </div>
    )
  }

  const name = session.user.name || "User"
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold hover:scale-105 transition-transform"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-1 text-sm font-medium text-foreground">{name}</div>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted/50 rounded"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
