"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { isAuthenticated } from "@/lib/session"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuth = isAuthenticated()

  useEffect(() => {
    if (!isAuth) {
      router.push("/admin")
    }
  }, [isAuth, router])

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
