# Barbershop Tek – Website met Boekingssysteem

Next.js 14 website voor Barbershop Tek in Tilburg, met online boekingssysteem via Supabase.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Fonts**: Oswald + Source Serif 4 (Google Fonts)

---

## 1. Supabase instellen

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account aan
2. Maak een nieuw project aan (kies Europa als regio)
3. Ga naar **SQL Editor** en voer de migration uit:

```sql
-- Kopieer de inhoud van: supabase/migrations/001_create_bookings.sql
```

4. Ga naar **Project Settings → API** en kopieer:
   - `Project URL` → wordt `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → wordt `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Lokaal draaien

```bash
# Vereisten: Node.js 18+

# 1. Clone je repo
git clone https://github.com/jouw-gebruikersnaam/barbershop-tek.git
cd barbershop-tek

# 2. Installeer dependencies
npm install

# 3. Maak .env.local aan
cp .env.local.example .env.local
# Vul je Supabase URL en key in

# 4. Start de dev server
npm run dev
# → http://localhost:3000
```

---

## 3. Deployen op Vercel

### Via GitHub (aanbevolen)

1. Push je code naar GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/jouw-gebruikersnaam/barbershop-tek.git
git push -u origin main
```

2. Ga naar [vercel.com](https://vercel.com) → **New Project**
3. Importeer je GitHub repository
4. Voeg de environment variables toe:
   - `NEXT_PUBLIC_SUPABASE_URL` = jouw Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = jouw Supabase anon key
5. Klik **Deploy** → klaar! 🎉

---

## Projectstructuur

```
barbershop-tek/
├── app/
│   ├── api/bookings/route.ts   # API: boekingen ophalen & aanmaken
│   ├── booking/
│   │   ├── page.tsx            # Boekingspagina (4 stappen)
│   │   └── booking.module.css
│   ├── globals.css             # Globale stijlen
│   ├── layout.tsx              # Root layout met fonts
│   ├── page.tsx                # Homepage
│   └── page.module.css
├── lib/
│   ├── constants.ts            # Diensten, tijdslots, openingstijden
│   └── supabase.ts             # Supabase client
├── supabase/
│   └── migrations/
│       └── 001_create_bookings.sql
├── .env.local.example
└── package.json
```

---

## Aanpassen

### Prijzen / diensten wijzigen
Bewerk `lib/constants.ts` → `SERVICES` array.

### Openingstijden / tijdslots wijzigen
Bewerk `lib/constants.ts` → `TIME_SLOTS` en `OPENING_HOURS`.

### Logo toevoegen
Vervang de SVG in `app/page.tsx` (navLogo) door een `<Image>` tag met je eigen logo PNG uit de `public/` map.

### Afspraken beheren
Log in op je Supabase dashboard → **Table Editor → bookings** om alle afspraken te zien en te beheren.
