type Props = {
  title?: string;
  children: React.ReactNode;
};

export function ResearchTask({ title = "Forscherauftrag", children }: Props) {
  return (
    <div className="lab-challenge">
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}
