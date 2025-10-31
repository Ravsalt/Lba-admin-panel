"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface Event {
  id: string
  icon: string
  name: string
  description: string
  image_url: string | null
  created_at: string
}

export function EventsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching events:', error)
          return
        }

        setEvents(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section id="events" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-foreground/60">Loading events...</p>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section id="events" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-foreground/60">No events available yet.</p>
        </div>
      </section>
    )
  }

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
              {event.image_url && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={event.image_url}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
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