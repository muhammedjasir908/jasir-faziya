# Jasir & Faziya wedding invitation

A private digital wedding card for Muhammed Jasir and Faziya Sherin. Every guest opens a unique link. Guests invited to the reception only never receive the Nikah date, time, venue, map, or reply form.

The wedding is on 7 December 2026, from 1:00 PM to 3:00 PM, at Shadhi Mahal Auditorium, Vadakara, Kozhikode.

## What you need

- Node.js 20.9 or newer
- A PostgreSQL database. [Neon](https://neon.tech) is the intended host. Docker can run Postgres on your own machine.

## Local setup

1. Copy the environment file and replace the secrets.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 8 characters. Put the guest's country code in phone numbers, for example `9198...`, with no plus sign, so WhatsApp can open the right chat.

2. Start Postgres if you are not using Neon.

```bash
docker compose up -d
```

3. Create the tables and the first admin. This also creates the Nikah and Reception records. It does not invent a Nikah date, time, or venue. Running it again will not overwrite celebration details or an existing admin password.

```bash
npm install
npm run db:setup
```

4. Start the site.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The family desk is at [http://localhost:3000/admin](http://localhost:3000/admin).

## How invitations work

- Add a guest and choose **Reception only** or **Both events, including Nikah**.
- The app creates a 10-character token with rejection-sampled cryptographic randomness.
- Only the SHA-256 hash is used to look the guest up. The raw token is encrypted with `AUTH_SECRET` so the family can copy, share, and print a QR code later.
- Guest numbers are never used as the invitation credential.
- A reception-only guest who opens `/invite/...` receives only the reception. The Nikah is omitted from the page and from `GET /api/invite/[token]`.
- An unknown token shows “Invitation not found”. A disabled token shows “Invitation unavailable”. A token past its expiry, or marked expired, shows “Invitation expired”.
- Each celebration has its own reply. Guests can accept or decline, choose a party size within their limit, and leave a note. Sending again updates the same reply. They cannot reply to a celebration that is not on their card.
- Regenerating a link immediately retires the old one. Replies stay with the guest.
- Changing a guest from both events to reception only removes their Nikah access and any Nikah reply.

WhatsApp sharing opens `wa.me` with a message written for that guest's invitation type and their private URL.

QR codes are generated on the server at `/api/admin/guests/[id]/qr`.

Replies can be filtered in the family desk and downloaded as UTF-8 CSV, which Excel opens. The file begins with a byte-order mark.

## Photographs

Until family photographs are added, the gallery is a set of geometric panels. To use photographs, place them in `public/gallery` and list them in `lib/gallery.ts`:

```ts
export const galleryPhotos = [
  { src: "/gallery/portrait.jpg", alt: "Muhammed Jasir and Faziya Sherin" },
];
```

## Deploy on Vercel and Neon

1. Create a Neon project and copy both connection strings.
2. Set these environment variables in Vercel:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string, with `sslmode=require` |
| `DIRECT_URL` | Neon direct connection string, with `sslmode=require` |
| `AUTH_SECRET` | Long random string |
| `ADMIN_EMAIL` | Family sign-in email |
| `ADMIN_PASSWORD` | Family sign-in password |
| `ADMIN_NAME` | Name shown in the family desk |
| `APP_URL` | Public site URL, such as `https://example.com` |
| `WEDDING_TIMEZONE` | `Asia/Kolkata`, unless the celebration uses another zone |

`APP_URL` is embedded in copied links, WhatsApp messages, and QR codes, so set it to the real domain.

3. Deploy. The build runs `prisma generate` and `next build`.
4. Apply the migration and seed once, from your machine or a one-off shell that has the production variables:

```bash
npm run db:setup
```

Use the direct Neon URL as `DIRECT_URL` for this command. Do not run the seed on every deploy if you have already created the admin. A later seed leaves the existing password and celebration details alone.

5. Sign in at `/admin`, enter the Nikah details when they are known, then create the guest list and share each private link.

## Scripts

- `npm run dev` starts the site.
- `npm run test` checks invitation filtering, reply limits, token encryption, and WhatsApp wording.
- `npm run lint` runs ESLint.
- `npm run build` generates the Prisma client and builds Next.js.
- `npm run db:migrate` applies `prisma/migrations`.
- `npm run db:seed` creates the admin and celebration records.

## API

Public:

- `GET /api/invite/[token]`
- `POST /api/invite/[token]/rsvp`

Family desk, all behind the admin session:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/stats`
- `GET /api/admin/guests` and `POST /api/admin/guests`
- `GET`, `PATCH`, and `DELETE /api/admin/guests/[id]`
- `POST /api/admin/guests/[id]/status`
- `POST /api/admin/guests/[id]/regenerate`
- `GET /api/admin/guests/[id]/qr`
- `GET /api/admin/events` and `PATCH /api/admin/events/[id]`
- `GET /api/admin/rsvps`
- `GET /api/admin/export`

Invitation and reply routes are rate-limited per server instance. Admin mutations check the session cookie and the request origin.
