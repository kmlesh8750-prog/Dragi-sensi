import { useMemo, useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { DEVICE_CATALOG } from '../data/devices';
import { CopyBundle } from '../data/translations';
import { calculateCalibration } from '../engine/calibration';
import { SavedPreset, WeaponFocus } from '../types/sensi';

interface SavedPresetsTableProps {
  copy: CopyBundle;
  savedPresets: SavedPreset[];
  onLoadPreset: (preset: SavedPreset) => void;
  onDeletePreset: (id: string) => void;
  onQuickSaveCurrent: () => void;
}

const REFERENCE_IDS = [
  { id: 'iqoo-neo-9-pro', dpi: 580, focus: 'm1887' as WeaponFocus },
  { id: 'poco-x6-pro', dpi: 560, focus: 'deagle' as WeaponFocus },
  { id: 'redmi-note-13-pro', dpi: 520, focus: 'ump' as WeaponFocus },
  { id: 'samsung-s24-ultra', dpi: 600, focus: 'all' as WeaponFocus },
  { id: 'oneplus-12r', dpi: 580, focus: 'm1887' as WeaponFocus },
  { id: 'infinix-gt-20-pro', dpi: 540, focus: 'ump' as WeaponFocus },
  { id: 'redmi-9a', dpi: 440, focus: 'all' as WeaponFocus },
  { id: 'iphone-15-pro-max', dpi: 430, focus: 'deagle' as WeaponFocus },
];

export function SavedPresetsTable({
  copy,
  savedPresets,
  onLoadPreset,
  onDeletePreset,
  onQuickSaveCurrent,
}: SavedPresetsTableProps) {
  const [activeTab, setActiveTab] = useState<'saved' | 'reference'>(
    savedPresets.length > 0 ? 'saved' : 'reference'
  );
  const [tableSearch, setTableSearch] = useState('');

  const referencePresets: SavedPreset[] = useMemo(() => {
    return REFERENCE_IDS.map((ref) => {
      const device = DEVICE_CATALOG.find((d) => d.id === ref.id) ?? DEVICE_CATALOG[0];
      const result = calculateCalibration({
        device,
        dpi: ref.dpi,
        grip: '3-finger',
        dragStyle: 'onetap',
        weaponFocus: ref.focus,
      });
      return {
        id: `ref-${device.id}`,
        label: device.name,
        deviceName: device.name,
        brand: device.brand,
        dpi: ref.dpi,
        weaponFocus: ref.focus,
        grip: '3-finger',
        dragStyle: 'onetap',
        sensitivity: result.sensitivity,
        fireButtonSize: result.metrics.fireButtonSize,
        createdAt: '2026-01-01',
      };
    });
  }, []);

  const rows = activeTab === 'saved' ? savedPresets : referencePresets;
  const filteredRows = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.deviceName.toLowerCase().includes(q) ||
        String(r.dpi).includes(q)
    );
  }, [rows, tableSearch]);

  const formatFocus = (f: WeaponFocus) => {
    if (f === 'm1887') return 'M1887';
    if (f === 'deagle') return 'Desert Eagle';
    if (f === 'ump') return 'UMP';
    return 'All';
  };

  return (
    <section id="saved" className="scroll-mt-20 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white text-balance">
            {copy.savedSectionTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{copy.savedSectionSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Preset tables"
            className="inline-flex rounded-lg bg-[#121824] p-1 border border-white/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'saved'}
              onClick={() => setActiveTab('saved')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {copy.tabSaved} ({savedPresets.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'reference'}
              onClick={() => setActiveTab('reference')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'reference'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {copy.tabReference}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121824]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Filter by device or DPI..."
            aria-label="Filter presets"
            className="w-full max-w-xs rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        {activeTab === 'saved' && savedPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <Bookmark className="h-7 w-7 text-slate-500" aria-hidden="true" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              {copy.savedEmptyTitle}
            </h3>
            <p className="mt-1 max-w-md text-xs text-slate-400">
              {copy.savedEmptyDesc}
            </p>
            <button
              type="button"
              onClick={onQuickSaveCurrent}
              className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors cursor-pointer"
            >
              {copy.savedEmptyCta}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#0B0F17] text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 font-medium">{copy.colDevice}</th>
                  <th className="px-4 py-2.5 font-medium text-right">{copy.colDpi}</th>
                  <th className="px-4 py-2.5 font-medium">{copy.colFocus}</th>
                  <th className="px-4 py-2.5 font-medium text-right">{copy.colGeneral}</th>
                  <th className="px-4 py-2.5 font-medium text-right">{copy.colRedDot}</th>
                  <th className="px-4 py-2.5 font-medium text-right">{copy.colFireBtn}</th>
                  <th className="px-4 py-2.5 font-medium text-right">{copy.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="h-10 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-2 font-medium text-white whitespace-nowrap">
                      <span>{row.label}</span>
                      {row.label !== row.deviceName && (
                        <span className="ml-2 text-slate-400 font-normal">
                          · {row.deviceName}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-slate-200">
                      {row.dpi}
                    </td>
                    <td className="px-4 py-2 text-slate-300 whitespace-nowrap">
                      {formatFocus(row.weaponFocus)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-semibold tabular-nums text-rose-400">
                      {row.sensitivity.general}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-slate-200">
                      {row.sensitivity.redDot}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-slate-200">
                      {row.fireButtonSize}%
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onLoadPreset(row)}
                          className="rounded-md border border-white/15 bg-[#0B0F17] px-2.5 py-1 text-xs font-medium text-white hover:bg-white/10 cursor-pointer"
                        >
                          {copy.loadBtn}
                        </button>
                        {activeTab === 'saved' && (
                          <button
                            type="button"
                            onClick={() => onDeletePreset(row.id)}
                            aria-label={`${copy.deleteBtn} ${row.label}`}
                            className="rounded-md p-1 text-slate-400 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
