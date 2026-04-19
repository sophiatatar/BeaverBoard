export type EventState = "dead" | "warming" | "good" | "packed" | "crazy";

export type Trend = "rising" | "flat" | "falling";

export type PulseLabel = EventState;

export interface PulseCounts {
  dead: number;
  warming: number;
  good: number;
  packed: number;
  crazy: number;
}

export interface PulseHistoryEntry {
  at: number;
  label: PulseLabel;
  source: "user" | "sim";
}

export interface ActivityEntry {
  at: number;
  message: string;
}

export interface Event {
  id: string;
  name: string;
  category: string;
  host: string;
  locationName: string;
  x: number;
  y: number;
  distanceMinutes: number;
  startTime: string;
  endTime: string;
  attendance: number;
  baseAttendance: number;
  state: EventState;
  watched: boolean;
  momentumScore: number;
  trend: Trend;
  pulseCounts: PulseCounts;
  pulseHistory: PulseHistoryEntry[];
  recentActivity: ActivityEntry[];
  lastAlertAt: number | null;
  isSurging: boolean;
  demoBias: number;
  /** Rolling scores for sparkline (last N simulation steps) */
  momentumHistory: number[];
}

export type LiveFilter = "all" | "rising" | "watched" | "hot";

export type TabId = "live" | "watchlist" | "alerts" | "demo";

export type SimSpeed = 1 | 2 | 4;

export type AlertType =
  | "state_up"
  | "surge"
  | "packed"
  | "flip";

export interface AlertItem {
  id: string;
  at: number;
  eventId: string;
  eventName: string;
  type: AlertType;
  message: string;
}

export interface SimulationMeta {
  tickIndex: number;
  running: boolean;
  speed: SimSpeed;
  forcedSurgeUntil: Record<string, number>;
}
