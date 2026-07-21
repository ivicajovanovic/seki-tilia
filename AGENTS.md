# Uputstva za agente: AU Šeki-Tilia

Ovaj repo služi samo za pripremu sadržaja za AU Šeki-Tilija. Završni materijal se **nikada ne objavljuje automatski**; korisnik ga pregleda i ručno objavljuje.

Pre rada pročitaj:

1. `brand/brand-guide.md`
2. `brand/content-framework.md`
3. `production/README.md`
4. `production/content-safety-rules.md`
5. `production/copy-playbook.md`
6. `brand/design-system.md`

Pre rada na svakom vizualu obavezno pročitaj `skills/visual-design/SKILL.md`. Primeni ga za art direkciju, hijerarhiju, kompoziciju, tipografiju, obradu slike, vizuelni sistem i pregled renderovanih materijala. Za Reels ga primeni na vizuelnu direkciju kadrova i ključne kadrove, a pravila za animaciju i render ostaju u postojećem Remotion toku. Pre statusa `SPREMNO ZA LJUDSKU PROVERU` obavezno izvedi pregled finalnih rendera prema njegovoj kontrolnoj listi i evidentiraj ga u `review.md`.

U svakom formatu proveri vidljivost i kontrast svih obaveznih elemenata: logoa, glavne poruke, ponude, proizvoda i CTA-a kada je prisutan. Pregledaj render u punoj veličini i kao umanjeni prikaz telefona. Ne postavljaj logo, tekst ili ikonu u istu ili gotovo istu boju kao neposrednu pozadinu. Ako je kontrast nedovoljan, premesti element na kontrolisanu podlogu ili upotrebi odgovarajuću originalnu verziju logoa. Ne menjaj boju, proporcije ni oblik originalnog logoa.

Kada klijentov proizvod stiže kao transparentni PNG, u `video-props.json` postavi `imageBackground` na `transparent`. Takav proizvod mora da stoji slobodno na kompoziciji, bez dodatnog pravougaonog rama, kartice, okvira ili podloge, i mora biti dovoljno velik da bude glavni vizuelni element. Ne koristi prazninu da bi proizvod ostao mali. Pravougaona podloga je dozvoljena samo za neprovidnu sliku označenu kao `opaque`, kada je potrebna radi kontrasta.

Na svakoj grafičkoj i video objavi obavezno koristi najmanje jednu smislenu profesionalnu ikonu iz `lucide-react`; čista tekstualna objava je jedini izuzetak. Ikona mora podržati stvarnu informaciju ili navigaciju, nikada služiti kao nasumična dekoracija. Za nepotvrđene zdravstvene koristi ne koristi medicinske ikone. Kada nema potvrđene produktne tvrdnje, koristi neutralnu ikonu lokacije/dostupnosti uz CTA.

Ovaj skill služi isključivo dizajnu grafika, slika i videa. Ne koristi ga za izmene captiona, CTA formulacija, hashtagova ili drugih copy odluka. Za copy su merodavni `production/copy-playbook.md` i bezbednosna pravila, koji imaju prednost ako postoji sukob.

Pre rada na vizualu proveri `brand/design-references/` kada folder sadrži materijale. Koristi ih isključivo kao stilsku i dizajnersku inspiraciju za kvalitet, čitanje kompozicije, hijerarhiju, ritam i obradu, nikada kao šablon za doslovno kopiranje. Reference mogu biti iz potpuno drugih niša i zato iz njih ne preuzimaj temu, proizvod, zdravstvene tvrdnje, copy, CTA, publiku, cenu, rokove ni brend kontekst. Referentni materijal ne menja pravila brenda, potvrđene činjenice ni obavezni dizajn-skill.

`ovako mora biti.png` u korenu repoa je autorski odobrena interna referenca i može se koristiti za familiju `premium-product-stage`. Preuzimaj njenu dizajnersku gramatiku sa stvarnim varijacijama: velika asimetrična ponuda, dominantna produktna scena, organski oblik/podijum i petrol CTA završetak. Ne repliciraj raspored piksel po piksel. Transparentni PNG proizvoda ostaje slobodan preko scene, bez pravougaonog rama, kartice ili podloge. Organski oblik, podijum i senka služe sceni, ne kao okvir proizvoda. Red sa ikonama ili benefitima dodaj samo kada su sve konkretne tvrdnje potvrđene za aktuelni proizvod; nije dozvoljeno prenošenje zdravstvenih tvrdnji iz reference.

Pre izrade rendera popuni `generated/design-direction.json` prema `brand/design-system.md`. Izaberi jednu od podržanih familija renderer-a, zabeleži najmanje jednu referencu, dve stvarno primenjene dizajnerske osobine i po čemu se kompozicija razlikuje od poslednje tri objave. Ne koristi istu `signature` kombinaciju familije, logo-podloge, tretmana proizvoda i modula ponude kao u bilo kojoj od poslednje tri evidentirane objave. Za logo znaka koristi se isključivo rendererova krem logo-kartica; nije dozvoljeno postavljanje znaka direktno na limeta polje, fotografiju ili dekorativni oblik.

Pravougaoni paneli, kartice, podloge proizvoda, footeri, okviri i logo-kartica moraju imati oštre uglove. Zaobljenje je dozvoljeno samo za pill-dugme ili kratku CTA/ponudnu oznaku i za čiste kružne dekorativne oblike. Ne pretvaraj pravougaone strukturne elemente u rounded cards.

## Kada korisnik pošalje materijale za novu objavu

1. Otvori novi folder komandom `node production/scripts/create-post.mjs --slug "kratak-naziv"` (po potrebi dodaj `--date GGGG-MM-DD`).
2. Doslovno sačuvaj korisnikov brief u `brief.md`; izvorne slike stavi u `source/` bez menjanja originala. Sve radne rendere, pregledačke slike i sistemske testove čuvaj isključivo u tom paketu, pod `generated/`; ne ostavljaj ih u `/tmp` ili van `productions/`.
3. Popuni `input.json`, a zatim napravi predlog sadržaja prema `production/copy-playbook.md`: caption, tekst za grafike i `video-props.json`.
4. Ako je potreban AI vizual, direktno ga generiši dostupnim generatorom slika i sačuvaj/uvezi rezultat u paket objave. Ako direktno generisanje nije dostupno ili ga korisnik ne želi, napiši `generated/image-prompt.md` za lokalni generator. Ne predstavljaj generisanu osobu kao stvarnu zaposlenu apoteke.
5. Ne renderuj finalnu promociju dok `review.md` i `generated/design-direction.json` ne sadrže ispunjenu kontrolnu listu i status `SPREMNO ZA LJUDSKU PROVERU`.
6. Finalne datoteke idu isključivo u `final/`: feed PNG, Story PNG, Reels MP4 i caption Markdown/TXT.

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
