"use client";

import { useId } from "react";

/**
 * A single-thumb range slider primitive.
 *
 * Wraps a native `<input type="range">` so it stays keyboard operable
 * (arrows, PageUp/PageDown, Home/End) while adding labelling, preset
 * "chip" stops, a formatted value readout and cross-browser thumb styling.
 *
 * @example
 * <Slider
 *   label="Coverage duration"
 *   value={days}
 *   onChange={setDays}
 *   min={1}
 *   max={365}
 *   presets={[30, 60, 90, 365]}
 *   formatValue={(v) => `${v} day${v === 1 ? "" : "s"}`}
 *   hint="How long your cover lasts."
 * />
 */
export interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Discrete stops rendered as keyboard-reachable chips. */
  presets?: number[];
  /** Formats the value for the readout and `aria-valuetext`. */
  formatValue?: (value: number) => string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const defaultFormat = (value: number) => String(value);

/** Clamp a value into the inclusive `[min, max]` range. */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Slider primitive with ticks, presets and cross-browser thumb styling.
 */
export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  presets,
  formatValue = defaultFormat,
  hint,
  error,
  disabled = false,
  id,
  className,
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? `slider-${generatedId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const safeValue = clamp(value, min, max);
  const pct = max === min ? 0 : ((safeValue - min) / (max - min)) * 100;
  const valueText = formatValue(safeValue);

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={["pm-slider-field", className].filter(Boolean).join(" ")}>
      <div className="pm-slider-field__header">
        <label className="pm-slider-field__label" htmlFor={inputId}>
          {label}
        </label>
        <output
          className="pm-slider-field__value"
          htmlFor={inputId}
          aria-live="polite"
        >
          {valueText}
        </output>
      </div>

      <input
        id={inputId}
        className="pm-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        disabled={disabled}
        aria-valuetext={valueText}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        style={{ ["--pct" as string]: `${pct}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />

      {presets && presets.length > 0 ? (
        <div className="pm-slider-field__presets" role="group" aria-label={`${label} presets`}>
          {presets.map((preset) => {
            const presetValue = clamp(preset, min, max);
            const active = presetValue === safeValue;
            return (
              <button
                key={preset}
                type="button"
                className="pm-slider-field__preset"
                aria-pressed={active}
                disabled={disabled}
                onClick={() => onChange(presetValue)}
              >
                {formatValue(presetValue)}
              </button>
            );
          })}
        </div>
      ) : null}

      {error ? (
        <p id={errorId} className="pm-slider-field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="pm-slider-field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
