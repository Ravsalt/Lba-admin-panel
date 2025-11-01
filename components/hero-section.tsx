"use client"

import { Button } from "@/components/ui/button"
import { SetStateAction, useEffect, useState } from "react"

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const slides = [
    {
      title: "Leezardas's British Army",
      subtitle: "Game Events & Community",
      icon: "🦁",
      background: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PDHjfCQp2dCqqqF3HJp0xhqBWcMN0Q.png",
    },
    {
      title: "Leezardas's British Army",
      subtitle: "United in Purpose, Strong in Formation",
      icon: "⚔️",
      background: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mmpJQIoPD6unf2eB7UisRaEDKdOxiJ.png",
    },
    {
      title: "Leezardas's British Army",
      subtitle: "Elite Gaming Community",
      icon: "👑",
      background: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RAykjTugh5mUGOWWAGwAUiVhQh2DVI.png",
    },
  ]

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, slides.length])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (idx: SetStateAction<number>) => {
    setActiveSlide(idx)
    setIsAutoPlay(false)
  }

  const currentSlide = slides[activeSlide]
  const backgroundStyle = {
    backgroundImage: `url('${currentSlide.background}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${slide.background}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Enhanced overlay with subtle gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/40" />

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8 animate-fade-in">
        </div>

        {/* Enhanced title with better readability */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance text-white drop-shadow-lg">
          {currentSlide.title}
        </h1>

        {/* Subtitle with improved styling */}
        <p className="text-lg md:text-2xl text-white/95 mb-8 text-balance drop-shadow-md max-w-3xl mx-auto leading-relaxed">
          {currentSlide.subtitle}
        </p>

        {/* CTA Buttons with improved styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="https://discord.gg/jHMsmaQRMG"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 font-semibold transition-all hover:scale-105"
            >
              💬 Join Discord
            </Button>
          </a>
          <a
            href="https://www.roblox.com/communities/35816550/LBA-Leezardass-British-Army#!/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white/80 text-white hover:bg-white/10 px-8 bg-white/5 font-semibold transition-all hover:scale-105 backdrop-blur-sm"
            >
              🎮 Join LBA
            </Button>
          </a>
        </div>

        {/* Slide indicators with improved styling */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full backdrop-blur-sm ${
                idx === activeSlide ? "bg-accent w-8 h-2" : "bg-white/30 w-2 h-2 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
        <button
          onClick={prevSlide}
          className="pointer-events-auto bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm hover:scale-110 shadow-lg"
          aria-label="Previous slide"
        >
          <span className="text-xl">←</span>
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm hover:scale-110 shadow-lg"
          aria-label="Next slide"
        >
          <span className="text-xl">→</span>
        </button>
      </div>
    </section>
  )
}
