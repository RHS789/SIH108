import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  IndianRupee,
  Clock,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Download
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchCrowdForecast } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const visitorTrends = [
    { period: "Today", visitors: 2847, growth: 12, revenue: 142450 },
    { period: "Yesterday", visitors: 2542, growth: 8, revenue: 127100 },
    { period: "This Week", visitors: 18956, growth: 15, revenue: 947800 },
    { period: "This Month", visitors: 76234, growth: 22, revenue: 3811700 }
  ];

  const { data: forecast } = useQuery({
    queryKey: ["crowd-forecast", selectedPeriod],
    queryFn: ({ signal }) => fetchCrowdForecast(48, signal),
    staleTime: 30_000,
  });

  const seasonalData = useMemo(
    () =>
      ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({
        m,
        v: Math.floor(2000 + Math.random() * 5000),
      })),
    []
  );

  const hourlyData = useMemo(
    () => Array.from({ length: 24 }, (_, h) => ({ h: `${h}:00`, v: Math.floor(200 + Math.random() * 900) })),
    []
  );

  const queuePerfData = useMemo(
    () => Array.from({ length: 20 }, (_, i) => ({ t: `D${i + 1}`, v: Math.floor(1500 + Math.random() * 2500) })),
    []
  );

  const dropOffData = useMemo(
    () => [
      { stage: "Arrival", v: Math.floor(95 + Math.random() * 5) },
      { stage: "Queue", v: Math.floor(85 + Math.random() * 10) },
      { stage: "Pre-entry", v: Math.floor(80 + Math.random() * 8) },
      { stage: "Darshan", v: Math.floor(78 + Math.random() * 6) },
    ],
    []
  );

  const revenueTrend = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ m: i + 1, v: Math.floor(200000 + Math.random() * 300000) })),
    []
  );

  const donationData = useMemo(
    () => [
      { src: "Tickets", v: Math.floor(400000 + Math.random() * 200000) },
      { src: "VIP", v: Math.floor(250000 + Math.random() * 150000) },
      { src: "Donations", v: Math.floor(200000 + Math.random() * 200000) },
      { src: "Prasadam", v: Math.floor(80000 + Math.random() * 100000) },
    ],
    []
  );

  const queueMetrics = [
    { metric: "Average Wait Time", value: "18 min", change: "-12%", trend: "down" },
    { metric: "Queue Throughput", value: "247/hr", change: "+8%", trend: "up" },
    { metric: "Drop-off Rate", value: "3.2%", change: "-15%", trend: "down" },
    { metric: "Peak Hour Efficiency", value: "89%", change: "+5%", trend: "up" }
  ];

  const sentimentData = [
    { category: "Overall Experience", positive: 87, negative: 13 },
    { category: "Queue Management", positive: 76, negative: 24 },
    { category: "Facility Cleanliness", positive: 92, negative: 8 },
    { category: "Staff Behavior", positive: 89, negative: 11 },
    { category: "Temple Ambiance", positive: 95, negative: 5 }
  ];

  const revenueData = [
    { source: "Darshan Tickets", amount: 847650, percentage: 45 },
    { source: "VIP Bookings", amount: 423250, percentage: 22 },
    { source: "Donations", amount: 381200, percentage: 20 },
    { source: "Prasadam Sales", amount: 189400, percentage: 10 },
    { source: "Parking Fees", amount: 56900, percentage: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Analytics & Insights</h1>
          <p className="text-muted-foreground">Divine insights and performance analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {visitorTrends.slice(0, 4).map((trend, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-accent">
                  +{trend.growth}%
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">{trend.visitors.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{trend.period} Visitors</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Visitor Trends</TabsTrigger>
          <TabsTrigger value="queue">Queue Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="heatmaps">Crowd Heatmaps</TabsTrigger>
        </TabsList>

        {/* Visitor Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Daily Visitor Trends</CardTitle>
                <CardDescription>Visitor patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {forecast && forecast.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecast.map(p => ({
                        t: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        y: p.predicted_pilgrims,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="t" minTickGap={24} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="y" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Fetching forecast…</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Seasonal Analysis</CardTitle>
                <CardDescription>Festival and seasonal visitor patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={seasonalData}>
                      <defs>
                        <linearGradient id="gradSeason" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="m" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="v" stroke="#22c55e" fillOpacity={1} fill="url(#gradSeason)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Peak Hours Analysis</CardTitle>
              <CardDescription>Hourly visitor distribution throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="h" minTickGap={8} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="v" fill="#3b82f6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue Analytics Tab */}
        <TabsContent value="queue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {queueMetrics.map((metric, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-primary" />
                    <Badge variant={metric.trend === "up" ? "default" : "destructive"}>
                      {metric.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-teko">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Queue Performance Trends</CardTitle>
                <CardDescription>Wait times and throughput over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={queuePerfData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="t" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Drop-off Analysis</CardTitle>
                <CardDescription>Queue abandonment patterns and reasons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dropOffData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="v" fill="#ef4444" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Reports Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Revenue Breakdown</CardTitle>
                <CardDescription>Income sources and distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {revenueData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">₹{item.amount.toLocaleString()}</span>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue growth patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrend}>
                      <defs>
                        <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="m" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="v" stroke="#f59e0b" fillOpacity={1} fill="url(#gradRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Donation Analytics</CardTitle>
              <CardDescription>Offering patterns and donor behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="src" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="v" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Pilgrim Sentiment Analysis</CardTitle>
              <CardDescription>Feedback analysis across different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sentimentData.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{item.category}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-accent" />
                        <span className="text-sm font-semibold">{item.positive}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-semibold">{item.negative}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-accent/80 rounded-full"
                      style={{ width: `${item.positive}%` }}
                    />
                    <div
                      className="bg-destructive rounded-full"
                      style={{ width: `${item.negative}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crowd Heatmaps Tab */}
        <TabsContent value="heatmaps" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Temple Ground Heatmap</CardTitle>
                <CardDescription>Real-time crowd density visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Live crowd density heatmap</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Flow Patterns</CardTitle>
                <CardDescription>Visitor movement and flow analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Visitor flow patterns</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
