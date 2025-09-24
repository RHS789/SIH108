import { 
  Home, 
  Building, 
  Users, 
  Calendar, 
  BarChart3, 
  MapPin, 
  Settings, 
  Shield, 
  AlertTriangle,
  FileText,
  Clock,
  Star
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, description: "Sacred Overview" },
  { title: "Temple Management", url: "/temple", icon: Building, description: "Sacred Spaces" },
  { title: "Queue & Ticketing", url: "/queue", icon: Clock, description: "Pilgrim Flow" },
  { title: "Analytics & Maps", url: "/analytics", icon: BarChart3, description: "Divine Insights" },
  { title: "Facilities", url: "/facilities", icon: Star, description: "Sacred Services" },
  { title: "Emergency", url: "/emergency", icon: AlertTriangle, description: "Divine Protection" },
  { title: "User Management", url: "/users", icon: Users, description: "Sacred Community" },
  { title: "Reports", url: "/reports", icon: FileText, description: "Sacred Records" },
  { title: "Settings", url: "/settings", icon: Settings, description: "Temple Configuration" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground shadow-sacred font-medium" 
      : "hover:bg-muted/50 text-foreground/80 hover:text-foreground transition-all duration-300";

  return (
    <Sidebar
      className="bg-gradient-temple border-r border-border/50 sacred-glow"
      collapsible="icon"
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F47a089953082494f838dba34d2e2a7ab%2F2702435c005d439faec1b63d0268240f?format=webp&width=800"
            alt="Teerth Bandhu Logo"
            className="w-10 h-10 rounded-lg object-cover sacred-glow"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-teko text-xl font-bold text-primary">
                Teerth Bandhu
              </h1>
              <p className="text-xs text-muted-foreground">Sacred Dashboard</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-teko text-sm uppercase tracking-wider">
            {!collapsed && "Sacred Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg" className="h-12 rounded-lg">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClasses}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
                      {!collapsed && (
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
