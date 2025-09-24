import { useState } from "react";
import { 
  Building, Plus, Edit, MapPin, Clock, Calendar, Image, Settings, Users, IndianRupee 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { predictSimpleCrowd } from "@/lib/api";

export default function TempleManagement() {
  const [selectedTemple, setSelectedTemple] = useState<string | null>(null);

  const [mlDay, setMlDay] = useState("Monday");
  const [mlFestival, setMlFestival] = useState<string | null>("No");
  const [mlWeather, setMlWeather] = useState("Sunny");
  const [mlResult, setMlResult] = useState<number | null>(null);
  const [mlLoading, setMlLoading] = useState(false);

  const temples = [
    {
      id: 1,
      name: "Main Sanctum",
      location: "Central Complex",
      status: "active",
      dailyVisitors: 2847,
      queueLimit: 500,
      slotDuration: 15,
      pricing: "₹50",
      facilities: ["Parking", "Restrooms", "Medical Aid"],
      timings: "5:00 AM - 10:00 PM"
    },
    {
      id: 2,
      name: "Meditation Hall",
      location: "East Wing",
      status: "active",
      dailyVisitors: 456,
      queueLimit: 100,
      slotDuration: 30,
      pricing: "Free",
      facilities: ["AC", "Sound System"],
      timings: "6:00 AM - 8:00 PM"
    },
    {
      id: 3,
      name: "Prayer Garden",
      location: "North Courtyard",
      status: "maintenance",
      dailyVisitors: 234,
      queueLimit: 200,
      slotDuration: 20,
      pricing: "₹25",
      facilities: ["Garden", "Fountain"],
      timings: "5:30 AM - 9:00 PM"
    }
  ];

  const specialDates = [
    { date: "Dec 25, 2024", event: "Christmas Festival", type: "festival" },
    { date: "Jan 1, 2025", event: "New Year Celebration", type: "holiday" },
    { date: "Jan 15, 2025", event: "Maintenance Day", type: "blackout" },
    { date: "Feb 14, 2025", event: "Vasant Panchami", type: "festival" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-600 bg-emerald-100";
      case "maintenance": return "text-orange-600 bg-orange-100";
      case "closed": return "text-red-600 bg-red-100";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "festival": return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white";
      case "holiday": return "bg-blue-400 text-white";
      case "blackout": return "bg-red-400 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gradient-to-b from-primary/5 to-primary/10 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Temple Management</h1>
          <p className="text-muted-foreground">Sacred space administration & configuration</p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sacred hover:scale-105 transition-transform">
          <Plus className="w-4 h-4 mr-2" />
          Add Temple
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border border-gold-300 shadow-sacred">
        <CardHeader>
          <CardTitle className="font-teko text-xl">Crowd Prediction</CardTitle>
          <CardDescription>Predict by Day, Festival and Weather using the provided ML model</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <Label>Day</Label>
            <Select value={mlDay} onValueChange={setMlDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
                ].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Festival</Label>
            <Select value={mlFestival ?? "No"} onValueChange={(v) => setMlFestival(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select festival" />
              </SelectTrigger>
              <SelectContent>
                {["No","Diwali","Dussehra","Ugadi","Makar Sankranti","Ganesh Chaturthi","Holi"].map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1">
            <Label>Weather</Label>
            <Select value={mlWeather} onValueChange={setMlWeather}>
              <SelectTrigger>
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent>
                {["Sunny","Cloudy","Rainy","Windy"].map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
              disabled={mlLoading}
              onClick={async () => {
                try {
                  setMlLoading(true);
                  setMlResult(null);
                  const res = await predictSimpleCrowd({ day: mlDay, festival: mlFestival, weather: mlWeather });
                  setMlResult(res.predicted_crowd);
                } catch (e) {
                  setMlResult(null);
                } finally {
                  setMlLoading(false);
                }
              }}
            >
              {mlLoading ? "Predicting..." : "Predict"}
            </Button>
          </div>

          <div className="md:col-span-5">
            {mlResult !== null && (
              <div className="text-lg font-teko">
                Predicted Crowd: <span className="font-bold">{Math.round(mlResult * 1.8).toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="temples" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card rounded-lg shadow-inner">
          <TabsTrigger value="temples">Temples</TabsTrigger>
          <TabsTrigger value="add-edit">Add/Edit</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="calendar">Special Dates</TabsTrigger>
        </TabsList>

        {/* Temples Tab */}
        <TabsContent value="temples" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {temples.map((temple) => (
              <motion.div 
                key={temple.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-card/80 backdrop-blur-sm border border-gold-300 hover:shadow-sacred transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-teko text-xl">{temple.name}</CardTitle>
                      <Badge className={`${getStatusColor(temple.status)} px-2 py-1 rounded-full text-xs`}>
                        {temple.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {temple.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Daily Visitors</p>
                        <p className="font-semibold text-lg font-teko">{temple.dailyVisitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pricing</p>
                        <p className="font-semibold text-lg font-teko">{temple.pricing}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Queue Limit</p>
                        <p className="font-semibold">{temple.queueLimit} people</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Slot Duration</p>
                        <p className="font-semibold">{temple.slotDuration} min</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Timings</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        {temple.timings}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-1">
                        {temple.facilities.map((facility, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{facility}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 hover:shadow-sacred transition-shadow">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:scale-105 transition-transform">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Add/Edit Tab */}
        <TabsContent value="add-edit" className="space-y-6">
          {/* Your Add/Edit form can be styled similarly with golden borders, shadow-sacred, gradient buttons */}
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          {/* Same upgrades: cards with border-gold-300, sacred shadow, hover scale */}
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-teko text-xl font-semibold">Special Dates Calendar</h3>
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 mr-2" />
              Add Special Date
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialDates.map((date, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border border-gold-300 hover:shadow-sacred transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{date.date}</span>
                    </div>
                    <Badge className={`${getEventTypeColor(date.type)} px-2 py-1 rounded-full text-xs`}>
                      {date.type}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{date.event}</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Remove</Button>
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
