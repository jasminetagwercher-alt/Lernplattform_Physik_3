export type MeasurementColumn<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  rows: T[];
  columns: MeasurementColumn<T>[];
  emptyText: string;
};

export function MeasurementTable<T>({ rows, columns, emptyText }: Props<T>) {
  if (rows.length === 0) {
    return <div className="empty-measurements">{emptyText}</div>;
  }

  return (
    <div className="table-wrap">
      <table className="measurement-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
