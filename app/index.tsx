import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useMission } from '@/context/MissionContext';
import { useSimulatedSensors, useSensorHistory } from '@/lib/sensors';
import { Colors } from '@/lib/theme';
import HomeScreen from '@/components/dashboards/HomeScreen';

/**
 * Rota /index — Dashboard Principal (tab "Início").
 * Inicializa os hooks de simulação e repassa dados para HomeScreen.
 */
export default function IndexPage() {
  const data    = useSimulatedSensors();
  const history = useSensorHistory(data.tick);
  const { state } = useMission();

  const alertCount = [
    data.oxygen.level < state.alertThresholds.oxygen,
    data.water.level  < state.alertThresholds.water,
    data.energy.level < state.alertThresholds.energy,
    data.food.level   < state.alertThresholds.food,
  ].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="CosmoDeploy" subtitle={state.name} alertCount={alertCount} />
      <HomeScreen data={data} history={history} />
    </SafeAreaView>
  );
}

// ─── Header compartilhado ─────────────────────────────────────────────────────

function AppHeader({
  title, subtitle, alertCount,
}: { title: string; subtitle: string; alertCount: number }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>🚀 {title}</Text>
        <Text style={styles.headerSub}>{subtitle}</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.liveDot} />
        <Text style={styles.liveLabel}>AO VIVO</Text>
        {alertCount > 0 && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>{alertCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical:   12,
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, letterSpacing: 0.5 },
  headerSub:   { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: Colors.success,
  },
  liveLabel:     { fontSize: 10, color: Colors.textMuted },
  alertBadge: {
    backgroundColor: Colors.danger,
    borderRadius:    10,
    paddingHorizontal: 7,
    paddingVertical:   2,
  },
  alertBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
