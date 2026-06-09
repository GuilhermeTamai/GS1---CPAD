import { useState, useEffect } from 'react';
import { SensorData, HistoryPoint } from './types';

/** Gera valor aleatório em torno de uma base com variância */
const rand = (base: number, variance: number): number =>
  Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10;

/**
 * Hook que simula leituras de sensores espaciais a cada 3 segundos.
 * Retorna dados atuais de oxigênio, água, energia, alimentos,
 * temperatura, pressão, sinal e estabilidade orbital.
 */
export function useSimulatedSensors(): SensorData {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return {
    oxygen:    { level: rand(68, 8),  trend: rand(0.2,  0.3), unit: '%'     },
    water:     { level: rand(45, 10), trend: rand(-0.1, 0.2), unit: 'L/dia' },
    energy:    { level: rand(72, 12), trend: rand(1.1,  0.5), unit: 'kWh'   },
    food:      { level: rand(55, 8),  trend: rand(-0.05,0.1), unit: 'kg'    },
    temperature: {
      internal: rand(21, 2),
      external: rand(-163, 20),
      unit: '°C',
    },
    pressure:  { level: rand(101, 3),   unit: 'kPa' },
    signal:    { strength: rand(82, 15), latency: rand(1240, 200), unit: 'ms' },
    orbital:   { stability: rand(96, 5), altitude: rand(384400, 500), unit: 'km' },
    tick,
  };
}

/**
 * Hook que mantém o histórico das últimas 20 leituras de sensores.
 * Alimenta os gráficos de linha nos dashboards.
 */
export function useSensorHistory(tick: number): HistoryPoint[] {
  const [history, setHistory] = useState<HistoryPoint[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      t: i,
      oxygen: 65 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
      energy: 70 + Math.cos(i * 0.4) * 12 + Math.random() * 5,
      water:  48 - i * 0.3 + Math.random() * 4,
      food:   55 - i * 0.2 + Math.random() * 3,
      signal: 80 + Math.sin(i * 0.7) * 15 + Math.random() * 5,
    }))
  );

  useEffect(() => {
    setHistory((h) => {
      const last = h[h.length - 1];
      return [
        ...h,
        {
          t:      last.t + 1,
          oxygen: rand(68, 8),
          energy: rand(72, 12),
          water:  rand(45, 10),
          food:   rand(55, 8),
          signal: rand(82, 15),
        },
      ].slice(-20);
    });
  }, [tick]);

  return history;
}

/** Persiste alertas com AsyncStorage */
export async function saveAlertHistory(alerts: object[]): Promise<void> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('@cosmo_alert_history', JSON.stringify(alerts));
  } catch (e) {
    console.warn('Erro ao salvar histórico de alertas:', e);
  }
}

/** Recupera alertas do AsyncStorage */
export async function loadAlertHistory(): Promise<object[]> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const raw = await AsyncStorage.getItem('@cosmo_alert_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Salva configurações da missão com AsyncStorage */
export async function saveMissionSettings(settings: object): Promise<void> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('@cosmo_mission_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Erro ao salvar configurações:', e);
  }
}

/** Carrega configurações da missão do AsyncStorage */
export async function loadMissionSettings(): Promise<object | null> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const raw = await AsyncStorage.getItem('@cosmo_mission_settings');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
