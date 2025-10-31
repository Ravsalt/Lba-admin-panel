"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Event {
  id: string
  name: string
  icon: string
  description: string
  image_url: string | null
  created_at: string
}

export function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({
    name: "",
    icon: "",
    description: "",
    image_url: ""
  })

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.icon || !newEvent.description) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            name: newEvent.name,
            icon: newEvent.icon,
            description: newEvent.description,
            image_url: newEvent.image_url || null
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        setEvents([data[0], ...events])
        setNewEvent({ name: "", icon: "", description: "", image_url: "" })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add event')
      console.error('Error adding event:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEvent = async () => {
    if (!editingId || !newEvent.name || !newEvent.icon || !newEvent.description) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          name: newEvent.name,
          icon: newEvent.icon,
          description: newEvent.description,
          image_url: newEvent.image_url || null
        })
        .eq('id', editingId)
        .select()

      if (error) throw error

      if (data) {
        setEvents(events.map(event => 
          event.id === editingId ? data[0] : event
        ))
        setEditingId(null)
        setNewEvent({ name: "", icon: "", description: "", image_url: "" })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event')
      console.error('Error updating event:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEvents(events.filter(event => event.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
      console.error('Error deleting event:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Events</h2>

      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-xl font-bold mb-4">
          {editingId ? 'Edit Event' : 'Add New Event'}
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            placeholder="Event name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <div className="flex gap-2">
            <Input
              placeholder="Icon (emoji)"
              value={newEvent.icon}
              onChange={(e) => setNewEvent({ ...newEvent, icon: e.target.value })}
              maxLength={2}
              className="bg-input border-border w-20"
              disabled={loading}
              required
            />
            <Input
              placeholder="Image URL (optional)"
              value={newEvent.image_url}
              onChange={(e) => setNewEvent({ ...newEvent, image_url: e.target.value })}
              className="bg-input border-border flex-1"
              disabled={loading}
              type="url"
            />
          </div>
          <Input
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <div className="flex gap-2">
            <Button 
              onClick={editingId ? handleUpdateEvent : handleAddEvent}
              className="bg-primary hover:bg-primary/90 flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingId ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus size={20} className="mr-2" />
                  {editingId ? 'Update Event' : 'Add Event'}
                </>
              )}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setNewEvent({ name: "", icon: "", description: "", image_url: "" })
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {loading && events.length === 0 ? (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No events found. Add your first event above.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden bg-card border-border">
              <div className="relative h-48 bg-muted/50">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-4xl">{event.icon}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-lg">{event.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditingId(event.id)
                        setNewEvent({
                          name: event.name,
                          icon: event.icon,
                          description: event.description,
                          image_url: event.image_url || ""
                        })
                      }}
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
