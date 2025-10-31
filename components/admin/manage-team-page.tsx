"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"
import { useData } from "@/lib/data-context"

export function ManageTeamPage() {
  const { team, setTeam } = useData()
  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    emoji: "",
  })

  const handleAddMember = () => {
    if (newMember.name && newMember.title && newMember.emoji) {
      setTeam([
        ...team,
        {
          id: Date.now().toString(),
          ...newMember,
        },
      ])
      setNewMember({ name: "", title: "", emoji: "" })
    }
  }

  const handleDeleteMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id))
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Team</h2>

      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-xl font-bold mb-4">Add Team Member</h3>
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="bg-input border-border"
          />
          <Input
            placeholder="Title"
            value={newMember.title}
            onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
            className="bg-input border-border"
          />
          <Input
            placeholder="Emoji"
            value={newMember.emoji}
            onChange={(e) => setNewMember({ ...newMember, emoji: e.target.value })}
            maxLength={2}
            className="bg-input border-border"
          />
          <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90 w-full">
            <Plus size={20} /> Add Member
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {team.map((member) => (
          <Card key={member.id} className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{member.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-accent text-sm">{member.title}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => handleDeleteMember(member.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
