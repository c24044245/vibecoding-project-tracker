import { TEXT_SIZES } from '../lib/constants';

/**
 * Display settings (FR22). Text size scales the whole app, because every size in the
 * app is set in rem units that follow the page's root font size (NFR8).
 */
export default function SettingsPanel({ settings, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-1 font-bold">Text size</legend>
        <p className="mb-3 text-sm text-ink-muted">Makes all text and controls larger. Your choice is remembered.</p>
        <div className="grid grid-cols-3 gap-3">
          {TEXT_SIZES.map((size) => (
            <label
              key={size.value}
              className="flex min-h-[64px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-slate-300 p-2 has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
            >
              <input
                type="radio"
                name="text-size"
                value={size.value}
                checked={settings.textSize === size.value}
                onChange={() => onChange({ ...settings, textSize: size.value })}
                className="sr-only"
              />
              <span aria-hidden="true" className="font-bold" style={{ fontSize: `${size.value / 100}rem` }}>
                Aa
              </span>
              <span className="text-sm">{size.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
