type DemoBannerProps = {
  message?: string;
};

export function DemoBanner({
  message = "Integración simulada para la demo. No se realizan cobros ni envíos reales.",
}: DemoBannerProps) {
  return (
    <p
      className="rounded-xl border border-dashed border-medicity-blue/40 bg-medicity-blue-light px-3 py-2 text-xs text-text-secondary"
      role="note"
    >
      <span className="font-bold text-medicity-blue">Demo · </span>
      {message}
    </p>
  );
}
