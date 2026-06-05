import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Polygon, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface LineChartProps {
  data:   number[];
  color:  string;
  height?: number;
}

/**
 * Gráfico de linha SVG com área preenchida (gradiente).
 * Usado nos dashboards de sensores, energia e comunicação.
 */
export function LineChart({ data, color, height = 100 }: LineChartProps) {
  if (!data || data.length < 2) return null;

  const W = 320;
  const H = height;
  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const range = max - min || 1;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H,
  }));

  const linePoints = coords.map(({ x, y }) => `${x},${y}`).join(' ');
  const areaPoints = `${linePoints} ${W},${H} 0,${H}`;

  return (
    <View style={{ width: '100%' }}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>

        {/* Área */}
        <Polygon points={areaPoints} fill="url(#areaGrad)" />

        {/* Linha */}
        <Polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Pontos */}
        {coords.map(({ x, y }, i) => (
          <Circle
            key={i}
            cx={x}
            cy={y}
            r={i === data.length - 1 ? 4 : 2}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.5}
          />
        ))}
      </Svg>
    </View>
  );
}
