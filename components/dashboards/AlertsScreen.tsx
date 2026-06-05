import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMission } from '@/context/MissionContext';
import { SensorData } from '@/lib/types';
import { Colors, alertColor, alertBg } from '@/lib/theme';
import { StatusBadge } from '@/components/common/StatusBadge';

interface AlertsScreenProps {
  data: SensorData;
}

/**
 * Tela de Alertas — alertas ativos em tempo real + histórico persistido.
 */
export default function AlertsScreen({ data }: AlertsScreenProps) {
  const { state } = useMission();
  const thr = state.alertThresholds;

  // Alertas calculados a partir dos dados atuais dos sensores
  const liveAlerts = [
    data.oxygen.level < thr.oxygen && {
      id: 'o', level: 'critical' as const, icon: '💨',
      title: 'Oxigênio crítico',
      msg: `Nível ${data.oxygen.level.toFixed(1)}% < limiar ${thr.oxygen}%`,
    },
    data.water.level < thr.water && {
      id: 'w', level: 'warning' as const, icon: '💧',
      title: 'Água baixa',
      msg: `Reserva ${data.water.level.toFixed(1)}% < limiar ${thr.water}%`,
    },
    data.energy.level < thr.energy && {
      id: 'e', level: 'warning' as const, icon: '⚡',
      title: 'Energia baixa',
      msg: `${data.energy.level.toFixed(1)}% < limiar ${thr.energy}%`,
    },
    data.food.level < thr.food && {
      id: 'f', level: 'warning' as const, icon: '🥗',
      title: 'Alimento baixo',
      msg: `${data.food.level.toFixed(1)}% < limiar ${thr.food}%`,
    },
    data.signal.strength < 50 && {
      id: 's', level: 'info' as const, icon: '📡',
      title: 'Sinal fraco',
      msg: `Qualidade ${data.signal.strength.toFixed(0)}%`,
    },
    data.temperature.internal > 25 && {
      id: 't', level: 'warning' as const, icon: '🌡',
      title: 'Temperatura elevada',
      msg: `${data.temperature.internal.toFixed(1)}°C acima do ideal`,
    },
  ].filter(Boolean) as Array<{ id: string; level: 'critical' | 'warning' | 'info'; icon: string; title: string; msg: string }>;

  const criticalCount = liveAlerts.filter((a) => a.level === 'critical').length;
  const warningCount  = liveAlerts.filter((a) => a.level !== 'critical').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Contador de alertas */}
      <View style={styles.countersRow}>
        <View style={[styles.counterCard, { borderColor: Colors.danger + '44' }]}>
          <Text style={styles.counterLabel}>🔴 Críticos</Text>
          <Text style={[styles.counterValue, { color: Colors.danger }]}>{criticalCount}</Text>
        </View>
        <View style={[styles.counterCard, { borderColor: Colors.warning + '44' }]}>
          <Text style={styles.counterLabel}>🟡 Avisos</Text>
          <Text style={[styles.counterValue, { color: Colors.warning }]}>{warningCount}</Text>
        </View>
      </View>

      {/* Alertas ativos */}
      <Text style={styles.sectionTitle}>ALERTAS ATIVOS</Text>
      {liveAlerts.length === 0 ? (
        <View style={[styles.emptyCard]}>
          <Text style={{ color: Colors.success, textAlign: 'center', fontWeight: '600' }}>
            ✅ Todos os sistemas operando normalmente
          </Text>
        </View>
      ) : (
        liveAlerts.map((a) => (
          <View
            key={a.id}
            style={[
              styles.alertCard,
              {
                backgroundColor: alertBg(a.level),
                borderColor:     alertColor(a.level) + '33',
                borderLeftColor: alertColor(a.level),
              },
            ]}
          >
            <View style={styles.alertHeader}>
              <View style={styles.alertLeft}>
                <Text style={{ fontSize: 20 }}>{a.icon}</Text>
                <View>
                  <Text style={[styles.alertTitle, { color: alertColor(a.level) }]}>{a.title}</Text>
                  <Text style={styles.alertMsg}>{a.msg}</Text>
                </View>
              </View>
              <StatusBadge level={a.level} />
            </View>
          </View>
        ))
      )}

      {/* Histórico */}
      <Text style={styles.sectionTitle}>HISTÓRICO ({state.alertHistory.length})</Text>
      {state.alertHistory.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ color: Colors.textMuted, textAlign: 'center' }}>Nenhum alerta registrado</Text>
        </View>
      ) : (
        state.alertHistory.slice(0, 10).map((a, i) => (
          <View key={i} style={styles.historyCard}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.historyMsg, { color: a.level === 'critical' ? Colors.danger : Colors.warning }]}>
                {a.message}
              </Text>
              <Text style={styles.historyTime}>{a.time}</Text>
            </View>
            <StatusBadge level={a.level} />
          </View>
        ))
      )}
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

  countersRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  counterCard: {
    flex:            1,
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    padding:         14,
  },
  counterLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  counterValue: { fontSize: 28, fontWeight: '700' },

  alertCard: {
    borderRadius:    12,
    borderWidth:     1,
    borderLeftWidth: 3,
    padding:         14,
    marginBottom:    8,
  },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  alertLeft:   { flexDirection: 'row', gap: 8, alignItems: 'flex-start', flex: 1 },
  alertTitle:  { fontSize: 13, fontWeight: '600' },
  alertMsg:    { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         14,
    marginBottom:    8,
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    gap:             8,
  },
  historyMsg:  { fontSize: 12, flex: 1 },
  historyTime: { fontSize: 11, color: Colors.textDim, marginTop: 2 },

  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         24,
    marginBottom:    8,
  },
});
