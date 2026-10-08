# EET 2.0 – podklady pre vývoj

> Zdroj pravdy je **oficiálna technická dokumentácia a XSD na https://eet.gov.cz/cs/pro-vyvojare**. Pred implementáciou si ju stiahni a skontroluj každý údaj nižšie. Ak sa niečo líši, platí dokumentácia a túto stránku oprav. Body označené **[OVERIŤ]** sme nemali potvrdené z primárneho zdroja.

## Kedy sa eviduje

- Účinnosť: **1. 1. 2027**. Prvý mesiac má byť pilotný (dobrovoľný) **[OVERIŤ]**.
- Eviduje sa platba **pri osobnom kontakte so zákazníkom**: hotovosť, karta, **QR platba na mieste**, poukážka a podobne.
- **Neeviduje sa:** bežný prevod alebo úhrada faktúry na diaľku, platba cez bránu bez osobného kontaktu, dobierka.
- Tá istá faktúra teda raz pod EET spadá a inokedy nie, podľa toho, **ako a kde** zákazník zaplatí.

V appke:

| Spôsob platby (`PaymentMethod`) | EET |
|---|---|
| `QR_ON_SITE` (QR na mieste → Zaplaceno) | áno |
| `CASH` (hotovosť) | áno |
| `CARD` (karta cez vlastný terminál remeselníka – len označenie) | áno |
| `BANK_TRANSFER_LATER` (zaplatí neskôr) | nie |

- Eviduje sa najneskôr **pri prijatí platby**. U nás je to moment ťuknutia na „Zaplaceno“.
- **EET OFF:** paušalista v 1. pásme sa môže prihlásiť do režimu bez EET (platí vyšší paušál). Účet má `eetMode = OFF` a nič sa neodosiela, appka to len zobrazí.

## Certifikát

- Podnikateľ si ho vygeneruje zadarmo v **DIS+ (MOJE daně)**. Dostupné od **1. 11. 2026**.
- Formát je **.p12 (PKCS#12)**, RSA 2048, platnosť **366 dní** **[OVERIŤ]**.
- Remeselník nahrá .p12 a heslo. Overíme heslo, vytiahneme platnosť a identifikátory a uložíme **zašifrované** (AES-256-GCM, `CERT_ENCRYPTION_KEY`).
- Upozornenie **30 a 7 dní** pred koncom platnosti (Domů + e-mail).
- Štát spúšťa od **1. 12. 2026** bezplatnú appku **MOJE EET**. Náš rozdiel je, že faktúra, QR platba a EET prebehnú jedným ťuknutím.

## Rozhranie

- **SOAP 1.1**, operácia `OdeslaniTrzby`, verzia rozhrania **v4.1** **[OVERIŤ]**.
- TLS 1.2+. Podpis správy: **WS-Security, XML-DSig, RSA-SHA256** certifikátom podnikateľa.
- Adresy:
  - **Playground (vývoj a testy):** `https://pg.trzbyeet.gov.cz/eet/services/EETServiceSOAP/v4`
  - **Produkcia:** `https://trzbyeet.gov.cz/eet/services/EETServiceSOAP/v4`
  - V kóde sú len cez premennú `EET_ENDPOINT`. **Produkcia sa nepoužíva**, kým to výslovne neodsúhlasíme.

### Údaje správy (podľa našich poznámok – skontroluj voči XSD)

| Pole | Význam | Odkiaľ |
|---|---|---|
| `uuid_zpravy` | UUID v4 každej správy | generuje worker |
| `dat_odesl` | čas odoslania | worker |
| `prvni_zaslani` | `true` pri prvom pokuse, `false` pri opakovaní | worker |
| `EIČ` | identifikátor podnikateľa v EET **[OVERIŤ]** | z certifikátu / nastavenia |
| `id_jednotky` | ID evidenčnej jednotky (miesto) | nastavenie účtu |
| `id_pokl` | ID pokladne / zariadenia | nastavenie účtu (predvolene `FAJFKA-01`) |
| `porad_cis` | poradové číslo tržby | číslo faktúry |
| `dat_trzby` | čas prijatia platby | čas ťuknutia „Zaplaceno“ (Europe/Prague, ISO 8601 s posunom) |
| `celk_trzba` | celková prijatá suma | `amountReceived` (formát čísla podľa XSD) |

- Položky faktúry sa **neevidujú**, posiela sa len celková suma.
- Odpoveď obsahuje **potvrdzovací kód (POK)**. Uložíme ho a vytlačíme na doklad.
- Čo presne musí byť na doklade (POK, ID jednotky, poradové číslo, režim) **[OVERIŤ]**.

## Fronta a opakovanie (worker)

1. „Zaplaceno“ → v transakcii vznikne `eet_record` (stav `PENDING`) a úloha `eet.send` v pg-boss.
2. Worker zostaví a podpíše správu a odošle ju (timeout ~5 s).
3. Úspech → `ACCEPTED`, uloží sa POK a PDF sa pregeneruje s POK. Ak e-mail ešte neodišiel, pošle sa s POK.
4. Chyba siete alebo servera → opakovanie s rastúcim odstupom (`prvni_zaslani = false`), **najneskôr do 48 h** od prijatia tržby.
5. Chyba v dátach (odmietnutie) → `REJECTED`, chyba sa uloží, remeselník dostane upozornenie, žiadne opakovanie.
6. Po 48 h bez úspechu → `FAILED` a výrazné upozornenie na Domů.

**E-mail zákazníkovi nečaká na EET.** Ak EET nie je potvrdené do ~10 s, e-mail odíde bez POK a na doklade je text, že tržba bude zaevidovaná dodatočne **[OVERIŤ, či je to prípustné]**.

## Storno

- Storno evidovanej tržby = nová správa so **zápornou sumou** a novým poradovým číslom (číslo stornovacieho dokladu).

## Testy (povinné)

- Zostavenie XML správy proti vzoru z dokumentácie (snapshot).
- Podpis s testovacím certifikátom z Playgroundu a overenie podpisu.
- Spracovanie odpovede: úspech, chyba v dátach, timeout.
- Opakovanie a príznak `prvni_zaslani`.
- Storno so zápornou sumou.

## Zdroje

- https://eet.gov.cz/cs/pro-vyvojare
- https://eet.gov.cz/files/EET2_Prezentace_Seminar_pro_vyvojare_23-6-2026.pdf
- https://www.epravo.cz/top/aktualne/eet-20-je-na-svete-od-ledna-2027-budou-podnikatele-evidovat-i-platby-kartou-a-qr-kodem-121639.html
- https://www.fakturoid.cz/blog/2026/10/01/eet-2
