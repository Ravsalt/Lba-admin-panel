"use client"

import { useState } from "react"
import Image from "next/image"
import { useData } from "@/lib/data-context"

export function GallerySection() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { events } = useData()

  const selected = events.find((img) => img.id === selectedId)

  return (
    <section id="gallery" className="py-20 px-4 bg-primary/5 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">📸 Gallery</h2>
          <p className="text-foreground/60 text-lg">Moments from our community and events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedId(image.id)}
              className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
            >
              <Image
                src={`/.jpg?height=256&width=400&query=${encodeURIComponent(image.icon)}`}
                alt={image.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-lg">{image.title}</h3>
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
            <Image
              src={`/.jpg?height=600&width=800&query=${encodeURIComponent(selected.icon)}`}
              alt={selected.title}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-2xl"
            >
              ×
            </button>
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{selected.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
