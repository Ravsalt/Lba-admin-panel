"use client"

import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background py-10 px-6 text-center text-foreground/70">
      <h3 className="text-lg font-bold mb-2">Leezardas's British Army</h3>
      <p className="max-w-md mx-auto mb-6 text-sm">
        A vibrant gaming community built on teamwork, strategy, and fun.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
        <Link href="#home" className="hover:text-accent transition">Home</Link>
        <Link href="#events" className="hover:text-accent transition">Events</Link>
        <Link href="#gallery" className="hover:text-accent transition">Gallery</Link>
        <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">
          Discord
        </a>
        <a href="https://roblox.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">
          Roblox
        </a>
      </div>

      <p className="text-xs">© {year} Leezardas's British Army. All rights reserved.</p>
    </footer>
  )
}
