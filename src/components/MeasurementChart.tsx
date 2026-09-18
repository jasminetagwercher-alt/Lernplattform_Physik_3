type Point = {
  x: number;
  y: number;
};

type Props = {
  points: Point[];
  xLabel: string;
  yLabel: string;
};

export function MeasurementChart({ points, xLabel, yLabel }: Props) {
  if (points.length < 2) {
    return (
      <div className="chart-empty">
        Speichere mindestens zwei Messwerte, damit ein Diagramm entsteht.
      </div>
    );
  }

  const width = 640;
  const height = 300;
  const pad = 46;
  const maxX = Math.max(...points.map((point) => point.x), 1);
  const maxY = Math.max(...points.map((point) => point.y), 1);

  const mapped = points.map((point) => ({
    x: pad + (point.x / maxX) * (width - pad * 2),
    y: height - pad - (point.y / maxY) * (height - pad * 2),
  }));

  const polyline = mapped.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="chart-card">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Messwertdiagramm">
        <line x1={pad} y1={height - pad} x2={width - 18} y2={height - pad} className="chart-axis" />
        <line x1={pad} y1={height - pad} x2={pad} y2={18} className="chart-axis" />
        <polyline points={polyline} fill="none" className="chart-line" />
        {mapped.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="6" className="chart-point" />
        ))}
        <text x={width - 24} y={height - pad - 10} textAnchor="end" className="chart-label">{xLabel}</text>
        <text x={pad + 10} y={25} className="chart-label">{yLabel}</text>
      </svg>
    </div>
  );
}
