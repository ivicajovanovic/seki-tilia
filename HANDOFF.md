# Handoff: AU Šeki-Tilia produkcioni sistem

**Ažurirano:** 4. avgust 2026.
**Status:** sistem je namenjen izradi novih lokalnih produkcionih paketa. Završni materijal se nikada ne objavljuje automatski.

## Trenutno stanje

- Lokalno mogu postojati raniji test-paketi i renderi. Oni nisu aktivni finali, ne zahtevaju ponovno renderovanje i ne prate se Git-om. GitHub sadrži samo sistem, standardne brend/reference/audio assete i sintetičke test fixture podatke.
- `brand/design-history.json` čuva sažetu istoriju potrebnu za pravilo sveže intervencije kada se aktivni paket arhivira ili ukloni iz `productions/`; validator deduplikuje isti ID ako je privremeno prisutan na oba mesta.
- Renderer, brend pravila, paleta, odobrene reference, pre-flight i tok nezavisnog pregleda su deo framework-a.
- Svaki naredni paket mora proći kompletan tok i ne sme ponoviti sadržajni ili vizuelni pristup prethodna tri paketa.
- Klijentske činjenice i materijale dostavljaju stručna lica. Sistem i dalje zahteva izvor uz svaku zdravstvenu ili produktnu tvrdnju, ali ne uvodi poseban interni stručni approval gate.
- Svaki zahtev proizvodi Feed, Story i Reels. Reels uvek koristi nasumično izabranu odobrenu numeru, a početna tema boja se nasumično bira među šest bezbednih renderer tema.
- Operativna paleta sada ima dvanaest tonova. Prvobitnih devet je zadržano, a dodati su Abyssal Teal `#2C3638`, Matcha `#D0D1AF` i Desert Khaki `#DBCCB7`.

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
- Originalni logo nema belu, krem ni drugu pravougaonu podlogu. Za svetlu kontrolisanu pozadinu koristi se `logos/logo-tamniji.svg`, a za tamnu `logos/logo-svetliji.svg`. Renderer istu logiku primenjuje kroz `LogoMark` komponentu. Stari `logo1`, `logo2` i `logo3` fajlovi više ne postoje.
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

Metapodaci šest audio numera evidentirani su u `public/mp3/README.md`; vlasnik projekta je potvrdio da su dozvoljene za korišćenje.
