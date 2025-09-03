import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  MessageCircle, 
  Calendar,
  Settings,
  User,
  ChevronLeft,
  Scale,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    exact: true 
  },
  { 
    title: "CRM", 
    url: "/crm", 
    icon: Users 
  },
  { 
    title: "Clientes", 
    url: "/clientes", 
    icon: UserCheck 
  },
  { 
    title: "Advogados", 
    url: "/advogados", 
    icon: Briefcase 
  },
  { 
    title: "Atendimentos", 
    url: "/atendimentos", 
  icon: MessageCircle
  },
  { 
    title: "Agenda", 
    url: "/agenda", 
    icon: Calendar 
  },
  { 
    title: "Configurações", 
    url: "/configuracoes", 
    icon: Settings 
  },
  { 
    title: "Perfil", 
    url: "/perfil", 
    icon: User 
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  
  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-primary">JuriPlus</h1>
          </div>
        )}
        {collapsed && (
          <Scale className="h-8 w-8 text-primary mx-auto" />
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isItemActive = isActive(item.url, item.exact)
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isItemActive && "bg-primary text-primary-foreground shadow-glow",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
              {!collapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Info (bottom) */}
      {!collapsed && (
        <div className="p-4 flex-shrink-0">
          <div className="bg-accent rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Dr. João Silva
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Advogado
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}