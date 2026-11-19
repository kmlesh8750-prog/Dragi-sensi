import { useEffect, useMemo, useState } from 'react';
import { DeviceControlRail } from './components/DeviceControlRail';
import { DragPracticeLab } from './components/DragPracticeLab';
import { Header } from './components/Header';
import { SavedPresetsTable } from './components/SavedPresetsTable';
import { SensitivityMatrix } from './components/SensitivityMatrix';
import { WeaponBlueprints } from './components/WeaponBlueprints';
import { buildCustomDevice, DEVICE_CATALOG } from './data/devices';
import { COPY } from './data/translations';
import { calculateCalibration } from './engine/calibration';
import {
  DeviceOS,
  DeviceProfile,
  DragStyle,
  GripMode,
  Language,
  SavedPreset,
  SensitivityKey,
  SensitivityValues,
  WeaponFocus,
} from './types/sensi';

const STORAGE_KEY = 'dragi_sensi_saved_presets_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const copy = COPY[language];

  // Device State
  const [catalogDevice, setCatalogDevice] = useState<DeviceProfile>(DEVICE_CATALOG[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('Nothing Phone (2a)');
  const [customOs, setCustomOs] = useState<DeviceOS>('android');
  const [customRam, setCustomRam] = useState(8);
  const [customHz, setCustomHz] = useState(120);

  // Calibration Input State
  const [dpi, setDpi] = useState<number>(560);
  const [grip, setGrip] = useState<GripMode>('3-finger');
  const [dragStyle, setDragStyle] = useState<DragStyle>('onetap');
  const [weaponFocus, setWeaponFocus] = useState<WeaponFocus>('all');

  // Optional Manual Fine-Tune Overrides
  const [manualOverrides, setManualOverrides] = useState<Partial<SensitivityValues> | null>(null);
  const [copied, setCopied] = useState(false);

  // Saved Presets (localStorage)
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedPreset[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPresets));
    } catch {
      // Ignore storage quota issues
    }
  }, [savedPresets]);

  const activeDevice: DeviceProfile = useMemo(() => {
    if (isCustomMode) {
      return buildCustomDevice(customName, {
        os: customOs,
        ramGB: customRam,
        refreshRate: customHz,
      });
    }
    return catalogDevice;
  }, [isCustomMode, customName, customOs, customRam, customHz, catalogDevice]);

  const calibration = useMemo(() => {
    return calculateCalibration({
      device: activeDevice,
      dpi,
      grip,
      dragStyle,
      weaponFocus,
    });
  }, [activeDevice, dpi, grip, dragStyle, weaponFocus]);

  const effectiveSensitivity: SensitivityValues = useMemo(() => {
    if (!manualOverrides) return calibration.sensitivity;
    return {
      ...calibration.sensitivity,
      ...manualOverrides,
    };
  }, [calibration.sensitivity, manualOverrides]);

  const handleSelectCatalogDevice = (device: DeviceProfile) => {
    setCatalogDevice(device);
    setIsCustomMode(false);
    setManualOverrides(null);
    // Keep DPI within sensible range when switching to iOS or budget devices
    if (device.os === 'ios' && dpi > device.maxSafeDpi) {
      setDpi(device.defaultDpi);
    }
  };

  const handleSliderChange = (key: SensitivityKey, value: number) => {
    setManualOverrides((prev) => ({
      ...(prev ?? {}),
      [key]: value,
    }));
  };

  const handleCopyAll = async () => {
    const text = [
      `Dragi Sensi — ${activeDevice.name} (${dpi} DPI)`,
      `Focus: ${weaponFocus.toUpperCase()} | Fire Button: ${calibration.metrics.fireButtonSize}%`,
      `General: ${effectiveSensitivity.general}`,
      `Red Dot: ${effectiveSensitivity.redDot}`,
      `2x Scope: ${effectiveSensitivity.scope2x}`,
      `4x Scope: ${effectiveSensitivity.scope4x}`,
      `Sniper Scope: ${effectiveSensitivity.sniperScope}`,
      `Free Look: ${effectiveSensitivity.freeLook}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback copy for restricted environments
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePreset = (label: string) => {
    const newPreset: SavedPreset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label: label.trim() || `${activeDevice.name} · ${dpi} DPI`,
      deviceName: activeDevice.name,
      brand: activeDevice.brand,
      dpi,
      weaponFocus,
      grip,
      dragStyle,
      sensitivity: effectiveSensitivity,
      fireButtonSize: calibration.metrics.fireButtonSize,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setSavedPresets((prev) => [newPreset, ...prev]);
  };

  const handleLoadPreset = (preset: SavedPreset) => {
    const found = DEVICE_CATALOG.find((d) => d.name === preset.deviceName);
    if (found) {
      setCatalogDevice(found);
      setIsCustomMode(false);
    } else {
      setCustomName(preset.deviceName);
      setIsCustomMode(true);
    }
    setDpi(preset.dpi);
    setWeaponFocus(preset.weaponFocus);
    setGrip(preset.grip);
    setDragStyle(preset.dragStyle);
    setManualOverrides(preset.sensitivity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePreset = (id: string) => {
    setSavedPresets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100">
      <Header copy={copy} copied={copied} onCopyAll={handleCopyAll} />

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Headline */}
        <section id="calibrator" className="scroll-mt-24 max-w-3xl">
          <p className="text-xs font-semibold tracking-wide text-rose-400">
            {copy.heroEyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-2xl">
            {copy.heroDesc}
          </p>
        </section>

        {/* Primary Calibration Workspace */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <DeviceControlRail
            language={language}
            onLanguageChange={setLanguage}
            copy={copy}
            selectedDevice={activeDevice}
            onSelectCatalogDevice={handleSelectCatalogDevice}
            isCustomMode={isCustomMode}
            onToggleCustomMode={(custom) => {
              setIsCustomMode(custom);
              setManualOverrides(null);
            }}
            customName={customName}
            onCustomNameChange={(name) => {
              setCustomName(name);
              setManualOverrides(null);
            }}
            customOs={customOs}
            onCustomOsChange={(os) => {
              setCustomOs(os);
              setManualOverrides(null);
            }}
            customRam={customRam}
            onCustomRamChange={(ram) => {
              setCustomRam(ram);
              setManualOverrides(null);
            }}
            customHz={customHz}
            onCustomHzChange={(hz) => {
              setCustomHz(hz);
              setManualOverrides(null);
            }}
            dpi={dpi}
            onDpiChange={(val) => {
              setDpi(val);
              setManualOverrides(null);
            }}
            grip={grip}
            onGripChange={(g) => {
              setGrip(g);
              setManualOverrides(null);
            }}
            dragStyle={dragStyle}
            onDragStyleChange={(s) => {
              setDragStyle(s);
              setManualOverrides(null);
            }}
            stabilityStatus={calibration.metrics.stabilityStatus}
          />

          <div className="flex-1 min-w-0">
            <SensitivityMatrix
              copy={copy}
              device={activeDevice}
              dpi={dpi}
              weaponFocus={weaponFocus}
              onWeaponFocusChange={(focus) => {
                setWeaponFocus(focus);
                setManualOverrides(null);
              }}
              sensitivity={effectiveSensitivity}
              isManuallyEdited={manualOverrides !== null}
              onSliderChange={handleSliderChange}
              onResetAuto={() => setManualOverrides(null)}
              metrics={calibration.metrics}
              onSavePreset={handleSavePreset}
              onCopyConfig={handleCopyAll}
              copied={copied}
            />
          </div>
        </section>

        {/* Signature Weapon Red-Number Blueprints */}
        <WeaponBlueprints
          language={language}
          copy={copy}
          blueprints={calibration.blueprints}
          activeFocus={weaponFocus}
          onSelectFocus={(focus) => {
            setWeaponFocus(focus);
            setManualOverrides(null);
          }}
        />

        {/* Interactive Drag & Flick Practice Pad */}
        <DragPracticeLab
          copy={copy}
          generalSensitivity={effectiveSensitivity.general}
          dpiMultiplier={calibration.metrics.dpiMultiplier}
          fireButtonSize={calibration.metrics.fireButtonSize}
          weaponFocus={weaponFocus}
        />

        {/* Saved Presets & Reference Chart */}
        <SavedPresetsTable
          copy={copy}
          savedPresets={savedPresets}
          onLoadPreset={handleLoadPreset}
          onDeletePreset={handleDeletePreset}
          onQuickSaveCurrent={() => handleSavePreset('')}
        />
      </main>

      <footer className="mt-16 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
          <span>Dragi Sensi</span>
          <span>Free Fire OB44+ 0–200 Scale · M1887 · Desert Eagle · UMP</span>
        </div>
      </footer>
    </div>
  );
}
