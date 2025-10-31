"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  title: string
  emoji: string
  image_url: string | null
  created_at: string
}

export function ManageTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    emoji: "",
    image_url: ""
  })

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.title || !newMember.emoji) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('team')
        .insert([
          {
            name: newMember.name,
            title: newMember.title,
            emoji: newMember.emoji,
            image_url: newMember.image_url || null
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        setTeam([...team, data[0]])
        setNewMember({ name: "", title: "", emoji: "", image_url: "" })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add team member')
      console.error('Error adding team member:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('team')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTeam(team.filter((m) => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team member')
      console.error('Error deleting team member:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          setTeam(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch team')
        console.error('Error fetching team:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Team</h2>

      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-xl font-bold mb-4">Add Team Member</h3>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <Input
            placeholder="Title"
            value={newMember.title}
            onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <Input
            placeholder="Emoji (e.g., 👨‍💻)"
            value={newMember.emoji}
            onChange={(e) => setNewMember({ ...newMember, emoji: e.target.value })}
            maxLength={2}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <Input
            placeholder="Image URL (optional)"
            value={newMember.image_url}
            onChange={(e) => setNewMember({ ...newMember, image_url: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            type="url"
          />
          <Button 
            onClick={handleAddMember} 
            className="bg-primary hover:bg-primary/90 w-full"
            disabled={loading}
          >
            {loading ? (
              <span>Adding...</span>
            ) : (
              <><Plus size={20} className="mr-2" /> Add Member</>
            )}
          </Button>
        </div>
      </Card>

      {loading && team.length === 0 ? (
        <div className="text-center py-8">Loading team members...</div>
      ) : team.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No team members found. Add your first team member above.
        </Card>
      ) : (
        <div className="space-y-4">
          {team.map((member) => (
            <Card key={member.id} className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {member.image_url ? (
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{member.emoji}</span>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-accent text-sm">{member.title}</p>
                    {member.image_url && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {member.emoji} • {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                  onClick={() => handleDeleteMember(member.id)}
                  disabled={loading}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
