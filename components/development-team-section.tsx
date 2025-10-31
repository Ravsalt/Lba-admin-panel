"use client"

import { Card } from "@/components/ui/card"
import { useData } from "@/lib/data-context"

export function DevelopmentTeamSection() {
  const { team } = useData()

  // Filter team members who are developers
  const developers = team.filter((m) => m.title.includes("Developer") || m.title.includes("Game"))

  if (developers.length === 0) return null

  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">💻 Development Team</h2>
          <p className="text-foreground/60">The talented developers behind LBA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {developers.map((dev) => (
            <Card
              key={dev.id}
              className="p-8 bg-card border-border hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all"
            >
              <div className="text-6xl mb-4">{dev.emoji}</div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">{dev.name}</h3>
              <p className="text-accent font-semibold">{dev.title}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
