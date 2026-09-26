import { Slider } from "@/components/ui";

// ... existing imports and component body unchanged ...

// Replace the raw range input (previously around lines 301-311) with:
<Slider
  label="Coverage duration"
  value={durationDays}
  onChange={setDurationDays}
  min={1}
  max={365}
  step={1}
  presets={[30, 60, 90, 365]}
  formatValue={(days) => `${days} day${days === 1 ? "" : "s"}`}
  hint="How long your cover lasts."
/>
