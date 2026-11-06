/** Curated icon set for Feature Grid items (rendered with lucide-react on the frontend). */
export const FEATURE_ICON_OPTIONS = [
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Shield', value: 'shield-check' },
  { label: 'Chart', value: 'trending-up' },
  { label: 'Code', value: 'code' },
  { label: 'Layers', value: 'layers' },
  { label: 'Lightning', value: 'zap' },
  { label: 'Target', value: 'target' },
  { label: 'Users', value: 'users' },
  { label: 'Globe', value: 'globe' },
  { label: 'Settings', value: 'settings' },
  { label: 'Message', value: 'message-circle' },
] as const

export type FeatureIconName = (typeof FEATURE_ICON_OPTIONS)[number]['value']
