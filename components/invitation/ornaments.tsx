import type { ReactNode } from "react";

export function Khatam({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.15" className="draw">
        <circle cx="50" cy="50" r="38" />
        <rect x="24" y="24" width="52" height="52" />
        <rect x="24" y="24" width="52" height="52" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="12" />
      </g>
    </svg>
  );
}

export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M40 70 C40 46 40 32 40 12" />
        <path d="M40 50 C28 44 20 36 15 24 C28 28 34 38 40 50Z" />
        <path d="M40 36 C53 30 61 23 67 12 C54 18 47 28 40 36Z" />
        <path d="M40 62 C30 58 24 52 20 44 C30 48 35 54 40 62Z" />
      </g>
    </svg>
  );
}

export function Framed({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`frame ${className}`}>
      <span className="frame-corner tl" aria-hidden />
      <span className="frame-corner tr" aria-hidden />
      <span className="frame-corner bl" aria-hidden />
      <span className="frame-corner br" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="mx-auto my-8 flex w-full max-w-xs items-center gap-4 text-gold-bright" aria-hidden>
      <span className="h-px flex-1 bg-current opacity-60" />
      <Khatam className="h-4 w-4" />
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  children,
  id,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-xl text-center md:mb-10">
      <p className="section-kicker">{kicker}</p>
      <h2 id={id} className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h2>
      {children ? <div className="mt-4 text-base leading-7 text-muted">{children}</div> : null}
    </div>
  );
}

export function PatternField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 text-[#e4c98a]" aria-hidden>
      <svg className="h-full w-full opacity-[0.09]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geom-pattern" width="76" height="76" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="0.7">
              <rect x="30" y="30" width="16" height="16" />
              <rect x="30" y="30" width="16" height="16" transform="rotate(45 38 38)" />
              <circle cx="38" cy="38" r="3.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geom-pattern)" />
      </svg>
    </div>
  );
}
