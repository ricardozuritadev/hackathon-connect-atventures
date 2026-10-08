type ScreenIntroProps = {
  eyebrow?: string;
  title: string;
  body?: string;
};

export function ScreenIntro({ eyebrow, title, body }: ScreenIntroProps) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow ? (
        <p className="text-xs font-bold tracking-wide text-medicity-blue uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-bold leading-8 text-text-primary">{title}</h1>
      {body ? (
        <p className="text-sm leading-5 text-text-secondary">{body}</p>
      ) : null}
    </div>
  );
}
