import { useState } from "react";
import { 
  Star, 
  Users, 
  Wrench, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Edit,
  MapPin,
  Clock,
  Phone,
  Clipboard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Facilities() {
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  const facilities = [
    {
      id: 1,
      name: "Main Restroom Complex",
      type: "restroom",
      location: "East Wing, Ground Floor",
      status: "operational",
      capacity: 50,
      currentUsage: 32,
      assignedStaff: ["Cleaner A", "Cleaner B"],
      lastMaintenance: "2 days ago",
      nextMaintenance: "Next week"
    },
    {
      id: 2,
      name: "Medical Station",
      type: "medical",
      location: "Central Hall",
      status: "operational",
      capacity: 10,
      currentUsage: 2,
      assignedStaff: ["Dr. Sharma", "Nurse Priya"],
      lastMaintenance: "1 week ago",
      nextMaintenance: "3 days"
    },
    {
      id: 3,
      name: "Water Distribution Point A",
      type: "water",
      location: "North Courtyard",
      status: "maintenance",
      capacity: 100,
      currentUsage: 0,
      assignedStaff: ["Technician Raj"],
      lastMaintenance: "Today",
      nextMaintenance: "Tomorrow"
    },
    {
      id: 4,
      name: "Information Kiosk",
      type: "information",
      location: "Main Entrance",
      status: "operational",
      capacity: 5,
      currentUsage: 3,
      assignedStaff: ["Volunteer Coordinator"],
      lastMaintenance: "3 days ago",
      nextMaintenance: "1 week"
    }
  ];

  const staffMembers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Facility Manager",
      assignment: "Overall supervision",
      contact: "+91 98765 43210",
      status: "available"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Medical Staff",
      assignment: "Medical Station",
      contact: "+91 98765 43211",
      status: "on-duty"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Maintenance Tech",
      assignment: "Water Systems",
      contact: "+91 98765 43212",
      status: "maintenance"
    },
    {
      id: 4,
      name: "Sunita Devi",
      role: "Cleaner",
      assignment: "Restroom Complex",
      contact: "+91 98765 43213",
      status: "available"
    }
  ];

  const serviceRequests = [
    {
      id: 1,
      facility: "Main Restroom Complex",
      issue: "Blocked drain in section B",
      priority: "high",
      reportedBy: "Cleaning Staff",
      reportedAt: "2 hours ago",
      status: "in-progress",
      assignedTo: "Maintenance Team"
    },
    {
      id: 2,
      facility: "Water Distribution Point B",
      issue: "Low water pressure",
      priority: "medium",
      reportedBy: "Volunteer",
      reportedAt: "4 hours ago",
      status: "assigned",
      assignedTo: "Technician Raj"
    },
    {
      id: 3,
      facility: "Medical Station",
      issue: "First aid supplies running low",
      priority: "low",
      reportedBy: "Dr. Sharma",
      reportedAt: "1 day ago",
      status: "completed",
      assignedTo: "Purchase Department"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-accent bg-accent/10";
      case "maintenance": return "text-orange-500 bg-orange-500/10";
      case "out-of-service": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getStaffStatusColor = (status: string) => {
    switch (status) {
      case "available": return "text-accent bg-accent/10";
      case "on-duty": return "text-primary bg-primary/10";
      case "maintenance": return "text-orange-500 bg-orange-500/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-accent bg-accent/10";
      case "in-progress": return "text-primary bg-primary/10";
      case "assigned": return "text-orange-500 bg-orange-500/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "medical": return <Star className="w-5 h-5" />;
      case "water": return <Wrench className="w-5 h-5" />;
      case "restroom": return <MapPin className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Facilities & Services</h1>
          <p className="text-muted-foreground">Sacred facility management and service coordination</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground sacred-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Facility
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">12</p>
                <p className="text-sm text-muted-foreground">Total Facilities</p>
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
                <p className="text-2xl font-bold font-teko">9</p>
                <p className="text-sm text-muted-foreground">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">24</p>
                <p className="text-sm text-muted-foreground">Staff Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">3</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="facilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="staff">Staff Assignment</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Card key={facility.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-sacred transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getFacilityIcon(facility.type)}
                      </div>
                      <div>
                        <CardTitle className="font-teko text-lg">{facility.name}</CardTitle>
                        <CardDescription className="text-xs">{facility.type}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(facility.status)}>
                      {facility.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{facility.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{facility.capacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">In Use</p>
                      <p className="font-semibold">{facility.currentUsage}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm mb-2">Assigned Staff</p>
                    <div className="flex flex-wrap gap-1">
                      {facility.assignedStaff.map((staff, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {staff}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Last Maintenance</p>
                      <p>{facility.lastMaintenance}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Due</p>
                      <p>{facility.nextMaintenance}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground">
                      <Wrench className="w-4 h-4 mr-2" />
                      Maintain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Staff Assignment</h3>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Assign Staff
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffMembers.map((staff) => (
              <Card key={staff.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{staff.name}</h4>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                    <Badge className={getStaffStatusColor(staff.status)}>
                      {staff.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assignment:</span>
                      <span className="font-medium">{staff.assignment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="font-medium">{staff.contact}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground">
                      <Edit className="w-4 h-4 mr-2" />
                      Reassign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Maintenance Schedule</CardTitle>
              <CardDescription>Facility maintenance tracking and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getFacilityIcon(facility.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{facility.name}</h4>
                        <p className="text-sm text-muted-foreground">{facility.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Maintenance</p>
                        <p className="font-medium">{facility.lastMaintenance}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-medium">{facility.nextMaintenance}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Service Requests</h3>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Clipboard className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>

          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getRequestStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{request.reportedAt}</span>
                      </div>
                      
                      <h4 className="font-semibold text-lg mb-1">{request.facility}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{request.issue}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Reported By</p>
                          <p className="font-medium">{request.reportedBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Assigned To</p>
                          <p className="font-medium">{request.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium">{request.status}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
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
      </Tabs>
    </div>
  );
}