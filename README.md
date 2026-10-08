# Fajfka

Faktura a EET za 30 sekund, přímo u zákazníka. Mobilná webová appka (PWA) pre remeselníkov v teréne.

## Začíname

1. Rozbaľ tento balík do priečinka projektu.
2. `git init` a prvý commit (`docs: project brief`).
3. Otvor priečinok v Claude Code a napíš:

   ```
   /dalsia-uloha
   ```

   Claude Code si prečíta `CLAUDE.md`, vezme úlohu 1 (kostra projektu) a navrhne plán.
4. Po každej úlohe spusti `/kontrola`, vyskúšaj appku na mobile a odškrtni úlohu v `docs/ULOHY.md`.

## Štruktúra podkladov

```
CLAUDE.md                 pravidlá projektu (Claude Code ho číta automaticky)
docs/PRODUKT.md           čo appka robí, obrazovky, web
docs/ULOHY.md             12 úloh fázy F1 v poradí
docs/ROADMAPA.md          fázy F0–F5 a brány
docs/DOKLADY.md           pravidlá faktúr a DPH
docs/EET.md               EET 2.0
docs/DATOVY-MODEL.md      návrh databázy (Prisma)
docs/DIZAJN.md            dizajn a tón reči
docs/ROZHODNUTIA.md       prečo sme čo zvolili
docs/OTAZKY.md            otvorené otázky (pre účtovníka a pod.)
docs/NAPADY.md            nápady na neskôr
design/tokens.json        farby, písmo, rozostupy
design/mockupy/           návrhy obrazoviek (HTML)
.claude/commands/         príkazy /dalsia-uloha a /kontrola
```

## Návrhy obrazoviek

Súbory v `design/mockupy/` sú exporty z plátna „Fajfka – návrhy obrazoviek“ na claude.ai. Otvárajú sa tam (interaktívne s preklikom). Tu slúžia Claude Code ako vzor rozloženia a textov.
