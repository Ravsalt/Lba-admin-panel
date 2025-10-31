"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { verifyAdminCredentials } from "@/lib/auth"
import { isAuthenticated, setSession } from "@/lib/session"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { valid, user } = await verifyAdminCredentials(username, password)
      
      if (valid && user) {
        // Store minimal user data in session storage
        setSession({
          id: user.id, 
          username: user.username,
          authenticatedAt: new Date().toISOString()
        });
        
        // Force a full page reload to ensure all components get the new auth state
        window.location.href = "/admin/dashboard";
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
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
        
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
