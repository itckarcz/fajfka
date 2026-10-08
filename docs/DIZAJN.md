# Dizajn – Fajfka

Vzhľad „pracovné náradie“: čierna a biela pre kontrast na slnku, signálna oranžová ako farba značky, fajfka ako znak hotovej a zaplatenej práce.

- **Zdroj pravdy:** `design/tokens.json`. Tailwind téma sa generuje z neho, farby sa nepíšu natvrdo.
- **Vzory obrazoviek:** `design/mockupy/*.dc.html`. Sú to statické HTML návrhy s inline štýlmi a slúžia ako vzor rozloženia, veľkostí a textov. Neprenášaj ich 1:1, postav z nich komponenty v Tailwinde.

## 8 princípov pre terén (platia pre každú obrazovku)

1. **Faktúra do 30 sekúnd**, najviac 5 ťuknutí od otvorenia appky po QR kód (pri uloženom zákazníkovi a položke).
2. **Hlavné tlačidlo dole**, na dosah palca, na celú šírku, výška **≥ 56 px** (na Domů 64 px). Ostatné tlačidlá **≥ 48 px**, medzi nimi **≥ 16 px**.
3. **Kontrast 7 : 1:** čierne na bielom, bez tieňov a prechodov. Polia a tlačidlá majú orámovanie (`line` #9AA0A6).
4. **Jedna obrazovka = jedna úloha.** Žiadne hamburger menu. Spodná lišta má 4 položky: Domů, Faktury, Zákazníci, Více.
5. **Len ťuknutia:** žiadne potiahnutia ani podržania na dôležité akcie. Namiesto rozbaľovacích zoznamov veľké tlačidlá s možnosťami.
6. **Nič sa nestratí:** koncept sa ukladá priebežne. EET sa pri výpadku signálu pošle neskôr a appka to jasne ukáže.
7. **Stav vždy slovom, ikonou aj farbou:** ✓ Zaplaceno, ◷ Čeká, ! Po splatnosti, ✓ V EET.
8. **Numerická klávesnica** pre sumy a IČO. Automatické dopĺňanie z ARES a z posledných zákazníkov.

**Kontrola pred vydaním:** vyskúšať vonku na slnku, na staršom Androide a jednou rukou.

## Farby

| Token | Svetlý | Použitie |
|---|---|---|
| `ink` | #14171A | text, sumy, **hlavné tlačidlo** (biely text) |
| `paper` | #FFFFFF | pozadie |
| `surface-2` | #F4F5F6 | podklad sekcií, súčet faktúry |
| `ink-muted` | #5B6168 | popisky, vedľajší text (nikdy sumy) |
| `line` | #9AA0A6 | orámovanie polí a tlačidiel |
| `signal` | #E8590C | logo, aktívna záložka, zvýraznenie (nie text) |
| `signal-strong` | #C2410C | oranžový text a odkazy |
| `signal-soft` | #FDE7D9 | jemné pozadie: tip, vybraná možnosť |
| `paid` / `paid-soft` | #15803D / #DCFCE7 | Zaplaceno, V EET |
| `waiting` | #B45309 | Čeká na platbu (pozadie odznaku #FEF3C7) |
| `overdue` | #B91C1C | Po splatnosti, chyby (pozadie odznaku #FEE2E2) |

Tmavý režim je v tokenoch, ale v teréne je predvolený svetlý. Tmavý sa zapína len ručne.

**Hlavné tlačidlo je čierne, nie oranžové.** Oranžová patrí značke.

## Písmo

- **Archivo** (700–800): nadpisy a sumy. `amount-xl` 36/40, `title` 24/30, `heading` 20/26.
- **Inter** (400–700): text a formuláre. `body` 16/24 (minimum), `button` 17/24 600, `label` 14/20 600, `caption` 13/18.
- Sumy majú `font-variant-numeric: tabular-nums`.
- Načítanie cez `next/font/google` s podmnožinou `latin-ext` (čeština).

## Rozostupy, zaoblenia, veľkosti

- Rozostupy: 4, 8, 16 (okraj obrazovky v mobile), 24 (medzi sekciami), 32 (okraje na PC).
- Zaoblenia: `sm` 6 (odznaky), `md` 10 (tlačidlá, polia, karty), `lg` 16 (veľké bloky, QR karta).
- `tap-min` 48 px, `tap-primary` 56 px.

## Ikony

- Jednoduché čiarové ikony (stroke 2–2,6). Napríklad **Lucide**, ktoré majú rovnaký štýl ako mockupy.
- Ikona je vždy s textom. Výnimka je tlačidlo Späť, ktoré má `aria-label`.

## Logo

- Slovo **Fajfka** v Archivo 800 v `ink` a za ním fajfka v `signal`.
- Ikona appky: štvorec `signal` so zaoblením `radius-lg` a bielou fajfkou. Treba pripraviť PNG 192, 512 a maskable pre manifest.
- Kým nebude logo nakreslené dizajnérom, používame písané slovo + SVG fajfku z mockupov.

## Tón reči

- Appka aj web sú **po česky** (slovenčina neskôr).
- **V appke tykáme**, krátko, ako kolega: „Vystav fakturu“, „Zaplaceno ✓“, „Tržba je v EET“, „Komu fakturuješ?“.
- **Web a e-maily zákazníkom remeselníka: vykáme.**
- Žiadny úradný jazyk: nie „Evidence tržby proběhla úspěšně“, ale „Tržba je v EET“.
- Chybové hlášky povedia, čo sa stalo a čo robiť: „Nemáš signál. Fakturu jsme uložili, EET odešleme, až budeš online.“

## Prístupnosť

- Skutočné `<button>`, `<a>`, `<input>` s `<label>`.
- `aria-label` na tlačidlách len s ikonou.
- Viditeľný focus.
- Text škálovateľný: rozloženie nesmie prasknúť pri 130 % veľkosti písma v systéme.
