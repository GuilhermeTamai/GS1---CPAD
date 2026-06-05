import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MissionState, MissionAction, AlertItem } from '@/lib/types';
import { saveMissionSettings, loadMissionSettings, saveAlertHistory, loadAlertHistory } from '@/lib/sensors';

// ─── Estado inicial ───────────────────────────────────────────────────────────

const initialState: MissionState = {
  name: 'Artemis Base Alpha',
  location: 'Lua — Polo Sul',
  crew: 6,
  daysMission: 142,
  alertThresholds: { oxygen: 20, water: 15, energy: 25, food: 20 },
  alertHistory: [],
  settings: { notifications: true, autoAlert: true, unit: 'metric' },
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'SET_THRESHOLDS':
      return {
        ...state,
        alertThresholds: { ...state.alertThresholds, ...action.payload },
      };
    case 'ADD_ALERT':
      return {
        ...state,
        alertHistory: [action.payload, ...state.alertHistory].slice(0, 50),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'UPDATE_MISSION':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface MissionContextValue {
  state: MissionState;
  dispatch: React.Dispatch<MissionAction>;
}

const MissionContext = createContext<MissionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface MissionProviderProps {
  children: ReactNode;
}

export function MissionProvider({ children }: MissionProviderProps) {
  const [state, dispatch] = useReducer(missionReducer, initialState);

  // Carrega dados persistidos na inicialização
  useEffect(() => {
    async function loadPersistedData() {
      const [savedSettings, savedAlerts] = await Promise.all([
        loadMissionSettings(),
        loadAlertHistory(),
      ]);

      if (savedSettings) {
        dispatch({ type: 'UPDATE_MISSION', payload: savedSettings as Partial<MissionState> });
      }
      if (Array.isArray(savedAlerts) && savedAlerts.length > 0) {
        savedAlerts.forEach((alert) =>
          dispatch({ type: 'ADD_ALERT', payload: alert as AlertItem })
        );
      }
    }
    loadPersistedData();
  }, []);

  // Persiste configurações sempre que mudam
  useEffect(() => {
    saveMissionSettings({
      name: state.name,
      location: state.location,
      crew: state.crew,
      alertThresholds: state.alertThresholds,
      settings: state.settings,
    });
  }, [state.name, state.location, state.crew, state.alertThresholds, state.settings]);

  // Persiste histórico de alertas
  useEffect(() => {
    if (state.alertHistory.length > 0) {
      saveAlertHistory(state.alertHistory);
    }
  }, [state.alertHistory]);

  return (
    <MissionContext.Provider value={{ state, dispatch }}>
      {children}
    </MissionContext.Provider>
  );
}

// ─── Hook de consumo ──────────────────────────────────────────────────────────

/**
 * Hook para acessar o contexto global da missão.
 * Deve ser usado dentro de <MissionProvider>.
 */
export function useMission(): MissionContextValue {
  const ctx = useContext(MissionContext);
  if (!ctx) {
    throw new Error('useMission deve ser usado dentro de <MissionProvider>');
  }
  return ctx;
}
