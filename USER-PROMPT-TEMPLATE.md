# Prompt za novu objavu

Ovaj šablon kopiraj u novu Codex/LLM sesiju i popuni samo podatke koje je klijent potvrdio. Uz poruku priloži originalnu fotografiju ili PNG proizvoda. Nepoznata polja ostavi prazna ili napiši `nije potvrđeno`. Ne nagađaj podatke da bi prompt bio potpun.

```text
Radimo novu objavu za AU Šeki-Tilia.

Pre bilo koje produkcione radnje pročitaj `AGENT-OPERATING-MAP.md`, `AGENTS.md` i sve obavezne izvore na koje upućuju. `HANDOFF.md` koristi samo kao dodatni kontekst ako nije u sukobu sa tim izvorima. Prati postojeće skripte, gate-ove i izvore istine. Ne objavljuj ništa automatski.

KORISNIKOV BRIEF
Sačuvaj sledeći tekst doslovno u `brief.md`, bez redakture:

[ovde nalepi originalnu poruku klijenta]

POTVRĐENI ULAZI
- Slug: [kratak-naziv ili „predloži”]
- Datum paketa: [GGGG-MM-DD ili „danas”]
- Cilj: [akcija / novitet / produktna objava / sezonski savet / lokalna objava]
- Proizvod ili tema: [pun naziv]
- Status proizvoda: [dodatak ishrani / kozmetika / medicinsko sredstvo / drugo / nije potvrđeno]
- Obavezna poruka: [tekst ili „predloži na osnovu potvrđenih činjenica”]
- Željeni CTA: [tekst ili „predloži neutralan CTA”]
- Potvrđene činjenice: [činjenica + izvor za svaku stavku]
- Potvrđena dostupnost: [cela mreža / ID lokacije iz `brand-config.json` / nije potvrđeno]
- Napomena za stručnu proveru: [tekst ili „nema”]

PODACI O AKCIJI, POPUNITI SAMO AKO JE CILJ AKCIJA
- Mehanika: [npr. 1+1 gratis / 20% popusta / akcijska cena]
- Prikaziva vrednost: [šta korisnik konkretno dobija ili plaća]
- Rok: [tačan datum]
- Mesto važenja: [potvrđena mreža ili ID lokacije]
- Izvor potvrde: [osoba, dokument ili drugi pouzdan izvor]

MATERIJALI
- Priloženi fajlovi ili tačne putanje: [spisak]
- Glavni proizvodni asset: [tačan naziv fajla]
- Tip glavnog asseta: [transparentni PNG / neprovidna fotografija / nije poznato]
- Dozvoljeno čitanje ambalaže: [da / ne]
- Posebna ograničenja kadra ili obrade: [tekst ili „nema”]

Ako je dozvoljeno čitanje ambalaže, prepiši samo jasno čitljiv tekst. Tretiraj ga kao mogući izvor produktnih činjenica, evidentiraj poreklo i ne dopunjavaj nečitljive delove pretpostavkom. Ne pretvaraj naziv sastojka ili deklaraciju automatski u zdravstvenu korist.

VIDEO STIL
- Video template: [reel-v1 / reel-v2]

Ako ovo polje nije doslovno popunjeno sa `reel-v2`, koristi podrazumevani `reel-v1`. `reel-v2` se nikada ne bira po pretpostavci.

OBAVEZAN REZULTAT
Jedan zahtev uvek proizvodi sva četiri materijala: univerzalni caption, Feed 1080x1350, Story 1080x1920 i Reels 1080x1920. Ne preskači format i ne pravi više opcija, varijanti ili paralelnih kandidata. Korekcija zamenjuje isti radni izlaz.

OBAVEZAN TOK SA ODOBRENJIMA
Radi strogo korak po korak:

1. Pripremi univerzalni caption i jedan Feed render. Pregledaj ih i pošalji mi tačno jednu rečenicu izveštaja. Zatim stani. Ne započinji Story pre mog izričitog odobrenja.
2. Posle odobrenja evidentiraj gate postojećom skriptom, pripremi jedan Story render, pregledaj ga i pošalji tačno jednu rečenicu izveštaja. Zatim stani. Ne započinji Reels pre mog izričitog odobrenja.
3. Posle odobrenja evidentiraj gate, pripremi jedan Reels i njegova tri obavezna dokazna kadra, pregledaj video i pošalji tačno jednu rečenicu izveštaja. Zatim stani. Ne kopiraj ništa u `final/` pre mog izričitog odobrenja.
4. Posle odobrenja Reels-a evidentiraj gate, pokreni finalizaciju postojećom skriptom i tek tada navedi finalne putanje i status.

PREVENTIVNE KONTROLE
- Koristi samo potvrđene činjenice. Ne izmišljaj cenu, popust, rok, dostupnost, lokaciju, sastojke, korist, sertifikat ili zdravstvenu tvrdnju.
- Lekove i antibiotike ne promoviši. Ako status proizvoda ili obavezni podatak za akciju nije potvrđen, blokiraj produkciju i jasno navedi šta nedostaje.
- Caption mora biti univerzalan za Feed, Story i Reels, na pravilnom srpskom jeziku, latinicom, informativan, prirodan i bez klišea, prenaglašavanja ili izmišljene hitnosti.
- Pre dizajna pregledaj asset na svetloj i tamnoj pozadini i veži odobrenu pripremljenu kopiju hashom. Ne menjaj original.
- U svakom formatu proizvod, tekst, ponuda, logo, ikona i CTA moraju biti dovoljno veliki i čitljivi u punoj veličini i kao umanjen prikaz telefona. Proizvod nikada ne sme preklopiti tekst.
- Feed i Story moraju imati namenski prilagođene, različite layoute. Ne rasteži isti raspored. Safe space treba da bude funkcionalan, bez nepotrebno velikih praznih margina. Footer u Feed-u i Story-ju ostaje na samom dnu, odvojen prema dizajn sistemu i ne sme zaklanjati sadržaj.
- Transparentni proizvod ostaje bez pravougaone kartice ili rama. Na glavnoj Feed/Story/Reels Hero sceni mora biti dominantan i pravilno uzemljen na vidljivoj gornjoj ravni podijuma kada izabrani template zahteva podijum. U završnom kadru `reel-v1` nema podijuma. `reel-v2` nema podijum ni u jednom kadru.
- Logo koristi samo originalni asset, pravilan kontrast i nema pravougaonu podlogu. Strukturni paneli i footer imaju oštre uglove. Ne koristi senke ni blur.
- Reels mora imati fazne ulaske, najmanje tri jasno različita vremenska trenutka i kontinuiranu vizuelnu dinamiku. Elementi ne smeju ući svi istovremeno.
- Tekst u Reels-u animira se samo tokom ulaska ili izlaska. Kada postane čitljiv, mora biti potpuno stabilan: bez pulsiranja, plutanja, skaliranja, subpikselnog pomeranja, treperenja ili podrhtavanja. Proveri stabilne susedne sirove frejmove, pravilno učitan Manrope latin/latin-ext i donje poteze slova `g`, `j`, `p`, `q` i `y` pre prihvatanja rendera.
- Svaki Reels mora sadržati nasumično izabranu odobrenu MP3 podlogu iz `public/mp3/`, sa `audioVolume` od 0.75 do 1. Proveri stvarni nivo zvuka finalnog MP4-a, ne samo postojanje audio streama.
- Primeni obaveznu svežinu: nov `contentApproach`, najmanje dve stvarne `designInterventions`, odgovarajući `familyFit`, različite format adaptacije i nov `motionTreatment` prema pravilima poslednje tri objave. Svežina nema prednost nad kvalitetom.
- Posle prvog drafta napravi najmanje jednu vidljivu korekciju. Zatim obnovi review dokaze, pregledaj sve rendere i MP4, pribavi nezavisan pregled sa drugim `reviewerId` i pokreni pre-flight. Posle hash pregleda ništa ne menjaj bez ponavljanja kompletnog pregleda.

IZVEŠTAVANJE I BLOKADE
Tokom prva tri koraka odgovor mora biti samo jedna rečenica koja navodi šta je završeno, rezultat kontrole i da se čeka moje odobrenje. Ako postoji bezbednosna ili podatkovna blokada, ne renderuj i u jednoj jasnoj rečenici navedi tačno koji potvrđeni podatak nedostaje.

Posle četvrtog koraka isporuči:
- kratko obrazloženje kreativne odluke;
- spisak eventualnih ograničenja ili podataka za ljudsku proveru;
- putanje do finalnog captiona, Feed-a, Story-ja i Reels-a;
- status `SPREMNO ZA LJUDSKU PROVERU` ili precizno objašnjenje preostale blokade.
```

Za neutralnu objavu nisu potrebni cena, popust ni rok. Za lokalnu objavu koristi isključivo potvrđeni ID iz `brand/brand-config.json`, nikada slobodno unetu adresu ili telefon. Ako je zahtev kraći od ovog šablona, pravila repoa i dalje važe u celosti.
