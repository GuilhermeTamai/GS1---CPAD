// Tipos globais do CosmoDeploy

export type ResourceKey = 'oxygen' | 'water' | 'energy' | 'food';

export type AlertLevel = 'critical' | 'warning' | 'info';

export interface ResourceData {
  level: number;
  trend: number;
  unit: string;
}

export interface SensorData {
  oxygen: ResourceData;
  water: ResourceData;
  energy: ResourceData;
  food: ResourceData;
  temperature: { internal: number; external: number; unit: string };
  pressure: { level: number; unit: string };
  signal: { strength: number; latency: number; unit: string };
  orbital: { stability: number; altitude: number; unit: string };
  tick: number;
}

export interface AlertItem {
  id: string;
  level: AlertLevel;
  message: string;
  resource: string;
  time: string;
}

export interface AlertThresholds {
  oxygen: number;
  water: number;
  energy: number;
  food: number;
}

export interface MissionSettings {
  notifications: boolean;
  autoAlert: boolean;
  unit: 'metric' | 'imperial';
}

export interface MissionState {
  name: string;
  location: string;
  crew: number;
  daysMission: number;
  alertThresholds: AlertThresholds;
  alertHistory: AlertItem[];
  settings: MissionSettings;
}

export type MissionAction =
  | { type: 'SET_THRESHOLDS'; payload: Partial<AlertThresholds> }
  | { type: 'ADD_ALERT'; payload: AlertItem }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<MissionSettings> }
  | { type: 'UPDATE_MISSION'; payload: Partial<MissionState> };

export interface HistoryPoint {
  t: number;
  oxygen: number;
  energy: number;
  water: number;
  signal: number;
}

export interface SolarPanel {
  name: string;
  output: number;
  health: number;
}

export interface EnergyConsumer {
  name: string;
  consumption: number;
  priority: 'crítico' | 'alto' | 'médio' | 'baixo';
}
