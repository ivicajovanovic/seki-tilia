# Uputstva za agente: AU Šeki-Tilia

Ovaj repo služi samo za pripremu sadržaja za AU Šeki-Tilija. Završni materijal se **nikada ne objavljuje automatski**; korisnik ga pregleda i ručno objavljuje.

Pre rada pročitaj:

1. `brand/brand-guide.md`
2. `brand/content-framework.md`
3. `production/README.md`
4. `production/content-safety-rules.md`
5. `production/copy-playbook.md`

## Kada korisnik pošalje materijale za novu objavu

1. Otvori novi folder komandom `node production/scripts/create-post.mjs --slug "kratak-naziv"` (po potrebi dodaj `--date GGGG-MM-DD`).
2. Doslovno sačuvaj korisnikov brief u `brief.md`; izvorne slike stavi u `source/` bez menjanja originala.
3. Popuni `input.json`, a zatim napravi predlog sadržaja prema `production/copy-playbook.md`: caption, tekst za grafike i `video-props.json`.
4. Ako je potreban AI vizual, direktno ga generiši dostupnim generatorom slika i sačuvaj/uvezi rezultat u paket objave. Ako direktno generisanje nije dostupno ili ga korisnik ne želi, napiši `generated/image-prompt.md` za lokalni generator. Ne predstavljaj generisanu osobu kao stvarnu zaposlenu apoteke.
5. Ne renderuj finalnu promociju dok `review.md` ne sadrži ispunjenu kontrolnu listu i status `SPREMNO ZA LJUDSKU PROVERU`.
6. Finalne datoteke idu isključivo u `final/`: feed PNG, Story PNG, Reels MP4 i caption Markdown/TXT.

## Lokacije i fotografije apoteka

- Kada korisnik dostavi adresu, telefon i radno vreme, ažuriraj postojeći zapis ili dodaj novi zapis u `brand/brand-config.json`. Ne rasipaj iste kontakt-podatke po šablonima ili pojedinačnim objavama.
- Koristi stabilan `id` lokacije, izveden iz mesta i/ili naziva koji klijent potvrdi (na primer `petrovac-na-mlavi-centar`).
- Fotografije koje korisnik podeli u podfolderima po apoteci čuvaj u `client-assets/locations/<id-lokacije>/`; ne mešaj ih sa slikama druge lokacije i ne preimenuj originale.
- Pri lokalnoj objavi koristi samo fotografije i kontakt-podatke iz potvrđenog foldera/zapisa te apoteke.

## Bezbednost sadržaja

- Lekovi i antibiotici se ne promovišu. Ako nije jasno da li je proizvod dozvoljen, stani i označi ga za proveru.
- Ne postavljaj dijagnoze, terapijske preporuke ni obećanja o ishodu.
- Činjenice o konkretnim proizvodima koriste se samo ako ih je dostavio klijent, proizvođač/distributer ili ih je potvrdila stručna osoba.
- Cena, popust, rok akcije, lokacija i kontakt moraju biti potvrđeni. U suprotnom, izostavi ih ili označi kao nedostajuće.
- Za objave vezane za konkretnu lokaciju koristi podatke samo iz `brand/brand-config.json`; trenutno nisu unete potvrđene lokacije.

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
