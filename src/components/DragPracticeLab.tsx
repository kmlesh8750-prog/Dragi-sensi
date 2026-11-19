import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyBundle } from '../data/translations';
import { WeaponFocus } from '../types/sensi';

interface DragPracticeLabProps {
  copy: CopyBundle;
  generalSensitivity: number;
  dpiMultiplier: number;
  fireButtonSize: number;
  weaponFocus: WeaponFocus;
}

type HitOutcome = 'idle' | 'head' | 'chest' | 'over';

interface DragPoint {
  x: number;
  y: number;
}

export function DragPracticeLab({
  copy,
  generalSensitivity,
  dpiMultiplier,
  fireButtonSize,
  weaponFocus,
}: DragPracticeLabProps) {
  const padRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [trail, setTrail] = useState<DragPoint[]>([]);
  const [crosshairY, setCrosshairY] = useState<number>(175); // px from top in 300px arena
  const [outcome, setOutcome] = useState<HitOutcome>('idle');
  const [damageNumber, setDamageNumber] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [lastVelocity, setLastVelocity] = useState(0);

  // Target geometry in a 300px tall arena:
  // Head center ~ 64px (range 42px..88px)
  // Chest center ~ 142px (range 90px..195px)
  // Over-drag < 42px
  const arenaHeight = 300;
  const startCrosshairY = 172;

  const buttonDiameter = Math.round(44 + ((fireButtonSize - 38) / 20) * 26);

  const weaponDamageLabel = () => {
    if (weaponFocus === 'deagle') return '-495';
    if (weaponFocus === 'ump') return '-132';
    return '-187';
  };

  const evaluateDrag = (dyUp: number, dtMs: number) => {
    const safeDt = Math.max(25, dtMs);
    const velocityPxPerSec = Math.round((dyUp / safeDt) * 1000);
    setLastVelocity(velocityPxPerSec);

    // Combined angular gain from active General (0..200) and DPI multiplier
    const effectiveGain = (generalSensitivity / 175) * (0.72 + dpiMultiplier * 0.28);
    // Upward travel in arena coordinates
    const travel = Math.max(0, dyUp * 0.72 * effectiveGain + (velocityPxPerSec / 1400) * 26 * effectiveGain);
    const finalY = Math.max(12, Math.min(200, startCrosshairY - travel));

    setCrosshairY(finalY);
    setAttempts((a) => a + 1);

    if (finalY >= 42 && finalY <= 92) {
      setOutcome('head');
      setHeadshots((h) => h + 1);
      setDamageNumber(weaponDamageLabel());
    } else if (finalY < 42) {
      setOutcome('over');
      setDamageNumber('MISS');
    } else {
      setOutcome('chest');
      setDamageNumber(weaponFocus === 'm1887' ? '-24' : '-38');
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = padRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startRef.current = { x, y, time: performance.now() };
    setIsDragging(true);
    setTrail([{ x, y }]);
    setCrosshairY(startCrosshairY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || !startRef.current || !padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(rect.width - 8, e.clientX - rect.left));
    const y = Math.max(8, Math.min(rect.height - 8, e.clientY - rect.top));

    setTrail((prev) => [...prev.slice(-24), { x, y }]);

    const dyUp = startRef.current.y - y;
    const effectiveGain = (generalSensitivity / 175) * (0.72 + dpiMultiplier * 0.28);
    const liveY = Math.max(14, Math.min(200, startCrosshairY - Math.max(0, dyUp * 0.72 * effectiveGain)));
    setCrosshairY(liveY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || !startRef.current || !padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const dyUp = startRef.current.y - y;
    const dt = performance.now() - startRef.current.time;

    setIsDragging(false);
    startRef.current = null;

    if (dyUp > 10) {
      evaluateDrag(dyUp, dt);
    }
  };

  const handleReset = () => {
    setOutcome('idle');
    setDamageNumber('');
    setAttempts(0);
    setHeadshots(0);
    setLastVelocity(0);
    setTrail([]);
    setCrosshairY(startCrosshairY);
  };

  const headRate = attempts > 0 ? Math.round((headshots / attempts) * 100) : 0;

  const polylinePoints = trail.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <section id="drag-lab" className="scroll-mt-20 space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white text-balance">
            {copy.dragLabTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{copy.dragLabSub}</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-white/15 bg-[#121824] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{copy.dragLabReset}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Interactive Drag Arena */}
        <div
          ref={padRef}
          style={{ height: `${arenaHeight}px` }}
          className="relative lg:col-span-8 overflow-hidden rounded-xl border border-white/10 bg-[#0E141F] select-none touch-none"
        >
          {/* Calibration Grid & Head Hitbox Band */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[42px] h-[50px] border-y border-rose-500/35 bg-rose-500/10"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-[59px] font-mono text-[11px] text-rose-400"
          >
            HEAD ZONE (RED)
          </span>

          {/* Target Silhouette */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 180"
            className="pointer-events-none absolute left-1/2 top-7 h-[190px] w-[128px] -translate-x-1/2 opacity-90"
          >
            {/* Head Hitbox */}
            <circle
              cx="60"
              cy="34"
              r="18"
              fill={outcome === 'head' ? 'rgba(225, 29, 72, 0.38)' : 'rgba(255, 255, 255, 0.08)'}
              stroke={outcome === 'head' ? '#f43f5e' : 'rgba(255,255,255,0.28)'}
              strokeWidth="2"
            />
            {/* Torso / Chest Hitbox */}
            <path
              d="M32 62 C32 55 44 53 60 53 C76 53 88 55 88 62 L94 128 L26 128 Z"
              fill={outcome === 'chest' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)'}
              stroke={outcome === 'chest' ? '#f59e0b' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1.5"
            />
            {/* Legs */}
            <rect x="34" y="130" width="20" height="44" rx="4" fill="rgba(255,255,255,0.04)" />
            <rect x="66" y="130" width="20" height="44" rx="4" fill="rgba(255,255,255,0.04)" />
          </svg>

          {/* Dynamic Crosshair Reticle */}
          <div
            aria-hidden="true"
            style={{ transform: `translate(-50%, ${crosshairY}px)` }}
            className="pointer-events-none absolute left-1/2 top-0 transition-transform duration-75"
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                outcome === 'head'
                  ? 'border-rose-500'
                  : outcome === 'chest'
                  ? 'border-amber-400'
                  : 'border-white/80'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  outcome === 'head'
                    ? 'bg-rose-500'
                    : outcome === 'chest'
                    ? 'bg-amber-400'
                    : 'bg-white'
                }`}
              />
            </div>
          </div>

          {/* Floating Damage Number */}
          {outcome !== 'idle' && (
            <div
              aria-live="polite"
              style={{ transform: `translateY(${Math.max(18, crosshairY - 22)}px)` }}
              className={`pointer-events-none absolute left-[56%] top-0 font-mono text-2xl font-bold tabular-nums ${
                outcome === 'head'
                  ? 'text-rose-500'
                  : outcome === 'chest'
                  ? 'text-amber-400'
                  : 'text-slate-400 text-sm'
              }`}
            >
              {damageNumber}
            </div>
          )}

          {/* Live Drag Trail SVG */}
          {trail.length > 1 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.75"
                points={polylinePoints}
              />
            </svg>
          )}

          {/* Instruction Hint */}
          <div className="pointer-events-none absolute left-4 bottom-4 text-xs text-slate-400">
            {copy.dragLabInstruction}
          </div>

          {/* Interactive Fire Button (Scaled to User's Fire Button Size %) */}
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              width: `${buttonDiameter}px`,
              height: `${buttonDiameter}px`,
            }}
            aria-label={copy.dragLabBtnLabel}
            className="absolute bottom-5 right-8 flex items-center justify-center rounded-full border-2 border-rose-300/80 bg-rose-600/85 text-[11px] font-bold text-white shadow-lg hover:bg-rose-500 active:scale-95 transition-transform cursor-grab active:cursor-grabbing"
          >
            FIRE
          </button>
        </div>

        {/* Verdict & Metrics Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-white/10 bg-[#121824] p-5">
          <div className="space-y-4">
            <div
              className={`rounded-lg border p-3.5 text-sm font-medium leading-relaxed ${
                outcome === 'head'
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  : outcome === 'chest'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                  : outcome === 'over'
                  ? 'border-slate-500/40 bg-white/5 text-slate-200'
                  : 'border-white/10 bg-[#0B0F17] text-slate-300'
              }`}
            >
              {outcome === 'head'
                ? copy.verdictHead
                : outcome === 'chest'
                ? copy.verdictChest
                : outcome === 'over'
                ? copy.verdictOver
                : copy.verdictIdle}
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {outcome === 'head'
                ? copy.verdictTipHead
                : outcome === 'chest'
                ? copy.verdictTipChest
                : outcome === 'over'
                ? copy.verdictTipOver
                : `General ${generalSensitivity} · Fire Button ${fireButtonSize}% · DPI ${dpiMultiplier.toFixed(
                    2
                  )}x`}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-[#0B0F17] py-3 text-center">
            <div>
              <div className="text-[11px] text-slate-400">{copy.dragLabAttempts}</div>
              <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-white">
                {attempts}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">{copy.dragLabHeadRate}</div>
              <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-rose-400">
                {headRate}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">{copy.dragLabLastVelocity}</div>
              <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-white">
                {lastVelocity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
