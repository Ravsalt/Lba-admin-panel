"use client"

import { useState, useEffect } from "react"
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

export function GallerySection() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching gallery:', error)
          return
        }

        setGallery(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const selected = gallery.find((img) => img.id === selectedId)

  if (loading) {
    return (
      <section id="gallery" className="py-20 px-4 bg-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-foreground/60">Loading gallery...</p>
        </div>
      </section>
    )
  }

  if (gallery.length === 0) {
    return (
      <section id="gallery" className="py-20 px-4 bg-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">📸 Gallery</h2>
          <p className="text-foreground/60 text-lg">No images available yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 px-4 bg-primary/5 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">📸 Gallery</h2>
          <p className="text-foreground/60 text-lg">Moments from our community and events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedId(image.id)}
              className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
            >
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-lg">{image.title}</h3>
                  {image.description && (
                    <p className="text-white/80 text-sm mt-1 line-clamp-2">{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedId(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[600px]">
              <Image
                src={selected.image_url}
                alt={selected.title}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-2xl"
            >
              ×
            </button>
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{selected.title}</h3>
              {selected.description && (
                <p className="text-white/80 mt-2">{selected.description}</p>
              )}
              {selected.source_url && (
                <a
                  href={selected.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-primary hover:text-primary/80 underline"
                >
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}