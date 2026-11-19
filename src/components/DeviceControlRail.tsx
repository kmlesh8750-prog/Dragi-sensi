import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, Search, Smartphone } from 'lucide-react';
import { DEVICE_CATALOG } from '../data/devices';
import { CopyBundle } from '../data/translations';
import { DeviceOS, DeviceProfile, DragStyle, GripMode, Language } from '../types/sensi';

interface DeviceControlRailProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  copy: CopyBundle;
  selectedDevice: DeviceProfile;
  onSelectCatalogDevice: (device: DeviceProfile) => void;
  isCustomMode: boolean;
  onToggleCustomMode: (custom: boolean) => void;
  customName: string;
  onCustomNameChange: (name: string) => void;
  customOs: DeviceOS;
  onCustomOsChange: (os: DeviceOS) => void;
  customRam: number;
  onCustomRamChange: (ram: number) => void;
  customHz: number;
  onCustomHzChange: (hz: number) => void;
  dpi: number;
  onDpiChange: (dpi: number) => void;
  grip: GripMode;
  onGripChange: (grip: GripMode) => void;
  dragStyle: DragStyle;
  onDragStyleChange: (style: DragStyle) => void;
  stabilityStatus: 'optimal' | 'tight' | 'high-risk';
}

export function DeviceControlRail({
  language,
  onLanguageChange,
  copy,
  selectedDevice,
  onSelectCatalogDevice,
  isCustomMode,
  onToggleCustomMode,
  customName,
  onCustomNameChange,
  customOs,
  onCustomOsChange,
  customRam,
  onCustomRamChange,
  customHz,
  onCustomHzChange,
  dpi,
  onDpiChange,
  grip,
  onGripChange,
  dragStyle,
  onDragStyleChange,
  stabilityStatus,
}: DeviceControlRailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('All');

  const brands = useMemo(() => {
    const unique = Array.from(new Set(DEVICE_CATALOG.map((d) => d.brand)));
    return ['All', ...unique];
  }, []);

  const filteredDevices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DEVICE_CATALOG.filter((d) => {
      const brandMatch = brandFilter === 'All' || d.brand === brandFilter;
      const textMatch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q);
      return brandMatch && textMatch;
    });
  }, [searchQuery, brandFilter]);

  const dpiPresets = useMemo(() => {
    if (selectedDevice.os === 'ios') {
      return [
        { label: 'Stock', value: selectedDevice.defaultDpi },
        { label: '430', value: 430 },
        { label: '480', value: 480 },
      ];
    }
    return [
      { label: 'Stock', value: selectedDevice.defaultDpi },
      { label: '480', value: 480 },
      { label: '560', value: 560 },
      { label: '680', value: 680 },
      { label: '800', value: 800 },
    ];
  }, [selectedDevice.defaultDpi, selectedDevice.os]);

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6 rounded-xl border border-white/10 bg-[#121824] p-5">
      {/* Workspace Toolbar: Language Switcher */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Smartphone className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
          <span>{copy.deviceSectionTitle}</span>
        </div>
        <div
          role="group"
          aria-label="Language switch"
          className="inline-flex items-center rounded-lg bg-[#0B0F17] p-1 border border-white/10"
        >
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              language === 'hi'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              language === 'en'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Device Selection Mode */}
      {!isCustomMode ? (
        <div className="space-y-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchDevicePlaceholder}
              aria-label={copy.searchDevicePlaceholder}
              className="w-full rounded-lg border border-white/10 bg-[#0B0F17] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="brand-filter" className="sr-only">
              Filter by brand
            </label>
            <select
              id="brand-filter"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2 text-xs font-medium text-slate-200 focus:border-rose-500 focus:outline-none"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === 'All' ? 'All Brands (44 Devices)' : brand}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable Device List */}
          <div
            role="listbox"
            aria-label="Smartphone models"
            className="max-h-56 overflow-y-auto divide-y divide-white/5 rounded-lg border border-white/10 bg-[#0B0F17]"
          >
            {filteredDevices.length === 0 ? (
              <div className="px-3 py-5 text-center text-xs text-slate-400">
                No match found. Try entering a custom device name below.
              </div>
            ) : (
              filteredDevices.map((device) => {
                const isSelected = !selectedDevice.isCustom && selectedDevice.id === device.id;
                return (
                  <button
                    key={device.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onSelectCatalogDevice(device)}
                    className={`w-full px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600/15 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{device.name}</span>
                      <span className="font-mono text-xs tabular-nums text-slate-400 shrink-0">
                        {device.refreshRate}Hz
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                      <span>{device.ramGB}GB RAM</span>
                      <span aria-hidden="true">·</span>
                      <span>{device.touchSamplingHz}Hz Touch</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Base {device.defaultDpi}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleCustomMode(true)}
            className="w-full text-left text-xs font-medium text-rose-400 hover:text-rose-300 hover:underline underline-offset-4 cursor-pointer py-1"
          >
            + {copy.customDeviceToggle}
          </button>
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border border-white/10 bg-[#0B0F17] p-3.5">
          <div>
            <label
              htmlFor="custom-device-name"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {copy.customDeviceLabel}
            </label>
            <input
              id="custom-device-name"
              type="text"
              value={customName}
              onChange={(e) => onCustomNameChange(e.target.value)}
              placeholder="e.g. Nothing Phone 2a"
              className="w-full rounded-lg border border-white/10 bg-[#121824] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label
                htmlFor="custom-os"
                className="block text-xs text-slate-400 mb-1"
              >
                {copy.customOsLabel}
              </label>
              <select
                id="custom-os"
                value={customOs}
                onChange={(e) => onCustomOsChange(e.target.value as DeviceOS)}
                className="w-full rounded-md border border-white/10 bg-[#121824] px-2 py-1.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="custom-ram"
                className="block text-xs text-slate-400 mb-1"
              >
                {copy.customRamLabel}
              </label>
              <select
                id="custom-ram"
                value={customRam}
                onChange={(e) => onCustomRamChange(Number(e.target.value))}
                className="w-full rounded-md border border-white/10 bg-[#121824] px-2 py-1.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value={3}>3 GB</option>
                <option value={4}>4 GB</option>
                <option value={6}>6 GB</option>
                <option value={8}>8 GB</option>
                <option value={12}>12 GB</option>
                <option value={16}>16 GB</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="custom-hz"
                className="block text-xs text-slate-400 mb-1"
              >
                {copy.customHzLabel}
              </label>
              <select
                id="custom-hz"
                value={customHz}
                onChange={(e) => onCustomHzChange(Number(e.target.value))}
                className="w-full rounded-md border border-white/10 bg-[#121824] px-2 py-1.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value={60}>60Hz</option>
                <option value={90}>90Hz</option>
                <option value={120}>120Hz</option>
                <option value={144}>144Hz</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleCustomMode(false)}
            className="text-xs font-medium text-slate-300 hover:text-white hover:underline underline-offset-4 cursor-pointer"
          >
            ← {copy.useCatalogDevice}
          </button>
        </div>
      )}

      {/* DPI Control */}
      <div className="space-y-3 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="dpi-number-input" className="text-sm font-semibold text-white">
            {copy.dpiControlTitle}
          </label>
          <input
            id="dpi-number-input"
            type="number"
            min={320}
            max={1000}
            step={5}
            value={dpi}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) {
                onDpiChange(Math.max(320, Math.min(1000, v)));
              }
            }}
            className="w-20 rounded-md border border-white/15 bg-[#0B0F17] px-2.5 py-1 text-right font-mono text-sm font-semibold tabular-nums text-white focus:border-rose-500 focus:outline-none"
          />
        </div>

        <input
          type="range"
          min={320}
          max={1000}
          step={5}
          value={dpi}
          onChange={(e) => onDpiChange(Number(e.target.value))}
          aria-label="DPI slider"
          className="sensi-range w-full"
        />

        <div className="flex flex-wrap items-center gap-1.5">
          {dpiPresets.map((preset) => {
            const active = dpi === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onDpiChange(preset.value)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium tabular-nums transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-rose-600 text-white'
                    : 'bg-[#0B0F17] text-slate-300 border border-white/10 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          {selectedDevice.os === 'ios' ? copy.dpiHintIos : copy.dpiHintAndroid}
        </p>

        {/* DPI Status Advisory (Icon + Text, never color-only) */}
        <div
          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
            stabilityStatus === 'high-risk'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
              : stabilityStatus === 'optimal'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
              : 'border-white/10 bg-[#0B0F17] text-slate-300'
          }`}
        >
          {stabilityStatus === 'high-risk' ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
          ) : stabilityStatus === 'optimal' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
          ) : (
            <Info className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" aria-hidden="true" />
          )}
          <span>
            {stabilityStatus === 'high-risk'
              ? copy.dpiSafeWarning
              : stabilityStatus === 'optimal'
              ? copy.dpiOptimalNote
              : copy.dpiTightNote}
          </span>
        </div>
      </div>

      {/* Grip & Drag Style */}
      <div className="space-y-4 border-t border-white/10 pt-5">
        <div>
          <span className="block text-xs font-semibold text-slate-300 mb-2">
            {copy.gripTitle}
          </span>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#0B0F17] p-1 border border-white/10">
            {(['2-finger', '3-finger', '4-finger'] as GripMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onGripChange(mode)}
                className={`rounded-md py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  grip === mode
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === '2-finger' ? '2 Finger' : mode === '3-finger' ? '3 Finger' : '4 Finger'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-300 mb-2">
            {copy.dragStyleTitle}
          </span>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#0B0F17] p-1 border border-white/10">
            {([
              { id: 'onetap', label: copy.styleOneTap },
              { id: 'balanced', label: copy.styleBalanced },
              { id: 'spray', label: copy.styleSpray },
            ] as { id: DragStyle; label: string }[]).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onDragStyleChange(item.id)}
                className={`rounded-md py-1.5 px-1 text-xs font-medium transition-colors whitespace-nowrap truncate cursor-pointer ${
                  dragStyle === item.id
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
