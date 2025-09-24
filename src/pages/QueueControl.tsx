import { useState } from "react";
import { 
  Users, 
  Clock, 
  Pause, 
  Play, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Bell,
  Activity,
  Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QueueControl() {
  const [queueStatus, setQueueStatus] = useState("active");

  const queueZones = [
    {
      id: 1,
      name: "Main Darshan Queue",
      currentCount: 324,
      maxCapacity: 500,
      avgWaitTime: 23,
      status: "active",
      priority: "high"
    },
    {
      id: 2,
      name: "VIP Queue",
      currentCount: 45,
      maxCapacity: 100,
      avgWaitTime: 8,
      status: "active",
      priority: "vip"
    },
    {
      id: 3,
      name: "Senior Citizens Queue",
      currentCount: 78,
      maxCapacity: 150,
      avgWaitTime: 12,
      status: "active",
      priority: "senior"
    },
    {
      id: 4,
      name: "Special Booking Queue",
      currentCount: 156,
      maxCapacity: 200,
      avgWaitTime: 18,
      status: "paused",
      priority: "special"
    }
  ];

  const tickets = [
    {
      id: "TKT001234",
      pilgrimName: "Rajesh Kumar",
      queueZone: "Main Darshan",
      bookingTime: "09:30 AM",
      status: "valid",
      slotTime: "02:30 PM"
    },
    {
      id: "TKT001235",
      pilgrimName: "Priya Sharma",
      queueZone: "VIP Queue",
      bookingTime: "10:15 AM",
      status: "used",
      slotTime: "01:15 PM"
    },
    {
      id: "TKT001236",
      pilgrimName: "Amit Patel",
      queueZone: "Senior Citizens",
      bookingTime: "08:45 AM",
      status: "expired",
      slotTime: "12:45 PM"
    }
  ];

  const getQueueStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-accent bg-accent/10";
      case "paused": return "text-orange-500 bg-orange-500/10";
      case "locked": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "vip": return "bg-gradient-gold text-primary-foreground";
      case "high": return "bg-gradient-primary text-primary-foreground";
      case "senior": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case "valid": return "text-accent bg-accent/10";
      case "used": return "text-muted-foreground bg-muted/10";
      case "expired": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Queue Control Center</h1>
          <p className="text-muted-foreground">Real-time queue monitoring and pilgrim flow management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
          <Button variant="destructive">
            <Lock className="w-4 h-4 mr-2" />
            Emergency Lockdown
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">603</p>
                <p className="text-sm text-muted-foreground">Total in Queue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">18</p>
                <p className="text-sm text-muted-foreground">Avg Wait (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">247</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">89%</p>
                <p className="text-sm text-muted-foreground">Queue Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">3</p>
                <p className="text-sm text-muted-foreground">Queue Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitor">Queue Monitor</TabsTrigger>
          <TabsTrigger value="controls">Manual Controls</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Verification</TabsTrigger>
          <TabsTrigger value="analytics">Flow Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-4">
          <div className="space-y-4">
            {queueZones.map((zone) => (
              <Card key={zone.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-sacred transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-teko text-xl font-semibold">{zone.name}</h3>
                      <Badge className={getPriorityColor(zone.priority)}>
                        {zone.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getQueueStatusColor(zone.status)}>
                        {zone.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                      <Button size="sm" variant="outline">
                        {zone.status === 'paused' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Queue Capacity</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{zone.currentCount} people</span>
                          <span>{zone.maxCapacity} max</span>
                        </div>
                        <Progress value={(zone.currentCount / zone.maxCapacity) * 100} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Average Wait Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold font-teko">{zone.avgWaitTime}</span>
                        <span className="text-muted-foreground">minutes</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Queue Flow</p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="text-lg font-semibold">
                          {Math.floor(Math.random() * 30) + 40}/hour
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Next Slot</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span className="font-semibold">
                          {Math.floor(Math.random() * 10) + 2} min
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-lg">Queue Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Queue Zone</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose queue" />
                    </SelectTrigger>
                    <SelectContent>
                      {queueZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Lock
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-lg">Slot Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-primary text-primary-foreground">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Release Next Batch
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Manual Slot Assignment
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Adjust Time Slots
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-primary text-primary-foreground">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Queue Update
                </Button>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delay Notification
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Crowd Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Ticket Verification Dashboard</h3>
            <Button className="bg-gradient-primary text-primary-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Bulk Verify
            </Button>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold">{ticket.id}</span>
                        <Badge className={getTicketStatusColor(ticket.status)}>
                          {ticket.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Pilgrim Name</p>
                          <p className="font-semibold">{ticket.pilgrimName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Queue Zone</p>
                          <p className="font-semibold">{ticket.queueZone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Booking Time</p>
                          <p className="font-semibold">{ticket.bookingTime}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Slot Time</p>
                          <p className="font-semibold">{ticket.slotTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                        Re-issue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Crowd Density Heatmap</CardTitle>
                <CardDescription>Visual representation of queue congestion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Crowd density visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
