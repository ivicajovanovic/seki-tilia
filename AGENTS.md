# Uputstva za agente: AU Šeki-Tilia

Ovaj repo služi samo za pripremu sadržaja za AU Šeki-Tilija. Završni materijal se **nikada ne objavljuje automatski**; korisnik ga pregleda i ručno objavljuje. Pre prvog koraka obavezno pročitaj `AGENT-OPERATING-MAP.md`: ona povezuje izvore istine, tok rada, lokacije fajlova i pravilo sveže intervencije.

Pre rada pročitaj:

1. `brand/brand-guide.md`
2. `brand/content-framework.md`
3. `production/README.md`
4. `production/content-safety-rules.md`
5. `production/copy-playbook.md`
6. `brand/design-system.md`
7. `brand/color-palette.json`

Pre pisanja ili izmene bilo kog copy-ja obavezno pročitaj `agent-skills-required/copywriting/SKILL.md`. Taj lokalni skill primenjuje se na caption, hook, naslov, pomoćni red, CTA, Story tekst, Reels tekst i titlove. `production/content-safety-rules.md`, potvrđene činjenice i pravila jezika iz ovog dokumenta imaju prednost nad svim konverzionim tehnikama.

Pre rada na svakom vizualu obavezno pročitaj `agent-skills-required/visual-design/SKILL.md`. Ovaj folder sadrži obavezna lokalna uputstva za agente, ne opcionu pomoćnu dokumentaciju. Primeni skill za art direkciju, hijerarhiju, kompoziciju, tipografiju, obradu slike, vizuelni sistem i pregled renderovanih materijala. Za Reels ga primeni na vizuelnu direkciju kadrova i ključne kadrove, a pravila za animaciju i render ostaju u postojećem Remotion toku. Pre statusa `SPREMNO ZA LJUDSKU PROVERU` obavezno izvedi pregled finalnih rendera prema njegovoj kontrolnoj listi i evidentiraj ga u `review.md`.

Pre dizajna svakog produktnog vizuala pokreni `node production/scripts/inspect-assets.mjs --post <paket>`, otvori svetli i tamni pregled svakog asseta i popuni `generated/asset-review.json`. Umereno slabija rezolucija, kompresija, mekoća ili nepotpuna čitljivost sitnog teksta na ambalaži nisu automatska blokada kada je proizvod pouzdano prepoznatljiv. Evidentiraj ih u `qualityLimitations`, koristi status `approved-with-limitations` i prilagodi veličinu, kadar, familiju, kontrast, geometriju i završnu obradu onome što asset realno može da podnese. Kursor, UI/screenshot artefakt, pogrešan proizvod, ozbiljna deformacija, obmanjujuća retuša, neupotrebljiva alfa ivica ili nemogućnost pouzdane identifikacije proizvoda ostaju blokada i upisuju se u `blockingDefects`. Original u `source/` se ne menja. Odobrena pripremljena kopija mora biti u paketu, a renderer mora koristiti fajl istog SHA-256 hasha. Ako defekt prekriva etiketu, pakovanje ili providni prozor proizvoda, ne popravljaj ga generativnim izmišljanjem sadržaja; traži čist original ili radi sa bezbednim kadrom koji ne falsifikuje detalj.

U svakom formatu proveri vidljivost i kontrast svih obaveznih elemenata: logoa, glavne poruke, ponude, proizvoda i CTA-a kada je prisutan. Pregledaj render u punoj veličini i kao umanjeni prikaz telefona. Ne postavljaj logo, tekst ili ikonu u istu ili gotovo istu boju kao neposrednu pozadinu. Ako je kontrast nedovoljan, premesti element na kontrolisanu podlogu ili upotrebi odgovarajuću originalnu verziju logoa. Ne menjaj boju, proporcije ni oblik originalnog logoa.

Kada klijentov proizvod stiže kao transparentni PNG, u `video-props.json` postavi `imageBackground` na `transparent`. Takav proizvod mora da stoji slobodno na kompoziciji, bez dodatnog pravougaonog rama, kartice, okvira ili podloge, i mora biti glavni vizuelni element. Kod slabijeg izvora dominaciju gradi položajem, kontrastom i scenom, bez forsiranog uvećanja koje vidljivo razara sliku. Ne koristi prazninu da bi proizvod ostao beznačajno mali. Pravougaona podloga je dozvoljena samo za neprovidnu sliku označenu kao `opaque`, kada je potrebna radi kontrasta. Senke i blur nisu dozvoljeni, ni vektorski ni rasterski. Podijum mora jasno nositi proizvod na vidljivoj gornjoj ravni, a njegova prednja masa mora biti dovoljno duga da uđe iza footera i ne deluje kao da visi u praznini. Dubina dolazi iz izraženih vektorskih gradijenata i geometrije.

**Obavezni vizuelni nepregovarivi uslovi pregleda:**
1. **Slika proizvoda (bočica, kutija, pakovanje) nikada ne sme preklopiti tekst**, naslov, eyebrow, podnaslov, ponudnu oznaku ili ikonu u bilo kom formatu (Feed, Story, Reels). Proizvod mora ostati strogo omeđen unutar produktne zone.
2. **Proizvod mora stajati pravilno i uzemljeno na postolju/podijumu na glavnoj sceni (Feed, Story, Reels Hero)**, pri čemu gornja ravan podijuma jasno nosi dno pakovanja, bez lebđenja u praznini. U završnom kadru videa (Reels Closing scene), postolje se potpuno izostavlja i proizvod stoji čisto i samostalno sa desne strane bez veštačkog podijuma ispod njega, kako ne bi dolazilo do vizuelnog utiska lebđenja.
3. **Futer nikada ne sme zaklanjati ikone, tekst, dugmad ili bilo koji drugi sadržaj**. U Story-ju i Feed-u donja margina sadržaja mora osigurati potpunu vidljivost svih ikona i teksta iznad linije footera.
4. **Tranzicije između video sekvenci (Reels) moraju biti potpuno čiste, bez preklapanja elemenata.** Prethodna scena (Hero) mora imati namenski exit fade-out do 0 opaciteta pre nego što se završna (Closing) scena potpuno uspostavi, tako da u 8. i 9. sekundi ne dolazi do nikakvog ružnog prekrivanja teksta ili slojeva.
5. **Video animacija (Reels) mora imati neprekidnu vizuelnu dinamičnost u svakom sekundu (kontinuirani pokret).** Elementi ne smeju da se pojave svi odjednom niti da video ostane statičan. Koristi fazni slide-in / slow reveal ulazak pojedinačnih elemenata (eyebrow -> naslov -> offer pill -> produktna scena -> benefit ikone -> futer). Tekst, uključujući naslov, eyebrow, ponudu, CTA i pomoćne redove, nakon završetka ulazne animacije mora ostati potpuno stabilan: bez pulsiranja, plutanja, kontinuiranog skaliranja ili pomeranja. Tokom faze zadržavanja animiraju se proizvod, ikone, akcentne linije, organska geometrija ili gradijent drift, tako da video ostaje dinamičan bez narušavanja čitljivosti.
6. **Muzička podloga u videu (Reels)**: Svaki generisani Reels video obavezno sadrži jasno čujnu muzičku podlogu. Agent nasumično bira jednu od 6 odobrenih audio numera iz `public/mp3/` (`clear-path.mp3`, `clear-path-ambient.mp3`, `open-sky-drift.mp3`, `open-sky-drift-chill.mp3`, `paper-sun-parade.mp3`, `paper-sun-parade-upbeat.mp3`) i upisuje je u `video-props.json` u polje `audioTrack` (npr. `"audioTrack": "mp3/paper-sun-parade.mp3"`). `audioVolume` mora biti između 0.75 i 1, a finalni MP4 mora proći proveru stvarne glasnoće, ne samo postojanja audio streama. Sve numere su dozvoljene za korišćenje; poreklo se vodi u `public/mp3/README.md`.

Na svakoj grafičkoj i video objavi obavezno koristi najmanje jednu smislenu profesionalnu ikonu iz `lucide-react`; čista tekstualna objava je jedini izuzetak. Ikona mora podržati stvarnu informaciju ili navigaciju, nikada služiti kao nasumična dekoracija. Za nepotvrđene zdravstvene koristi ne koristi medicinske ikone. Kada nema potvrđene produktne tvrdnje, koristi neutralnu ikonu lokacije/dostupnosti uz CTA.

Ovaj skill služi isključivo dizajnu grafika, slika i videa. Ne koristi ga za izmene captiona, CTA formulacija, hashtagova ili drugih copy odluka. Za copy su merodavni `production/copy-playbook.md` i bezbednosna pravila, koji imaju prednost ako postoji sukob.

Pre rada na vizualu proveri isključivo četiri odobrene reference navedene u `brand/design-references/references.json`: `ref-premium-product-stage.png`, `ref-product-stage-footer.png`, `ref-editorial-offer-stage.png` i `ref-vertical-product-spotlight.png`. Ova kratka ASCII imena su stabilni identifikatori i koriste se doslovno u `generated/design-direction.json`; u `referenceFiles` navedi samo reference čije si osobine stvarno primenio. Ne koristi druge fajlove kao reference. Koristi odobrene slike isključivo kao stilsku i dizajnersku inspiraciju za kvalitet, čitanje kompozicije, hijerarhiju, ritam i obradu, nikada kao šablon za doslovno kopiranje. Reference mogu biti iz potpuno drugih niša i zato iz njih ne preuzimaj temu, proizvod, zdravstvene tvrdnje, copy, CTA, publiku, cenu, rokove ni brend kontekst. Referentni materijal ne menja pravila brenda, potvrđene činjenice ni obavezni dizajn-skill.

`brand/design-references/ref-premium-product-stage.png` je autorski odobrena interna referenca i može se koristiti za familiju `premium-product-stage`. Preuzimaj njenu dizajnersku gramatiku sa stvarnim varijacijama: velika asimetrična ponuda, dominantna produktna scena, organski oblik/podijum i petrol CTA završetak. `ref-product-stage-footer.png` može da inspiriše veliku produktnu scenu, podijum, premium osvetljenje i funkcionalan lokacijski footer. `ref-editorial-offer-stage.png` dodaje editorial odnos poruke levo i produktne scene desno, a `ref-vertical-product-spotlight.png` snažnu vertikalnu skalu proizvoda i slojevitu kružnu scenografiju. Ne repliciraj raspored piksel po piksel. Ne kopiraj zaobljen strukturni footer, direktan logo tretman, kursor/UI trag, konkretne benefit-ikonice ili zdravstvene tvrdnje iz novih referenci. Transparentni PNG proizvoda ostaje slobodan preko scene, bez pravougaonog rama, kartice ili podloge. Organski oblik i podijum služe sceni, ne kao okvir proizvoda. Red sa ikonama ili benefitima dodaj samo kada su sve konkretne tvrdnje potvrđene za aktuelni proizvod.

Pre izrade rendera popuni `generated/design-direction.json` prema `brand/design-system.md`, uključujući stabilan `authorId`. Početni `colorScheme` se nasumično bira iz `rendererThemes` u `brand/color-palette.json`; agent ga potvrđuje ili nasumično menja drugom kompatibilnom temom radi raznovrsnosti. Ista vrednost mora biti u `video-props.json`, a `palettePlan` mora doslovno odgovarati izabranoj temi. Tekstualni par mora biti u `safeTextPairs`, a `logoVariant` i neposredna pozadina moraju odgovarati `approvedLogoPlacements`. Izaberi jednu od podržanih familija renderer-a, zabeleži najmanje jednu referencu, dve stvarno primenjene dizajnerske osobine, najmanje dve sveže dizajnerske intervencije, formatne adaptacije i po čemu se kompozicija razlikuje od poslednje tri objave. U `input.json` obavezno zabeleži nov `contentApproach` i `copyFreshnessNote`; za Reels zabeleži i nov `motionTreatment` identično u `generated/design-direction.json` i `video-props.json`, kako bi uticao na stvarni ritam sekvenci i način ulaska elemenata. Ne koristi istu `signature` kombinaciju familije, tretmana logoa bez podloge, tretmana proizvoda i modula ponude kao u bilo kojoj od poslednje tri evidentirane objave. Za logo znaka je obavezno `logoSurface: "none"`: ne sme imati belu, krem ni drugu pravougaonu podlogu, a neposredni kontrast mora čuvati oba originalna dela znaka.

Svežina nikada nema prednost nad kvalitetom. Pre izbora nove familije popuni `familyFit` i potvrdi da odgovara proporciji proizvoda, snazi potvrđene ponude i potrebnoj dubini scene. Ponovi kompatibilnu familiju sa novom kompozicijom kada bi nova familija dala slabiji rezultat. `formatPlan` mora imati različite Feed i Story `layoutId` vrednosti, a Reels najmanje tri različite scene. Ne opisuj promenu koja nije sprovedena u rendereru.

Posle prvog drafta obavezno napravi najmanje jednu vidljivu korekciju, zatim pokreni `node production/scripts/prepare-visual-review.mjs --post <paket>`. Otvori `generated/reference-comparison.png`, `generated/format-comparison.png`, Feed, Story, sva tri Reels ključna kadra i finalni MP4, pa popuni `generated/quality-review.json`. Svaki kriterijum mora imati 4 ili 5 od 5 i konkretan dokaz. Nezavisni pregled radi drugi agent sa drugačijim `reviewerId` od `authorId`, direktno nad sirovim artefaktima. Ako drugi agent nije dostupan, paket ostaje blokiran dok takav pregled ne bude moguć. Posle generisanja review dokaza ne menjaj input, props, design-direction, renderer, CSS, reference ni rendere bez ponovnog pokretanja skripte. `review.md` je samo ljudski sažetak i ne može samostalno otključati paket.

Pravougaoni paneli, kartice, podloge proizvoda, footeri i okviri moraju imati oštre uglove. Zaobljenje je dozvoljeno samo za pill-dugme ili kratku CTA/ponudnu oznaku i za čiste kružne dekorativne oblike. Ne pretvaraj pravougaone strukturne elemente u rounded cards.

## Kada korisnik pošalje materijale za novu objavu

**Obavezni workflow gate:** Objava se izrađuje u tri produkciona koraka i četvrtoj finalizaciji: (1) tekst i Feed, (2) Story, (3) Reels, (4) kopiranje u `final/`. Posle svakog od prva tri koraka agent daje korisniku tačno jednu rečenicu izveštaja i bez izričitog odobrenja korisnika ne započinje sledeći korak. Odobrenje se evidentira samo posle korisnikove potvrde kroz `node production/scripts/advance-post-stage.mjs --post <paket> --approve <text-and-feed|story|video> --report "Jedna rečenica."`. Tek po sva tri odobrenja agent pokreće `node production/scripts/finalize-post.mjs --post <paket>`, koji kopira odobrene radne izlaze iz `generated/` u `final/`.

1. Otvori novi folder komandom `node production/scripts/create-post.mjs --slug "kratak-naziv"` (po potrebi dodaj `--date GGGG-MM-DD`).
2. Doslovno sačuvaj korisnikov brief u `brief.md`; izvorne slike stavi u `source/` bez menjanja originala. Sve radne rendere, pregledačke slike i sistemske testove čuvaj isključivo u tom paketu, pod `generated/`; ne ostavljaj ih u `/tmp` ili van `productions/`.
3. Popuni `input.json`, a zatim napravi predlog sadržaja prema `production/copy-playbook.md`: caption, tekst za grafike i `video-props.json`.
4. Ako je potreban AI vizual, direktno ga generiši dostupnim generatorom slika i sačuvaj/uvezi rezultat u paket objave. Ako direktno generisanje nije dostupno ili ga korisnik ne želi, napiši `generated/image-prompt.md` za lokalni generator. Ne predstavljaj generisanu osobu kao stvarnu zaposlenu apoteke.
5. Ne renderuj finalnu promociju dok asset gate ne prođe. Ne označavaj paket spremnim dok `generated/quality-review.json`, `review.md` i `generated/design-direction.json` ne prođu pre-flight i sadrže aktuelne hasheve rendera.
6. Finalne datoteke idu isključivo u `final/`: feed PNG, Story PNG, Reels MP4 i caption Markdown/TXT.
7. Svaki korisnički zahtev izrađuje sva tri formata: Feed, Story i Reels. Nijedan pojedinačni format se ne preskače.

## Lokacije i fotografije apoteka

- Kada korisnik dostavi adresu, telefon i radno vreme, ažuriraj postojeći zapis ili dodaj novi zapis u `brand/brand-config.json`. Ne rasipaj iste kontakt-podatke po šablonima ili pojedinačnim objavama.
- Koristi stabilan `id` lokacije, izveden iz mesta i/ili naziva koji klijent potvrdi (na primer `petrovac-na-mlavi-centar`).
- Fotografije koje korisnik podeli u podfolderima po apoteci čuvaj u `client-assets/locations/<id-lokacije>/`; ne mešaj ih sa slikama druge lokacije i ne preimenuj originale.
- Pri lokalnoj objavi koristi samo fotografije i kontakt-podatke iz potvrđenog foldera/zapisa te apoteke.

## Korišćenje mreže lokacija u sadržaju

- U opštim objavama o proizvodu, akciji ili savetu ne navodi kompletnu listu lokacija na grafici, u Story-ju ni u Reels-u. Koristi najviše kratku, neutralnu završnu poruku: „Dostupno u AU Šeki-Tilia apotekama.”
- Pun lokalni podatak koristi samo kada je objava vezana za konkretnu apoteku. Tada navedi samo relevantnu lokaciju i samo potvrđene podatke iz `brand/brand-config.json`.
- Predloži ručno objavljeni Story Highlight „Lokacije” i povremene lokacijske objave ili carousele kao kanal za pregled mreže. Ne pretpostavljaj da Highlight postoji dok korisnik to ne potvrdi. Ovo nisu obavezni elementi svake promotivne objave.
- Ne završavaj redovni Reels spiskom svih lokacija. Lokacijski detalj koristi samo ako je deo poruke; ključne vizuelne elemente zadrži u sigurnoj zoni videa.

## Bezbednost sadržaja

- Lekovi i antibiotici se ne promovišu. Ako nije jasno da li je proizvod dozvoljen, stani i označi ga za proveru.
- Ne postavljaj dijagnoze, terapijske preporuke ni obećanja o ishodu.
- Činjenice o konkretnim proizvodima koriste se samo ako ih je dostavio klijent, proizvođač/distributer ili ih je potvrdila stručna osoba.
- Cena, popust, rok akcije, lokacija i kontakt moraju biti potvrđeni. U suprotnom, izostavi ih ili označi kao nedostajuće.
- Objava tipa `akcija` zahteva potvrđenu mehaniku, prikazivu vrednost, rok i izvor. Sam rok nije akcijska mehanika. Ako to nedostaje, paket ostaje blokiran ili korisnik eksplicitno menja nameru u neutralnu produktnu objavu.
- Za objave vezane za konkretnu lokaciju koristi podatke samo iz `brand/brand-config.json`. Ako podatak za tu lokaciju nedostaje, izostavi ga ili zatraži potvrdu.

## Vizuelna pravila

- Koristi paletu, logo i tipografiju iz `brand/brand-guide.md`.
- Jedna jasna poruka po grafici, bez kolaža i sitnog teksta.
- Za tekst na fotografiji uvek ostavi čitljivu pozadinu i dovoljno praznog prostora.
- Kada su potrebne fiktivne apotekarke, koristi opis odrasle žene od oko 25–35 godina, sa jugoistočnoevropskim izgledom; nikada ne navodi da je zaposlena u AU Šeki-Tilija.

## Jezik, ton i kvalitet teksta

- Sav tekst mora biti na pravilnom srpskom jeziku, latinicom: caption, tekst na grafici, Story tekst, Reels tekst, titlovi i CTA.
- Ne koristi em crtu (`—`). Rečenice odvajaj tačkom, zarezom, dvotačkom ili novom rečenicom.
- Ikonice i emoji nisu podrazumevani element. Koristi ih samo kada zaista pomažu razumevanju, najviše jednu do dve po objavi.
- Hashtagovi moraju biti relevantni za stvarnu temu, brend i potvrđeno mesto. Ne dodaj opšte ili trend hashtagove samo radi broja.
- Ne izmišljaj sastojke, koristi, cenu, popust, rok, lokaciju, kontakt, dostupnost, zalihe, sertifikate ni bilo koju drugu činjenicu koju korisnik nije potvrdio.
- Piši prirodno, konkretno i sa merom. Izbegavaj generičke marketinške fraze, prenaglašene superlative, veštačku hitnost, klišee i nabrajanja bez stvarne vrednosti ("AI slop").
- Prioriteti copy-ja su: vidljivost kroz jasan relevantan sadržaj, zatim poverenje kroz tačnost i ton, pa tek onda prodajni poziv.
