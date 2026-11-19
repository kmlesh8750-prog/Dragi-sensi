import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { CopyBundle } from '../data/translations';
import { Language, WeaponBlueprint, WeaponFocus } from '../types/sensi';

interface WeaponBlueprintsProps {
  language: Language;
  copy: CopyBundle;
  blueprints: WeaponBlueprint[];
  activeFocus: WeaponFocus;
  onSelectFocus: (focus: WeaponFocus) => void;
}

function WeaponImage({
  src,
  alt,
  weaponName,
}: {
  src: string;
  alt: string;
  weaponName: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#182030] to-[#0B0F17] text-slate-400">
        <Crosshair className="h-8 w-8 text-rose-500/80" aria-hidden="true" />
        <span className="font-display text-sm font-semibold text-slate-200">
          {weaponName}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
    />
  );
}

export function WeaponBlueprints({
  language,
  copy,
  blueprints,
  activeFocus,
  onSelectFocus,
}: WeaponBlueprintsProps) {
  return (
    <section id="weapons" className="scroll-mt-20 space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white text-balance">
          {copy.weaponsSectionTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{copy.weaponsSectionSub}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {blueprints.map((bp) => {
          const isFocused = activeFocus === bp.id;
          return (
            <article
              key={bp.id}
              className={`group flex flex-col overflow-hidden rounded-xl border bg-[#121824] transition-colors ${
                isFocused ? 'border-rose-500/70' : 'border-white/10'
              }`}
            >
              <div className="relative overflow-hidden border-b border-white/10 bg-[#0B0F17]">
                <WeaponImage
                  src={bp.imagePath}
                  alt={`${bp.name} Free Fire headshot calibration render`}
                  weaponName={bp.name}
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                {/* Direct Title + Unboxed Metadata */}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-white">
                    {bp.name}
                  </h3>
                  <span className="font-mono text-xs tabular-nums text-slate-400">
                    {bp.effectiveRange}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>{language === 'hi' ? bp.categoryHi : bp.categoryEn}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {copy.fireBtnLabel}:{' '}
                    <strong className="font-mono tabular-nums text-rose-400">
                      {bp.fireButtonSize}%
                    </strong>
                  </span>
                </div>

                {/* Tabular Key Numbers */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-[#0B0F17] py-2.5 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">General</div>
                    <div className="font-mono text-base font-bold tabular-nums text-white">
                      {bp.recommendedGeneral}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Red Dot</div>
                    <div className="font-mono text-base font-bold tabular-nums text-white">
                      {bp.recommendedRedDot}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">2x Scope</div>
                    <div className="font-mono text-base font-bold tabular-nums text-white">
                      {bp.recommendedScope2x}
                    </div>
                  </div>
                </div>

                {/* Drag Mechanics */}
                <dl className="mt-4 space-y-2.5 text-xs">
                  <div>
                    <dt className="text-slate-400">{copy.dragPathLabel}</dt>
                    <dd className="mt-0.5 font-medium text-slate-100">
                      {language === 'hi' ? bp.dragPathHi : bp.dragPathEn}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">{copy.aimStartLabel}</dt>
                    <dd className="mt-0.5 font-medium text-slate-100">
                      {language === 'hi' ? bp.crosshairStartHi : bp.crosshairStartEn}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-300 flex-1">
                  {language === 'hi' ? bp.headshotTipHi : bp.headshotTipEn}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectFocus(isFocused ? 'all' : bp.id)}
                  className={`mt-4 w-full rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isFocused
                      ? 'bg-rose-600 text-white'
                      : 'border border-white/15 bg-[#0B0F17] text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isFocused ? copy.activeFocusLabel : copy.applyFocusBtn}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
