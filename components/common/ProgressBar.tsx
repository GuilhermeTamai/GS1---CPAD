import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/lib/theme';

interface ProgressBarProps {
  value:     number; // 0–100
  color:     string;
  height?:   number;
  width?:    number | string;
}

/**
 * Barra de progresso horizontal simples.
 */
export function ProgressBar({ value, color, height = 4, width = 80 }: ProgressBarProps) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius:    height,
        overflow:        'hidden',
      }}
    >
      <View
        style={{
          width:           `${pct}%`,
          height:          '100%',
          backgroundColor: color,
          borderRadius:    height,
        }}
      />
    </View>
  );
}
