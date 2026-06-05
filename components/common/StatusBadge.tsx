import React from 'react';
import { View, Text } from 'react-native';
import { Colors, alertColor, alertBg } from '@/lib/theme';
import { AlertLevel } from '@/lib/types';

interface StatusBadgeProps {
  level: AlertLevel | 'ok';
  label?: string;
}

const LABELS: Record<string, string> = {
  critical: 'CRÍTICO',
  warning:  'AVISO',
  info:     'INFO',
  ok:       'OK',
};

/**
 * Pill colorida de status/nível de alerta.
 */
export function StatusBadge({ level, label }: StatusBadgeProps) {
  const color = level === 'ok' ? Colors.success   : alertColor(level as AlertLevel);
  const bg    = level === 'ok' ? Colors.successBg : alertBg(level as AlertLevel);

  return (
    <View
      style={{
        flexDirection:  'row',
        alignItems:     'center',
        alignSelf:      'flex-start',
        borderRadius:   20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: bg,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '700', color }}>
        {label ?? LABELS[level] ?? level.toUpperCase()}
      </Text>
    </View>
  );
}
