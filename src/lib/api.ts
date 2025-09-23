export type RealtimeMetrics = {
  active_pilgrims: number;
  queue_wait_time_min: number;
  todays_offerings_inr: number;
  events_today: number;
};

export type ForecastPoint = {
  timestamp: string;
  predicted_pilgrims: number;
};

const JSON_HEADERS: HeadersInit = { "Content-Type": "application/json" };

export async function fetchRealtimeMetrics(signal?: AbortSignal): Promise<RealtimeMetrics> {
  const res = await fetch("/api/realtime_metrics", { signal });
  if (!res.ok) throw new Error(`Failed to fetch realtime metrics: ${res.status}`);
  return res.json();
}

export async function fetchCrowdForecast(hours = 48, signal?: AbortSignal): Promise<ForecastPoint[]> {
  const res = await fetch(`/api/crowd_forecast?hours=${hours}`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch forecast: ${res.status}`);
  return res.json();
}

export async function predictCrowd(input: {
  timestamp?: string;
  is_holiday?: 0 | 1;
  is_festival_day?: 0 | 1;
  weather?: "sunny" | "cloudy" | "rainy" | "stormy";
}): Promise<{ predicted_pilgrims: number }> {
  const res = await fetch("/api/predict_crowd", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to predict crowd: ${res.status}`);
  return res.json();
}
