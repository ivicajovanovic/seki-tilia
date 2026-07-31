# Handoff: AU Šeki-Tilia produkcioni sistem

**Ažurirano:** 31. jul 2026.
**Status:** framework je čist i spreman za prvi stvarni, potvrđeni brief. Završni materijal se nikada ne objavljuje automatski.

## Trenutno stanje

- Nema lokalnih test-objava, rendera ni job asseta. `productions/` je prazan, a `brand/design-history.json` počinje bez zapisa.
- Renderer, brend pravila, paleta, odobrene reference, pre-flight i tok nezavisnog pregleda su deo framework-a.
- Svaki prvi stvarni paket mora proći kompletan tok. Ne postoje raniji renderi koji služe kao uzor ili dokaz za novu objavu.

## Obavezan početak rada

1. Pročitaj `AGENT-OPERATING-MAP.md`, zatim `AGENTS.md` i sva dokumenta na koja oni upućuju.
2. Za svaki vizual primeni `agent-skills-required/visual-design/SKILL.md`.
3. Za novu objavu otvori poseban paket:

```bash
node production/scripts/create-post.mjs --slug "kratak-naziv-objave"
```

4. Originale bez izmene stavi u `source/`, a nerazvrstane privatne materijale privremeno u `client-assets/inbox/`.

## Vizuelni ugovor

- Nema senki ni zamućenja, vektorskih ni rasterskih.
- Originalni logo nema belu, krem ni drugu pravougaonu podlogu. Postavlja se samo na kontrolisanu tamnu pozadinu; naziv lanca mora biti čitljiv i dovoljno velik.
- Transparentni proizvod ostaje slobodan, dominantan element, bez rama, kartice i pravougaone podloge.
- Kada postoji podijum, proizvod mora vidljivo stajati na njegovoj gornjoj ravni. Prednja masa podijuma ulazi iza footera, dovoljno je široka i ima izražen vektorski gradijent.
- Pravougaoni strukturni elementi imaju oštre uglove. Grafika i video koriste jednu smislenu Lucide ikonu, osim čiste tekstualne objave.
- Boje se biraju iz `brand/color-palette.json`. Tekst i logo koriste isključivo dozvoljene kontrastne kombinacije.

Puna pravila, familije, svežina kompozicije i pregled rendera nalaze se u `AGENTS.md` i `brand/design-system.md`.

## Šta je potrebno od klijenta

- tema i potvrđene činjenice o proizvodu ili kategoriji;
- originalni produktni asset, idealno transparentni PNG ili kvalitetna fotografija;
- za akciju: proizvod, mehanika, vrednost, rok, obuhvaćene lokacije i izvor potvrde;
- za lokalnu objavu: potvrđen ID lokacije i podaci iz `brand/brand-config.json`.

Ne izmišljati činjenice, cenu, popust, rok, dostupnost, sastojke, zdravstvenu korist niti lokalne podatke. Lekovi i antibiotici se ne promovišu.

## Tok do predaje

Asset gate → potvrđen copy → `design-direction.json` i `palettePlan` → draft i stvarna korekcija → render → `prepare-visual-review.mjs` → nezavisni pregled → `check-post.mjs` → `SPREMNO ZA LJUDSKU PROVERU`.

Finali idu samo u `final/`: Feed PNG, Story PNG, Reels MP4 i caption. Pravila za čuvanje i kasnije arhiviranje su u `production/artifact-lifecycle.md`.

## Otvorena administrativna stavka

`brand/brand-config.json` sadrži 12 unetih lokacija, dok deo brend dokumentacije pominje najmanje 14. Pre prve lokalne objave potvrditi da li nedostaju dva zapisa ili treba uskladiti opis mreže.
