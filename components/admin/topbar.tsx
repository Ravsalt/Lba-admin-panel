"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AdminSession {
  username: string;
  // Add other session properties if they exist
}

export function AdminTopbar() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    // Get session from sessionStorage on component mount
    const sessionData = sessionStorage.getItem('adminSession')
    if (sessionData) {
      try {
        const session: AdminSession = JSON.parse(sessionData)
        setUsername(session.username || 'Admin')
      } catch (e) {
        console.error('Failed to parse admin session', e)
      }
    }
  }, [])
  
  const handleLogout = () => {
    sessionStorage.removeItem("adminSession")
    router.push("/admin")
  }

  return (
    <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        {username && (
          <span className="text-foreground/60 text-sm">
            Welcome, {username}
          </span>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
