"use client";

type PreferenceRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
};

export function PreferenceRow({
  title,
  description,
  checked,
  onChange,
  id,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border-default px-3.5 py-3.5">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-sm font-medium text-text-primary">
          {title}
        </label>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors",
          checked ? "bg-medicity-blue" : "bg-border-default",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 size-[18px] rounded-full bg-white shadow transition-transform",
            checked ? "left-[18px]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
