import { useState } from "react"
import { Outlet } from "react-router-dom"
import { ResponsiveSidebar } from "./ResponsiveSidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isMobile = useIsMobile()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <ResponsiveSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 overflow-auto">
          <div className={`h-full ${isMobile ? 'p-4' : 'p-6'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}