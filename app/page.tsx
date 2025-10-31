"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { EventsSection } from "@/components/events-section"
import { GallerySection } from "@/components/gallery-section"
import { LeadershipSection } from "@/components/leadership-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation scrolled={scrolled} />
      <HeroSection />
      <EventsSection />
      <GallerySection />
      <LeadershipSection />
      <Footer />
    </div>
  )
}
