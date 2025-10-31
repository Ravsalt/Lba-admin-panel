"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Plus } from "lucide-react"
import { useData } from "@/lib/data-context"

export function ManageEventsPage() {
  const { events, setEvents } = useData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({
    name: "",
    icon: "",
    description: "",
  })

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.icon && newEvent.description) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          ...newEvent,
        },
      ])
      setNewEvent({ name: "", icon: "", description: "" })
    }
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Events</h2>

      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-xl font-bold mb-4">Add New Event</h3>
        <div className="space-y-4">
          <Input
            placeholder="Event name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="bg-input border-border"
          />
          <Input
            placeholder="Icon (emoji)"
            value={newEvent.icon}
            onChange={(e) => setNewEvent({ ...newEvent, icon: e.target.value })}
            maxLength={2}
            className="bg-input border-border"
          />
          <Input
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="bg-input border-border"
          />
          <Button onClick={handleAddEvent} className="bg-primary hover:bg-primary/90 w-full">
            <Plus size={20} /> Add Event
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{event.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">{event.name}</h3>
                  <p className="text-foreground/60">{event.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-transparent"
                  onClick={() => setEditingId(event.id)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
