# Stav projektu – Fajfka

> Tento súbor aktualizujeme po každej dokončenej úlohe. Je to rýchly prehľad pre každého kto chce vedieť kde sme.

## Základné info

| | |
|---|---|
| **GitHub** | https://github.com/itckarcz/fajfka (súkromné) |
| **Aktuálna fáza** | F1 – MVP |
| **Cieľ F1** | 10. 12. 2026 (testeri), EET live 1. 1. 2027 |
| **Posledná aktualizácia** | 2026-10-08 |

---

## Úlohy F1 – stav

| # | Úloha | Stav | Dátum |
|---|---|---|---|
| 1 | Kostra projektu | ✅ Hotovo | 2026-10-08 |
| 2 | Registrácia a prihlásenie | ✅ Hotovo | 2026-10-08 |
| 3 | Zákazníci a ceník | ✅ Hotovo | 2026-10-08 |
| 4 | Jadro dokladu (bez UI) | ⬜ Čaká | – |
| 5 | Obrazovky Nová faktura | ⬜ Čaká | – |
| 6 | QR Platba | ⬜ Čaká | – |
| 7 | PDF faktúry | ⬜ Čaká | – |
| 8 | E-mail a zdieľanie | ⬜ Čaká | – |
| 9 | EET 2.0 | ⬜ Čaká | – |
| 10 | Zoznam faktúr a detail | ⬜ Čaká | – |
| 11 | PC rozloženie a export | ⬜ Čaká | – |
| 12 | Predplatné a verejný web | ⬜ Čaká | – |

---

## Čo je hotové (Úloha 1)

### Projekt a nástroje
- **Next.js 15** (App Router) + **TypeScript strict** + **Tailwind CSS 4**
- **pnpm** ako správca balíčkov (verzia 12)
- **Vitest** pre unit testy, **Playwright** nachystaný pre e2e
- **GitHub Actions CI** – spúšťa lint + typecheck + test pri každom push/PR

### Databáza
- **PostgreSQL 16** cez Homebrew (lokálne) alebo Docker
- **Prisma 6** + prvá migrácia (`prisma/migrations/20261008035954_init/`)
- Všetky tabuľky z `docs/DATOVY-MODEL.md`: Account, User, Customer, Item, Invoice, InvoiceLine, InvoiceSequence, EetRecord, EmailLog

### Frontend
- Spodná navigačná lišta (Domů / Faktury / Zákazníci / Více) podľa `Main.dc.html`
- Tailwind téma z `design/tokens.json` (farby, fonty, rozostupy, zaoblenia, tap veľkosti)
- PWA: `manifest.webmanifest` + service worker (offline shell)
- Fonty Archivo + Inter cez `next/font`

### Kód
- `src/texts/cs.ts` – všetky texty pre používateľa na jednom mieste + `t()` helper
- `src/lib/money.ts` – typ `Halere`, `formatCzk()`, `parseCzk()`, `roundToCrowns()`, `multiplyHal()`
- `src/worker/index.ts` – stub, plná implementácia v úlohách 8–9

### Testy
- **19 unit testov** – všetky prechádzajú
- Pokrytie: `formatCzk`, `formatAmount`, `parseCzk`, `roundToCrowns`, `cashRounding`, `multiplyHal`

### DevOps
- `docker-compose.yml` – postgres + app (dev mode) + worker
- `Dockerfile` – produkčný obraz (Next.js standalone)
- `Dockerfile.worker` – worker proces
- `.env.example` – šablóna premenných prostredia

---

## Ako spustiť lokálne

### Požiadavky
- Node.js 22+
- pnpm (`curl -fsSL https://get.pnpm.io/install.sh | sh -`)
- PostgreSQL 16 (Homebrew: `brew install postgresql@16`)

### Kroky

```bash
# 1. Klonovať repozitár
git clone https://github.com/itckarcz/fajfka.git
cd fajfka

# 2. Nainštalovať závislosti
pnpm install

# 3. Nastaviť prostredie
cp .env.example .env
# → upraviť .env (DATABASE_URL a ostatné)

# 4. Spustiť PostgreSQL
brew services start postgresql@16

# 5. Vytvoriť databázu (len prvý raz)
psql postgres -c "CREATE USER fajfka WITH PASSWORD 'fajfka_dev' CREATEDB;"
psql postgres -c "CREATE DATABASE fajfka OWNER fajfka;"

# 6. Migrovať databázu
pnpm db:migrate

# 7. Spustiť vývojový server
pnpm dev
# → http://localhost:3000
```

### Alebo cez Docker (keď bude Docker Desktop nainštalovaný)

```bash
cp .env.example .env
docker compose up
# → http://localhost:3000
```

---

## Štruktúra projektu

```
fajfka/
├── src/
│   ├── app/                    # Next.js App Router stránky
│   │   ├── layout.tsx          # Root layout (fonty, PWA meta, SW registrácia)
│   │   ├── page.tsx            # Domů
│   │   ├── faktury/page.tsx    # Faktury (zatiaľ prázdna)
│   │   ├── zakaznici/page.tsx  # Zákazníci (zatiaľ prázdna)
│   │   ├── vice/page.tsx       # Více (zatiaľ prázdna)
│   │   └── globals.css
│   ├── components/
│   │   └── BottomNav.tsx       # Spodná navigácia (4 záložky)
│   ├── lib/
│   │   ├── money.ts            # Halere, formatCzk, parseCzk, ...
│   │   └── money.test.ts       # 19 unit testov
│   ├── texts/
│   │   └── cs.ts               # Všetky texty v češtine + t() helper
│   └── worker/
│       └── index.ts            # Worker stub (EET + email v úlohách 8–9)
├── prisma/
│   ├── schema.prisma           # Celá DB schéma (11 modelov, 7 enumov)
│   └── migrations/             # SQL migrácie
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   └── sw.js                   # Service worker (offline shell)
├── design/
│   ├── tokens.json             # Dizajnové tokeny (zdroj pravdy)
│   └── mockupy/                # HTML návrhy obrazoviek
├── docs/                       # Dokumentácia projektu
├── Dockerfile                  # Produkčný obraz
├── Dockerfile.worker
├── docker-compose.yml          # Lokálne prostredie
├── .env.example                # Šablóna premenných
└── .github/workflows/ci.yml   # CI pipeline
```

---

## Technický dlh a poznámky

- **Docker Desktop** nie je nainštalovaný na vývojovom stroji → PostgreSQL cez Homebrew
- **Ikony PWA** (`/public/icons/`) zatiaľ neexistujú (placeholder) – treba 192px, 512px, maskable
- `CLAUDE - kópia.md` a `Reserch WEB dizign/` v root – nevznikli tu, ignorujeme

---

## Čo je hotové (Úloha 3 – Zákazníci a ceník)

### Zákazníci
- Zoznam zákazníkov s vyhľadávaním (meno, IČO, e-mail, telefón)
- Zoradenie podľa `lastUsedAt` (posledné použitie)
- Nový zákazník: Člověk (meno, e-mail, tel, adresa) alebo Firma (IČO → ARES, DIČ, DPH)
- Detail zákazníka s editáciou (`/zakaznici/[id]`)

### Ceník
- Zoznam aktívnych položiek (`/vice/cennik`)
- Nová položka: názov, jednotka (ks/h/m/m²/km/paušál), cena (Kč→hal), sadzba DPH (0/12/21)
- Editácia položky (`/vice/cennik/[id]`)
- Archivácia položky
- Predvyplnené položky pri registrácii: Hodina práce 800 Kč/h, Výjezd 500 Kč, Doprava 7 Kč/km, Materiál 0 Kč/ks

### ESLint
- Nainštalovaný `eslint@9` + `eslint-config-next@15.3.4` + `@eslint/eslintrc`
- Flat config `eslint.config.mjs` (Next.js core-web-vitals + TypeScript)

### Nasledujúca úloha

**Úloha 4 – Jadro dokladu (bez UI)**
- `src/lib/invoice/`: výpočty, DPH, zaokrúhlenie, číslovanie, stavy
- Všetky 6 kombinácií so 100 % pokrytím testami
