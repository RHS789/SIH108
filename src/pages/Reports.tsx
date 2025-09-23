import { useMemo, useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  IndianRupee,
  Clock,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [reportType, setReportType] = useState("all");

  const bookingReports = [
    {
      period: "Today",
      totalBookings: 2847,
      revenue: 142450,
      attendance: 2654,
      cancellations: 193,
      avgTicketPrice: 50
    },
    {
      period: "This Week", 
      totalBookings: 18956,
      revenue: 947800,
      attendance: 17823,
      cancellations: 1133,
      avgTicketPrice: 50
    },
    {
      period: "This Month",
      totalBookings: 76234,
      revenue: 3811700,
      attendance: 71456,
      cancellations: 4778,
      avgTicketPrice: 50
    }
  ];

  const visitorDemographics = [
    { ageGroup: "18-25", percentage: 22, count: 16752 },
    { ageGroup: "26-35", percentage: 28, count: 21365 },
    { ageGroup: "36-50", percentage: 25, count: 19058 },
    { ageGroup: "51-65", percentage: 18, count: 13722 },
    { ageGroup: "65+", percentage: 7, count: 5337 }
  ];

  const queueReports = [
    {
      metric: "Average Wait Time",
      current: "18 min",
      lastPeriod: "22 min",
      trend: "down",
      improvement: "18%"
    },
    {
      metric: "Queue Efficiency",
      current: "89%",
      lastPeriod: "84%",
      trend: "up",
      improvement: "6%"
    },
    {
      metric: "Drop-off Rate",
      current: "3.2%",
      lastPeriod: "4.1%",
      trend: "down",
      improvement: "22%"
    },
    {
      metric: "Throughput Rate",
      current: "247/hr",
      lastPeriod: "228/hr",
      trend: "up",
      improvement: "8%"
    }
  ];

  const incidentReports = [
    {
      type: "Medical Emergency",
      count: 12,
      avgResponseTime: "3.2 min",
      resolved: 12,
      pending: 0
    },
    {
      type: "Crowd Management",
      count: 8,
      avgResponseTime: "1.8 min",
      resolved: 7,
      pending: 1
    },
    {
      type: "Facility Issues",
      count: 15,
      avgResponseTime: "12 min",
      resolved: 13,
      pending: 2
    },
    {
      type: "Security Concerns",
      count: 4,
      avgResponseTime: "2.1 min",
      resolved: 4,
      pending: 0
    }
  ];

  const exportableReports = [
    {
      name: "Daily Booking Summary",
      description: "Comprehensive booking and attendance data",
      lastGenerated: "2 hours ago",
      format: ["PDF", "CSV"]
    },
    {
      name: "Weekly Revenue Report",
      description: "Revenue breakdown by sources and trends",
      lastGenerated: "1 day ago",
      format: ["PDF", "Excel"]
    },
    {
      name: "Queue Performance Analysis",
      description: "Wait times, efficiency, and flow metrics",
      lastGenerated: "3 hours ago",
      format: ["PDF", "CSV"]
    },
    {
      name: "Incident Management Summary", 
      description: "Emergency response and resolution tracking",
      lastGenerated: "5 hours ago",
      format: ["PDF"]
    },
    {
      name: "Visitor Demographics Report",
      description: "Age groups, preferences, and behavior analysis",
      lastGenerated: "1 day ago",
      format: ["PDF", "CSV", "Excel"]
    }
  ];

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-accent" : "text-orange-500";
  };

  const bookingTrendData = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ m: i + 1, bookings: Math.floor(15000 + Math.random() * 20000) })),
    []
  );

  const geoData = useMemo(
    () => [
      { name: "Local", value: Math.floor(40 + Math.random() * 20) },
      { name: "Regional", value: Math.floor(20 + Math.random() * 20) },
      { name: "National", value: Math.floor(10 + Math.random() * 15) },
      { name: "International", value: Math.floor(5 + Math.random() * 10) },
    ],
    []
  );

  const behaviorData = useMemo(
    () => Array.from({ length: 24 }, (_, h) => ({ h: `${h}:00`, dwell: Math.floor(1 + Math.random() * 5) })),
    []
  );

  const waitTimeData = useMemo(
    () => Array.from({ length: 24 }, (_, h) => ({ h: `${h}:00`, min: Math.floor(5 + Math.random() * 30) })),
    []
  );

  const efficiencyData = useMemo(
    () => [
      { k: "Flow", v: Math.floor(70 + Math.random() * 25) },
      { k: "Staff", v: Math.floor(60 + Math.random() * 30) },
      { k: "Infra", v: Math.floor(55 + Math.random() * 35) },
      { k: "Comm", v: Math.floor(65 + Math.random() * 25) },
    ],
    []
  );

  const incidentTimeline = useMemo(
    () => Array.from({ length: 14 }, (_, d) => ({ d: `D${d + 1}`, cnt: Math.floor(Math.random() * 12) })),
    []
  );

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]; 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive temple performance insights and documentation</p>
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
          <Button className="bg-gradient-primary text-primary-foreground sacred-glow">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">47</p>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">76.2K</p>
                <p className="text-sm text-muted-foreground">Monthly Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">₹38.1L</p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">94%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="booking">Booking Reports</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="queue">Queue Performance</TabsTrigger>
          <TabsTrigger value="incidents">Incident Summary</TabsTrigger>
          <TabsTrigger value="export">Export Center</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bookingReports.map((report, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-sacred transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-teko text-xl">{report.period}</CardTitle>
                  <CardDescription>Booking and attendance summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold font-teko text-primary">
                        {report.totalBookings.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold font-teko text-secondary">
                        ₹{(report.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Attendance</p>
                      <p className="text-lg font-semibold">{report.attendance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cancellations</p>
                      <p className="text-lg font-semibold">{report.cancellations}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Attendance Rate</span>
                      <span className="text-sm font-semibold">
                        {((report.attendance / report.totalBookings) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full"
                        style={{ width: `${(report.attendance / report.totalBookings) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Detailed Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Booking Trends</CardTitle>
              <CardDescription>Visual representation of booking patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="m" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Age Demographics</CardTitle>
                <CardDescription>Visitor distribution by age groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {visitorDemographics.map((demo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{demo.ageGroup} years</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{demo.count.toLocaleString()}</span>
                        <Badge variant="secondary">{demo.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full"
                        style={{ width: `${demo.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Geographic Distribution</CardTitle>
                <CardDescription>Visitor origins and travel patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie data={geoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {geoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Visitor Behavior Analysis</CardTitle>
              <CardDescription>Visit patterns, preferences, and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={behaviorData}>
                    <defs>
                      <linearGradient id="gradBeh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="h" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="dwell" stroke="#3b82f6" fillOpacity={1} fill="url(#gradBeh)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {queueReports.map((report, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-primary" />
                    <Badge variant="secondary" className={getTrendColor(report.trend)}>
                      {report.trend === 'up' ? '↗' : '↘'} {report.improvement}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-teko">{report.current}</p>
                    <p className="text-sm text-muted-foreground mb-1">{report.metric}</p>
                    <p className="text-xs text-muted-foreground">
                      Previous: {report.lastPeriod}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Wait Time Trends</CardTitle>
                <CardDescription>Historical queue performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waitTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="h" minTickGap={12} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="min" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Efficiency Metrics</CardTitle>
                <CardDescription>Queue throughput and optimization insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="k" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="v" fill="#10b981" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incidentReports.map((incident, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-teko text-lg">{incident.type}</CardTitle>
                  <CardDescription>Incident summary and response metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Incidents</p>
                      <p className="text-2xl font-bold font-teko text-primary">{incident.count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold font-teko text-secondary">{incident.avgResponseTime}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span>{incident.resolved} Resolved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span>{incident.pending} Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Incident Timeline</CardTitle>
              <CardDescription>Resolution patterns and response time analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incidentTimeline}>
                    <defs>
                      <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="d" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cnt" stroke="#f472b6" fillOpacity={1} fill="url(#gradInc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Export Center</h3>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="booking">Booking Reports</SelectItem>
                <SelectItem value="financial">Financial Reports</SelectItem>
                <SelectItem value="operational">Operational Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {exportableReports.map((report, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{report.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                      <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {report.format.map((format, formatIndex) => (
                          <Badge key={formatIndex} variant="secondary" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                      <Button className="bg-gradient-primary text-primary-foreground">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
