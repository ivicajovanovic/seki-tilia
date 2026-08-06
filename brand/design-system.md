# Dizajnerski sistem za seriju objava

Ovaj dokument pretvara brend vodič i vizuelne reference u operativna pravila za agente i renderer. Cilj je prepoznatljiv AU Šeki-Tilia identitet bez ponavljanja iste grafike.

## Nepromenjivi elementi

- Koristi se samo originalni logo iz `logos/`. Znak se nikada ne prebojava, rasteže niti postavlja direktno na limeta, fotografsku ili drugu nekontrolisanu podlogu.
- Znak bez naziva koristi se bez bele, krem ili druge pravougaone kartice. `logoVariant: "on-light"` koristi `logo-tamniji.svg` na svetloj kontrolisanoj pozadini, a `logoVariant: "on-dark"` koristi `logo-svetliji.svg` na tamnoj. `logoSurface` je obavezno `"none"`; kombinacija varijante i neposredne pozadine mora postojati u `approvedLogoPlacements` iz `brand/color-palette.json`.
- Jedina porodica teksta na AU Šeki-Tilia vizualima je **Manrope**. Naslov koristi 700 ili 800, a ostali tekst 400, 500 ili 600. Renderer eksplicitno učitava oba potrebna latin podskupa iste Manrope porodice i ne koristi zamenski font.
- Paleta ima dva strogo izolovana seta iz `brand/color-palette.json`: `legacy` sa prvobitnih devet tonova i `alternative` sa bojama Abyssal Teal, Matcha i Desert Khaki. Jedna objava koristi isključivo jedan set u svim dizajniranim površinama, tekstu, akcentima, ikonama, geometriji i gradijentima. Uzastopne objave obavezno smenjuju set, dok se `colorScheme` nasumično bira samo među temama aktuelnog seta. `colorSet` i `colorScheme` upisuju se identično u `design-direction.json` i `video-props.json`, a `palettePlan` mora odgovarati temi i ostati unutar seta. Originalni logo i boje samog proizvoda ili izvorne fotografije ostaju neizmenjeni i jedini su izuzetak. Jedan vizual koristi najviše jedan dominantan akcenat. Tekst, CTA i funkcionalne ikonice koriste samo parove iz `safeTextPairs`, dok logo koristi isključivo kombinacije iz `approvedLogoPlacements`.
- Obavezni elementi ostaju čitljivi na punoj veličini i u približno 25% prikazu telefona: logo, glavna poruka, ponuda, proizvod i CTA kada postoje.
- Pravougaoni paneli, kartice, proizvodne podloge, footeri i okviri imaju oštre uglove. Zaobljenje je dozvoljeno samo za pill-dugme/kratku ponudnu oznaku (`borderRadius: 999`) ili čiste kružne dekorativne oblike (`borderRadius: 50%`).
- Uz `imageSrc` u `video-props.json` podržani su opcioni parametari:
  - **`imageBackground`**: `"transparent" | "opaque" | "unknown"`.
  - **`footerStyle`**: `"brand-full" | "cta-only" | "minimal"` (stil brendiranog footera sa logom i Lucide ikonom).
- Transparentni PNG proizvoda se prikazuje bez dodatnog pravougaonog rama, kartice, okvira ili podloge i dobija dominantnu rezervisanu zonu kompozicije. Ako je klijentov izvor slabiji, dominacija se postiže položajem, kontrastom i scenom, bez destruktivnog uvećanja. Za neprovidnu sliku kontrolisana podloga ostaje dozvoljena kada je potrebna za kontrast.
- Slika proizvoda (bočica, kutija, pakovanje) nikada ne sme preklopiti tekst, naslov, eyebrow, podnaslov, ponudnu oznaku ili ikonu u bilo kom formatu. Proizvod ostaje omeđen u svojoj produktnoj zoni.
- Futer nikada ne sme prekrivati ikone, tekst ili druge sadržajne elemente. Donja margina kontejnera sadržaja u rendereru iznosi najmanje 310px u Story-ju i 240px u Feed-u, čime ostavlja slobodan prostor iznad linije footera.
- Tranzicije video sekvenci u Reels-u moraju koristiti namenski exit fade-out (HeroScene opacity -> 0) pre ulaska završne scene, kako bi se spriječilo bilo kakvo neuredno preklapanje elemenata u 8. i 9. sekundi.
- Podijum mora imati jasno čitljivu gornjoku ravan na kojoj proizvod optički stoji stabilno i bez lebđenja. Prednja masa podijuma se produžava iza footera tako da footer preseca njen donji deo, nikada ne ostavlja podijum da visi u praznini. Dubina se dobija samo izraženim vektorskim gradijentima i geometrijom, bez senki ili blur-a.
- Senke i zamućenja nisu dozvoljeni ni kao vektorski CSS/SVG efekat ni kao rasterski dodatak. Naziv lanca „AU Šeki-Tilia” u brend-footeru mora imati veću i jasniju tipografsku ulogu od pomoćnog reda, i ostati čitljiv na prikazu telefona.

## Promo graphics system

Ovaj sistem se koristi za objave tipa `akcija` i za produktne promocije sa potvrđenom ponudom. Njegova svrha je brzo razumevanje ponude na telefonu: promocija ima prednost nad dekorativnim copy-jem.

### Komunikaciona hijerarhija

Svaki promo `video-props.json` koristi eksplicitne slotove. Za akciju su `primaryMessage`, `secondaryMessage`, `productDetailMessage`, `deadlineMessage`, `retailMessage` i `brandSignature` obavezni; `supportMessage` postoji samo kada je njegova činjenica potvrđena.

1. `primaryMessage`: potvrđena akcija ili ponuda. To je najveći kontrast i prvi element čitanja.
2. `secondaryMessage`: naziv proizvoda ili kategorije.
3. `productDetailMessage`: jedna ili dve kratke, proverljive informacije sa ambalaže ili iz potvrđenog izvora, na primer pakovanje i sastav. Ne sme biti izvedena zdravstvena korist.
4. `deadlineMessage`: potvrđeni rok akcije, odvojen od informacije o proizvodu.
5. `retailMessage`: neutralna dostupnost u mreži apoteka.
6. `brandSignature`: originalni znak i naziv lanca, bez podloge.

Naslov koji opisuje rutinu, kategoriju ili korist nikada ne sme preuzeti ulogu `primaryMessage` kada je tema potvrđena akcija. Na vizualu postoje najviše dva dominantna fokusa: ponuda i proizvod.

### Dva master rasporeda

- `PromoFeed45`, aktiviran kroz `promoLayout: "auto"` za 1080×1350, koristi 12-kolonsku logiku sa levom marginom 52px, zaštićenom tekstualnom zonom, product-stageom i footerom od 196px. Čitanje je levo ka desno: ponuda, identitet proizvoda, činjenica sa ambalaže, proizvod, rok i CTA.
- `PromoStory916`, aktiviran kroz isti `promoLayout: "auto"` za 1080×1920, nije rastegnuti Feed: poruka je gore, proizvod je vertikalno centralan, a CTA završetak je podignut. Kritični sadržaj ne ulazi u gornjih 196px ni donjih 260px Story UI zone. Čak i kada je u props-ima naveden horizontalni promo layout, vertikalni format mora rutirati u ovaj master, nikada u rastegnuti Feed.
- `product-dominant-sticker` je zaseban treći master za situacije kada ambalaža ima prepoznatljivu siluetu i dovoljan kvalitet za veliku skalu. Proizvod je prvi fokus, a kratka potvrđena promo oznaka je sekundarni sticker, bez dodira sa proizvodom ili tekstom. Zahteva `imageSrc`, četiri ključna promo slota i layoutId vrednosti `product-dominant-sticker-feed`, `product-dominant-sticker-story` i `product-dominant-sticker-reel`.

Isti kampanjski sistem zadržava Manrope, izolovan `colorSet`, bedž, tretman proizvoda i footer. Menjaju se osa čitanja, količina praznog prostora, položaj hero proizvoda i CTA, pa Feed i Story ne smeju biti mehanički rastegnuta kopija.

### Jedan kandidat po koraku

Za jedan korak workflow-a postoji samo jedan nameran kandidat: `generated/feed-1080x1350.png`, zatim `generated/story-1080x1920.png`, pa jedan `generated/reels-1080x1920.mp4`. Agent ne pravi paralelne dizajnerske opcije, alternativne Story/Reels kadrove ni test-render serije za izbor; unutrašnja korekcija prepisuje isti radni izlaz. Tri obavezna Reels ključna kadra služe isključivo proveri jednog MP4-a.

### Komponente i granice copy-ja

- Eyebrow: jedna uppercase linija, niska težina, najviše 28 karaktera.
- Promo bedž: kratka pill oznaka, najviše 14 karaktera i 45% širine kompozicije. Nije UI dugme.
- Secondary poruka: najviše dva reda u Feed-u, tri u Story-ju.
- Product detail: najviše 72 karaktera i dva reda, sa neutralnom Lucide `Info` ikonom koja označava podatak sa ambalaže.
- Rok: najviše 32 karaktera i jedan red uz semantičku Lucide kalendarsku ikonu.
- Support poruka: najviše 65 karaktera i dva reda, samo kada je njena činjenica potvrđena.
- Footer CTA: najviše 40 karaktera. Retail red: najviše 55 karaktera.
- Brand signature: originalan logo bez kartice i naziv lanca, podređen ponudi i proizvodu.

Spacing koristi samo skalu 8, 12, 16, 24, 32, 40, 56 i 72px. Razmak eyebrow–glavna poruka je 24–32px, glavna–support 12–16px, support–bedž 24px, a hero–footer 24–40px.

### Product hero i pozadinska podrška

Product hero zauzima najmanje 45% visine Feed-a i najmanje 38% visine Story/Reels Hero kadra kada to kvalitet izvora dopušta, i nikada ne ulazi u zonu teksta. Za transparentan PNG ostaje slobodan, bez pravougaonog rama ili kartice. Podijum se koristi samo kada kompoziciji daje jasno uzemljenje: gornja ravan se vidi ispod proizvoda, prednja masa se može nastaviti iza footera, a dubina dolazi iz geometrije i vektorskog gradijenta, nikada iz senke ili blura.

Pozadina je podrška, ne treći fokus: dozvoljeni su najviše jedan disk ili oval i jedna akcentna linija. Ne smeju značajno ulaziti u headline zonu niti imati jači kontrast od proizvoda.

### Footer, CTA i safe zone

Feed koristi `CompactFooter` visine do 18% formata, sa jednim CTA-om, jednom semantičkom Lucide ikonom i brend-završetkom. Feed CTA je najmanje 32px, naziv lanca 26px, a znak 54px. Story koristi footer od 200px **strogo vezan za donju ivicu formata**, sa CTA-om najmanje 38px, nazivom lanca 30px i znakom 64px. Story safe prostor je samo 160px na vrhu i 220px neposredno iznad footera, bez dodatnog praznog pojasa ispod footera. Footer informiše, ali nikada ne nadjačava ponudu ili proizvod, niti zaklanja sadržaj.

### Promo QA pre izvoza

Pre izvoza proveri sledeće. Ako dve ili više stavki nisu prolazne, uradi korekciju i ponovi render pregled.

1. Potvrđena ponuda je prva stvar koju osoba vidi.
2. Proizvod je drugi dominantan fokus i jasno je prepoznatljiv.
3. Secondary poruka jasno imenuje proizvod ili kategoriju.
4. Support shape usmerava pažnju, bez takmičenja sa hero proizvodom.
5. Footer prenosi jednu praktičnu informaciju bez krađe pažnje.
6. Logo, CTA i kritični tekst ostaju van Story UI overlap zona.
7. Tekst je čitljiv na približno 25% prikazu telefona.
8. Feed i Story očigledno pripadaju istoj kampanji, ali koriste različit raspored.
9. Ne postoje više od dva dominantna fokusa.
10. Grafika jasno prodaje potvrđenu ponudu, a ne samo estetski prikazuje proizvod.
11. Feed, Story i Reels Hero prikazuju ponudu, identitet proizvoda, najmanje jednu potvrđenu informaciju o proizvodu, rok, dostupnost i čitljiv brend-završetak.
12. Na umanjenom 25% prikazu proizvod, logo, naziv lanca, CTA i ikone ostaju optički veliki i odmah čitljivi.

### Layout architecture i optička kontrola

Promo masteri koriste tri ose: levu tekstualnu osu, internu osu product-stagea i desnu osu brand/footer kolone. Svaki sadržajni element vezuje se za jednu od njih. Gornji znak se ne prikazuje u promo masterima, jer je puna brand signature već deo strogo poravnatog footera.

- Dozvoljena je jedna primarna masa, jedna sekundarna masa i najviše jedan jak akcent. Product-stage je po pravilu primaran, tekstualna poruka sekundarna, a promo bedž jedini jak akcent. Footer i support geometrija ostaju vizuelno tiši.
- Slojevi su uvek: pozadina, support shape, product hero sa podijumom, pa eventualni foreground akcent. Support shape, proizvod i podijum čine jednu `ProductHero` komponentu i dele internu centralnu osu.
- Support shape je jedan disk ili oval, sa najviše jednim akcentnim potezom. Centar mu je vezan za proizvod, ne ulazi u tekstualnu zonu i crop na ivici, kada postoji, mora biti očigledno nameran.
- Svaki susedni odnos mora biti jasno razdvojen, jasno preklopljen ili poravnat. Slučajne tangencije između teksta, oblika, proizvoda, podijuma, footera i ivice kadra nisu dozvoljene.
- Naslovni blok ima ograničenu širinu i visinu: do dva reda u Feed-u, do tri u Story-ju. Ručno prilagodi prelom ako je odnos najdužeg i najkraćeg reda ekstreman ili ako poslednji red ostaje izolovano kratak.
- Vertikalni ritam koristi malu distancu unutar tekstualne grupe, srednju između poruke i product-stagea i veliku pre footera. Praznina je planirani deo ritma, ne preostali prostor.
- Footer koristi jedinstvenu trokolonsku mrežu `ikona | poruka | brand`, ujednačen padding i optički poravnate baseline. Ima samo jedan funkcionalni akcent, a ne zasebni vizuelni događaj.

U pregledu finala proveri i grayscale prikaz: primarna masa mora ostati prva, sekundarna druga, a footer i support shape ne smeju se izjednačiti sa hero sadržajem.

## Dizajnerske familije

Za akcije, novitete i proizvode postoje različite kompozicione familije. Izaberi onu koja najbolje odgovara briefu, proizvodu i poslednjim objavama.

| Familija | Namena i vizuelna logika | Ne koristiti uzastopno sa |
| --- | --- | --- |
| `product-atelier` | Proizvod kao studijski heroj u organskoj bež, kružno slojevitoj sceni kada je fotografija neprovidna, odnosno slobodno postavljen heroj kada je PNG transparentan. Jasna, mirna hijerarhija za jednu ponudu. | istom familijom ili istim tretmanom ponude u naredne tri objave |
| `editorial-split` | Asimetrična tekstualna kolona i proizvod u velikom organskom isečku. Više ritma, ali jedna dominantna poruka. | `product-atelier` sa sličnim položajem proizvoda |
| `minimal-offer` | Tipografija i potvrđena ponuda nose kadar, uz dominantan proizvod bez pravougaone podloge kada je PNG transparentan. Za kratke akcije i novitete. | drugom minimalnom objavom sa istim CTA modulom |
| `product-card` | Proizvod na krem kartici preko petrol polja samo kada je fotografija neprovidna; transparentni PNG izlazi iz kartičnog tretmana kao slobodan heroj. | istom kartičnom strukturom u naredne tri objave |
| `premium-product-stage` | Velika asimetrična ponuda i dominantan proizvod u režiranoj sceni: organska pozadina, izražen podijum sa vektorskim gradijentima i petrol završni blok sa CTA-om. Transparentni PNG slobodno prelazi preko scene, bez pravougaonog rama, kartice ili podloge. Za potvrđene akcije i proizvode čije pakovanje treba da bude glavni nosilac kadra. | bilo kojom familijom sa istim odnosom "velika ponuda levo, proizvod desno, petrol footer" u naredne tri objave |
| `offer-orbit` | Orbitni akcenat, kružna putanja ponude i uzemljena produktna scena sa zasebnim prostornim odnosom teksta i proizvoda. Feed, Story i Reels moraju imati stvarno različitu orbitnu kompoziciju, ne alias druge familije. | `editorial-split` ili drugom objavom sa istim odnosom teksta i proizvoda |
| `type-stage` | Veliki tipografski naslov postavlja vertikalni ritam, a proizvod izlazi iz donje podijumske scene pred slojevitom kružnom scenografijom; CTA je kratak petrol završetak. | `minimal-offer` ili `premium-product-stage` sa sličnim redosledom čitanja |
| `gallery-shelf` | Svetla produktna galerija levo i petrol informativni stub desno. Za novitet ili proizvod kada je naziv važniji od cene. | `offer-orbit` ili drugom kompozicijom sa tamnim desnim stubom |

Familije se ne smeju svoditi na promenu boje istog šablona. Menjaju se čitanje kompozicije, odnos tipografije i proizvoda, položaj ponude i tretman praznog prostora. Brend margine, font, oštar ugao panela, nenametljivo postavljen logo bez kartice i ton ostaju konzistentni.

`offer-orbit` koristi zajednički baseline proizvoda i podijuma čija gornja ravan vidljivo podržava proizvod. Feed ima odnos tekstualnog polja i široke produktne scene, Story vertikalni stack sa naslovom, scenom i zasebnim petrol CTA završetkom, a Reels najmanje tri vremenski različite scene. `productShape` (`wide`, `compact`, `tall`) bira geometriju proizvoda; jedan procenat veličine nije dozvoljen za sve oblike.

### `premium-product-stage`: obavezna pravila

`ref-premium-product-stage.png` je autorski odobrena interna referenca. Može se koristiti kao direktna referenca za kvalitet i dizajnersku gramatiku, ali svaka nova objava mora biti nova kompozicija, a ne mehanička replika istog rasporeda.

- Prvi utisak čine velika, čitljiva ponuda i proizvod kao dva jasno različita fokusa. Njihov odnos je asimetričan, ali optički uravnotežen.
- Proizvod zauzima dominantnu vizuelnu zonu. Organski luk, krug ili elipsa i podijum sa izraženim vektorskim gradijentom grade scenu i dubinu, ali nisu individualni ram, kartica ni pravougaona podloga proizvoda. Gornja ravan podijuma mora biti vidljiva neposredno ispod proizvoda, a njegova prednja masa mora ulaziti iza footera.
- Kada je `imageBackground: transparent`, proizvod mora slobodno da prelazi preko scene. Ne sme biti umanjen, zatvoren u pravougaonik niti odvojen od kompozicije praznim prostorom bez funkcije.
- Petrol završni blok može objediniti jedan CTA i brend-završetak. Originalni logo je bez pravougaone podloge (`logoSurface: "none"`) i sme biti postavljen samo tamo gde neposredni kontrast čuva oba originalna dela znaka. Naziv lanca je veći od pomoćnog reda footera.
- Kratka limeta linija, diskretna tačkasta tekstura i najviše jedan kratki pill modul mogu da pojačaju hijerarhiju. Oni su akcenti, ne zamena za kompoziciju.
- Red sa ikonama, simbolima ili benefitima nije podrazumevan. U regulisanoj kategoriji uvodi se samo kada su svaka tvrdnja, ikona i njeno značenje potvrđeni od klijenta, proizvođača/distributera ili stručne osobe. U suprotnom se prostor koristi za čistiju hijerarhiju, ne za izmišljene koristi.
- Pravougaoni footer i tekstualni paneli ostaju oštrih uglova. Organski oblici su dozvoljeni samo kao pozadinski, kružni ili eliptični elementi scene.

## Reference i odluka za objavu

Pre dizajna agent pregleda četiri reference navedene u `brand/design-references/references.json`. `ref-premium-product-stage.png` i `ref-product-stage-footer.png` definišu premium produktnu scenu i završetak; `ref-editorial-offer-stage.png` definiše editorial odnos poruke i proizvoda; `ref-vertical-product-spotlight.png` definiše vertikalnu skalu i slojevitu scenografiju. Za svaku objavu popunjava `generated/design-direction.json` sa:

- izabranom familijom i jedinstvenim `signature` zapisom;
- najmanje jednom korišćenom referencom i dve konkretne dizajnerske osobine preuzete kao inspiracija;
- kratkim opisom po čemu se objava razlikuje od poslednje tri;
- potvrdom da je `logoSurface` `"none"`, da `logoVariant` odgovara neposrednoj pozadini i da se koristi rendererova Manrope porodica `AUSekiManrope`;
- listom finalnih rendera pregledanih na punoj veličini i u umanjenom prikazu.
- stabilan identitet autora u `authorId`, najmanje dve vrednosti `designInterventions`, opis `freshInterventionNote`, `motionTreatment` kada postoji Reels i opis `formatAdaptations` za svaki traženi format.
- strukturisanim `formatPlan` vrednostima: različiti Feed i Story `layoutId`, redosled čitanja i anchor proizvoda, kao i Reels `shotPlan` sa najmanje tri scene;
- `familyFit` potvrdom da familija odgovara proporciji proizvoda, stvarnoj snazi ponude i potrebnoj scenskoj dubini.
- `palettePlan` sa identifikatorima pozadine, površine, teksta, akcenta i logo-pozadine iz `brand/color-palette.json`, uz kratko obrazloženje odnosa prema zadatku.
- `colorSet` i `colorScheme` iz `paletteSets` i `rendererThemes`, identični u renderer props-ima, strogo odvojeni od drugog seta i usklađeni sa svim `palettePlan` poljima.

U `referenceFiles` dozvoljene su samo vrednosti iz `brand/design-references/references.json`, a navode se samo reference čije su osobine stvarno primenjene. Za familiju `premium-product-stage` može se navesti `ref-premium-product-stage.png`.

Reference služe za kompoziciju, ritam, odnos slike i teksta, obradu i kvalitet. `ref-premium-product-stage.png` je izuzetak u smislu prava korišćenja: to je interno autorsko delo i njegova dizajnerska gramatika sme da se koristi. Iz ostalih referenci ne preuzimaj vlasničke elemente, copy, proizvod, publiku, tvrdnje, cenu, rok, CTA, benefit-ikonice, kursor/UI artefakt, direktan logo tretman ni zaobljen strukturni footer. Sva pravila brenda ostaju iznad reference.

## Zaštita od monotonije

Svaka nova objava mora zadržati brend identitet, ali uvesti stvarnu novu intervenciju u sadržaj, grafiku i video kada je prisutan. Novi proizvod, druga boja ili preformulisan isti tekst nisu dovoljni.

- U `input.json` `contentApproach` bira sadržajni ugao: `offer-first`, `product-context`, `routine-moment`, `practical-guidance`, `seasonal-context`, `local-availability` ili `professional-prompt`. Ne ponavlja se među poslednje tri objave.
- `designInterventions` u `generated/design-direction.json` bira najmanje dve ose promene: `reading-order`, `product-placement`, `offer-treatment`, `scene-depth`, `image-crop`, `type-composition`, `cta-footer`, `icon-role` ili `motion-rhythm`. Njihova kombinacija ne sme biti ista kao u poslednje tri objave.
- `motionTreatment` je obavezan za Reels: `staged-reveal`, `offer-build`, `detail-cutaway`, `editorial-pan` ili `location-close`. Upisuje se identično u `generated/design-direction.json` i `video-props.json`, jer renderer njime menja ritam uvoda. Ne ponavlja se među poslednje tri Reels objave.
- `formatAdaptations` objašnjava namernu razliku Feed-a, Story-ja i Reels-a. Format se ne sme dobiti pukim rastezanjem istog layouta ili istog teksta.

Pre-flight poredi `signature`, sadržajni ugao, kombinaciju intervencija i Reels ritam aktuelne objave sa tri poslednje evidentirane objave. Ako se bilo koji obavezni obrazac ponovi, paket se blokira dok agent ne izabere stvarno drugačiji pristup. Isti proizvod može dobiti novu kompoziciju; novi proizvod ne sme automatski dobiti staru.

Istorijska različitost se proverava tek posle `familyFit` provere. Nova, ali nekompatibilna familija je blokada. Kompatibilna familija može ponovo da se koristi samo uz novu signature kombinaciju i stvarno drugačiji layout.

## Finalna vizuelna provera

Pre statusa `SPREMNO ZA LJUDSKU PROVERU` agent mora:

1. pregledati Feed i Story u punoj veličini i kao umanjeni telefon-prikaz;
2. pregledati uvodni, ponudni i završni kadar Reels-a;
3. proveriti da je originalni logo celovit, bez bele, krem ili druge pravougaone podloge, sa dovoljnim kontrastom;
4. proveriti da je Manrope stvarno učitan tokom rendera; ako ne može da se učita, render mora ostati blokiran umesto da pređe na zamenski font;
5. upisati konkretna imena rendera u `design-direction.json` i `review.md`.
6. proveriti da nijedan pravougaoni panel, kartica, footer ili proizvodna podloga nema zaobljene uglove; pill CTA/ponudna oznaka i kružni dekorativni oblici su jedini izuzeci.
7. ako je `imageBackground: transparent`, proveriti da proizvod nema dodatni pravougaoni ram, karticu, okvir ni podlogu i da je glavni vizuelni element. Kod slabijeg izvora ne forsirati veličinu preko tačke vidljivog raspada; koristiti kompozicionu dominaciju i dokumentovati ograničenje.
8. proveriti da nema vektorske ni rasterske senke ili zamućenja, da je naziv lanca u footeru dovoljno velik i da podijum ima čitljivu gornju ravan na kojoj proizvod stoji, uz prednju masu koja ulazi iza footera. Ako je familija `premium-product-stage`, proveriti da organska scena, podijum sa gradijentom i footer stvaraju namernu hijerarhiju, da proizvod nije mali ili vizuelno odvojen od scene, i da svaki prikazani benefit ima potvrđen izvor.
9. pokrenuti `prepare-visual-review.mjs`, oceniti svih sedam kriterijuma sa najmanje 4/5, evidentirati stvarnu reviziju drafta i dobiti nezavisan verdict `meets-reference-bar`. Nezavisni reviewer koristi drugačiji `reviewerId` od `authorId` i pregleda Feed, Story, tri Reels kadra i finalni MP4 direktno. Hash dokazi zaključavaju rendere, ulazne JSON fajlove, renderer, CSS i reference; svaka kasnija izmena poništava prolaz.
10. U Reels videu obezbediti neprekidnu vizuelnu dinamičnost u svakom sekundu: elementi ulaze fazno (eyebrow -> naslov -> offer pill -> produktna scena -> benefit ikone -> futer). Posle završene ulazne animacije sav tekst ostaje potpuno stabilan, bez pulsa, plutanja, kontinuiranog skaliranja ili pomeranja. Tokom zadržavanja pokret nose mikro-plutanje i breath proizvoda, kretanje ikona, akcentne linije, organska geometrija ili gradijent drift. U završnom kadru videa (Reels closing scene), postolje/podijum se potpuno izostavlja i proizvod stoji čisto i samostalno sa desne strane, bez ikakvog podijuma ispod njega. Takođe, izbeći nepotrebna dupliranja istog teksta (npr. kada su CTA i oznaka ponude identični).
11. Svaki Reels koristi `Audio` iz `@remotion/media`, jasno čujni deo nasumično izabrane numere iz `public/mp3/` i `audioVolume` između 0.75 i 1. Finalna provera meri nivo zvuka; samo postojanje AAC/audio streama nije dovoljan dokaz muzičke podloge.

Ocena završne obrade meri kvalitet dizajnerskih odluka u okviru realno dostupnog klijentovog materijala. Dokumentovana izvorna mekoća, kompresija ili niža rezolucija ne obaraju automatski kriterijum ispod 4/5 ako agent nije dodatno degradirao sliku, nije falsifikovao detalje i izabrao je kadar i scenu koji ograničenje profesionalno kontrolišu.
