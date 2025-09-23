import { useState } from "react";
import { 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  Users, 
  Download,
  CheckCircle,
  XCircle,
  Phone,
  Radio
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Emergency() {
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const emergencyAlerts = [
    {
      id: 1,
      title: "Medical Emergency - Main Hall",
      severity: "critical",
      status: "in-progress",
      location: "Main Darshan Hall, Section A",
      timestamp: "2 min ago",
      responder: "Dr. Sharma",
      description: "Elderly devotee collapsed during evening aarti"
    },
    {
      id: 2,
      title: "Crowd Pressure - Entry Gate",
      severity: "high",
      status: "acknowledged",
      location: "Main Entry Gate",
      timestamp: "8 min ago",
      responder: "Security Team Alpha",
      description: "High crowd density at main entrance"
    },
    {
      id: 3,
      title: "Lost Child Alert",
      severity: "medium",
      status: "resolved",
      location: "Temple Complex",
      timestamp: "1 hour ago",
      responder: "Volunteer Coordinator",
      description: "Child reunited with family safely"
    }
  ];

  const sosRequests = [
    {
      id: 1,
      caller: "Devotee #2847",
      location: "Parking Area B",
      timestamp: "3 min ago",
      status: "active",
      issue: "Vehicle breakdown assistance needed"
    },
    {
      id: 2,
      caller: "Staff Member",
      location: "Kitchen Area",
      timestamp: "12 min ago",
      status: "resolved",
      issue: "Equipment malfunction resolved"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "text-accent";
      case "in-progress": return "text-orange-500";
      case "acknowledged": return "text-blue-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Emergency Management</h1>
          <p className="text-muted-foreground">Divine protection and incident response system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button className="bg-gradient-primary text-primary-foreground sacred-glow">
            <Shield className="w-4 h-4 mr-2" />
            Emergency Protocol
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">3</p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
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
                <p className="text-2xl font-bold font-teko">127</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">15</p>
                <p className="text-sm text-muted-foreground">Response Team</p>
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
                <p className="text-2xl font-bold font-teko">2.3</p>
                <p className="text-sm text-muted-foreground">Avg Response (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="sos">SOS Management</TabsTrigger>
          <TabsTrigger value="map">Incident Map</TabsTrigger>
          <TabsTrigger value="responders">Response Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Emergency Alerts</h3>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {emergencyAlerts.map((alert) => (
              <Card key={alert.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-sacred transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {alert.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {alert.responder}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">SOS Management</h3>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Phone className="w-4 h-4 mr-2" />
              Broadcast Alert
            </Button>
          </div>

          <div className="space-y-4">
            {sosRequests.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={request.status === 'active' ? 'destructive' : 'default'}>
                          {request.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{request.timestamp}</span>
                      </div>
                      <h4 className="font-semibold">{request.caller}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{request.issue}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4" />
                        {request.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Radio className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                        Assign Responder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Interactive Incident Map</CardTitle>
              <CardDescription>Real-time visualization of emergency locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map showing incident locations</p>
                  <p className="text-sm text-muted-foreground mt-2">Real-time emergency tracking and responder deployment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Response Teams</h3>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Assign Team
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Medical Team Alpha", "Security Team Beta", "Fire Safety Team", "Volunteer Coordinators", "Technical Support", "Communication Team"].map((team, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{team}</h4>
                    <Badge variant="outline" className="text-accent">Available</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Members:</span>
                      <span>{Math.floor(Math.random() * 8) + 3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>Zone {String.fromCharCode(65 + index)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-accent">Ready</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Deploy Team
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}