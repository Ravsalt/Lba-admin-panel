"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  scrolled: boolean
}

export function Navigation({ scrolled }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-accent text-2xl">★</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#home" className="text-foreground/80 hover:text-foreground transition">
            Home
          </Link>
          <Link href="#events" className="text-foreground/80 hover:text-foreground transition">
            Events
          </Link>
          <Link href="#gallery" className="text-foreground/80 hover:text-foreground transition">
            Gallery
          </Link>
          <Link href="#team" className="text-foreground/80 hover:text-foreground transition">
            Team
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            💬 Join Discord
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">🎮 Join LBA</Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur border-b border-border p-4 space-y-4">
          <Link href="#home" className="block text-foreground hover:text-accent transition">
            Home
          </Link>
          <Link href="#events" className="block text-foreground hover:text-accent transition">
            Events
          </Link>
          <Link href="#gallery" className="block text-foreground hover:text-accent transition">
            Gallery
          </Link>
          <Link href="#team" className="block text-foreground hover:text-accent transition">
            Team
          </Link>
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" className="w-full border-accent text-accent bg-transparent">
              💬 Join Discord
            </Button>
            <Button className="w-full bg-primary">🎮 Join LBA</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
