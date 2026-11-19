import { Check, Copy } from 'lucide-react';
import { CopyBundle } from '../data/translations';

interface HeaderProps {
  copy: CopyBundle;
  copied: boolean;
  onCopyAll: () => void;
}

export function Header({ copy, copied, onCopyAll }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0F17]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand wordmark */}
        <a
          href="#calibrator"
          className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
        >
          Dragi Sensi
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <a
            href="#calibrator"
            className="whitespace-nowrap shrink-0 py-1 hover:text-white hover:underline underline-offset-4 decoration-rose-500 transition-colors"
          >
            {copy.navCalibrator}
          </a>
          <a
            href="#weapons"
            className="whitespace-nowrap shrink-0 py-1 hover:text-white hover:underline underline-offset-4 decoration-rose-500 transition-colors"
          >
            {copy.navWeapons}
          </a>
          <a
            href="#drag-lab"
            className="whitespace-nowrap shrink-0 py-1 hover:text-white hover:underline underline-offset-4 decoration-rose-500 transition-colors"
          >
            {copy.navDragLab}
          </a>
          <a
            href="#saved"
            className="whitespace-nowrap shrink-0 py-1 hover:text-white hover:underline underline-offset-4 decoration-rose-500 transition-colors"
          >
            {copy.navSaved}
          </a>
        </nav>

        {/* Zone 3: 1 primary CTA button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onCopyAll}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 active:bg-rose-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            {copied ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied' : copy.copyAllSensi}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
