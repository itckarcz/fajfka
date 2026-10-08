# Fajfka – pravidlá projektu pre Claude Code

Fajfka je mobilná webová appka (PWA) pre remeselníkov v teréne v Česku. Remeselník vystaví faktúru za 30 sekúnd priamo u zákazníka. Zákazník zaplatí QR kódom alebo hotovosťou na mieste. Tržbu appka sama pošle do EET 2.0 a faktúru zákazníkovi e-mailom.

Mobil je hlavná appka, nie zmenšený web. PC verzia slúži na prehľad, export a nastavenia.

> Pred každou úlohou si prečítaj tento súbor a dokument, ktorý sa úlohy týka (zoznam nižšie). Ak si niečo odporuje, platí tento súbor. Potom sa opýtaj.

## Kde čo nájdeš

| Súbor | Čo v ňom je |
|---|---|
| `docs/PRODUKT.md` | čo appka robí v 1. verzii, obrazovky, postupy, čo do 1. verzie nepatrí |
| `docs/ULOHY.md` | **12 úloh v poradí** s definíciou hotového – podľa toho pracuješ |
| `docs/ROADMAPA.md` | fázy F0–F5 a brány medzi nimi (aby sme nestavali dopredu) |
| `docs/DOKLADY.md` | české pravidlá faktúr: 6 kombinácií, 4 tvary dokladu, DPH, číslovanie, zaokrúhlenie |
| `docs/EET.md` | EET 2.0: kedy evidovať, správa, certifikát, fronta, storno |
| `docs/DATOVY-MODEL.md` | tabuľky a polia 1. verzie |
| `docs/DIZAJN.md` | farby, písmo, rozmery, 8 princípov pre terén, tón reči |
| `docs/ROZHODNUTIA.md` | prečo sme čo zvolili (krátke záznamy) |
| `design/tokens.json` | dizajnové tokeny (zdroj pravdy pre farby, písmo, rozostupy) |
| `design/mockupy/*.dc.html` | návrhy obrazoviek ako HTML – **vzor pre vzhľad a texty** |

## Technológie (nemeniť bez záznamu v `docs/ROZHODNUTIA.md`)

- **Next.js (App Router) + TypeScript (strict) + Tailwind CSS.** Jeden repozitár pre appku, PC verziu aj verejný web. Inštalovateľné ako PWA (manifest a service worker).
- **PostgreSQL + Prisma.**
- **pnpm** ako správca balíčkov.
- **Fronta úloh: pg-boss** (beží nad tou istou PostgreSQL, bez Redisu). Používa ju EET a e-maily.
- **EET worker** je samostatný proces (`src/worker/`). Používa ten istý kód a databázu, beží ako vlastný kontajner.
- **E-mail: Resend.** Prihlásenie magickým odkazom cez e-mail, bez hesiel.
- **PDF** sa generuje na serveri (napr. `@react-pdf/renderer`). Musí podporovať českú diakritiku, takže písma Inter a Archivo sú vložené do PDF.
- **Platby predplatného: Stripe** (až v úlohe 12).
- **Testy: Vitest** (logika) a **Playwright** (e2e na mobilnom viewporte 390×844).
- **Nasadenie:** Docker Compose na Hetzner VPS (EÚ). Automatické nasadenie z GitHubu (GitHub Actions).
- **Analytika webu** bez cookies (Plausible alebo Umami), žiadna cookie lišta.

## Pevné pravidlá kódu

1. **Peniaze vždy v halieroch ako celé čísla** (`number`, typ `Halere`). Nikdy nie desatinné čísla ani `float`. Prevod na Kč len pri zobrazení (`formatCzk()`). V databáze `Int` (alebo `BigInt` pri súčtoch).
2. **Výpočty dokladu sú na jednom mieste:** `src/lib/invoice/`. Sú to čisté funkcie bez databázy a 100 % pokryté testami. UI ani API si sumy nepočítajú sami.
3. **Všetky texty pre používateľa sú v jednom súbore** `src/texts/cs.ts` (čeština). V komponentoch nie sú žiadne natvrdo napísané texty. Neskôr pribudne `sk.ts`.
4. **Kód, názvy premenných, commity a komentáre sú po anglicky.** Dokumentácia pre nás je po slovensky. Texty v appke sú po česky.
5. **Časové pásmo je `Europe/Prague`.** Dátumy na doklade (vystavenie, DUZP, splatnosť) sa počítajú v tomto pásme.
6. **Číslovanie faktúr je bez dier**, zvlášť pre každý účet a rok (`2026-0001`). Číslo sa prideľuje v transakcii pri vystavení, nie pri koncepte.
7. **Vystavená faktúra sa už nemení.** Oprava sa robí stornom alebo opravným dokladom. Koncept sa dá meniť a ukladá sa priebežne.
8. **EET certifikáty** (.p12) a ich heslá sú v databáze zašifrované (AES-256-GCM, kľúč z `CERT_ENCRYPTION_KEY`). Nikdy sa nelogujú, neposielajú klientovi ani do e-mailu.
9. **V logoch nie sú osobné údaje** (e-mail, meno, IBAN, certifikát). Logujeme ID.
10. **Každá databázová tabuľka s dátami používateľa má `accountId`** a každý dotaz ho filtruje. Žiadny dotaz bez kontroly vlastníctva.
11. **Validácia vstupov cez Zod** na serveri (server actions aj API). Klientovi neveríme.
12. **Offline:** rozpracovaná faktúra sa ukladá lokálne (IndexedDB) aj na server, hneď ako je signál. Odoslanie EET a e-mailu ide vždy cez frontu s opakovaním.

## Pravidlá dizajnu (podrobne v `docs/DIZAJN.md`)

- Faktúra do **30 sekúnd** a najviac **5 ťuknutí** od otvorenia appky po QR kód (uložený zákazník aj položka).
- Hlavné tlačidlo je **dole na celú šírku, výška ≥ 56 px**. Ostatné tlačidlá **≥ 48 px**, medzi nimi **≥ 16 px**.
- Kontrast textu **7 : 1**: čierna `#14171A` na bielej. Žiadne tiene, prechody ani sivý text na sumách. Polia a tlačidlá majú orámovanie.
- **Jedna obrazovka = jedna úloha.** Spodná lišta má 4 položky (Domů, Faktury, Zákazníci, Více). Žiadne hamburger menu.
- **Len ťuknutia.** Žiadne potiahnutia ani podržania na dôležité akcie. Namiesto rozbaľovacích zoznamov veľké tlačidlá.
- **Stav vždy slovom + ikonou + farbou** (Zaplaceno ✓, Čeká, Po splatnosti, V EET).
- Pre sumy, IČO a telefón **numerická klávesnica** (`inputMode="numeric"` / `"decimal"`).
- Minimálne písmo 16 px. Sumy sú v písme Archivo s `tabular-nums`.
- Tón: v appke **tykáme**, krátko, po česky („Vystav fakturu“, „Tržba je v EET“). V e-mailoch zákazníkom remeselníka **vykáme**. Žiadny úradný jazyk.

## Ako pracuješ

1. **Jedna úloha naraz** podľa `docs/ULOHY.md`. Nezačínaj ďalšiu úlohu a nepridávaj funkcie mimo zadania. Nápady zapíš do `docs/NAPADY.md`.
2. **Najprv plán:** napíš krátko, čo urobíš, ktoré súbory sa zmenia a ako to otestuješ. Pri väčšej úlohe počkaj na potvrdenie.
3. **Testy píš spolu s kódom.** Testy pre výpočty DPH, QR reťazec (SPAYD) a EET správu sú povinné.
4. **Pred odovzdaním spusti** `pnpm lint && pnpm typecheck && pnpm test`. Pri UI navyše `pnpm test:e2e`.
5. **Skontroluj definíciu hotového** (nižšie) a odškrtni úlohu v `docs/ULOHY.md`.
6. **Commit** po logických krokoch, správy v tvare Conventional Commits (`feat: …`, `fix: …`).
7. **Keď si nie si istý** daňovým alebo právnym pravidlom (DPH, EET, náležitosti dokladu), **nehádaj**. Napíš otázku do `docs/OTAZKY.md` a opýtaj sa.
8. Rozhodnutie, ktoré mení architektúru alebo knižnicu, zapíš do `docs/ROZHODNUTIA.md`.

## Definícia hotového (pre každú úlohu)

- [ ] Funguje na iPhone (Safari, pridané na plochu) aj na Androide (Chrome).
- [ ] Spĺňa 8 princípov dizajnu pre terén (`docs/DIZAJN.md`).
- [ ] Testy prechádzajú, sumy sedia na halier.
- [ ] Žiadne texty natvrdo v komponentoch, všetko je v `src/texts/cs.ts`.
- [ ] Nasadené na testovací server a vyskúšané na reálnom mobile.
- [ ] Úloha je odškrtnutá v `docs/ULOHY.md`.

## Príkazy

```bash
pnpm dev            # vývojový server (Next.js)
pnpm worker:dev     # EET a e-mail worker (tsx watch)
pnpm lint           # next lint
pnpm typecheck      # tsc --noEmit
pnpm test           # Vitest (unit testy)
pnpm test:watch     # Vitest v interaktívnom režime
pnpm test:e2e       # Playwright (mobilný viewport 390×844)
pnpm db:migrate     # prisma migrate dev
pnpm db:seed        # testovací účet, zákazníci, cenník
docker compose up   # celé prostredie lokálne (app, worker, postgres)
```

**Prvé spustenie:**
```bash
cp .env.example .env   # vyplniť DATABASE_URL a ostatné
docker compose up -d postgres
pnpm db:migrate
pnpm dev
```

## Čo nerobíme

- **Nekopírujeme texty, logá ani grafiku konkurencie** (Jobber, Fakturoid, iDoklad…). Preberáme len štruktúru a vzory.
- **Nescrapujeme NejŘemeslníci ani iné portály** a neposielame hromadné nevyžiadané e-maily (zákon 480/2004 Sb., GDPR).
- **Nepoužívame produkčné EET** (`trzbyeet.gov.cz`), kým nie je úloha 9 hotová a odsúhlasená. Vývoj a testy idú len na **Playground**.
- **Neukladáme platobné karty.** Peniaze idú priamo na účet remeselníka (QR) alebo do ruky (hotovosť). My peniaze zákazníkov nikdy nedržíme.
- V 1. verzii **nerobíme:** zákazky a denník prác, párovanie s bankou, bločky s AI, cenové ponuky, zálohové faktúry, sklad, viac používateľov, cudzie meny a zahraničných zákazníkov. Pozri `docs/ROADMAPA.md`.
