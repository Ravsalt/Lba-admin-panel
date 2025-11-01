"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Edit2, Save, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

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
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({})
  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    emoji: "",
    image_url: ""
  })

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const validateUrl = (url: string): boolean => {
    if (!url) return true // Optional field
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.title || !newMember.emoji) {
      showError("Please fill in all required fields (Name, Title, Emoji)")
      return
    }

    if (newMember.image_url && !validateUrl(newMember.image_url)) {
      showError("Please enter a valid URL starting with http:// or https://")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('team')
        .insert([
          {
            name: newMember.name.trim(),
            title: newMember.title.trim(),
            emoji: newMember.emoji.trim(),
            image_url: newMember.image_url.trim() || null
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        setTeam([data[0], ...team])
        setNewMember({ name: "", title: "", emoji: "", image_url: "" })
        showSuccess("Team member added successfully!")
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to add team member')
      console.error('Error adding team member:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('team')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTeam(team.filter((m) => m.id !== id))
      showSuccess("Team member removed successfully!")
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete team member')
      console.error('Error deleting team member:', err)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setEditForm({
      name: member.name,
      title: member.title,
      emoji: member.emoji,
      image_url: member.image_url || ""
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleUpdateMember = async (id: string) => {
    if (!editForm.name || !editForm.title || !editForm.emoji) {
      showError("Please fill in all required fields")
      return
    }

    if (editForm.image_url && !validateUrl(editForm.image_url)) {
      showError("Please enter a valid URL starting with http:// or https://")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('team')
        .update({
          name: editForm.name!.trim(),
          title: editForm.title!.trim(),
          emoji: editForm.emoji!.trim(),
          image_url: editForm.image_url?.trim() || null
        })
        .eq('id', id)
        .select()

      if (error) throw error

      if (data) {
        setTeam(team.map((m) => m.id === id ? data[0] : m))
        setEditingId(null)
        setEditForm({})
        showSuccess("Team member updated successfully!")
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update team member')
      console.error('Error updating team member:', err)
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
        showError(err instanceof Error ? err.message : 'Failed to fetch team')
        console.error('Error fetching team:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [supabase])



  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">⚔️ Manage Team</h2>
        <p className="text-foreground/60">Add, edit, or remove team members from the chain of command</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 text-green-500 rounded-lg border border-green-500/30 flex items-center gap-2">
          <span className="text-xl">✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/30 flex items-center gap-2">
          <span className="text-xl">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Add Member Form */}
      <Card className="p-6 bg-card border-border mb-8 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="text-accent" size={24} />
          <h3 className="text-xl font-bold">Add New Team Member</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="John Doe"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="bg-input border-border"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Title/Rank <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Supreme Commander"
              value={newMember.title}
              onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
              className="bg-input border-border"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Emoji <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="⚔️"
              value={newMember.emoji}
              onChange={(e) => setNewMember({ ...newMember, emoji: e.target.value })}
              maxLength={2}
              className="bg-input border-border text-2xl"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Profile Image URL (Optional)
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={newMember.image_url}
              onChange={(e) => setNewMember({ ...newMember, image_url: e.target.value })}
              className="bg-input border-border"
              disabled={loading}
              type="url"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAddMember} 
          className="bg-primary hover:bg-primary/90 w-full mt-6"
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <span>Adding...</span>
          ) : (
            <><Plus size={20} className="mr-2" /> Add Team Member</>
          )}
        </Button>
      </Card>

      {/* Team Members List */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Current Team ({team.length})</h3>
      </div>

      {loading && team.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="animate-pulse">Loading team members...</div>
        </Card>
      ) : team.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-bold mb-2">No Team Members Yet</h3>
          <p className="text-muted-foreground">Add your first team member using the form above.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {team.map((member) => {
            const isEditing = editingId === member.id
            
            return (
              <Card key={member.id} className="p-6 bg-card border-border hover:border-accent/50 transition-all">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-input border-border"
                        disabled={loading}
                      />
                      <Input
                        placeholder="Title"
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="bg-input border-border"
                        disabled={loading}
                      />
                      <Input
                        placeholder="Emoji"
                        value={editForm.emoji || ""}
                        onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })}
                        maxLength={2}
                        className="bg-input border-border text-2xl"
                        disabled={loading}
                      />
                      <Input
                        placeholder="Image URL (optional)"
                        value={editForm.image_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                        className="bg-input border-border"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateMember(member.id)}
                        className="bg-primary hover:bg-primary/90 flex-1"
                        disabled={loading}
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        className="flex-1"
                        disabled={loading}
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {member.image_url ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/50 flex-shrink-0">
                          <Image 
                            src={member.image_url} 
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl flex-shrink-0">{member.emoji}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-lg">{member.name}</h3>
                        </div>
                        <p className="text-accent text-sm font-medium">{member.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added {new Date(member.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(member)}
                        disabled={loading}
                        className="border-accent/50 hover:bg-accent/10"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}