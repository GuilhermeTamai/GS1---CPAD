// Design tokens — tema espacial escuro CosmoDeploy

export const Colors = {
  bg: '#0a0c14',
  surface: '#111624',
  surfaceHover: '#161d2e',
  border: 'rgba(100,130,200,0.18)',
  borderActive: 'rgba(100,160,255,0.4)',
  text: '#e8edf8',
  textMuted: '#b8c3dc',
textDim: '#8fa1c7',
  accent: '#4c8ef5',
  accentGlow: 'rgba(76,142,245,0.15)',
  success: '#30d994',
  successBg: 'rgba(48,217,148,0.12)',
  warning: '#f5a623',
  warningBg: 'rgba(245,166,35,0.12)',
  danger: '#e84d4d',
  dangerBg: 'rgba(232,77,77,0.12)',
  info: '#7b9ef8',
  infoBg: 'rgba(123,158,248,0.12)',
  purple: '#a78bfa',
  purpleBg: 'rgba(167,139,250,0.12)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

/** Retorna a cor semântica por nível de alerta */
export function alertColor(level: 'critical' | 'warning' | 'info'): string {
  if (level === 'critical') return Colors.danger;
  if (level === 'warning') return Colors.warning;
  return Colors.info;
}

/** Retorna o bg semântico por nível de alerta */
export function alertBg(level: 'critical' | 'warning' | 'info'): string {
  if (level === 'critical') return Colors.dangerBg;
  if (level === 'warning') return Colors.warningBg;
  return Colors.infoBg;
}
