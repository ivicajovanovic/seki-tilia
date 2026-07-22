# Operativni vodič

Pre bilo kog rada pročitaj `AGENT-OPERATING-MAP.md`. Ona daje redosled izvora istine, lokacije izlaza i pravilo protiv ponavljanja sadržaja, grafika i videa.

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
                # asset-review.json, quality-review.json i comparison dokazi
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

Uz svaku `imageSrc` vrednost obavezno upiši `imageBackground` u `video-props.json`: `transparent` za PNG sa providnom pozadinom, odnosno `opaque` za fotografiju ili neprovidnu sliku. Transparentni PNG se prikazuje slobodno na kompoziciji, bez dodatne pravougaone kartice, rama, okvira ili podloge, i mora vizuelno da nosi kadar. Kod slabijeg izvora koristi položaj, kontrast i scenu umesto preteranog uvećanja. Podloga je dozvoljena samo za neprovidnu sliku kada je potrebna za kontrast.

Sve radne datoteke objave ostaju u njenom paketu: originali u `source/`, radni renderi i pregledi u `generated/`, a samo materijal spreman za ručnu proveru u `final/`. Ne ostavljaj test rendere u `/tmp` niti u drugim folderima van `productions/`.

Pre upotrebe produktne slike pokreni `node production/scripts/inspect-assets.mjs --post productions/.../<id>`. Skripta računa dimenzije, alfa granice, transparentnost, potreban faktor povećanja i SHA-256, a zatim pravi svetli/tamni pregled. Otvori pregled i popuni `generated/asset-review.json`. Slabija rezolucija, kompresija, mekoća ili nečitljiv sitan tekst na ambalaži evidentiraju se u `qualityLimitations` i koriste status `approved-with-limitations`; sami po sebi ne blokiraju produkciju. Tada izaberi kadar, veličinu proizvoda i scenu koji ne naglašavaju nedostatke, uz maksimalno bezbedno poboljšanje bez izmišljanja detalja. `blockingDefects` je rezervisan za kursor/UI trag, pogrešan proizvod, ozbiljnu deformaciju, obmanjujuću obradu, neupotrebljivu alfa ivicu ili neprepoznatljiv proizvod. Renderer koristi samo pripremljenu kopiju čiji hash odgovara odobrenom zapisu.

## Obavezna vizuelna provera

Pre dizajniranja i pre finalnog izvoza agent čita `agent-skills-required/visual-design/SKILL.md`. To je obavezni lokalni skill za agente i vodi art direkciju, kompoziciju, tipografiju, obradu fotografije i pregled rendera. Njegova provera dizajna se evidentira u `review.md` i blokira status spremnosti dok nije potvrđena.

Skill se ne koristi za izmene copy-ja. Za caption, CTA, hashtagove i zdravstveno osetljive formulacije i dalje važe `production/copy-playbook.md` i `production/content-safety-rules.md`.

Pre dizajna pročitaj i `brand/design-system.md`, kao i `brand/design-references/catalog.md`. Kao reference su odobrene isključivo `ref-premium-product-stage.png` i `ref-product-stage-footer.png` iz `brand/design-references/`; ove stabilne ASCII identifikatore doslovno upiši u `generated/design-direction.json`. U njemu zabeleži `authorId`, jednu familiju renderer-a, korišćenu referencu, najmanje dve dizajnerske osobine, jedinstvenu `signature`, najmanje dve `designInterventions`, `freshInterventionNote`, `motionTreatment` za Reels i razliku u odnosu na poslednje tri objave. U `input.json` obavezno popuni `contentApproach` i `copyFreshnessNote`, a u `formatAdaptations` objasni stvarnu adaptaciju svakog traženog formata. Za Reels `motionTreatment` mora identično da se upiše i u `video-props.json`, jer renderer na njemu zasniva različit raspored sekvenci i način ulaska elemenata. Za logo je dozvoljena samo `cream-card` podloga, a za tipografiju rendererova Manrope porodica `AUSekiManrope` bez zamenskog fonta.

Za akciju sa dominantnim pakovanjem može se izabrati `premium-product-stage`. Ona koristi internu, autorski odobrenu referencu `ref-premium-product-stage.png` kao inspiraciju za veliku asimetričnu ponudu, produktnu scenu sa organskim oblikom/podijumom i petrol CTA završetak. Ne prepisuj jedan raspored iz reference. Za transparentni PNG proizvod ostaje slobodan preko scene, bez pravougaonog rama, kartice ili podloge. Ikone, benefit-redovi i zdravstvene tvrdnje nisu dekoracija: koriste se samo uz potvrđene činjenice za taj proizvod.

Pre-flight blokira ponovljenu `signature` kombinaciju, `contentApproach`, kombinaciju `designInterventions` i `motionTreatment` među poslednje tri evidentirane objave. Kada je objava spremna, `validatedRenders` mora doslovno navesti `final/feed-1080x1350.png`, `final/story-1080x1920.png`, `generated/reels-intro.png`, `generated/reels-offer.png` i `generated/reels-closing.png`.

Posle prvog drafta napravi najmanje jednu vidljivu korekciju, zatim pokreni `node production/scripts/prepare-visual-review.mjs --post productions/.../<id>`. Otvori `reference-comparison.png`, `format-comparison.png`, sve pojedinačne rendere i finalni MP4. U `quality-review.json` svaki kriterijum mora dobiti ocenu 4 ili 5 sa konkretnim dokazom, draft i final moraju imati različite hasheve, a nezavisni pregled mora potvrditi `meets-reference-bar`. `reviewerId` mora biti različit od `authorId`, a `rawArtifactOnly` mora biti `true`. Skripta hashom vezuje pregled za aktuelne ulaze, renderer, CSS, reference, tri Reels kadra i MP4; posle bilo kakve izmene pokreni je ponovo. `review.md` je sažetak, ne izvor istine za vizuelni prolaz.

Pravougaoni strukturni elementi u rendereru, uključujući panel, footer, karticu, proizvodnu podlogu, okvir i logo-karticu, moraju imati oštre uglove. Zaobljenje je rezervisano isključivo za pill-dugme/kratku ponudnu oznaku i kružni dekorativni oblik. Pre-flight proverava da renderer ne uvodi drugo zaobljenje.

Za transparentni PNG finalna provera mora potvrditi da nema dodatni pravougaoni ram, karticu, okvir ni podlogu oko proizvoda, kao i da proizvod zauzima dominantnu vizuelnu zonu bez suvišne praznine.

Za svaku grafičku i video objavu koristi se najmanje jedna semantička ikona iz `lucide-react`. Čista tekstualna objava je izuzetak. Ikona mora predstavljati proverenu informaciju ili navigaciju, a ne nepotvrđenu zdravstvenu korist.

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

Podržane `designVariant` vrednosti su `product-atelier`, `editorial-split`, `minimal-offer`, `product-card`, `premium-product-stage`, `offer-orbit`, `type-stage` i `gallery-shelf`. Biraj ih prema briefu i dizajnerskoj istoriji, ne prema poslednjem korišćenom šablonu.

Uz produktni vizual upiši `productShape` kao `wide`, `compact` ili `tall`. Uz ponudu upiši `offerKind` kao `price`, `discount`, `bundle`, `gift`, `deadline` ili `none`. Objava tipa akcija ne može koristiti `deadline` ili `none` kao zamenu za konkretnu mehaniku.

## Pre-flight provera

Pre označavanja paketa za pregled agent pokreće:

```bash
node production/scripts/check-post.mjs --post productions/GGGG/MM/001-GGGG-MM-DD-naziv
```

Skripta blokira očigledno rizičan sadržaj i nepotpun paket. Ne predstavlja stručnu, farmaceutsku ili pravnu proveru; ona je i dalje obavezna kada je relevantna.
