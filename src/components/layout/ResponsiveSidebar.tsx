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
  Menu,
  X,
  Scale,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

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

export function ResponsiveSidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-primary">JuriPlus</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-80 bg-card border-r border-border shadow-lg">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scale className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-bold text-primary">JuriPlus</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const isItemActive = isActive(item.url, item.exact)
                  
                  return (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isItemActive && "bg-primary text-primary-foreground shadow-glow"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  )
                })}
              </nav>

              {/* Mobile User Info */}
              <div className="absolute bottom-4 left-4 right-4">
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
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 hidden lg:block",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
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
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
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
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Info (bottom) */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
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