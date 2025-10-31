"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface GalleryItem {
  id: string
  title: string
  query: string
  image_url: string | null
  created_at: string
}

export function ManageGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [newItem, setNewItem] = useState({ title: "", query: "", image_url: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGallery = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setGallery(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery')
      console.error('Error fetching gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.query) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([
          {
            title: newItem.title,
            query: newItem.query,
            image_url: newItem.image_url || null
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        setGallery([data[0], ...gallery])
        setNewItem({ title: "", query: "", image_url: "" })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add gallery item')
      console.error('Error adding gallery item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error

      setGallery(gallery.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      console.error('Error deleting gallery item:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage Gallery</h2>

      <Card className="p-6 bg-card border-border mb-8">
        <h3 className="text-xl font-bold mb-4">Add New Gallery Item</h3>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <Input
            placeholder="Description or search query"
            value={newItem.query}
            onChange={(e) => setNewItem({ ...newItem, query: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            required
          />
          <Input
            placeholder="Image URL (optional)"
            value={newItem.image_url}
            onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
            className="bg-input border-border"
            disabled={loading}
            type="url"
          />
          <Button 
            onClick={handleAddItem} 
            className="bg-primary hover:bg-primary/90 w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <><Plus size={20} className="mr-2" /> Add Item</>
            )}
          </Button>
        </div>
      </Card>

      {loading && gallery.length === 0 ? (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading gallery items...</p>
        </div>
      ) : gallery.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No gallery items found. Add your first item above.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-card border-border flex flex-col">
              <div className="relative h-48 bg-muted/50">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.query}</p>
                <div className="mt-auto">
                  <p className="text-xs text-muted-foreground mb-3">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} className="mr-2" />
                    {loading ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
