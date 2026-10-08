# Úlohy pre Claude Code – fáza F1 (MVP)

Cieľ: prvá verzia u testerov do **10. 12. 2026**. EET musí byť hotové na spustenie **1. 1. 2027**.

Pravidlo: robíme jednu úlohu naraz, v tomto poradí. Po každej úlohe nasleduje kontrola podľa definície hotového v `CLAUDE.md` a code review. Hotovú úlohu odškrtni a doplň dátum.

---

## 1. Kostra projektu
- [x] Hotovo (dátum: 2026-10-08)

- Next.js (App Router) + TypeScript strict + Tailwind, pnpm.
- Tailwind téma z `design/tokens.json`: farby, písmo (Archivo, Inter cez `next/font`), rozostupy, zaoblenia, `tap-min`, `tap-primary`.
- PWA: manifest (názov, ikony, `display: standalone`, `theme_color`), service worker (offline shell).
- Prisma + PostgreSQL, prvá migrácia s tabuľkami z `docs/DATOVY-MODEL.md`.
- `src/texts/cs.ts` a pomocná funkcia `t()`.
- `src/lib/money.ts`: typ `Halere`, `formatCzk()`, `parseCzk()` + testy.
- Docker Compose (app, worker, postgres), `.env.example`, GitHub Actions (lint, typecheck, test).
- Rozloženie mobilu: spodná lišta so 4 položkami podľa `design/mockupy/Main.dc.html`, prázdne stránky.
- Doplniť sekciu Príkazy v `CLAUDE.md`.

**Hotové, keď:** appka sa dá pridať na plochu na iPhone aj Androide a otvorí sa bez lišty prehliadača. CI je zelené.

## 2. Registrácia, prihlásenie a prvé nastavenie
- [ ] Hotovo (dátum: ……)

- Prihlásenie magickým odkazom (Resend). Session v cookie (httpOnly, secure).
- Prvé nastavenie v 3 krokoch:
  1. IČO → ARES (REST API) → potvrdenie údajov,
  2. platiteľ DPH áno/nie (+ DIČ),
  3. IBAN (validácia) a EET: „Nastavím později“ / „Mám EET OFF“.
- Obrazovka „Přidej na plochu“ pre iPhone (detekcia Safari + nie standalone).

**Hotové, keď:** nový používateľ sa prihlási a nastaví účet do 2 minút. ARES výpadok nezablokuje registráciu (ručné vyplnenie).

## 3. Zákazníci a ceník
- [ ] Hotovo (dátum: ……)

- Zákazník: Člověk (meno a/alebo e-mail) / Firma (IČO → ARES, DIČ, platiteľ DPH).
- Vyhľadávanie podľa mena, IČO, e-mailu a telefónu. Zoradenie podľa posledného použitia.
- Ceník: názov, jednotka (ks, h, m, m², km, paušál), cena v haléřích, sadzba DPH (21 / 12 / 0).
- Predvyplnené položky pri registrácii: Hodina práce, Výjezd, Doprava (km), Materiál.

## 4. Jadro dokladu (bez UI)
- [ ] Hotovo (dátum: ……)

- `src/lib/invoice/`: určenie tvaru dokladu (4 tvary zo 6 kombinácií), výpočet riadkov, rekapitulácia DPH podľa sadzieb, zaokrúhlenie hotovosti, prenesená daňová povinnosť, kontrola povinných údajov podľa tvaru.
- Číslovanie bez dier (sekvencia na účet a rok, v transakcii).
- Stavy: `DRAFT → ISSUED → PAID`, `ISSUED/PAID → CANCELLED` (storno).
- **Testy:** všetkých 6 kombinácií, každá sadzba, zmiešané sadzby, zaokrúhlenie, hranica 10 000 Kč, prenesená povinnosť, nulové a záporné hodnoty (storno). Pravidlá sú v `docs/DOKLADY.md`.

## 5. Obrazovky Nová faktura
- [ ] Hotovo (dátum: ……)

- 3 kroky podľa mockupov `Faktura-1-zakaznik`, `Faktura-2-polozky`, `Faktura-3-platba`.
- Priebežné ukladanie konceptu (IndexedDB + server). Návrat na rozpracovanú faktúru.
- Rýchla faktura (popis + suma + platba na jednej obrazovke).
- e2e test: uložený zákazník + položka → QR do 5 ťuknutí.

## 6. QR Platba
- [ ] Hotovo (dátum: ……)

- Generátor reťazca SPAYD (`SPD*1.0*ACC:…*AM:…*CC:CZK*X-VS:…*MSG:…`) podľa špecifikácie qr-platba.cz.
  - VS = číslo faktúry bez pomlčky.
  - MSG = názov remeselníka + číslo faktúry, bez diakritiky, s obmedzenou dĺžkou.
- Obrazovka QR podľa `Faktura-4-qr.dc.html`: Wake Lock API (obrazovka nezhasne), tlačidlo Zaplaceno.
- QR na úhradu aj v PDF pri platbe neskôr.
- **Testy:** reťazec SPAYD pre rôzne sumy, IBAN, escapovanie znaku `*`.

## 7. PDF faktúry
- [ ] Hotovo (dátum: ……)

- Šablóna pre všetky 4 tvary dokladu, česká diakritika, logo, QR na úhradu, EET údaje (ak sú).
- Názov súboru `Faktura-2026-0142.pdf`.
- **Testy:** snapshot pre každý tvar dokladu.

## 8. E-mail a zdieľanie
- [ ] Hotovo (dátum: ……)

- Odoslanie cez frontu (pg-boss) s opakovaním. Šablóna po česky s vykaním a PDF v prílohe. Odpovedať (Reply-To) sa dá na e-mail remeselníka.
- `email_log` so stavom doručenia (webhook Resend).
- Tlačidlo Sdílet: Web Share API so súborom PDF. Fallback je stiahnutie.

## 9. EET 2.0
- [ ] Hotovo (dátum: ……)

- Nahratie certifikátu .p12 + heslo → overenie, zašifrované uloženie, kontrola platnosti (upozornenie 30 dní pred koncom).
- Zostavenie správy, podpis, odoslanie na **Playground**, spracovanie odpovede (kód POK).
- Fronta: odoslanie pri „Zaplaceno“, opakovanie do 48 h, príznak prvého zaslania.
- Storno = správa so zápornou sumou.
- Stav EET na faktúre a na Domů. Upozornenie, keď sa niečo nepodarí odoslať.
- **Testy:** zostavenie a podpis správy proti vzorovým dátam z dokumentácie, opakovanie, storno. Pozri `docs/EET.md`.

## 10. Zoznam faktúr a detail
- [ ] Hotovo (dátum: ……)

- Zoznam podľa `Faktury.dc.html`: filtre, zoskupenie podľa dňa, stavy.
- Detail faktúry:
  - PDF,
  - poslať znovu,
  - označiť zaplatené (pri neskoršej platbe; bez EET, ak ide o prevod),
  - storno (+ EET storno, ak bola evidovaná),
  - pripomienka po splatnosti (e-mail zákazníkovi).
- Automatický stav „Po splatnosti“.

## 11. PC rozloženie a export
- [ ] Hotovo (dátum: ……)

- Rozloženie podľa `PC-prehled.dc.html` (ľavé menu od šírky ~1024 px).
- Přehled s KPI a grafom za 12 mesiacov.
- Export pro účetní: výber mesiaca → ZIP (všetky PDF + `prehled.xlsx` + `prehled.csv`).
- Import zákazníkov a ceníka z Excelu/CSV.
- Vzhľad faktúry (logo, farba akcentu, pätička) s náhľadom.

## 12. Predplatné a verejný web
- [ ] Hotovo (dátum: ……)

- Stripe Checkout + Customer Portal (zrušenie jedným klikom), webhooky, limity tarifu Zdarma.
- Verejný web podľa `Web.dc.html` a podstránky z `docs/PRODUKT.md`. SEO meta, OG obrázky, sitemap.
- Kalkulačka „Týká se mě EET?“ a nástroj `/qr-platba-generator`.
- Obchodné podmienky a GDPR: šablóny s miestami [DOPLNIŤ] na právnu kontrolu.
- Analytika bez cookies.
