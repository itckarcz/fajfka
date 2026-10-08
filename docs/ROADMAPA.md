# Roadmapa

Každá fáza má **bránu**: konkrétne číslo, ktoré musí prísť, než začneme ďalšiu. Ak brána nepríde, fázu nepreskakujeme. Zistíme prečo (rozhovory s používateľmi) a opravíme, čo bráni rastu.

| Fáza | Obdobie | Čo staviame | Brána na ďalšiu fázu |
|---|---|---|---|
| **F0 Overenie** | okt – nov 2026 | landing page s waitlistom, rozhovory s remeselníkmi, test PWA na iPhone a Androide | 50+ ľudí na waitliste |
| **F1 MVP** | nov – 10. 12. 2026 | úlohy 1–12 z `ULOHY.md`: faktúra, QR, PDF, e-mail, EET, PC export, predplatné | 20 testerov reálne vystavuje faktúry |
| **F2 Spustenie** | dec 2026 – feb 2027 | ostrá prevádzka EET od 1. 1. 2027, opravy z testov, onboarding, obsah na web (EET návody) | 100 platiacich, odchod < 5 % mesačne |
| **F3 Zákazky + banka** | mar – jún 2027 | zákazky a denník prác (zápis práce a materiálu, faktúra na konci), párovanie platieb (Fio API, potom ďalšie banky), pripomienky | 250 platiacich |
| **F4 Náklady + účtovníčka** | júl – dec 2027 | bločky a náklady s AI, prístup pre účtovníčku, export Pohoda XML a ISDOC, cenové ponuky, zálohy | 500 platiacich → rozhovory s investorom |
| **F5 Rast** | 2028 | Slovensko (eKasa, slovenčina), ďalšie obory, malé tímy (viac používateľov), partnerstvá | – |

## Pravidlá pre Claude Code

- Pracuje sa **len na aktuálnej fáze** (teraz F1). Kód pripravujeme tak, aby ďalšie fázy nebolo treba prepisovať:
  - texty sú v jednom súbore,
  - `accountId` je všade,
  - spôsob platby je enum.
- Ďalšie funkcie navyše nestavia.
- Nápady na neskôr patria do `docs/NAPADY.md` s označením fázy.
