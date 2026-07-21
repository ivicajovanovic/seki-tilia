# Operativni vodič

## Kreiranje nove objave

Iz korena repoa:

```bash
node production/scripts/create-post.mjs --slug "naziv-objave"
```

Za unapred poznat datum:

```bash
node production/scripts/create-post.mjs --slug "naziv-objave" --date 2026-08-12
```

Komanda otvara folder u obliku:

```text
productions/2026/08/001-2026-08-12-naziv-objave/
  source/       # originalni brief i fajlovi klijenta
  generated/    # radne verzije, promptovi, props i design-direction.json
  final/        # materijali spremni za pregled i objavu
  brief.md
  input.json
  video-props.json
  review.md
```

Redni broj se računa unutar meseca. Originali u `source/` se ne menjaju niti prepisuju.

## Podaci koje čekamo od klijenta

Pre lokalnih objava proveriti `brand/brand-config.json` i koristiti samo potvrđene podatke za konkretnu apoteku. Ako radno vreme ili drugi podatak nedostaje, ne izmišljati ga niti ga prikazivati.

Fotografije apoteka se lokalno čuvaju u `client-assets/locations/<id-lokacije>/`. Fotografije proizvoda, briefovi i finalni materijali za konkretnu objavu idu u njen `source/` folder. Ni jedna od tih datoteka se ne objavljuje na GitHub-u po podrazumevanom pravilu.

## Režim za AI slike

Podrazumevani režim je **direct-generation**: agent dostupnim generatorom slika pravi potreban originalni vizual, čuva/uvezuje ga uz paket objave i koristi ga u grafici i videu.

Ako direktno generisanje nije dostupno ili korisnik želi svoj lokalni generator, agent piše `generated/image-prompt.md`. Korisnik zatim rezultat sačuva u `source/`, a agent ga kopira u `video-renderer/public/jobs/<id>/` i upisuje URL koji počinje sa `/jobs/` u `video-props.json`, na primer:

```json
{ "imageSrc": "/jobs/001-2026-08-12-naziv-objave/proizvod.png" }
```

Ako je dovoljno dobra fotografija proizvoda koju je klijent poslao, ne pravi se AI prompt.

## Obavezna vizuelna provera

Pre dizajniranja i pre finalnog izvoza agent čita `skills/visual-design/SKILL.md`. Skill vodi art direkciju, kompoziciju, tipografiju, obradu fotografije i pregled rendera. Njegova provera dizajna se evidentira u `review.md` i blokira status spremnosti dok nije potvrđena.

Skill se ne koristi za izmene copy-ja. Za caption, CTA, hashtagove i zdravstveno osetljive formulacije i dalje važe `production/copy-playbook.md` i `production/content-safety-rules.md`.

Pre dizajna pročitaj i `brand/design-system.md`, a kada postoje reference i `brand/design-references/catalog.md`. U `generated/design-direction.json` zabeleži jednu familiju renderer-a, korišćenu referencu, najmanje dve dizajnerske osobine, jedinstvenu `signature` i razliku u odnosu na poslednje tri objave. Za logo je dozvoljena samo `cream-card` podloga, a za tipografiju rendererova Manrope porodica `AUSekiManrope` bez zamenskog fonta.

Pre-flight blokira ponovljenu `signature` kombinaciju među poslednje tri evidentirane objave. Kada je objava spremna, `validatedRenders` mora navesti Feed, Story i tri ključna Reels kadra pregledana u punoj veličini i kao umanjeni prikaz telefona.

## Renderovanje grafika i videa

Iz foldera `video-renderer/` agent koristi `video-props.json` iz foldera objave.

```bash
npx remotion still SekiTiliaFeed ../productions/.../final/feed-1080x1350.png --props=../productions/.../video-props.json
npx remotion still SekiTiliaStory ../productions/.../final/story-1080x1920.png --props=../productions/.../video-props.json
npx remotion render SekiTiliaPromo ../productions/.../final/reels-1080x1920.mp4 --props=../productions/.../video-props.json
```

Za pregled i uređivanje šablona:

```bash
cd video-renderer
npm run dev
```

Podržane `designVariant` vrednosti su `product-atelier`, `editorial-split`, `minimal-offer` i `product-card`. Biraj ih prema briefu i dizajnerskoj istoriji, ne prema poslednjem korišćenom šablonu.

## Pre-flight provera

Pre označavanja paketa za pregled agent pokreće:

```bash
node production/scripts/check-post.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv
```

Skripta blokira očigledno rizičan sadržaj i nepotpun paket. Ne predstavlja stručnu, farmaceutsku ili pravnu proveru; ona je i dalje obavezna kada je relevantna.
