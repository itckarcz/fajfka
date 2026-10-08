# Rozhodnutia

Krátke záznamy, prečo sme čo zvolili. Nové rozhodnutie pridaj na koniec (dátum, rozhodnutie, dôvod, čo sme zamietli).

## 2026-10-08 – PWA namiesto appky v obchodoch
- **Dôvod:**
  - bez schvaľovania Apple a Google,
  - predplatné cez web bez 15–30 % provízie,
  - jeden kód pre mobil aj PC, aktualizácie hneď.
- **Cena za to:**
  - na iPhone sa inštaluje ručne (Sdílet → Přidat na plochu), preto máme obrazovku s návodom,
  - notifikácie na iPhone fungujú až po pridaní na plochu (iOS 16.4+).
- Neskôr sa dá zabaliť do appky bez prepisovania.

## 2026-10-08 – Next.js + PostgreSQL + Prisma, Docker na Hetzner
- Jeden repozitár a jeden jazyk (TypeScript) pre web, appku aj worker.
- Dáta sú v EÚ.
- Lacná prevádzka: VPS ~5–10 € mesačne na začiatok.

## 2026-10-08 – Peniaze v haléřích ako celé čísla
- Desatinné čísla spôsobujú chyby pri zaokrúhľovaní.
- Halier je najmenšia jednotka v účtovníctve aj v QR platbe.

## 2026-10-08 – Fronta cez pg-boss (bez Redisu)
- Jedna databáza menej na prevádzku.
- Pre naše objemy (desiatky až tisíce správ denne) stačí.

## 2026-10-08 – „Zaplaceno“ potvrdzuje remeselník ručne
- Appka v 1. verzii nevidí do banky. Remeselník ťukne, keď mu zákazník ukáže potvrdenie.
- Párovanie s bankou (Fio API, neskôr PSD2 agregátor) je až vo F3.
- **Zamietnuté:** Stripe Tap to Pay a platobné brány. Peniaze aj dáta zostávajú u remeselníka, nechceme poplatky ani zodpovednosť za cudzie peniaze.

## 2026-10-08 – EET aj pri QR platbe na mieste
- EET 2.0 eviduje všetky platby pri osobnom kontakte vrátane QR kódu na mieste.
- Prevod „zaplatí neskôr“ sa neeviduje.

## 2026-10-08 – Jeden doklad, appka sama zvolí tvar
- 6 kombinácií (platiteľ / neplatiteľ × firma platiteľ / firma neplatiteľ / osoba) dáva 4 tvary dokladu a 1 políčko pre prenesenú daňovú povinnosť.
- Remeselník nevyberá typ dokladu.

## 2026-10-08 – Pracovný názov „Fajfka“
- Doména a ochranná známka zatiaľ **neoverené**. Pred verejným spustením treba overiť .cz/.sk, ÚPV, EUIPO a sociálne siete.
- V kóde používaj neutrálne názvy (`app`, `brand.ts`), aby sa názov dal ľahko zmeniť.
