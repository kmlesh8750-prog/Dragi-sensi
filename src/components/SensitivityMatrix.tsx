import { useState } from 'react';
import { BookmarkPlus, Check, Copy, Minus, Plus, RotateCcw } from 'lucide-react';
import { CopyBundle } from '../data/translations';
import {
  CalibrationMetrics,
  DeviceProfile,
  SensitivityKey,
  SensitivityValues,
  WeaponFocus,
} from '../types/sensi';

interface SensitivityMatrixProps {
  copy: CopyBundle;
  device: DeviceProfile;
  dpi: number;
  weaponFocus: WeaponFocus;
  onWeaponFocusChange: (focus: WeaponFocus) => void;
  sensitivity: SensitivityValues;
  isManuallyEdited: boolean;
  onSliderChange: (key: SensitivityKey, value: number) => void;
  onResetAuto: () => void;
  metrics: CalibrationMetrics;
  onSavePreset: (label: string) => void;
  onCopyConfig: () => void;
  copied: boolean;
}

const SLIDER_ORDER: SensitivityKey[] = [
  'general',
  'redDot',
  'scope2x',
  'scope4x',
  'sniperScope',
  'freeLook',
];

export function SensitivityMatrix({
  copy,
  device,
  dpi,
  weaponFocus,
  onWeaponFocusChange,
  sensitivity,
  isManuallyEdited,
  onSliderChange,
  onResetAuto,
  metrics,
  onSavePreset,
  onCopyConfig,
  copied,
}: SensitivityMatrixProps) {
  const [presetLabel, setPresetLabel] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    onSavePreset(presetLabel);
    setPresetLabel('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Active Device & Weapon Focus Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#121824] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-bold text-white font-display">
            {device.name}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-mono tabular-nums text-slate-200">{dpi} DPI</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{device.refreshRate}Hz Display</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{device.touchSamplingHz}Hz Touch</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{device.ramGB}GB RAM</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-400 font-medium">{metrics.headLockWindow}</span>
          </div>
        </div>

        {/* Interactive Weapon Focus Tabs */}
        <div
          role="tablist"
          aria-label={copy.weaponFocusLabel}
          className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#0B0F17] p-1 border border-white/10 shrink-0"
        >
          {(
            [
              { id: 'all', label: copy.focusAll },
              { id: 'm1887', label: 'M1887' },
              { id: 'deagle', label: 'Desert Eagle' },
              { id: 'ump', label: 'UMP' },
            ] as { id: WeaponFocus; label: string }[]
          ).map((tab) => {
            const active = weaponFocus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onWeaponFocusChange(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary 6-Slider Calibration Matrix (0 - 200 Scale) */}
      <section className="rounded-xl border border-white/10 bg-[#121824] p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              {copy.sensiMatrixTitle}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">{copy.sensiMatrixSub}</p>
          </div>
          {isManuallyEdited && (
            <button
              type="button"
              onClick={onResetAuto}
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-white/15 bg-[#0B0F17] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.resetCalibrated}</span>
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {SLIDER_ORDER.map((key) => {
            const value = sensitivity[key];
            const isPrimary = key === 'general' || key === 'redDot';
            return (
              <div key={key} className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor={`slider-${key}`}
                    className={`text-sm font-semibold ${
                      isPrimary ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {copy.sliderNames[key]}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSliderChange(key, Math.max(0, value - 1))}
                      aria-label={`Decrease ${copy.sliderNames[key]}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#0B0F17] text-slate-300 hover:text-white hover:border-white/25 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span
                      className={`w-12 text-center font-mono text-lg font-bold tabular-nums ${
                        isPrimary ? 'text-rose-400' : 'text-white'
                      }`}
                    >
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSliderChange(key, Math.min(200, value + 1))}
                      aria-label={`Increase ${copy.sliderNames[key]}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#0B0F17] text-slate-300 hover:text-white hover:border-white/25 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <input
                  id={`slider-${key}`}
                  type="range"
                  min={0}
                  max={200}
                  step={1}
                  value={value}
                  onChange={(e) => onSliderChange(key, Number(e.target.value))}
                  className="sensi-range w-full"
                />
              </div>
            );
          })}
        </div>

        {/* 4-Column Hardware & HUD Metrics Strip (Hairline Dividers, Single Elevation) */}
        <div className="mt-6 grid grid-cols-2 divide-y divide-white/10 rounded-lg border border-white/10 bg-[#0B0F17] sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <div className="p-3.5">
            <div className="text-xs text-slate-400">{copy.fireButtonMetric}</div>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-rose-400">
              {metrics.fireButtonSize}%
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
              {copy.hudPlacementHint}: {metrics.fireButtonOffsetPx}px
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-xs text-slate-400">{copy.dpiScaleMetric}</div>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-white">
              {metrics.dpiMultiplier.toFixed(2)}x
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
              Base {device.defaultDpi} → {dpi}
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-xs text-slate-400">{copy.touchGainMetric}</div>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-white">
              {metrics.effectiveTouchGain.toFixed(2)}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
              {device.touchSamplingHz}Hz Sampling
            </div>
          </div>
          <div className="p-3.5">
            <div className="text-xs text-slate-400">
              {device.os === 'ios' ? copy.iosTrackingMetric : copy.pointerSpeedMetric}
            </div>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-white">
              {device.os === 'ios'
                ? `${metrics.iosTrackingSpeed}%`
                : `${metrics.pointerSpeedAndroid} / 7`}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              {device.os === 'ios' ? 'Single-Tap Cursor' : 'System Settings'}
            </div>
          </div>
        </div>

        {/* Save & Copy Actions */}
        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={presetLabel}
              onChange={(e) => setPresetLabel(e.target.value)}
              placeholder={copy.presetNamePlaceholder}
              aria-label={copy.presetNamePlaceholder}
              className="w-full max-w-xs rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0B0F17] px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {justSaved ? (
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <BookmarkPlus className="h-4 w-4 text-rose-400" aria-hidden="true" />
              )}
              <span>{justSaved ? 'Saved' : copy.savePresetBtn}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onCopyConfig}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied' : copy.copyConfigBtn}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
