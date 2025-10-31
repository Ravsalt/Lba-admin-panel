"use client"

import { Card } from "@/components/ui/card"
import { useData } from "@/lib/data-context"

interface MemberCardProps {
  name: string
  title: string
  emoji: string
}

function MemberCard({ name, title, emoji }: MemberCardProps) {
  return (
    <Card className="p-6 text-center bg-card hover:bg-card/80 border-border hover:border-accent transition-all">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
      <p className="text-accent text-sm">{title}</p>
    </Card>
  )
}

export function LeadershipSection() {
  const { team } = useData()

  // Categorize team members by role
  const supremeCommander = team.filter((m) => m.title.includes("Supreme"))
  const topCommanders = team.filter((m) => m.title.includes("Top"))
  const wingCommanders = team.filter((m) => m.title.includes("Wing"))
  const officers = team.filter((m) => m.title.includes("Officer"))

  return (
    <section id="team" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">👑 Leadership Team</h2>
          <p className="text-foreground/60">Meet the dedicated leadership driving LBA forward</p>
        </div>

        {/* Supreme Commander */}
        {supremeCommander.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-accent text-center mb-8">Supreme Commander</h3>
            <div className="max-w-xs mx-auto">
              {supremeCommander.map((member) => (
                <MemberCard key={member.id} name={member.name} title={member.title} emoji={member.emoji} />
              ))}
            </div>
          </div>
        )}

        {/* Top Commanders */}
        {topCommanders.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-accent text-center mb-8">Top Commanders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {topCommanders.map((member) => (
                <MemberCard key={member.id} name={member.name} title={member.title} emoji={member.emoji} />
              ))}
            </div>
          </div>
        )}

        {/* Wing Commanders */}
        {wingCommanders.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-accent text-center mb-8">Wing Commanders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {wingCommanders.map((member) => (
                <MemberCard key={member.id} name={member.name} title={member.title} emoji={member.emoji} />
              ))}
            </div>
          </div>
        )}

        {/* Officer Corps */}
        {officers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-accent text-center mb-8">Officer Corps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {officers.map((member) => (
                <MemberCard key={member.id} name={member.name} title={member.title} emoji={member.emoji} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
