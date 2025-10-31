"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, ImageIcon, Users, LogOut } from "lucide-react"

interface AdminSidebarProps {
  currentPage: string
  onPageChange: (page: any) => void
}

export function AdminSidebar({ currentPage, onPageChange }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Manage Events", icon: Calendar },
    { id: "gallery", label: "Manage Gallery", icon: ImageIcon },
    { id: "team", label: "Manage Team", icon: Users },
  ]

  return (
    <div className="w-64 bg-card border-r border-border p-6 flex flex-col h-screen">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-2xl">🇬🇧</span>
        <span className="font-bold text-accent">LBA Admin</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                currentPage === item.id ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 text-foreground"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full border-border text-foreground hover:bg-destructive/10 bg-transparent"
      >
        <LogOut size={20} />
        Logout
      </Button>
    </div>
  )
}
