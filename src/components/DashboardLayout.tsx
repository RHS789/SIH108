import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      {/* Base background */}
      <div className="min-h-screen flex w-full bg-black overflow-hidden">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-black/50 backdrop-blur-md border-b border-amber-700/50 px-4 sm:px-6 flex items-center justify-between shadow-2xl">
            {/* Left side: Trigger + Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <SidebarTrigger className="text-amber-200 hover:text-amber-400" />

              <div className="flex flex-col leading-tight">
                <h2 className="font-teko text-lg sm:text-xl font-semibold text-amber-400 leading-none">
                  Sacred Temple Management
                </h2>
                <p className="hidden sm:block text-xs text-amber-200/70 leading-none">
                  Divine administration dashboard
                </p>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-amber-800/40"
              >
                <Bell className="w-5 h-5 text-amber-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Profile */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-amber-800/40"
              >
                <User className="w-5 h-5 text-amber-200" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="bg-amber-800/90 rounded-2xl shadow-2xl p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
