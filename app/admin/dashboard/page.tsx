"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { OverviewPage } from "@/components/admin/overview-page"
import { ManageEventsPage } from "@/components/admin/manage-events-page"
import { ManageGalleryPage } from "@/components/admin/manage-gallery-page"
import { ManageTeamPage } from "@/components/admin/manage-team-page"

type AdminPage = "overview" | "events" | "gallery" | "team"

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<AdminPage>("overview")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin")
      }
    }
    setMounted(true)
  }, [router])

  if (!mounted) return null

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

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-8 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
