import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMission } from '@/context/MissionContext';
import { SensorData, HistoryPoint } from '@/lib/types';
import { Colors } from '@/lib/theme';
import { GaugeRing } from '@/components/common/GaugeRing';
import { ResourceCard } from '@/components/common/ResourceCard';

interface HomeScreenProps {
  data:    SensorData;
  history: HistoryPoint[];
}

/**
 * Dashboard principal — visão geral dos recursos e status da missão.
 * Consome o MissionContext para alertas e limiares.
 */
export default function HomeScreen({ data, history }: HomeScreenProps) {
  const { state, dispatch } = useMission();
  const { alertThresholds: thr } = state;

  const resources = [
    { key: 'oxygen', label: 'Oxigênio', value: data.oxygen.level,    unit: '%', color: Colors.success, icon: '💨' },
    { key: 'water',  label: 'Água',     value: data.water.level,     unit: '%', color: Colors.info,    icon: '💧' },
    { key: 'energy', label: 'Energia',  value: data.energy.level,    unit: '%', color: Colors.warning, icon: '⚡' },
    { key: 'food',   label: 'Alimento', value: data.food.level,      unit: '%', color: Colors.purple,  icon: '🥗' },
  ] as const;

  const criticals = resources.filter((r) => r.value < thr[r.key as keyof typeof thr]);

  // Gera alertas automáticos ao detectar recursos críticos
  useEffect(() => {
    if (!state.settings.autoAlert) return;
    criticals.forEach((r) => {
      dispatch({
        type:    'ADD_ALERT',
        payload: {
          id:       `${Date.now()}-${r.key}`,
          level:    r.value < thr[r.key as keyof typeof thr] * 0.6 ? 'critical' : 'warning',
          message:  `${r.label}: ${r.value.toFixed(1)}${r.unit} abaixo do limiar de ${thr[r.key as keyof typeof thr]}%`,
          resource: r.key,
          time:     new Date().toLocaleTimeString('pt-BR'),
        },
      });
    });
  }, [data.tick]);

  const overall = Math.round(resources.reduce((a, r) => a + r.value, 0) / resources.length);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Card de status geral */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.missionLabel}>🛸 {state.name}</Text>
            <Text style={styles.missionSub}>{state.location} · Dia {state.daysMission}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.overallValue, { color: overall > 50 ? Colors.success : Colors.warning }]}>
              {overall}%
            </Text>
            <Text style={styles.overallLabel}>saúde geral</Text>
          </View>
        </View>

        {/* Gauges */}
        <View style={styles.gaugesRow}>
          {resources.map((r) => (
            <GaugeRing key={r.key} value={r.value} color={r.color} label={r.label} size={52} />
          ))}
        </View>
      </View>

      {/* Banner de recursos críticos */}
      {criticals.length > 0 && (
        <View style={styles.criticalBanner}>
          <Text style={styles.criticalTitle}>
            ⚠ {criticals.length} recurso(s) em nível crítico
          </Text>
          {criticals.map((r) => (
            <Text key={r.key} style={styles.criticalItem}>
              {r.icon} {r.label}:{' '}
              <Text style={{ color: Colors.danger, fontWeight: '700' }}>
                {r.value.toFixed(1)}{r.unit}
              </Text>
            </Text>
          ))}
        </View>
      )}

      {/* Cards de recursos */}
      <Text style={styles.sectionTitle}>RECURSOS DA BASE</Text>
      <View style={styles.resourceGrid}>
        {resources.map((r) => {
          const histKey = r.key as 'oxygen' | 'energy' | 'water' | 'food';
          const hist = ['oxygen', 'energy', 'water', 'food'].includes(r.key)
            ? history.map((h) => h[histKey])
            : undefined;
          return (
            <ResourceCard
              key={r.key}
              icon={r.icon}
              label={r.label}
              value={r.value}
              unit={r.unit}
              color={r.color}
              isAlert={r.value < thr[r.key as keyof typeof thr]}
              history={hist}
            />
          );
        })}
      </View>

      {/* Ambiente */}
      <Text style={styles.sectionTitle}>AMBIENTE</Text>
      <View style={styles.envRow}>
        <View style={styles.envCard}>
          <Text style={styles.envLabel}>🌡 Temp. Interna</Text>
          <Text style={[styles.envValue, { color: Colors.accent }]}>
            {data.temperature.internal.toFixed(1)}°C
          </Text>
          <Text style={styles.envSub}>Externa: {data.temperature.external.toFixed(0)}°C</Text>
        </View>
        <View style={styles.envCard}>
          <Text style={styles.envLabel}>📡 Sinal</Text>
          <Text style={[styles.envValue, { color: data.signal.strength > 60 ? Colors.success : Colors.warning }]}>
            {data.signal.strength.toFixed(0)}%
          </Text>
          <Text style={styles.envSub}>Latência: {data.signal.latency.toFixed(0)}ms</Text>
        </View>
        <View style={styles.envCard}>
          <Text style={styles.envLabel}>🔵 Pressão</Text>
          <Text style={[styles.envValue, { color: Colors.purple }]}>
            {data.pressure.level.toFixed(1)}
          </Text>
          <Text style={styles.envSub}>kPa</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { padding: 16, paddingBottom: 80 },

  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    padding:         14,
    borderWidth:     1,
    borderColor:     Colors.borderActive,
    marginBottom:    12,
  },
  statusHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  missionLabel:  { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  missionSub:    { fontSize: 13, color: Colors.textDim },
  overallValue:  { fontSize: 28, fontWeight: '700' },
  overallLabel:  { fontSize: 11, color: Colors.textMuted },
  gaugesRow:     { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 14 },

  criticalBanner: {
    backgroundColor: Colors.dangerBg,
    borderRadius:    12,
    borderWidth:     1,
    borderLeftWidth: 3,
    borderColor:     Colors.danger + '33',
    borderLeftColor: Colors.danger,
    padding:         14,
    marginBottom:    12,
  },
  criticalTitle: { fontSize: 12, fontWeight: '700', color: Colors.danger, marginBottom: 6 },
  criticalItem:  { fontSize: 12, color: Colors.text, marginTop: 2 },

  sectionTitle: {
    fontSize:      11,
    fontWeight:    '700',
    color:         Colors.textDim,
    letterSpacing: 1.2,
    marginBottom:  10,
    marginTop:     4,
  },

  resourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },

  envRow:  { flexDirection: 'row', gap: 10, marginBottom: 16 },
  envCard: {
    flex:            1,
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         12,
  },
  envLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  envValue: { fontSize: 18, fontWeight: '700' },
  envSub:   { fontSize: 10, color: Colors.textDim, marginTop: 2 },
});
