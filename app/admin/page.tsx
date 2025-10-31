"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock authentication - replace with real auth
    if (email === "admin@lba.com" && password === "admin123") {
      localStorage.setItem("adminToken", "authenticated")
      router.push("/admin/dashboard")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">🇬🇧</h1>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-foreground/60 mt-2">Leezardas's British Army</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-foreground mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lba.com"
              className="bg-input border-border"
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-input border-border"
            />
          </div>

          {error && (
            <div className="p-3 rounded bg-destructive/10 border border-destructive/50 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Login to Dashboard
          </Button>
        </form>

        <p className="text-foreground/60 text-sm text-center mt-6">Demo: Use admin@lba.com / admin123</p>
      </Card>
    </div>
  )
}
