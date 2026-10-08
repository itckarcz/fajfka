# Produkt – 1. verzia (MVP)

## Pre koho

Remeselník alebo živnostník (OSVČ, prípadne malé s.r.o.) v Česku, ktorý robí prácu u zákazníka: inštalatér, elektrikár, malíř, topenář, podlahář, zámečník, opravár spotrebičov, hodinový manžel. Väčšinou nie je platiteľ DPH. Fakturuje ľuďom aj firmám. Počítač otvára zriedka, všetko má v mobile.

## Čo rieši

- Faktúru vystaví hneď na mieste, nie večer doma.
- Peniaze dostane hneď: QR platba alebo hotovosť.
- Od 1. 1. 2027 musí platby na mieste evidovať v EET 2.0 a nechce kvôli tomu pokladňu ani druhú appku.

## Hlavný postup (musí trvať do 30 sekúnd)

```
Domů → [+ Nová faktura]
  1. Zákazník   – vyhľadať / posledný / nový (Člověk | Firma s IČO → ARES)
  2. Položky    – z ceníku jedným ťuknutím, vlastná položka, množstvo +/−, súčet
  3. Platba     – QR kód teď | Hotově nebo kartou | Zaplatí později
       QR teď      → QR na celú obrazovku → [Zaplaceno] → EET → e-mail → Hotovo
       Hotově      → prijatá suma (zaokrúhlenie na Kč) → [Zaplaceno] → EET → e-mail → Hotovo
       Později     → faktúra so splatnosťou a QR na úhradu → e-mail → bez EET
```

Do EET ide **iba platba pri osobnom kontakte** (QR na mieste, hotovosť, karta). Faktúra zaplatená neskôr prevodom sa neeviduje. Podrobnosti sú v `EET.md`.

V 1. verzii appka **nevie sama zistiť**, že QR platba prišla. Remeselník ťukne „Zaplaceno“, keď mu zákazník ukáže potvrdenie z banky. Automatické párovanie s bankou príde vo fáze F3.

## Obrazovky mobilu (10)

| # | Obrazovka | Obsah | Hlavné tlačidlo | Mockup |
|---|---|---|---|---|
| 1 | Prvé spustenie (3 kroky) | IČO → údaje z ARES na potvrdenie; platiteľ DPH áno/nie; číslo účtu (IBAN); EET certifikát / „Později“ / EET OFF | Pokračovat | – |
| 2 | Návod „Přidej na plochu“ (iPhone) | 3 kroky so šípkou na tlačidlo Sdílet v Safari | Rozumím | – |
| 3 | Domů | veľké tlačidlo Nová faktura; zaplatené tento mesiac; čaká (počet + suma); po splatnosti; posledné 3 faktúry; stav EET | + Nová faktura | `Main.dc.html` |
| 4 | Nová faktura – zákazník | Člověk / Firma (IČO); vyhľadávanie; poslední zákazníci; Nový zákazník | Pokračovat | `Faktura-1-zakaznik.dc.html` |
| 5 | Nová faktura – položky | položky; Přidat položku; rýchle z ceníku; súčet veľkým písmom; pri platiteľovi rozpis DPH | Pokračovat k platbě | `Faktura-2-polozky.dc.html` |
| 6 | Nová faktura – platba | 3 veľké voľby; e-mail zákazníka; pri platiteľ → firma platiteľ políčko „Přenesená daňová povinnost“ | (výber voľby) | `Faktura-3-platba.dc.html` |
| 7 | QR na celú obrazovku | suma, QR (SPAYD), VS, banka; jas na maximum | Zaplaceno | `Faktura-4-qr.dc.html` |
| 8 | Hotovo | Zaplaceno ✓, Tržba je v EET ✓ (alebo „odešleme, až bude signál“), e-mail odeslán | Hotovo; Sdílet PDF | `Faktura-5-hotovo.dc.html` |
| 9 | Faktury | zoznam so stavmi; filtre Vše / Čeká / Po splatnosti / Zaplaceno; detail: PDF, poslat znovu, označit zaplaceno, storno, připomínka | – | `Faktury.dc.html` |
| 10 | Více | zákazníci, ceník, nastavenia (údaje, účet, EET, logo, číslovanie), export pro účetní, predplatné | – | – |

### Detaily, ktoré rozhodujú

- **Súkromná osoba:** stačí meno alebo len e-mail. Adresa je voliteľná.
- **Firma:** stačí IČO, zvyšok (názov, adresa, DIČ) sa doplní z ARES. Či je firma platiteľ DPH, overíme v registri plátcov DPH. Ak to nevyjde, remeselník to označí ručne.
- **Položka „Hodina práce“** má rýchle tlačidlá ½ h, 1 h, 2 h.
- **Hotovosť:** appka pýta prijatú sumu, ukáže vydať späť a zaokrúhli na celé koruny. Do EET ide skutočne prijatá suma (pozri `DOKLADY.md`, zaokrúhlenie).
- **Rýchla faktúra:** na Domů je druhá možnosť „Rychlá faktura“. Na jednej obrazovke je popis, suma a platba.
- **E-mail zákazníka:** pole s textom „Fakturu vám pošleme e-mailem“. Keď ho zákazník zadá, súhlasil s elektronickou formou dokladu.
- **Zdieľanie:** systémové tlačidlo Sdílet (Web Share API so súborom PDF) pre WhatsApp a SMS. Fallback je stiahnutie PDF.
- **Rozpracovaná faktúra** sa ukladá priebežne. Po prerušení (hovor, zlý signál) sa appka vráti presne tam.

## PC verzia

Je to tá istá appka, len rozložená na širokú obrazovku. Mockup: `PC-prehled.dc.html`.

- **Ľavé menu:** Přehled, Faktury, Zákazníci, Ceník, EET a tržby, Export pro účetní, Nastavení.
- **Přehled:** zaplatené tento a minulý mesiac, čaká na platbu, po splatnosti, tržby v EET, graf za 12 mesiacov, tlačidlo Export.
- **Faktury:** tabuľka (číslo, zákazník, dátum, platba, EET, suma, stav) s filtrami a vyhľadávaním. Vpravo je náhľad PDF.
- **Nová faktura:** jeden formulár na celú šírku, vpravo živý náhľad PDF.
- **Len na PC (alebo pohodlnejšie):**
  - mesačný export (ZIP s PDF + Excel súhrn),
  - import zákazníkov a ceníka z Excelu,
  - vzhľad faktúry (logo, farba, pätička).
- **Pravidlo:** čo sa dá spraviť na PC, dá sa spraviť aj v mobile (aspoň cez Více). Nikdy nie naopak.

## Verejný web

Mockup: `Web.dc.html`. Web je po česky a vykáme.

1. **Hlavička:** logo, Jak to funguje, EET, Cena, Otázky, Přihlásit, tlačidlo „Vyzkoušet zdarma“.
2. **Hlavný blok:** „Faktura a EET za 30 sekund. Přímo u zákazníka.“ Pod ním podnadpis, formulár (waitlist / registrácia) a mobil s obrazovkou Hotovo.
3. **Pruh dôvery:** „Připraveno na EET 2.0 od 1. 1. 2027“, „Data v EU“, „QR Platba všech českých bank“.
4. **Jak to funguje** v 3 krokoch.
5. **Blok EET 2.0** a kalkulačka „Týká se mě EET?“ (3 otázky → áno / nie / EET OFF).
6. **Pro koho:** dlaždice oborov, každá vedie na vlastnú podstránku.
7. **Cena:** Zdarma vs Řemeslník 199 Kč/měsíc, ročne 2 mesiace zadarmo.
8. **Časté otázky** a **pätička** (kontakt, obchodné podmienky, GDPR, sídlo firmy).

**Podstránky:** `/cena`, `/eet-2-0`, `/jak-to-funguje`, `/pro-instalatery`, `/pro-elektrikare`, `/qr-platba-generator` (nástroj zadarmo), `/prihlaseni`, `/obchodni-podminky`, `/ochrana-osobnich-udaju`.

## Tarify (návrh, finálne v úlohe 12)

| | Zdarma | Řemeslník |
|---|---|---|
| Cena | 0 Kč | 199 Kč / mesiac (ročne 10 mesiacov) |
| Faktúry | limit [DOPLNIŤ, napr. 5 / mesiac] | neomezeně |
| QR platba, e-mail, PDF | áno | áno |
| EET 2.0 | nie | áno |
| Export pro účetní | nie | áno |

## Čo do 1. verzie nepatrí

Zákazky a denník prác, párovanie s bankou, bločky s AI, prístup pre účtovníčku, cenové ponuky, zálohové faktúry, sklad, viac používateľov na účte, cudzie meny, zahraniční zákazníci (aj slovenskí), slovenčina, natívna appka v obchodoch.
