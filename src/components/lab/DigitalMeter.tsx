type Props = {
  label: string;
  value: string;
  formula?: string;
};

export function DigitalMeter({ label, value, formula }: Props) {
  return (
    <div className="meter">
      <span>{label}</span>
      <strong>{value}</strong>
      {formula && <small>{formula}</small>}
    </div>
  );
}
