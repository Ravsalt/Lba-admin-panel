"use client"

import { Card } from "@/components/ui/card"
import { Users, Calendar, Image, Zap } from "lucide-react"

export function OverviewPage() {
  const stats = [
    { label: "Total Members", value: "1,234", icon: Users },
    { label: "Active Events", value: "8", icon: Calendar },
    { label: "Gallery Photos", value: "42", icon: Image },
    { label: "Engagement Rate", value: "87%", icon: Zap },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-accent mt-2">{stat.value}</p>
                </div>
                <Icon size={32} className="text-accent/30" />
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <div>
              <p className="font-semibold">Zombie Event Completed</p>
              <p className="text-foreground/60 text-sm">42 participants joined</p>
            </div>
            <span className="text-accent">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <div>
              <p className="font-semibold">Gallery Updated</p>
              <p className="text-foreground/60 text-sm">8 new photos added</p>
            </div>
            <span className="text-accent">5 hours ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Team Member Promoted</p>
              <p className="text-foreground/60 text-sm">CommanderX promoted to Top Commander</p>
            </div>
            <span className="text-accent">1 day ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
