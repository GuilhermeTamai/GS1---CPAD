import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SensorData } from '@/lib/types';
import { Colors } from '@/lib/theme';
import { ProgressBar } from '@/components/common/ProgressBar';

interface EnergyScreenProps {
  data: SensorData;
}

/**
 * Dashboard de Energia — painéis solares, balanço e consumo por sistema.
 */
export default function EnergyScreen({ data }: EnergyScreenProps) {
  const panels = [
    { name: 'Painel A', output: data.energy.level * 0.38, health: 92 },
    { name: 'Painel B', output: data.energy.level * 0.35, health: 88 },
    { name: 'Painel C', output: data.energy.level * 0.27, health: 76 },
  ];

  const consumers = [
    { name: 'Suporte de vida', consumption: 28.4, priority: 'crítico' as const },
    { name: 'Propulsão',       consumption: 19.2, priority: 'alto'    as const },
    { name: 'Computação',      consumption: 12.8, priority: 'alto'    as const },
    { name: 'Comunicação',     consumption: 8.6,  priority: 'médio'   as const },
    { name: 'Iluminação',      consumption: 4.2,  priority: 'baixo'   as const },
    { name: 'Recreação',       consumption: 1.8,  priority: 'baixo'   as const },
  ];

  const totalGen  = panels.reduce((a, p) => a + p.output, 0);
  const totalCons = consumers.reduce((a, c) => a + c.consumption, 0);
  const balance   = totalGen - totalCons;

  const priorityColor = (p: string) =>
    p === 'crítico' ? Colors.danger
    : p === 'alto'  ? Colors.warning
    : p === 'médio' ? Colors.info
    : Colors.textMuted;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>DASHBOARD DE ENERGIA</Text>

      {/* Métricas de geração/consumo */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderColor: Colors.warning + '44' }]}>
          <Text style={styles.metricLabel}>⚡ Geração</Text>
          <Text style={[styles.metricValue, { color: Colors.warning }]}>
            {totalGen.toFixed(1)}
          </Text>
          <Text style={styles.metricUnit}>kWh/h</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: Colors.info + '44' }]}>
          <Text style={styles.metricLabel}>🔋 Consumo</Text>
          <Text style={[styles.metricValue, { color: Colors.info }]}>
            {totalCons.toFixed(1)}
          </Text>
          <Text style={styles.metricUnit}>kWh/h</Text>
        </View>
      </View>

      {/* Balanço */}
      <View style={[
        styles.balanceCard,
        {
          backgroundColor: balance >= 0 ? Colors.successBg : Colors.dangerBg,
          borderLeftColor: balance >= 0 ? Colors.success    : Colors.danger,
        },
      ]}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Balanço Energético</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? Colors.success : Colors.danger }]}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(1)} kWh/h
          </Text>
        </View>
        <Text style={styles.balanceSub}>
          {balance >= 0
            ? '✅ Gerando excedente — baterias carregando'
            : '⚠ Consumo acima da geração — baterias descarregando'}
        </Text>
      </View>

      {/* Painéis solares */}
      <Text style={styles.sectionTitle}>PAINÉIS SOLARES</Text>
      {panels.map((p, i) => (
        <View key={i} style={styles.panelCard}>
          <View>
            <Text style={styles.panelName}>{p.name}</Text>
            <Text style={styles.panelHealth}>Saúde: {p.health}%</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Text style={[styles.panelOutput, { color: Colors.warning }]}>
              {p.output.toFixed(1)} kWh/h
            </Text>
            <ProgressBar
              value={p.health}
              color={p.health > 80 ? Colors.success : Colors.warning}
              width={80}
              height={4}
            />
          </View>
        </View>
      ))}

      {/* Consumo por sistema */}
      <Text style={styles.sectionTitle}>CONSUMO POR SISTEMA</Text>
      {consumers.map((c, i) => (
        <View key={i} style={styles.consumerCard}>
          <View style={styles.consumerLeft}>
            <View style={[styles.dot, { backgroundColor: priorityColor(c.priority) }]} />
            <Text style={styles.consumerName}>{c.name}</Text>
          </View>
          <View style={styles.consumerRight}>
            <ProgressBar
              value={(c.consumption / 30) * 100}
              color={priorityColor(c.priority)}
              width={60}
              height={4}
            />
            <Text style={styles.consumerValue}>{c.consumption.toFixed(1)} kWh</Text>
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
    color:         Colors.text,
    letterSpacing: 1.2,
    marginBottom:  10,
    marginTop:     4,
  },

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  metricCard: {
    flex:            1,
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    padding:         14,
  },
  metricLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '700' },
  metricUnit:  { fontSize: 11, color: Colors.textDim },

  balanceCard: {
    borderRadius:    12,
    borderWidth:     1,
    borderLeftWidth: 3,
    borderColor:     'transparent',
    padding:         14,
    marginBottom:    16,
  },
  balanceRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 13, color: Colors.text, },
  balanceValue: { fontSize: 20, fontWeight: '700' },
  balanceSub:   { fontSize: 11, color: Colors.textMuted, marginTop: 4 },

  panelCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         14,
    marginBottom:    8,
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
  },
  panelName:   { fontSize: 13, fontWeight: '600', color: Colors.text, },
  panelHealth: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  panelOutput: { fontSize: 14, fontWeight: '700' },

  consumerCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         14,
    marginBottom:    8,
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
  },
  consumerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  consumerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  consumerName:  { fontSize: 13,  color: Colors.text, },
  consumerValue: { fontSize: 13, fontWeight: '600', minWidth: 60, textAlign: 'right', color: Colors.text, },
  dot:           { width: 6, height: 6, borderRadius: 3 },
});
