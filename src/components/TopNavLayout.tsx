import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building,
  Users,
  BarChart3,
  Star,
  AlertTriangle,
  FileText,
  Settings,
  Bell,
  User,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

interface TopNavLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Temple", url: "/temple", icon: Building },
  { title: "Queue", url: "/queue", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Facilities", url: "/facilities", icon: Star },
  { title: "Emergency", url: "/emergency", icon: AlertTriangle },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function TopNavLayout({ children }: TopNavLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-gradient-temple">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sacred-glow sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F47a089953082494f838dba34d2e2a7ab%2F2702435c005d439faec1b63d0268240f?format=webp&width=800"
                alt="Teerth Bandhu Logo"
                className="w-10 h-10 rounded-lg object-cover sacred-glow hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <h1 className="font-teko text-lg sm:text-xl font-bold text-primary leading-none whitespace-nowrap">
                  Teerth Bandhu
                </h1>
              </div>
            </motion.div>

            {/* Middle: Navigation (centered) */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:flex flex-1 items-center justify-center gap-6"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.url)
                      ? "bg-gradient-primary text-primary-foreground shadow-sacred"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sacred hover:scale-105"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </motion.nav>

            {/* Right: Actions */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 sm:gap-3 ml-auto"
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted/50 hover:scale-110 transition-transform duration-300"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50 hover:scale-110 transition-transform duration-300"
              >
                <User className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content with AOS animations */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div data-aos="fade-up">{children}</div>
      </main>
    </div>
  );
}
