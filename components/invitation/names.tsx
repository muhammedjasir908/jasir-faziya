import { BRIDE, GROOM } from "@/lib/constants";

export function CoupleNames({ large = false }: { large?: boolean }) {
  const size = large
    ? "text-[clamp(2.15rem,8vw,5.4rem)]"
    : "text-[clamp(1.9rem,6vw,3.3rem)]";
  const ampersand = large
    ? "my-2 text-[clamp(2.3rem,6vw,4rem)]"
    : "my-1 text-[clamp(2rem,5vw,3rem)]";
  return (
    <span className="block text-center text-ink">
      <span className={`block text-balance font-display font-medium leading-[0.95] tracking-[-0.03em] ${size}`}>
        {GROOM}
      </span>
      <span className={`block font-script leading-none text-gold-bright ${ampersand}`}>&</span>
      <span className={`block text-balance font-display font-medium italic leading-[0.95] tracking-[-0.03em] ${size}`}>
        {BRIDE}
      </span>
    </span>
  );
}
