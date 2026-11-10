import Image from "next/image";

import { galleryPhotos } from "@/lib/gallery";
import { SectionHeading } from "@/components/invitation/ornaments";

function Motif({ variant }: { variant: 1 | 2 | 3 | 4 }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-gold" aria-hidden>
      <rect width="200" height="200" fill="#fffaf3" />
      {variant === 1 ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="100" cy="100" r="72" />
          <circle cx="100" cy="100" r="48" />
          <rect x="58" y="58" width="84" height="84" />
          <rect x="58" y="58" width="84" height="84" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="16" />
        </g>
      ) : null}
      {variant === 2 ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.1">
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={index} d="M100 28 L112 100 L100 172 L88 100 Z" transform={`rotate(${index * 45} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="18" />
        </g>
      ) : null}
      {variant === 3 ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.1">
          <path d="M100 20 L180 100 L100 180 L20 100 Z" />
          <path d="M100 44 L156 100 L100 156 L44 100 Z" />
          <rect x="70" y="70" width="60" height="60" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="10" />
        </g>
      ) : null}
      {variant === 4 ? (
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {Array.from({ length: 6 }).map((_, index) => (
            <circle key={index} cx="100" cy="100" r={18 + index * 12} />
          ))}
          <path d="M100 16 V184 M16 100 H184 M40 40 L160 160 M160 40 L40 160" />
        </g>
      ) : null}
    </svg>
  );
}

export function Gallery() {
  if (galleryPhotos.length > 0) {
    return (
      <section aria-labelledby="gallery-heading">
        <SectionHeading id="gallery-heading" kicker="Moments" title="Gallery">
          <p>Photographs shared by the families.</p>
        </SectionHeading>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {galleryPhotos.map((photo) => (
            <div key={photo.src} className="relative aspect-square overflow-hidden border border-[rgba(141,106,50,0.35)]">
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 30vw" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="gallery-heading">
      <SectionHeading id="gallery-heading" kicker="Pattern and light" title="Gallery">
        <p>A quiet gallery of geometry, until photographs of the day take their place.</p>
      </SectionHeading>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="col-span-2 overflow-hidden border border-[rgba(141,106,50,0.35)] md:col-span-1 md:row-span-2">
          <Motif variant={1} />
        </div>
        <div className="overflow-hidden border border-[rgba(141,106,50,0.35)]">
          <Motif variant={2} />
        </div>
        <div className="overflow-hidden border border-[rgba(141,106,50,0.35)]">
          <Motif variant={3} />
        </div>
        <div className="col-span-2 overflow-hidden border border-[rgba(141,106,50,0.35)] md:col-span-1">
          <Motif variant={4} />
        </div>
      </div>
    </section>
  );
}
