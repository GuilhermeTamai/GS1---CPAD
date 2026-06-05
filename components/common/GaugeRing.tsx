import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/lib/theme';

interface GaugeRingProps {
  /** Valor atual (0–max) */
  value: number;
  /** Valor máximo (padrão: 100) */
  max?: number;
  /** Cor principal do anel quando OK */
  color: string;
  /** Tamanho do SVG em px (padrão: 56) */
  size?: number;
  /** Rótulo abaixo do anel */
  label: string;
}

/**
 * Anel SVG circular que exibe o nível de um recurso.
 * Muda automaticamente para amarelo (<50%) ou vermelho (<25%).
 */
export function GaugeRing({ value, max = 100, color, size = 56, label }: GaugeRingProps) {
  const strokeWidth = 5;
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value / max, 0), 1);

  const ringColor =
    pct < 0.25 ? Colors.danger : pct < 0.5 ? Colors.warning : color;

  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {/* Trilha de fundo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${pct * circumference} ${circumference}`}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ fontSize: 9, color: Colors.textMuted }}>{label}</Text>
    </View>
  );
}
