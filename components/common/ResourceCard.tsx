import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { Colors, BorderRadius } from '@/lib/theme';
import { StatusBadge } from './StatusBadge';

interface ResourceCardProps {
  icon:       string;
  label:      string;
  value:      number;
  unit:       string;
  color:      string;
  isAlert:    boolean;
  /** Série histórica para sparkline (opcional) */
  history?:   number[];
}

/**
 * Card de recurso da missão com valor atual, status e sparkline.
 */
export function ResourceCard({
  icon, label, value, unit, color, isAlert, history,
}: ResourceCardProps) {
  return (
    <View
      style={{
        flex:            1,
        backgroundColor: Colors.surface,
        borderRadius:    BorderRadius.lg,
        padding:         12,
        borderWidth:     1,
        borderColor:     isAlert ? color + '44' : Colors.border,
      }}
    >
      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        {isAlert && <StatusBadge level="warning" label="Alerta" />}
      </View>

      {/* Valor */}
      <Text
        style={{
          fontSize:   22,
          fontWeight: '700',
          color:      isAlert ? Colors.danger : color,
          marginTop:  6,
          marginBottom: 2,
        }}
      >
        {value.toFixed(1)}
        <Text style={{ fontSize: 12, fontWeight: '400', color: Colors.textMuted }}>
          {unit}
        </Text>
      </Text>

      <Text style={{ fontSize: 12, color: Colors.textMuted, marginBottom: history ? 6 : 0 }}>
        {label}
      </Text>

      {/* Sparkline */}
      {history && history.length >= 2 && (
        <Sparkline data={history} color={color} />
      )}
    </View>
  );
}

// ─── Sparkline mini ───────────────────────────────────────────────────────────

interface SparklineProps {
  data:  number[];
  color: string;
}

function Sparkline({ data, color }: SparklineProps) {
  const W = 80, H = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const lastX = W;
  const lastY = H - ((data[data.length - 1] - min) / range) * (H - 4) - 2;

  return (
    <Svg width={W} height={H}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Circle cx={lastX} cy={lastY} r={3} fill={color} />
    </Svg>
  );
}
