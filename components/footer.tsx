"use client"

import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Leezardas's British Army</h3>
            <p className="text-foreground/60">
              A vibrant gaming community dedicated to military strategy and teamwork.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-foreground/60">
              <li>
                <Link href="#home" className="hover:text-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#events" className="hover:text-accent transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="hover:text-accent transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-foreground/60">
              <li>
                <a
                  href="https://discord.gg"
                  className="hover:text-accent transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://roblox.com"
                  className="hover:text-accent transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Roblox
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-foreground/60">
          <p>© {currentYear} Leezardas's British Army. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
