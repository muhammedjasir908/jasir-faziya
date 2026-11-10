import { BRIDE_FATHER, BRIDE_MOTHER, GROOM_FATHER, GROOM_MOTHER, WEDDING_DATE_LABEL, WEDDING_PLACE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="px-2 py-14 text-center">
      <p className="section-kicker">With compliments and prayers from both families</p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#f6e7c4]">
        {GROOM_FATHER} &amp; {GROOM_MOTHER} · {BRIDE_FATHER} &amp; {BRIDE_MOTHER}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#e4c98a]">
        {WEDDING_DATE_LABEL} · {WEDDING_PLACE}
      </p>
      <p className="mt-3 font-script text-3xl text-[#f6e7c4]">Jasir &amp; Faziya</p>
    </footer>
  );
}
