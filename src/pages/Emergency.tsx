import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, MapPin, Users } from "lucide-react";

export default function Emergency() {
  const alerts = [
    {
      id: 1,
      category: "Medical Help",
      location: "Temple Hall",
      time: "2 min ago",
    },
    {
      id: 2,
      category: "Temple Security",
      location: "Near Main Gate",
      time: "8 min ago",
    },
  ];

  const team = [
    { id: 1, name: "Dr. Meera", role: "Doctor", status: "Available" },
    { id: 2, name: "Arjun Singh", role: "Security Guard", status: "Available" },
    { id: 3, name: "Kavya Rao", role: "Coordinator", status: "On Break" },
    { id: 4, name: "Rahul Verma", role: "First Responder", status: "Available" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-teko text-3xl font-bold text-foreground">Emergency Command Center</h1>
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card/80 border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="font-teko text-xl leading-none">2</div>
                <div className="text-xs text-muted-foreground">Active Alerts</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="font-teko text-xl leading-none">1</div>
                <div className="text-xs text-muted-foreground">Resolved Today</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="font-teko text-xl leading-none">40</div>
                <div className="text-xs text-muted-foreground">Avg Response (min)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Alerts */}
        <div className="lg:col-span-9 space-y-3">
          <div className="text-sm font-semibold text-muted-foreground">Active Alerts</div>
          {alerts.map((a) => (
            <Card key={a.id} className="bg-card/70 border-border/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">{a.category}</div>
                    <div className="font-semibold">{a.location}</div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Assign Responder</Button>
                    <Button size="sm" variant="outline">Resolve</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Right: Team */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-muted-foreground">Team</div>
            <Button size="sm" variant="secondary">Manage Teams</Button>
          </div>

          {team.map((m) => (
            <Card key={m.id} className="bg-card/70 border-border/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role}</div>
                </div>
                <Badge variant={m.status === "Available" ? "outline" : "secondary"}>{m.status}</Badge>
              </CardContent>
            </Card>
          ))}

          <Button variant="secondary" className="w-full">
            Export Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
