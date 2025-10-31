"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { OverviewPage } from "@/components/admin/overview-page"
import { ManageEventsPage } from "@/components/admin/manage-events-page"
import { ManageGalleryPage } from "@/components/admin/manage-gallery-page"
import { ManageTeamPage } from "@/components/admin/manage-team-page"
import { isAuthenticated } from "@/lib/session"
import { useRouter } from "next/navigation"

type AdminPage = "overview" | "events" | "gallery" | "team"

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [currentPage, setCurrentPage] = useState<AdminPage>("overview")
  const router = useRouter()

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle authentication and redirect if needed
  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push("/admin")
    }
  }, [isClient, router])

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewPage />
      case "events":
        return <ManageEventsPage />
      case "gallery":
        return <ManageGalleryPage />
      case "team":
        return <ManageTeamPage />
      default:
        return <OverviewPage />
    }
  }

  // Show loading state during initial render and auth check
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  // Only render the dashboard if authenticated
  if (!isAuthenticated()) {
    return null // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-8 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
