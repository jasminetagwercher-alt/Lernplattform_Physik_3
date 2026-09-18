type Props = {
  label: string;
  symbol: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function LabSlider({
  label,
  symbol,
  value,
  unit,
  min,
  max,
  step = 1,
  disabled = false,
  onChange,
}: Props) {
  return (
    <label className={disabled ? "locked-control" : ""}>
      <span>{label} {symbol} {disabled && "· konstant"}</span>
      <strong>{value} {unit}</strong>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
