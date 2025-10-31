"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Calendar, Image, Activity, RefreshCw, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

// Types
type ActivityType = 'team' | 'event' | 'gallery'

interface ActivityItem {
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

interface DashboardStats {
  teamCount: number
  eventCount: number
  galleryCount: number
  recentActivity: ActivityItem[]
}

interface StatCardProps {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: keyof typeof CARD_COLORS
  value: number | string
  isLoading?: boolean
}

// Constants
const STATS: Omit<StatCardProps, 'value' | 'isLoading'>[] = [
  { id: 'team', label: 'Team Members', icon: Users, color: 'blue' },
  { id: 'event', label: 'Events', icon: Calendar, color: 'green' },
  { id: 'gallery', label: 'Gallery Items', icon: Image, color: 'purple' },
  { id: 'activity', label: 'Recent Activity', icon: Activity, color: 'amber' }
]

const CARD_COLORS = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hover: 'hover:bg-blue-500/20' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500', hover: 'hover:bg-green-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', hover: 'hover:bg-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', hover: 'hover:bg-amber-500/20' }
} as const

// API Service
const fetchDashboardData = async (): Promise<DashboardStats> => {
  try {
    const [
      { count: teamCount, error: teamError },
      { count: eventCount, error: eventError },
      { count: galleryCount, error: galleryError },
      { data: recentTeam },
      { data: recentEvents },
      { data: recentGallery }
    ] = await Promise.all([
      supabase.from('team').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('team')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      supabase.from('events')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      supabase.from('gallery')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
    ])

    // Handle errors
    const errors = [teamError, eventError, galleryError].filter(Boolean)
    if (errors.length > 0) {
      console.error('Database errors:', errors)
      throw new Error('Failed to fetch dashboard data. Please check your connection and try again.')
    }

    // Format activity
    const activity: ActivityItem[] = []
    
    if (recentTeam?.name) {
      activity.push({
        type: 'team',
        title: 'New Team Member',
        description: `${recentTeam.name} joined the team`,
        timestamp: recentTeam.created_at
      })
    }
    
    if (recentEvents?.name) {
      activity.push({
        type: 'event',
        title: 'New Event',
        description: `${recentEvents.name} was created`,
        timestamp: recentEvents.created_at
      })
    }
    
    if (recentGallery?.title) {
      activity.push({
        type: 'gallery',
        title: 'Gallery Update',
        description: `Added "${recentGallery.title}" to gallery`,
        timestamp: recentGallery.created_at
      })
    }

    // Sort by most recent
    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      teamCount: teamCount || 0,
      eventCount: eventCount || 0,
      galleryCount: galleryCount || 0,
      recentActivity: activity
    }
  } catch (error) {
    console.error('Error in fetchDashboardData:', error)
    throw error
  }
}

// Components
const StatCard = ({ id, label, icon: Icon, color, value, isLoading = false }: StatCardProps) => {
  const colors = CARD_COLORS[color]
  
  return (
    <Card className="p-6 bg-card/50 hover:bg-card/80 transition-colors h-full">
      <div className="flex items-center justify-between h-full">
        <div className="space-y-1">
          <p className="text-foreground/60 text-sm font-medium">{label}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
        <div 
          className={`p-3 rounded-lg ${colors.bg} ${colors.hover} transition-colors`}
          aria-hidden="true"
        >
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>
    </Card>
  )
}

const ActivityItem = ({ activity }: { activity: ActivityItem }) => {
  const { icon: Icon, color } = {
    team: { icon: Users, color: 'blue' as const },
    event: { icon: Calendar, color: 'green' as const },
    gallery: { icon: Image, color: 'purple' as const }
  }[activity.type]
  
  const colors = CARD_COLORS[color]

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors group">
      <div className={`p-2 rounded-lg ${colors.bg} group-hover:${colors.hover} transition-colors mt-0.5`}>
        <Icon className={`w-4 h-4 ${colors.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{activity.title}</p>
        <p className="text-sm text-foreground/60 truncate" title={activity.description}>
          {activity.description}
        </p>
      </div>
      <span 
        className="text-xs text-foreground/40 whitespace-nowrap ml-2"
        title={new Date(activity.timestamp).toLocaleString()}
      >
        {formatTimeAgo(activity.timestamp)}
      </span>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-96 rounded-lg" />
  </div>
)

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
    <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full mb-4">
      <AlertCircle className="w-8 h-8 text-rose-500" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
    <p className="text-foreground/60 mb-6 max-w-md">{error}</p>
    <Button 
      onClick={onRetry}
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </Button>
  </div>
)

// Utility
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats>({
    teamCount: 0,
    eventCount: 0,
    galleryCount: 0,
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(async (showLoading = true) => {
    try {
      setError(null)
      if (showLoading) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }
      
      const data = await fetchDashboardData()
      setStats(data)
      setLastUpdated(new Date())
      
      if (!showLoading) {
        toast.success('Dashboard updated')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false)
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [loadData])

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={() => loadData()} />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-foreground/60 text-sm">
            {lastUpdated ? (
              <>
                Last updated <span className="font-medium">{formatTimeAgo(lastUpdated.toISOString())}</span>
                {isRefreshing && <span className="ml-2">Updating...</span>}
              </>
            ) : 'Loading...'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => loadData(false)}
          disabled={isRefreshing}
          className="gap-2 min-w-24"
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          {...STATS[0]} 
          value={stats.teamCount}
          isLoading={isRefreshing}
        />
        <StatCard 
          {...STATS[1]} 
          value={stats.eventCount}
          isLoading={isRefreshing}
        />
        <StatCard 
          {...STATS[2]} 
          value={stats.galleryCount}
          isLoading={isRefreshing}
        />
        <StatCard 
          {...STATS[3]} 
          value={stats.recentActivity.length}
          isLoading={isRefreshing}
        />
      </div>

      {/* Recent Activity */}
      <Card className="overflow-hidden border-border/50">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => loadData(false)}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-2">
            {isRefreshing ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : stats.recentActivity.length > 0 ? (
              <div className="divide-y divide-border/50">
                {stats.recentActivity.slice(0, 5).map((activity, i) => (
                  <ActivityItem key={`${activity.type}-${i}`} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-foreground/60">
                <Activity className="mx-auto h-10 w-10 text-foreground/20 mb-3" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm mt-1">New activities will appear here</p>
              </div>
            )}
          </div>
        </div>
        
        {stats.recentActivity.length > 0 && (
          <div className="px-6 py-3 bg-accent/5 border-t border-border/30 text-sm text-foreground/60 flex justify-between items-center">
            <span>
              Showing {Math.min(stats.recentActivity.length, 5)} of {stats.recentActivity.length} activities
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-foreground/60 hover:text-foreground/80"
              onClick={() => {}}
            >
              View All
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
