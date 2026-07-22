# Dizajnerski sistem za seriju objava

Ovaj dokument pretvara brend vodič i vizuelne reference u operativna pravila za agente i renderer. Cilj je prepoznatljiv AU Šeki-Tilia identitet bez ponavljanja iste grafike.

## Nepromenjivi elementi

- Koristi se samo originalni logo iz `logos/`. Znak se nikada ne prebojava, rasteže niti postavlja direktno na limeta, fotografsku ili drugu nekontrolisanu podlogu.
- Znak bez naziva (`logo3.svg`) u rendereru uvek stoji na zasebnoj svetloj krem kartici sa oštrim uglovima. Time su vidljiva oba njegova originalna dela, petrol i limeta.
- Jedina porodica teksta na AU Šeki-Tilia vizualima je **Manrope**. Naslov koristi 700 ili 800, a ostali tekst 400, 500 ili 600. Renderer eksplicitno učitava oba potrebna latin podskupa iste Manrope porodice i ne koristi zamenski font.
- Paleta ostaje petrol, krem, limeta, bež i ugalj. Jedan vizual koristi najviše jedan dominantan akcenat i ne pretvara limetu u pozadinu za logo.
- Obavezni elementi ostaju čitljivi na punoj veličini i u približno 25% prikazu telefona: logo, glavna poruka, ponuda, proizvod i CTA kada postoje.
- Pravougaoni paneli, kartice, proizvodne podloge, footeri, okviri i logo-kartica imaju oštre uglove. Zaobljenje je dozvoljeno samo za pill-dugme/kratku ponudnu oznaku (`borderRadius: 999`) ili čiste kružne dekorativne oblike (`borderRadius: 50%`).
- Uz `imageSrc` je obavezno upisati `imageBackground` kao `transparent` ili `opaque`. Transparentni PNG proizvoda se prikazuje bez dodatnog pravougaonog rama, kartice, okvira ili podloge i dobija dominantnu rezervisanu zonu kompozicije. Za neprovidnu sliku kontrolisana podloga ostaje dozvoljena kada je potrebna za kontrast.

## Dizajnerske familije

Za akcije, novitete i proizvode postoje različite kompozicione familije. Izaberi onu koja najbolje odgovara briefu, proizvodu i poslednjim objavama.

| Familija | Namena i vizuelna logika | Ne koristiti uzastopno sa |
| --- | --- | --- |
| `product-atelier` | Proizvod kao studijski heroj u organskom bež prozoru kada je fotografija neprovidna, odnosno slobodno postavljen heroj kada je PNG transparentan. Jasna, mirna hijerarhija za jednu ponudu. | istom familijom ili istim tretmanom ponude u naredne tri objave |
| `editorial-split` | Asimetrična tekstualna kolona i proizvod u velikom organskom isečku. Više ritma, ali jedna dominantna poruka. | `product-atelier` sa sličnim položajem proizvoda |
| `minimal-offer` | Tipografija i potvrđena ponuda nose kadar, uz dominantan proizvod bez pravougaone podloge kada je PNG transparentan. Za kratke akcije i novitete. | drugom minimalnom objavom sa istim CTA modulom |
| `product-card` | Proizvod na krem kartici preko petrol polja samo kada je fotografija neprovidna; transparentni PNG izlazi iz kartičnog tretmana kao slobodan heroj. | istom kartičnom strukturom u naredne tri objave |
| `premium-product-stage` | Velika asimetrična ponuda i dominantan proizvod u režiranoj sceni: organska pozadina, diskretan podijum/senka i petrol završni blok sa CTA-om. Transparentni PNG slobodno prelazi preko scene, bez pravougaonog rama, kartice ili podloge. Za potvrđene akcije i proizvode čije pakovanje treba da bude glavni nosilac kadra. | bilo kojom familijom sa istim odnosom "velika ponuda levo, proizvod desno, petrol footer" u naredne tri objave |
| `offer-orbit` | Orbitni akcenat i uzemljena produktna scena. Feed koristi asimetričan tekst/proizvod odnos i petrol CTA završetak, Story vertikalni stack, a Reels zaseban hook, hero i closing. | `editorial-split` ili drugom objavom sa istim odnosom teksta i proizvoda |
| `type-stage` | Veliki tipografski naslov postavlja ritam, a proizvod izlazi iz donje podijumske scene; CTA je kratak petrol završetak. | `minimal-offer` ili `premium-product-stage` sa sličnim redosledom čitanja |
| `gallery-shelf` | Svetla produktna galerija levo i petrol informativni stub desno. Za novitet ili proizvod kada je naziv važniji od cene. | `offer-orbit` ili drugom kompozicijom sa tamnim desnim stubom |

Familije se ne smeju svoditi na promenu boje istog šablona. Menjaju se čitanje kompozicije, odnos tipografije i proizvoda, položaj ponude i tretman praznog prostora. Brend margine, font, oštar ugao panela i logo-kartica, kao i ton, ostaju konzistentni.

`offer-orbit` koristi zajednički baseline proizvoda, podijuma i kontaktne senke. Feed ima odnos tekstualnog polja i široke produktne scene, Story vertikalni stack sa naslovom, scenom i zasebnim petrol CTA završetkom, a Reels najmanje tri vremenski različite scene. `productShape` (`wide`, `compact`, `tall`) bira geometriju proizvoda; jedan procenat veličine nije dozvoljen za sve oblike.

### `premium-product-stage`: obavezna pravila

`ref-premium-product-stage.png` je autorski odobrena interna referenca. Može se koristiti kao direktna referenca za kvalitet i dizajnersku gramatiku, ali svaka nova objava mora biti nova kompozicija, a ne mehanička replika istog rasporeda.

- Prvi utisak čine velika, čitljiva ponuda i proizvod kao dva jasno različita fokusa. Njihov odnos je asimetričan, ali optički uravnotežen.
- Proizvod zauzima dominantnu vizuelnu zonu. Organski luk, krug ili elipsa, podijum i kontaktna senka mogu graditi scenu i dubinu, ali nisu individualni ram, kartica ni pravougaona podloga proizvoda.
- Kada je `imageBackground: transparent`, proizvod mora slobodno da prelazi preko scene. Ne sme biti umanjen, zatvoren u pravougaonik niti odvojen od kompozicije praznim prostorom bez funkcije.
- Petrol završni blok može objediniti jedan CTA i brend-završetak. Koristi originalni logo isključivo na krem `cream-card` podlozi, nikada direktno na petrol, limeta ili dekorativni oblik.
- Kratka limeta linija, diskretna tačkasta tekstura i najviše jedan kratki pill modul mogu da pojačaju hijerarhiju. Oni su akcenti, ne zamena za kompoziciju.
- Red sa ikonama, simbolima ili benefitima nije podrazumevan. U regulisanoj kategoriji uvodi se samo kada su svaka tvrdnja, ikona i njeno značenje potvrđeni od klijenta, proizvođača/distributera ili stručne osobe. U suprotnom se prostor koristi za čistiju hijerarhiju, ne za izmišljene koristi.
- Pravougaoni footer, tekstualni paneli i logo-kartica ostaju oštrih uglova. Organski oblici su dozvoljeni samo kao pozadinski, kružni ili eliptični elementi scene.

## Reference i odluka za objavu

Pre dizajna agent pregleda isključivo `brand/design-references/ref-premium-product-stage.png` i `brand/design-references/ref-product-stage-footer.png`. Za svaku objavu popunjava `generated/design-direction.json` sa:

- izabranom familijom i jedinstvenim `signature` zapisom;
- najmanje jednom korišćenom referencom i dve konkretne dizajnerske osobine preuzete kao inspiracija;
- kratkim opisom po čemu se objava razlikuje od poslednje tri;
- potvrdom da je logo na `cream-card` površini i da se koristi rendererova Manrope porodica `AUSekiManrope`;
- listom finalnih rendera pregledanih na punoj veličini i u umanjenom prikazu.
- stabilan identitet autora u `authorId`, najmanje dve vrednosti `designInterventions`, opis `freshInterventionNote`, `motionTreatment` kada postoji Reels i opis `formatAdaptations` za svaki traženi format.
- strukturisanim `formatPlan` vrednostima: različiti Feed i Story `layoutId`, redosled čitanja i anchor proizvoda, kao i Reels `shotPlan` sa najmanje tri scene;
- `familyFit` potvrdom da familija odgovara proporciji proizvoda, stvarnoj snazi ponude i potrebnoj scenskoj dubini.

U `referenceFiles` dozvoljene su samo vrednosti `ref-premium-product-stage.png` i `ref-product-stage-footer.png`. Za familiju `premium-product-stage` može se navesti `ref-premium-product-stage.png`.

Reference služe za kompoziciju, ritam, odnos slike i teksta, obradu i kvalitet. `ref-premium-product-stage.png` je izuzetak u smislu prava korišćenja: to je interno autorsko delo i njegova dizajnerska gramatika sme da se koristi. Ipak, ne preuzimaj automatski copy, proizvod, publiku, tvrdnje, cenu, rok, CTA ni bilo koji drugi podatak, osim ako su za konkretnu objavu potvrđeni.

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
3. proveriti da je originalni logo celovit na krem kartici;
4. proveriti da je Manrope stvarno učitan tokom rendera; ako ne može da se učita, render mora ostati blokiran umesto da pređe na zamenski font;
5. upisati konkretna imena rendera u `design-direction.json` i `review.md`.
6. proveriti da nijedan pravougaoni panel, kartica, footer, proizvodna podloga ili logo-kartica nema zaobljene uglove; pill CTA/ponudna oznaka i kružni dekorativni oblici su jedini izuzeci.
7. ako je `imageBackground: transparent`, proveriti da proizvod nema dodatni pravougaoni ram, karticu, okvir ni podlogu, i da je dovoljno velik da bude glavni vizuelni element, bez nezavršenog praznog prostora.
8. ako je familija `premium-product-stage`, proveriti da organska scena, podijum/senka i footer stvaraju namernu hijerarhiju, da proizvod nije mali ili vizuelno odvojen od scene, i da svaki prikazani benefit ima potvrđen izvor.
9. pokrenuti `prepare-visual-review.mjs`, oceniti svih sedam kriterijuma sa najmanje 4/5, evidentirati stvarnu reviziju drafta i dobiti nezavisan verdict `meets-reference-bar`. Nezavisni reviewer koristi drugačiji `reviewerId` od `authorId` i pregleda Feed, Story, tri Reels kadra i finalni MP4 direktno. Hash dokazi zaključavaju rendere, ulazne JSON fajlove, renderer, CSS i reference; svaka kasnija izmena poništava prolaz.
