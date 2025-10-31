"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Loader2, Edit2, Save, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  source_url: string | null
  created_at: string
}

export function ManageGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [newItem, setNewItem] = useState({ 
    title: "", 
    description: "", 
    image_url: "",
    source_url: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<GalleryItem>>({})

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const validateUrl = (url: string): boolean => {
    if (!url) return false
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

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
      showError(err instanceof Error ? err.message : 'Failed to load gallery')
      console.error('Error fetching gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [supabase])

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.image_url) {
      showError("Please provide both a title and image URL")
      return
    }

    if (!validateUrl(newItem.image_url)) {
      showError("Please enter a valid image URL starting with http:// or https://")
      return
    }

    if (newItem.source_url && !validateUrl(newItem.source_url)) {
      showError("Please enter a valid source URL starting with http:// or https://")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([
          {
            title: newItem.title.trim(),
            description: newItem.description.trim() || null,
            image_url: newItem.image_url.trim(),
            source_url: newItem.source_url.trim() || null
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        setGallery([data[0], ...gallery])
        setNewItem({ title: "", description: "", image_url: "", source_url: "" })
        showSuccess("Gallery item added successfully!")
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to add gallery item')
      console.error('Error adding gallery item:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error

      setGallery(gallery.filter((item) => item.id !== id))
      showSuccess("Gallery item deleted successfully!")
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete item')
      console.error('Error deleting gallery item:', err)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setEditForm({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url,
      source_url: item.source_url || ""
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleUpdateItem = async (id: string) => {
    if (!editForm.title || !editForm.image_url) {
      showError("Title and image URL are required")
      return
    }

    if (!validateUrl(editForm.image_url)) {
      showError("Please enter a valid image URL")
      return
    }

    if (editForm.source_url && !validateUrl(editForm.source_url)) {
      showError("Please enter a valid source URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('gallery')
        .update({
          title: editForm.title!.trim(),
          description: editForm.description?.trim() || null,
          image_url: editForm.image_url!.trim(),
          source_url: editForm.source_url?.trim() || null
        })
        .eq('id', id)
        .select()

      if (error) throw error

      if (data) {
        setGallery(gallery.map((item) => item.id === id ? data[0] : item))
        setEditingId(null)
        setEditForm({})
        showSuccess("Gallery item updated successfully!")
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update item')
      console.error('Error updating gallery item:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">📸 Manage Gallery</h2>
        <p className="text-foreground/60">Add, edit, or remove images from your gallery</p>
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

      {/* Add New Item Form */}
      <Card className="p-6 bg-card border-border mb-8 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="text-accent" size={24} />
          <h3 className="text-xl font-bold">Add New Gallery Item</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Epic Gaming Moment"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="bg-input border-border"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Add a description for this image..."
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="bg-input border-border min-h-[80px]"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Image URL <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              className="bg-input border-border"
              disabled={loading}
              type="url"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-1 block">
              Source URL (Optional)
            </label>
            <Input
              placeholder="https://source-link.com"
              value={newItem.source_url}
              onChange={(e) => setNewItem({ ...newItem, source_url: e.target.value })}
              className="bg-input border-border"
              disabled={loading}
              type="url"
            />
          </div>

          <Button 
            onClick={handleAddItem} 
            className="bg-primary hover:bg-primary/90 w-full"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <><Plus size={20} className="mr-2" /> Add to Gallery</>
            )}
          </Button>
        </div>
      </Card>

      {/* Gallery Items */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Gallery Items ({gallery.length})</h3>
      </div>

      {loading && gallery.length === 0 ? (
        <Card className="p-12 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-4 text-muted-foreground">Loading gallery items...</p>
        </Card>
      ) : gallery.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">No Gallery Items Yet</h3>
          <p className="text-muted-foreground">Add your first image using the form above.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => {
            const isEditing = editingId === item.id

            return (
              <Card key={item.id} className="overflow-hidden bg-card border-border flex flex-col hover:border-accent/50 transition-all">
                {isEditing ? (
                  // Edit Mode
                  <div className="p-4 space-y-3">
                    <Input
                      placeholder="Title"
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="bg-input border-border"
                      disabled={loading}
                    />
                    <Textarea
                      placeholder="Description"
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="bg-input border-border min-h-[60px]"
                      disabled={loading}
                    />
                    <Input
                      placeholder="Image URL"
                      value={editForm.image_url || ""}
                      onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                      className="bg-input border-border"
                      disabled={loading}
                    />
                    <Input
                      placeholder="Source URL"
                      value={editForm.source_url || ""}
                      onChange={(e) => setEditForm({ ...editForm, source_url: e.target.value })}
                      className="bg-input border-border"
                      disabled={loading}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateItem(item.id)}
                        className="bg-primary hover:bg-primary/90 flex-1"
                        size="sm"
                        disabled={loading}
                      >
                        <Save size={14} className="mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="relative h-48 bg-muted/50 group">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold mb-1 line-clamp-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline mb-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Source →
                        </a>
                      )}
                      <div className="mt-auto space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Added {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-accent/50 hover:bg-accent/10"
                            onClick={() => startEdit(item)}
                            disabled={loading}
                          >
                            <Edit2 size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            disabled={loading}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}