import { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  Users,
  Calendar,
  AlertCircle,
  Gift,
  Shield,
  Building,
  BarChart3,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import templeHero from "@/assets/temple-hero.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchRealtimeMetrics } from "@/lib/api";

export default function Dashboard() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const { data: metrics } = useQuery({
    queryKey: ["realtime-metrics"],
    queryFn: ({ signal }) => fetchRealtimeMetrics(signal),
    refetchInterval: 10000,
  });

  const stats = [
    {
      title: "Active Pilgrims",
      value: metrics ? metrics.active_pilgrims.toLocaleString() : "–",
      change: metrics ? "Live" : "Waiting...",
      changeType: "positive" as const,
      icon: <Users className="w-5 h-5 animate-pulse text-gold-400" />,
      description: "Currently in temple",
      variant: "sacred" as const,
    },
    {
      title: "Today's Offerings",
      value: metrics ? `₹${metrics.todays_offerings_inr.toLocaleString()}` : "–",
      change: metrics ? "Updating" : "Waiting...",
      changeType: "positive" as const,
      icon: <Gift className="w-5 h-5 animate-bounce text-gold-400" />,
      description: "Donations received",
      variant: "gold" as const,
    },
    {
      title: "Queue Wait Time",
      value: metrics ? `${metrics.queue_wait_time_min} min` : "–",
      change: "Refreshed every 10s",
      changeType: "positive" as const,
      icon: <Users className="w-5 h-5" />,
      description: "Average wait time",
    },
    {
      title: "Events Today",
      value: metrics ? `${metrics.events_today}` : "–",
      change: "Schedule",
      changeType: "neutral" as const,
      icon: <Calendar className="w-5 h-5" />,
      description: "Sacred ceremonies",
    },
  ];

  const recentAlerts = [
    { id: 1, type: "warning", message: "High crowd density in main hall", time: "5 min ago" },
    { id: 2, type: "info", message: "Evening aarti preparations started", time: "15 min ago" },
    { id: 3, type: "success", message: "Parking lot B is now available", time: "30 min ago" },
    { id: 4, type: "warning", message: "Queue limit approaching for darshan", time: "1 hour ago" },
  ];

  const upcomingEvents = [
    { id: 1, name: "Evening Aarti", time: "18:30", participants: 500 },
    { id: 2, name: "Bhajan Session", time: "19:30", participants: 150 },
    { id: 3, name: "Prasadam Distribution", time: "20:00", participants: 800 },
  ];

  return (
    <div className="space-y-8 bg-gradient-temple-pattern min-h-screen relative overflow-hidden font-poppins">
      {/* Floating glowing diyas */}
      <motion.div
        className="absolute top-10 left-10 w-6 h-6 bg-yellow-400 rounded-full shadow-sacred animate-flicker"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <motion.div
        className="absolute top-32 right-20 w-4 h-4 bg-orange-400 rounded-full shadow-sacred animate-flicker"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-52 rounded-xl overflow-hidden sacred-glow shadow-sacred"
      >
        <img
          src={templeHero}
          alt="Sacred Temple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/40 flex flex-col justify-center p-8">
          <h1 className="font-teko text-4xl font-bold text-primary-foreground mb-2">
            Temple Dashboard
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Divine management for spiritual harmony
          </p>
          <p className="text-sm mt-2 text-primary-foreground/75">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        data-aos="fade-up"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <Card
          className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-gold-400 border-2 hover:shadow-sacred transition-all duration-300"
          data-aos="fade-right"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-teko text-xl text-gold-400">
              <AlertCircle className="w-5 h-5" />
              Recent Alerts & Activities
            </CardTitle>
            <CardDescription>
              Live monitoring of temple activities and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 shadow-inner transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        alert.type === "warning"
                          ? "destructive"
                          : alert.type === "success"
                            ? "default"
                            : "secondary"
                      }
                      className="w-2 h-2 p-0 rounded-full"
                    />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 hover:shadow-sacred transition-shadow duration-300">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card
          className="bg-card/80 backdrop-blur-sm border-gold-400 border-2 hover:shadow-sacred transition-all duration-300"
          data-aos="fade-left"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-teko text-xl text-gold-400">
              <Calendar className="w-5 h-5" />
              Today's Events
            </CardTitle>
            <CardDescription>
              Sacred ceremonies and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="p-3 rounded-lg bg-background/50 hover:bg-background/80 shadow-inner transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{event.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.participants} expected
                  </p>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 hover:shadow-sacred transition-shadow duration-300">
              View Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card
        className="bg-card/80 backdrop-blur-sm border-gold-400 border-2 hover:shadow-sacred transition-all duration-300"
        data-aos="zoom-in-up"
      >
        <CardHeader>
          <CardTitle className="font-teko text-xl text-gold-400">Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks for efficient temple management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { to: "/emergency", label: "Emergency", icon: Shield, gradient: true },
              { to: "/temple", label: "Temple Mgmt", icon: Building },
              { to: "/queue", label: "Queue Control", icon: Users },
              { to: "/analytics", label: "Analytics", icon: BarChart3 },
              { to: "/facilities", label: "Offerings", icon: Gift },
              { to: "/reports", label: "Reports", icon: FileText },
            ].map((action, i) => (
              <motion.div
                key={action.to}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Button
                  asChild
                  variant={action.gradient ? "default" : "outline"}
                  className={`h-20 flex-col gap-2 transition-transform duration-200 hover:scale-105 ${
                    action.gradient
                      ? "bg-gradient-primary text-primary-foreground sacred-glow"
                      : "hover:shadow-sacred"
                  }`}
                >
                  <Link to={action.to}>
                    <action.icon className="w-6 h-6" />
                    <span className="text-sm">{action.label}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
