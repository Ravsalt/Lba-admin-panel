export type Event = {
  id: string
  icon: string
  name: string
  description: string
  image_url: string | null
  created_at: string
}

export type Gallery = {
  id: string
  title: string
  description: string | null
  image_url: string
  source_url: string | null
  created_at: string
}

export type Team = {
  id: string
  name: string
  title: string
  emoji: string
  image_url: string | null
  created_at: string
}
