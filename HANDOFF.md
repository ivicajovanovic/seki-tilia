# Handoff: AU Šeki-Tilia produkcioni sistem

**Ažurirano:** 30. jul 2026.
**Trenutni status:** `premium-product-stage` je potvrđen. Slede piksel-mapiranja preostale tri reference.

## Cilj

Izgraditi pouzdan, lokalni sistem za pripremu Feed, Story i Reels materijala za AU Šeki-Tilia koji:

- dostiže čistu, profesionalnu vizuelnu hijerarhiju odobrenih referenci;
- koristi samo potvrđene činjenice i bezbedan sadržaj;
- čuva originalne assete netaknute i koristi samo hashom odobrene pripremljene kopije;
- prolazi render, nezavisni vizuelni pregled i pre-flight pre statusa `SPREMNO ZA LJUDSKU PROVERU`;
- nikada ne objavljuje sadržaj automatski.

Završni materijal korisnik ručno pregleda i objavljuje na Instagramu i Facebooku.

## Izvori istine i obavezan početak rada

Pre bilo kakve izmene prvo pročitaj `AGENT-OPERATING-MAP.md`, zatim `AGENTS.md` i dokumente koje on navodi. Za vizuale je obavezan `agent-skills-required/visual-design/SKILL.md`.

Glavni izvori istine su:

- `brand/brand-guide.md` za identitet brenda;
- `production/content-safety-rules.md` i `production/copy-playbook.md` za bezbedan sadržaj;
- `brand/design-system.md` za familije, varijacije i pravila logoa;
- `brand/design-references/references.json` za jedine četiri dozvoljene reference;
- `production/scripts/check-post.mjs` za tehnički pre-flight.

## Potvrđeno stanje

### Vizuelni model

Renderer sada koristi čist model: produktni asset, preciznu Manrope tipografiju, semantičke Lucide ikonice i režiranu vektorsku scenu. PNG lišće, noise overlay i dekorativni radijalni blur nisu deo aktivne kompozicije.

Ključne komponente nalaze se u `video-renderer/src/Composition.tsx`:

- `CleanStageArch` za čistu taupe pozadinsku masu;
- `CleanPodium` za podijum i kontrolisanu kontaktnu senku;
- `BrandFooter` sa petrol završetkom, lokacijskom ikonicom i krem logo-karticom;
- `OfferBadge` za kružnu ponudu u familijama kojima je stvarno potrebna;
- `BenefitIconsRow` bez podrazumevanih zdravstvenih tvrdnji. Red se prikazuje samo kada su konkretni benefiti dostavljeni i potvrđeni za aktuelni proizvod.

Znak logoa se koristi samo na krem kartici. Transparentni proizvod ostaje slobodan na sceni, bez pravougaonog rama, kartice ili podloge.

### Validirana familija: `premium-product-stage`

Familija je mapirana prema `ref-premium-product-stage.png` kroz:

- veliku asimetričnu hijerarhiju, poruka levo, dominantna scena desno;
- naslov od 110 px u Feed-u i 148 px u Story-ju, sa `lineHeight: 0.84`;
- podijum širine 490 px u Feed-u i 640 px u Story-ju;
- prilagođavanje širine transparentnom `wide` proizvodu, tako da proizvod ne izlazi iz kadra;
- petrol CTA/footer završetak sa jasnim kontrastom i krem logo-karticom.

Prvi draft je otkrio koliziju dužeg pomoćnog teksta sa scenom. Final je korigovan skraćivanjem tog reda, pa tekst i produkt imaju čiste odvojene zone.

Poslednja korekcija je rešila tri uočena problema: taupe luk je sada jedna neprekinuta kriva bez uglastog spoja, premium podijum ima veću dubinu i vidljivu kontaktnu senku na gornjoj ravni, a proizvod se po formatu vezuje za tu ravan. Brand footer je povećan po visini, uz veću CTA tipografiju, lokacijsku ikonicu i krem logo-karticu za čitanje na telefonu.

### Dokaz i provera

Interni, neobjavljivi validacioni paket je:

`productions/2026/07/002-2026-07-30-premium-stage-sistemska-validacija/`

On koristi neutralni, transparentni test-model, ne stvarni klijentov proizvod. Zato nema zdravstvene, komercijalne ni lokacijske tvrdnje.

- `npm run lint` prolazi za `video-renderer`;
- Feed, Story i Reels su renderovani;
- Reels je 1080x1920 i traje približno 12 sekundi;
- asset je pregledan na svetloj i tamnoj pozadini, vezan SHA-256 hashom i odobren sa dokumentovanim ograničenjem umerenog uvećanja;
- `prepare-visual-review.mjs` je pokrenut nakon konačnog rendera;
- nezavisni reviewer `codex-independent-visual-qc-20260730` potvrdio je `meets-reference-bar`;
- `check-post.mjs` prolazi. Jedino upozorenje je dokumentovano umereno uvećanje neutralnog test-asset-a.

Koren `video-renderer/` više ne sadrži stare `test-feed*.png` rendere. Svi aktuelni radni renderi i dokazi čuvaju se samo u paketu objave.

## Šta sledi

Sledeći rad se radi ovim redosledom. Ne preskakati korake i ne započinjati novu objavu pre završetka odgovarajućeg asset gate-a.

1. Mapirati `editorial-split` i `gallery-shelf` prema `ref-editorial-offer-stage.png`.
   - Fokus: editorial odnos poruke levo i produktne scene desno, rotirani `OfferBadge` samo kada postoji potvrđena ponuda.

2. Mapirati `minimal-offer` i `product-card` prema `ref-product-stage-footer.png`.
   - Fokus: dominantna centrirana scena, podijum, premium osvetljenje i funkcionalan footer.

3. Mapirati `product-atelier` i `type-stage` prema `ref-vertical-product-spotlight.png`.
   - Fokus: vertikalna skala proizvoda i slojevita kružna scenografija.

4. Za svaku od tri matrice napraviti novi interni paket i proveriti Feed, Story i Reels.
   - Pokrenuti `inspect-assets.mjs`.
   - Pregledati svetli i tamni asset-preview.
   - Napraviti draft, zatim najmanje jednu vidljivu korekciju.
   - Renderovati Feed, Story, tri Reels ključna kadra i MP4.
   - Pokrenuti `prepare-visual-review.mjs`.
   - Tražiti nezavisan pregled drugog agenta sa drugačijim `reviewerId`.
   - Pokrenuti `check-post.mjs`.

5. Tek nakon četiri validirane matrice koristiti renderer za stvarne klijentske objave.

## Pravila koja ne smeju biti prekršena

- Lekovi i antibiotici se ne promovišu.
- Za produktne, zdravstvene, cenovne, akcijske i lokacijske tvrdnje koristi se samo potvrđen izvor.
- Akcija zahteva mehaniku, vrednost, rok i izvor. Bez toga paket ostaje blokiran ili se menja u neutralnu objavu.
- Transparentni produktni asset sa kursorom, UI tragom, pogrešnim proizvodom, ozbiljnom deformacijom ili neupotrebljivom alfa ivicom je blokada. Ne retuširati generativno sadržaj pakovanja.
- Logo, glavna poruka, ponuda, proizvod i CTA moraju ostati čitljivi u punoj veličini i pri prikazu telefona.
- Pravougaoni paneli, footeri, kartice i logo-kartice imaju oštre uglove. Pill oznaka i kružni oblici su jedini izuzeci.
- Za svaku grafiku i video koristi se smislena Lucide ikonica. Benefit i medicinska ikonica traže potvrđenu tvrdnju.
- Nakon `prepare-visual-review.mjs` ne menjati input, props, renderer, CSS, reference ni render bez novog review ciklusa.

## Podaci koji se još čekaju od klijenta

- potvrđeni podaci za svaku lokaciju: naziv, mesto, adresa, telefon, radno vreme i odstupanja;
- fotografije apoteka koje se smeju javno koristiti;
- čisti produktni asseti kada se promoviše konkretan proizvod;
- za stvarnu akciju: proizvod, mehanika, vrednost, rok, obuhvaćene lokacije i izvor potvrde.

Lokacije se vode centralno u `brand/brand-config.json`, a fotografije lokacija u `client-assets/locations/<id-lokacije>/`. Dok potvrda ne stigne, podatak se ne izmišlja i ne prikazuje.

## Brza komanda za stvarnu objavu

```bash
node production/scripts/create-post.mjs --slug "kratak-naziv-objave"
```

Zatim se radi kompletan tok iz `AGENT-OPERATING-MAP.md`. Finalne datoteke idu samo u `final/`: Feed PNG, Story PNG, Reels MP4 i caption.
