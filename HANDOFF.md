# Handoff: AU Šeki-Tilia produkcioni sistem

**Ažurirano:** 31. jul 2026.
**Trenutni status:** sistem je spreman za rad sa stvarnim, potvrđenim klijentskim briefom. Interni paketi `premium-product-stage`, `editorial-split` i `gallery-shelf` imaju aktuelne rendere, nezavisan pregled i prolazan pre-flight. `product-atelier` i `type-stage` su implementirane kao zasebne familije; pre prve javne upotrebe prolaze isti paketni tok kao i svaka stvarna objava.

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
- `brand/color-palette.json` za devet dozvoljenih tonova, kontrastne parove za tekst i kontrolisane podloge za logo;
- `brand/design-references/references.json` za jedine četiri dozvoljene reference;
- `production/scripts/check-post.mjs` za tehnički pre-flight.

## Potvrđeno stanje

### Vizuelni model

Renderer sada koristi čist model: produktni asset, preciznu Manrope tipografiju, semantičke Lucide ikonice i režiranu vektorsku scenu. Senke i zamućenja, vektorski ili rasterski, nisu deo aktivne kompozicije.

Ključne komponente nalaze se u `video-renderer/src/Composition.tsx`:

- `CleanStageArch` za čistu taupe pozadinsku masu;
- `CleanPodium` za podijum sa izraženim vektorskim gradijentom, vidljivom gornjom ravni i prednjom masom koja ulazi iza footera;
- `BrandFooter` sa petrol završetkom, lokacijskom ikonicom, većim nazivom lanca i originalnim logom bez pravougaone podloge;
- `OfferBadge` za kružnu ponudu u familijama kojima je stvarno potrebna;
- `BenefitIconsRow` bez podrazumevanih zdravstvenih tvrdnji. Red se prikazuje samo kada su konkretni benefiti dostavljeni i potvrđeni za aktuelni proizvod.

Znak logoa se koristi bez bele, krem ili druge pravougaone kartice. Transparentni proizvod ostaje slobodan na sceni, bez pravougaonog rama, kartice ili podloge.

### Podržana familija: `premium-product-stage`

Familija je mapirana prema `ref-premium-product-stage.png` kroz:

- veliku asimetričnu hijerarhiju, poruka levo, dominantna scena desno;
- naslov od 110 px u Feed-u i 148 px u Story-ju, sa `lineHeight: 0.84`;
- podijum širine 490 px u Feed-u i 640 px u Story-ju;
- prilagođavanje širine transparentnom `wide` proizvodu, tako da proizvod ne izlazi iz kadra;
- petrol CTA/footer završetak sa jasnim kontrastom, većim nazivom lanca i logom bez pravougaone podloge.

Aktuelni vizuelni ugovor: taupe luk je jedna neprekinuta kriva bez uglastog spoja; premium podijum dobija dubinu kroz izražen vektorski gradijent i vidljivu gornju ravan, a proizvod se po formatu vezuje za tu ravan. Prednja masa podijuma ulazi iza footera. Brand footer ima veći naziv lanca, uz lokacijsku ikonicu i logo bez pravougaone podloge.

### Početno stanje dokaza

Prethodni interni test-paketi i njihovi renderi namerno nisu deo čistog radnog prostora. Nisu uzor za naredne objave i ne računaju se kao istorija dizajna. Prvi stvarni paket postaje prvi lokalni zapis; svaki sledeći paket prolazi svoj asset gate, render, nezavisni pregled i pre-flight prema pravilima iz `AGENT-OPERATING-MAP.md`.

## Spremnost za stvarne objave

Framework je spreman da otvori prvi stvarni paket, ali ne sme sam da izmisli njegov sadržaj. U `client-assets/` trenutno nema odobrenih produktnih ili lokacijskih fotografija za novu objavu, niti postoji potvrđen brief.

Za prvi stvarni paket korisnik dostavlja:

1. temu objave i potvrđene činjenice o proizvodu ili kategoriji;
2. originalni produktni asset, po mogućnosti transparentni PNG ili kvalitetnu neprovidnu fotografiju;
3. cenu, mehaniku, rok i izvor samo ako se radi o akciji;
4. konkretnu lokaciju i podatke samo ako je objava lokalna.

Zatim se otvara novi paket komandom `node production/scripts/create-post.mjs --slug "kratak-naziv-objave"` i sprovodi ceo tok iz `AGENT-OPERATING-MAP.md`: asset gate, tekst iz potvrđenih činjenica, dizajn, stvarna korekcija, render, nezavisan pregled i pre-flight. Završni materijal se nikada ne objavljuje automatski.

## Pravila koja ne smeju biti prekršena

- Lekovi i antibiotici se ne promovišu.
- Za produktne, zdravstvene, cenovne, akcijske i lokacijske tvrdnje koristi se samo potvrđen izvor.
- Akcija zahteva mehaniku, vrednost, rok i izvor. Bez toga paket ostaje blokiran ili se menja u neutralnu objavu.
- Transparentni produktni asset sa kursorom, UI tragom, pogrešnim proizvodom, ozbiljnom deformacijom ili neupotrebljivom alfa ivicom je blokada. Ne retuširati generativno sadržaj pakovanja.
- Logo, glavna poruka, ponuda, proizvod i CTA moraju ostati čitljivi u punoj veličini i pri prikazu telefona.
- Pravougaoni paneli, footeri i kartice imaju oštre uglove. Pill oznaka i kružni oblici su jedini izuzeci. Senke i zamućenja nisu dozvoljeni, ni vektorski ni rasterski.
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
