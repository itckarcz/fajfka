# Pravidlá dokladov (Česko)

> Tieto pravidlá sú zhrnutie pre vývoj, nie právna rada. Miesta označené **[OVERIŤ]** pred spustením skontroluje účtovník alebo daňový poradca. Otázky zapisuj do `docs/OTAZKY.md`.

## 6 kombinácií → 4 tvary dokladu

Remeselník (dodávateľ) je platiteľ alebo neplatiteľ DPH. Zákazník je firma platiteľ, firma neplatiteľ alebo súkromná osoba. Appka sama určí tvar dokladu, remeselník nič nevyberá.

| Remeselník | Zákazník | Tvar dokladu (`InvoiceKind`) |
|---|---|---|
| neplatiteľ | firma platiteľ | `NON_VAT_INVOICE` |
| neplatiteľ | firma neplatiteľ | `NON_VAT_INVOICE` |
| neplatiteľ | súkromná osoba | `NON_VAT_INVOICE` |
| platiteľ | firma platiteľ | `VAT_INVOICE`, alebo `VAT_INVOICE_REVERSE_CHARGE`, ak je zaškrtnutá prenesená povinnosť |
| platiteľ | firma neplatiteľ | `VAT_INVOICE` |
| platiteľ | súkromná osoba | `SIMPLIFIED_VAT_INVOICE`, ak celková suma ≤ 10 000 Kč; inak `VAT_INVOICE` (appka vypýta meno a adresu) |

Funkcia: `determineInvoiceKind(supplier, customer, totals, reverseCharge): InvoiceKind`. Všetky vetvy musia byť pokryté testom.

## Tvar 1 – `NON_VAT_INVOICE` (neplatiteľ)

- Nadpis: **Faktura**. Text: **„Nejsem plátce DPH.“**
- Dodávateľ:
  - meno / názov, adresa (miesto podnikania), IČO,
  - pri fyzickej osobe text o zápise v živnostenskom registri, pri s.r.o. zápis v obchodnom registri **[OVERIŤ presné znenie]**.
- Odberateľ:
  - firma: názov, adresa, IČO (DIČ, ak má),
  - osoba: meno (adresa a e-mail voliteľné).
- Číslo dokladu, dátum vystavenia, dátum splatnosti (pri platbe neskôr), spôsob platby, bankový účet + VS.
- Položky: popis, množstvo, jednotka, cena za jednotku, spolu. Celková suma.
- Pri platbe na mieste: „Zaplaceno [hotově / QR platbou] dne …“ + EET údaje (pozri `EET.md`).

## Tvar 2 – `VAT_INVOICE` (plný daňový doklad, § 29 ZDPH)

Obsahuje navyše oproti tvaru 1:

- Nadpis: **Faktura – daňový doklad**.
- DIČ dodávateľa aj odberateľa (ak ho odberateľ má).
- **DUZP** (dátum uskutočnenia zdaniteľného plnenia). Predvolene je to dátum vystavenia a dá sa zmeniť.
- Pri každej položke: cena za jednotku bez DPH, sadzba DPH.
- **Rekapitulácia podľa sadzieb:** základ dane, sadzba, výška DPH (v Kč), spolu s DPH.

## Tvar 3 – `SIMPLIFIED_VAT_INVOICE` (zjednodušený daňový doklad, § 30 ZDPH)

- Len ak je celková suma **≤ 10 000 Kč vrátane DPH**.
- Údaje o odberateľovi nie sú povinné.
- Obsahuje dodávateľa s DIČ, číslo, dátum vystavenia, DUZP, popis plnenia, sadzbu DPH a celkovú cenu s DPH. Podľa sadzieb uvedieme aj základ a daň **[OVERIŤ minimálny rozsah]**.

## Tvar 4 – `VAT_INVOICE_REVERSE_CHARGE` (prenesená daňová povinnosť, § 92e ZDPH)

- Ponúka sa **len** pri kombinácii platiteľ → firma platiteľ, ako zaškrtávacie políčko „Přenesená daňová povinnost“ (stavebné a montážne práce).
- Na doklade je text **„Daň odvede zákazník“**, sadzba DPH je uvedená, ale **výška DPH sa neuvádza**. Celková suma = základ.
- Povinné: DIČ oboch strán.
- **[OVERIŤ]:** presné znenie textu a či uvádzať kód CZ-CPA.

## DPH

- Sadzby: **21 %, 12 %, 0 %** (0 % = osvobozeno / mimo DPH).
- Nastavenie účtu „Ceny zadávám s DPH / bez DPH“. Predvolene **s DPH**, lebo remeselník myslí v cene pre človeka.
- **Výpočet:**
  - Ceny bez DPH: základ = Σ riadkov danej sadzby, DPH = zaokrúhlenie(základ × sadzba / 100).
  - Ceny s DPH: celkom za sadzbu = Σ riadkov, DPH = zaokrúhlenie(celkom × sadzba / (100 + sadzba)), základ = celkom − DPH.
  - Zaokrúhľujeme **na haléře, matematicky** (polovica nahor), **raz za sadzbu v rekapitulácii**, nie po riadkoch **[OVERIŤ]**.
- Všetko je v haléřích ako celé čísla. Pri násobení množstvom pracujeme s množstvom v tisícinách (`quantityMilli`), aby 1,5 h nebola desatinná hodnota v ceste výpočtu.

## Zaokrúhlenie pri hotovosti

- Platba v hotovosti sa zaokrúhľuje na **celé koruny** (matematicky).
- Rozdiel ide do samostatného riadku „Zaokrouhlení“ (mimo DPH). Do EET ide **skutočne prijatá suma** **[OVERIŤ zaobchádzanie s DPH pri zaokrúhlení u platiteľa]**.
- QR platba a prevod sa nezaokrúhľujú (presne na haléře).

## Číslovanie

- Formát `RRRR-NNNN` (napr. `2026-0142`), samostatná rada na účet a kalendárny rok, **bez dier**.
- Číslo sa pridelí pri vystavení v transakcii (`SELECT … FOR UPDATE` na riadku sekvencie). Koncept číslo nemá.
- Storno dostane vlastné číslo z tej istej rady a odkaz na pôvodný doklad.
- VS pre QR je číslo bez pomlčky (`20260142`).

## Storno a oprava

- Vystavený doklad sa nemení.
- Storno = nový doklad so zápornými sumami (opravný daňový doklad pri platiteľovi, § 45 ZDPH **[OVERIŤ náležitosti]**).
- Ak bola tržba v EET, storno sa eviduje so zápornou sumou (pozri `EET.md`).

## E-mail a súhlas s elektronickou formou

- Pri daňovom doklade musí odberateľ súhlasiť s elektronickou formou. Stačí aj konkludentný súhlas: zákazník sám zadá e-mail. V UI je text „Fakturu vám pošleme e-mailem.“
- Spotrebiteľ má nárok na doklad na požiadanie (zákon o ochrane spotrebiteľa). PDF je možné aj cez Sdílet.

## Mimo 1. verziu

Zahraniční odberatelia (aj SK), cudzie meny, zálohové faktúry a daňové doklady k prijatej platbe, zľavy na úrovni dokladu, viac rád číslovania.
