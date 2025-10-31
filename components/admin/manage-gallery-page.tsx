"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"
import Image from "next/image"
import { useData } from "@/lib/data-context"

export function ManageGalleryPage() {
  const { gallery, setGallery } = useData()
  const [newItem, setNewItem] = useState({ title: "", query: "" })

  const handleAddItem = () => {
    if (newItem.title && newItem.query) {
      setGallery([
        ...gallery,
        {
          id: Date.now().toString(),
          ...newItem,
        },
      ])
      setNewItem({ title: "", query: "" })
    }
  }

  const handleDeleteItem = (id: string) => {
    setGallery(gallery.filter((item) => item.id !== id))
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Gallery</h2>

      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-xl font-bold mb-4">Add New Photo</h3>
        <div className="space-y-4">
          <Input
            placeholder="Photo title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="bg-input border-border"
          />
          <Input
            placeholder="Photo description"
            value={newItem.query}
            onChange={(e) => setNewItem({ ...newItem, query: e.target.value })}
            className="bg-input border-border"
          />
          <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 w-full">
            <Plus size={20} /> Add Photo
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden bg-card border-border">
            <div className="relative h-48 bg-background">
              <Image
                src={`/.jpg?height=192&width=300&query=${encodeURIComponent(item.query)}`}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-foreground/60 text-sm mb-4">{item.query}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
