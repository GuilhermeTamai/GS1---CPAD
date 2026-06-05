import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SensorData, HistoryPoint } from '@/lib/types';
import { Colors } from '@/lib/theme';
import { LineChart } from '@/components/charts/LineChart';
import { StatusBadge } from '@/components/common/StatusBadge';

interface SensorsScreenProps {
  data:    SensorData;
  history: HistoryPoint[];
}

type ChartKey = 'energy' | 'oxygen' | 'water' | 'signal';

interface ChartConfig {
  label: string;
  color: string;
  key:   ChartKey;
  unit:  string;
}

const CHARTS: Record<ChartKey, ChartConfig> = {
  energy: { label: 'Energia Solar',       color: Colors.warning, key: 'energy', unit: '%' },
  oxygen: { label: 'Oxigênio',            color: Colors.success, key: 'oxygen', unit: '%' },
  water:  { label: 'Reserva Hídrica',     color: Colors.info,    key: 'water',  unit: '%' },
  signal: { label: 'Qualidade do Sinal',  color: Colors.accent,  key: 'signal', unit: '%' },
};

/**
 * Dashboard de Sensores — gráfico de linha interativo + lista de todos os sensores.
 * Permite alternar entre 4 séries de dados simulados.
 */
export default function SensorsScreen({ data, history }: SensorsScreenProps) {
  const [active, setActive] = useState<ChartKey>('energy');
  const current   = CHARTS[active];
  const chartData = history.map((h) => h[current.key]);
  const lastValue = chartData[chartData.length - 1] ?? 0;

  const sensors = [
    { label: 'Temperatura Interna',   value: data.temperature.internal, unit: '°C', ok: data.temperature.internal > 18 && data.temperature.internal < 26, icon: '🌡' },
    { label: 'Temperatura Externa',   value: data.temperature.external, unit: '°C', ok: true,                                                              icon: '❄'  },
    { label: 'Pressão Cabine',        value: data.pressure.level,       unit: 'kPa',ok: data.pressure.level > 95,                                          icon: '🔵' },
    { label: 'Estabilidade Orbital',  value: data.orbital.stability,    unit: '%',  ok: data.orbital.stability > 90,                                       icon: '🛸' },
    { label: 'Sinal Telemetria',      value: data.signal.strength,      unit: '%',  ok: data.signal.strength > 60,                                         icon: '📡' },
    { label: 'Latência Comunicação',  value: data.signal.latency,       unit: ' ms',ok: data.signal.latency < 1500,                                        icon: '⏱' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>ANÁLISE DE SENSORES</Text>

      {/* Seletor de série */}
      <View style={styles.selectorRow}>
        {(Object.keys(CHARTS) as ChartKey[]).map((k) => (
          <TouchableOpacity
            key={k}
            onPress={() => setActive(k)}
            style={[
              styles.selectorBtn,
              active === k && { borderColor: CHARTS[k].color, backgroundColor: CHARTS[k].color + '22' },
            ]}
          >
            <Text style={[styles.selectorLabel, active === k && { color: CHARTS[k].color, fontWeight: '600' }]}>
              {CHARTS[k].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card do gráfico */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartName}>{current.label}</Text>
            <Text style={[styles.chartValue, { color: current.color }]}>
              {lastValue.toFixed(1)}{current.unit}
            </Text>
          </View>
          <Text style={styles.chartSub}>Últimas 20 leituras</Text>
        </View>
        <LineChart data={chartData} color={current.color} height={100} />
      </View>

      {/* Lista de sensores */}
      <Text style={styles.sectionTitle}>TODOS OS SENSORES</Text>
      {sensors.map((s, i) => (
        <View key={i} style={[styles.sensorRow, { borderLeftColor: s.ok ? Colors.success : Colors.danger }]}>
          <View style={styles.sensorLeft}>
            <Text style={{ fontSize: 18 }}>{s.icon}</Text>
            <Text style={styles.sensorLabel}>{s.label}</Text>
          </View>
          <View style={styles.sensorRight}>
            <Text style={[styles.sensorValue, { color: s.ok ? Colors.success : Colors.danger }]}>
              {s.value.toFixed(s.unit === ' ms' ? 0 : 1)}{s.unit}
            </Text>
            <StatusBadge level={s.ok ? 'ok' : 'warning'} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { padding: 16, paddingBottom: 80 },

  sectionTitle: {
    fontSize:      11,
    fontWeight:    '700',
    color:         Colors.textDim,
    letterSpacing: 1.2,
    marginBottom:  10,
    marginTop:     4,
  },

  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  selectorBtn: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       Colors.border,
  },
  selectorLabel: { fontSize: 12, color: Colors.textMuted },

  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         14,
    marginBottom:    16,
  },
  chartHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  chartName:    { fontSize: 13, color: Colors.textMuted },
  chartValue:   { fontSize: 28, fontWeight: '700' },
  chartSub:     { fontSize: 11, color: Colors.textDim },

  sensorRow: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderLeftWidth: 3,
    borderColor:     Colors.border,
    padding:         14,
    marginBottom:    8,
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
  },
  sensorLeft:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sensorLabel: { fontSize: 13 },
  sensorRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sensorValue: { fontSize: 14, fontWeight: '700' },
});
