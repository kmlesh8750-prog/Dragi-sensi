export type Language = 'hi' | 'en';

export type WeaponFocus = 'all' | 'm1887' | 'deagle' | 'ump';

export type GripMode = '2-finger' | '3-finger' | '4-finger';

export type DragStyle = 'onetap' | 'balanced' | 'spray';

export type ChipsetTier = 'entry' | 'mid' | 'upper' | 'flagship' | 'ios';

export type DeviceOS = 'android' | 'ios';

export interface DeviceProfile {
  id: string;
  name: string;
  brand: string;
  os: DeviceOS;
  refreshRate: number;
  touchSamplingHz: number;
  ramGB: number;
  screenInches: number;
  defaultDpi: number;
  maxSafeDpi: number;
  chipsetTier: ChipsetTier;
  isCustom?: boolean;
}

export interface SensitivityValues {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
}

export type SensitivityKey = keyof SensitivityValues;

export interface CalibrationInput {
  device: DeviceProfile;
  dpi: number;
  grip: GripMode;
  dragStyle: DragStyle;
  weaponFocus: WeaponFocus;
}

export interface CalibrationMetrics {
  fireButtonSize: number;
  fireButtonOffsetPx: number;
  dpiMultiplier: number;
  effectiveTouchGain: number;
  pointerSpeedAndroid: number;
  iosTrackingSpeed: number;
  stabilityStatus: 'optimal' | 'tight' | 'high-risk';
  headLockWindow: string;
}

export interface WeaponBlueprint {
  id: Exclude<WeaponFocus, 'all'>;
  name: string;
  categoryHi: string;
  categoryEn: string;
  imagePath: string;
  fireButtonSize: number;
  recommendedGeneral: number;
  recommendedRedDot: number;
  recommendedScope2x: number;
  dragPathHi: string;
  dragPathEn: string;
  crosshairStartHi: string;
  crosshairStartEn: string;
  effectiveRange: string;
  headshotTipHi: string;
  headshotTipEn: string;
}

export interface CalibrationResult {
  sensitivity: SensitivityValues;
  metrics: CalibrationMetrics;
  blueprints: WeaponBlueprint[];
}

export interface SavedPreset {
  id: string;
  label: string;
  deviceName: string;
  brand: string;
  dpi: number;
  weaponFocus: WeaponFocus;
  grip: GripMode;
  dragStyle: DragStyle;
  sensitivity: SensitivityValues;
  fireButtonSize: number;
  createdAt: string;
}
