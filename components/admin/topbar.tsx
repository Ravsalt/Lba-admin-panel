"use client"

export function AdminTopbar() {
  return (
    <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <div className="text-foreground/60 text-sm">Logged in as: admin@lba.com</div>
    </div>
  )
}
