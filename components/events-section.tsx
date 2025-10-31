"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useData } from "@/lib/data-context"

export function EventsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { events } = useData()

  return (
    <section id="events" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">🎮 Game Events & Community</h2>
          <p className="text-foreground/60 text-lg">Experience epic events and build lasting connections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className={`p-6 border border-border hover:border-accent transition-all duration-300 cursor-pointer ${
                hoveredId === event.id ? "bg-primary/10 shadow-lg shadow-accent/20" : "bg-card hover:bg-card/80"
              }`}
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="text-4xl mb-4">{event.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{event.name}</h3>
              <p className="text-foreground/70 leading-relaxed">{event.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
