export function mapsLink(venue: string | null, address: string | null, mapUrl: string | null) {
  if (mapUrl) {
    try {
      const url = new URL(mapUrl);
      if (url.protocol === "https:") return url.toString();
    } catch {
      return null;
    }
  }
  const query = [venue, address].filter(Boolean).join(", ");
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
