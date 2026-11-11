import type { Metadata } from "next";

import type { InvitationSide } from "@/lib/constants";

export const PUBLIC_SITE_URL = "https://jasir-faziya.vercel.app";

export function invitationLink(side: InvitationSide) {
  return side === "bride" ? `${PUBLIC_SITE_URL}/bride` : `${PUBLIC_SITE_URL}/groom`;
}

type ShareCard = {
  title: string;
  description: string;
  message: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
};

const bride: ShareCard = {
  title: "Faziya Sherin's Nikah invitation",
  description:
    "Assalamu alaikum. You are invited to the Nikah of Faziya Sherin and Muhammed Jasir on Sunday, 6 December 2026 at 11:00 AM, AMANATH Convention Centre, Tirur. Come with your duas and let your presence make the morning complete.",
  message: [
    "Faziya Sherin's Nikah invitation",
    "",
    "Assalamu alaikum. With the blessings of Allah, you are invited to the Nikah of Faziya Sherin and Muhammed Jasir.",
    "",
    "Sunday, 6 December 2026",
    "11:00 AM",
    "AMANATH Convention Centre, Meeshapadi, Tirur",
    "",
    "Bring your prayers and your joy. Your presence will make this morning gentle and blessed.",
  ].join("\n"),
  image: "/share/preview.jpg",
  imageWidth: 1200,
  imageHeight: 630,
};

const groom: ShareCard = {
  title: "Muhammed Jasir's wedding reception",
  description:
    "Assalamu alaikum. You are invited to the wedding reception of Muhammed Jasir and Faziya Sherin on Monday, 7 December 2026, 1:00 to 3:00 PM, at Shadhi Mahal Auditorium, Vadakara. Come share the afternoon and leave your blessings on the couple.",
  message: [
    "Muhammed Jasir's wedding reception",
    "",
    "Assalamu alaikum. The families of Muhammed Jasir and Faziya Sherin request the pleasure of your company at the wedding reception.",
    "",
    "Monday, 7 December 2026",
    "1:00 PM – 3:00 PM",
    "Shadhi Mahal Auditorium, Vadakara, Kozhikode",
    "",
    "Join the celebration and keep the couple in your duas.",
  ].join("\n"),
  image: "/share/preview.jpg",
  imageWidth: 1200,
  imageHeight: 630,
};

export function publicShare(side: InvitationSide) {
  return side === "bride" ? bride : groom;
}

export function invitationMetadata(side: InvitationSide): Metadata {
  const share = publicShare(side);
  return {
    title: { absolute: share.title },
    description: share.description,
    openGraph: {
      title: share.title,
      description: share.description,
      type: "website",
      url: invitationLink(side),
      images: [
        {
          url: share.image,
          alt: share.title,
          type: "image/jpeg",
          ...(share.imageWidth && share.imageHeight
            ? { width: share.imageWidth, height: share.imageHeight }
            : {}),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: share.title,
      description: share.description,
      images: [share.image],
    },
  };
}
