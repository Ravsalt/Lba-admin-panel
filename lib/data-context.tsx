"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface DataContextType {
  events: any[]
  setEvents: (events: any[]) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<any[]>([])

  return (
    <DataContext.Provider value={{ events, setEvents }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
