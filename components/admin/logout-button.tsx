"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { clearSession } from "@/lib/session"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    clearSession()
    // Force a full page reload to clear all state
    window.location.href = "/admin"
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}
