"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface MemberCardProps {
  name: string
  title: string
  emoji: string
  image_url?: string | null
}

function MemberCard({ name, title, emoji, image_url }: MemberCardProps) {
  return (
    <Card className="p-6 text-center transition-all duration-300 hover:scale-105 bg-card/60 border-border/60 hover:border-accent shadow-md relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        {image_url ? (
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-accent/40">
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="text-6xl mb-4 filter drop-shadow-lg">{emoji}</div>
        )}

        <h3 className="text-lg font-bold text-foreground mb-1 tracking-wide">{name}</h3>
        <p className="text-accent text-sm font-semibold uppercase tracking-wider">{title}</p>
      </div>
    </Card>
  )
}

interface TeamMember {
  id: string
  name: string
  title: string
  emoji: string
  image_url: string | null
  created_at: string
}

export function LeadershipSection() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase
          .from("team")
          .select("*")
          .order("created_at", { ascending: true })

        if (error) throw error
        if (data) setTeam(data)
      } catch (err) {
        console.error("Error fetching team:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-foreground/60">Loading team...</p>
        </div>
      </section>
    )
  }

  if (team.length === 0) {
    return (
      <section id="team" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h2>
          <p className="text-foreground/60">No members yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="py-20 px-4 bg-background relative overflow-hidden">
      {/* subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            The Leadership
          </h2>
          <p className="text-foreground/60 text-lg">The people who make it happen</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              title={member.title}
              emoji={member.emoji}
              image_url={member.image_url}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
