import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Download,
  Clock,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar, AreaChart, Area } from "recharts";
import { fetchRealtimeMetrics, type RealtimeMetrics } from "@/lib/api";

// Types
type CrowdRow = {
  date: string; // YYYY-MM-DD
  day: string; // Monday..Sunday
  festival: string | null; // null when N/A
  weather: "Sunny" | "Cloudy" | "Rainy" | "Stormy";
  total: number;
};

function parseCsv(text: string): CrowdRow[] {
  const lines = text.trim().split(/\r?\n/);
  const out: CrowdRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 5) continue;
    const [date, day, festival, weather, total] = parts;
    out.push({
      date,
      day,
      festival: festival === "N/A" ? null : festival,
      weather: weather as CrowdRow["weather"],
      total: Number(total),
    });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

function formatMonthKey(isoDate: string) {
  return isoDate.slice(0, 7); // YYYY-MM
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("week");
  const [rows, setRows] = useState<CrowdRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtime, setRealtime] = useState<RealtimeMetrics | null>(null);

  // Load CSV from public folder
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/crowd.csv", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load CSV: ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        setRows(parseCsv(text));
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to load data");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime metrics (queue wait time etc.)
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const load = async () => {
      try {
        const res = await fetchRealtimeMetrics();
        if (!cancelled) setRealtime(res);
      } catch (_) {
        // ignore, api.ts provides fallback
      } finally {
        if (!cancelled) timer = window.setTimeout(load, 10000);
      }
    };
    load();
    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, []);

  // Period filtering
  const filtered = useMemo(() => {
    if (rows.length === 0) return [] as CrowdRow[];
    const lastDate = rows[rows.length - 1].date;
    const last = new Date(lastDate);
    let from = new Date(last);
    if (selectedPeriod === "day") from.setDate(last.getDate() - 1);
    else if (selectedPeriod === "week") from.setDate(last.getDate() - 7);
    else if (selectedPeriod === "month") from.setMonth(last.getMonth() - 1);
    else if (selectedPeriod === "year") from.setFullYear(last.getFullYear() - 1);
    const fromIso = from.toISOString().slice(0, 10);
    return rows.filter((r) => r.date >= fromIso);
  }, [rows, selectedPeriod]);

  // Charts data
  const dailyTrend = useMemo(() => filtered.map((r) => ({ t: r.date, y: r.total })), [filtered]);

  const monthlyTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const k = formatMonthKey(r.date);
      map.set(k, (map.get(k) || 0) + r.total);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([m, v]) => ({ m, v }));
  }, [rows]);

  const weekdayAverages = useMemo(() => {
    const sums = new Map<string, { sum: number; n: number }>();
    for (const r of rows) {
      const k = r.day;
      const v = sums.get(k) || { sum: 0, n: 0 };
      v.sum += r.total;
      v.n += 1;
      sums.set(k, v);
    }
    return WEEKDAYS.map((d) => ({ d, v: Math.round((sums.get(d)?.sum || 0) / (sums.get(d)?.n || 1)) }));
  }, [rows]);

  const weatherImpact = useMemo(() => {
    const sums = new Map<string, { sum: number; n: number }>();
    for (const r of rows) {
      const k = r.weather;
      const v = sums.get(k) || { sum: 0, n: 0 };
      v.sum += r.total;
      v.n += 1;
      sums.set(k, v);
    }
    return ["Sunny", "Cloudy", "Rainy", "Stormy"].map((w) => ({ w, v: Math.round((sums.get(w)?.sum || 0) / (sums.get(w)?.n || 1)) }));
  }, [rows]);

  const topFestivals = useMemo(() => {
    const fest = rows.filter((r) => r.festival).map((r) => ({ date: r.date, f: r.festival as string, v: r.total }));
    fest.sort((a, b) => b.v - a.v);
    return fest.slice(0, 6);
  }, [rows]);

  const visitorTrends = useMemo(() => {
    if (rows.length === 0) return [] as { period: string; visitors: number; growth: number }[];
    const last = rows[rows.length - 1];
    const week = rows.slice(-7).reduce((a, r) => a + r.total, 0);
    const prevWeek = rows.slice(-14, -7).reduce((a, r) => a + r.total, 0) || 1;
    const month = rows.slice(-30).reduce((a, r) => a + r.total, 0);
    const prevMonth = rows.slice(-60, -30).reduce((a, r) => a + r.total, 0) || 1;
    return [
      { period: "Today", visitors: last.total, growth: Math.round(((last.total - rows[rows.length - 2]?.total) / (rows[rows.length - 2]?.total || last.total)) * 100) },
      { period: "This Week", visitors: week, growth: Math.round(((week - prevWeek) / prevWeek) * 100) },
      { period: "This Month", visitors: month, growth: Math.round(((month - prevMonth) / prevMonth) * 100) },
      { period: "All-time", visitors: rows.reduce((a, r) => a + r.total, 0), growth: 0 },
    ];
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-teko text-3xl font-bold text-primary">Analytics & Insights</h1>
          <p className="text-muted-foreground">Crowd analytics derived from historical data (2022–2024)</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last 365 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => window.open("/data/crowd.csv", "_blank")}> 
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(loading ? [1,2,3,4].map((i) => ({ period: "…", visitors: 0, growth: 0 })) : visitorTrends).map((trend, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                {!loading && <Badge variant="secondary" className="text-accent">{trend.growth > 0 ? "+" : ""}{trend.growth}%</Badge>}
              </div>
              <div>
                <p className="text-2xl font-bold font-teko">{loading ? "…" : trend.visitors.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{trend.period} Visitors</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Visitor Trends</TabsTrigger>
          <TabsTrigger value="queue">Queue Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
        </TabsList>

        {/* Visitor Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Daily Crowd Trend</CardTitle>
                <CardDescription>Time series for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {error ? (
                    <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      <p className="text-muted-foreground">{error}</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="t" minTickGap={24} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="y" stroke="#eab308" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Monthly Totals</CardTitle>
                <CardDescription>Aggregated crowd per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTotals}>
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

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Weekday Averages</CardTitle>
                <CardDescription>Average crowd by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekdayAverages}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="d" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="v" fill="#3b82f6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Weather Impact</CardTitle>
                <CardDescription>Average crowd by weather condition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weatherImpact}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="w" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="v" fill="#8b5cf6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="font-teko text-xl">Top Festival Days</CardTitle>
              <CardDescription>Highest crowd on festival days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topFestivals.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border/50 p-3 bg-card/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{f.f}</span>
                      <Badge variant="secondary">{f.date}</Badge>
                    </div>
                    <p className="text-lg font-teko">{f.v.toLocaleString()} visitors</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          {(() => {
            const last = rows[rows.length - 1];
            const prev = rows[rows.length - 2];
            const periodDays = new Set(filtered.map(r => r.date)).size || 1;
            const sumFiltered = filtered.reduce((a, r) => a + r.total, 0);
            const avgDaily = Math.round(sumFiltered / periodDays);
            const from = (() => {
              if (rows.length === 0) return null as null | { fromIso: string; toIso: string };
              const lastDate = rows[rows.length - 1].date;
              const lastDt = new Date(lastDate);
              let fromDt = new Date(lastDt);
              if (selectedPeriod === "day") fromDt.setDate(lastDt.getDate() - 1);
              else if (selectedPeriod === "week") fromDt.setDate(lastDt.getDate() - 7);
              else if (selectedPeriod === "month") fromDt.setMonth(lastDt.getMonth() - 1);
              else if (selectedPeriod === "year") fromDt.setFullYear(lastDt.getFullYear() - 1);
              return { fromIso: fromDt.toISOString().slice(0,10), toIso: lastDate };
            })();
            const prevRange = (() => {
              if (!from) return { sum: 0 };
              const start = new Date(from.fromIso);
              const end = new Date(from.toIso);
              const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime())/86400000));
              const prevEnd = new Date(start);
              const prevStart = new Date(start);
              prevStart.setDate(prevStart.getDate() - diffDays);
              const a = prevStart.toISOString().slice(0,10);
              const b = new Date(prevEnd.getTime() - 1).toISOString().slice(0,10);
              const sum = rows.filter(r => r.date >= a && r.date <= b).reduce((s, r) => s + r.total, 0);
              return { sum };
            })();
            const periodChangePct = prevRange.sum > 0 ? Math.round(((sumFiltered - prevRange.sum)/prevRange.sum)*100) : 0;
            const dayChangePct = prev ? Math.round(((last.total - prev.total) / Math.max(1, prev.total)) * 100) : 0;
            const waitMin = realtime?.queue_wait_time_min ?? Math.max(5, Math.round(12 + (avgDaily - 2000) / 400));
            const throughputPerDay = avgDaily;
            const dropOff = dayChangePct < 0 ? Math.abs(dayChangePct) : 0;
            const eff = (() => {
              if (realtime?.queue_wait_time_min != null) {
                const e = Math.max(30, Math.min(99, Math.round(100 - realtime.queue_wait_time_min * 2)));
                return e;
              }
              const maxInPeriod = filtered.reduce((m, r) => Math.max(m, r.total), 0) || 1;
              return Math.max(30, Math.min(99, Math.round(((last?.total || 0) / maxInPeriod) * 100)));
            })();
            const cards = [
              { metric: "Average Wait Time", value: `${waitMin} min`, change: `${dayChangePct}%`, trend: dayChangePct >= 0 ? "up" : "down" },
              { metric: "Queue Throughput", value: `${throughputPerDay.toLocaleString()}/day`, change: `${periodChangePct}%`, trend: periodChangePct >= 0 ? "up" : "down" },
              { metric: "Drop-off Rate", value: `${dropOff}%`, change: `${dayChangePct}%`, trend: dayChangePct <= 0 ? "up" : "down" },
              { metric: "Peak Hour Efficiency", value: `${eff}%`, change: `${periodChangePct}%`, trend: periodChangePct >= 0 ? "up" : "down" },
            ];
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map((metric, index) => (
                  <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 text-primary" />
                        <Badge variant={metric.trend === "up" ? "default" : "destructive" as any}>
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
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Queue Performance Trends</CardTitle>
                <CardDescription>Example throughput over days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rows.slice(-20).map((r, i) => ({ t: `D${i+1}`, v: r.total }))}>
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
                <CardDescription>Illustrative stage-wise rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { stage: "Arrival", v: 96 },
                      { stage: "Queue", v: 86 },
                      { stage: "Pre-entry", v: 81 },
                      { stage: "Darshan", v: 79 },
                    ]}>
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

        {/* Revenue Reports (sample visuals retained) */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Revenue Breakdown</CardTitle>
                <CardDescription>Illustrative distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { source: "Darshan Tickets", amount: 847650, percentage: 45 },
                  { source: "VIP Bookings", amount: 423250, percentage: 22 },
                  { source: "Donations", amount: 381200, percentage: 20 },
                  { source: "Prasadam Sales", amount: 189400, percentage: 10 },
                  { source: "Parking Fees", amount: 56900, percentage: 3 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">₹{item.amount.toLocaleString()}</span>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-teko text-xl">Revenue Trends</CardTitle>
                <CardDescription>Illustrative monthly growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: i + 1, v: 200000 + (i%3)*40000 }))}>
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
        </TabsContent>

      </Tabs>
    </div>
  );
}
