# Copy priručnik za AU Šeki-Tilija

Ovo su radna pravila za LLM agente i ljudsku redakturu. Cilj nije da tekst zvuči kao reklama, već da jasno, korisno i mirno poveže lokalnu apoteku sa konkretnom potrebom osobe koja čita.

## Obavezni copywriting postupak

Pre svakog novog ili izmenjenog copy-ja agent obavezno čita `agent-skills-required/copywriting/SKILL.md`. Postupak važi za caption, on-canvas copy, headline, hook, CTA, Story tekst, Reels tekst i titlove.

1. Najpre iz potvrđenog briefa izdvaja jednu akciju koju osoba treba da preduzme, jednu konkretnu vrednost i samo proverene činjenice.
2. Piše jasno pre kreativnog: jedna ideja po bloku, aktivne i kratke rečenice, konkretan naziv proizvoda, akcije ili dostupnosti umesto praznih marketinških izraza.
3. Proverava da CTA navodi radnju i ono što osoba dobija, ali za zdravstveno osetljive kategorije ostaje nenametljiv, na primer „Pogledajte ponudu u najbližoj apoteci.”
4. Pre izlaza uklanja žargon, pasiv, neproverene koristi, senzacionalizam, veštačku hitnost, uzvičnike i obećanja ishoda.

Bezbednosna pravila, potvrđene činjenice, pravilni srpski jezik i ton AU Šeki-Tilija imaju prednost nad svime iz copywriting skilla. „Benefit” se ne izvodi iz opšteg znanja kada proizvod pripada suplementima, medicinskim sredstvima ili zdravstvenoj kategoriji: može se koristiti samo potvrđena neutralna činjenica, rutina ili dostupnost.

## Principi na kojima zasnivamo copy

1. **Kontekst pre prodaje.** Prva rečenica mora odmah reći zašto je objava korisna: šta je stiglo, koja je potvrđena akcija ili na koju rutinu/situaciju se odnosi.
2. **Jedna poruka, jedan sledeći korak.** Ne kombinovati popust, tri proizvoda, zdravstveni savet i dve lokacije u istoj objavi. Jedan caption ima samo jedan primarni CTA.
3. **Konkretno, ne generički.** Imenovati proverenu kategoriju/proizvod, potvrđenu akciju i, kada je važno, mesto ili rok. Ne koristiti prazne fraze poput „najbolja ponuda” ili „vaše zdravlje je na prvom mestu” bez informacije koja ih prati.
4. **Korist bez obećanja.** Pišemo o rutini, dostupnosti, praktičnosti i informacijama koje je potvrdio proizvođač ili farmaceut. Ne obećavamo izlečenje, rezultat ni „rešenje” zdravstvenog problema.
5. **Dijalog bez mamaca.** Pitanje, poziv da se objava sačuva ili podeli ima smisla samo kada se prirodno odnosi na sadržaj. Ne tražiti komentar radi komentara.
6. **Lokalnost i poverenje.** Kada su podaci potvrđeni, lokacija i stručni savet farmaceuta vrede više od agresivnog prodajnog jezika.

Meta u svojim aktuelnim smernicama naglašava da caption treba da doda kontekst vizualu, koristi relevantne ključne reči/hashtagove i završi se jasnim CTA-om; za Reels je najvažniji kratak hook na početku, a Story tekst treba da bude sažet i akcioni. [Meta — caption smernice](https://ai.meta.com/learn/ai-creativity/how-to-use-meta-ai-for-instagram-captions/)

## Glas brenda

| Koristiti | Izbegavati |
| --- | --- |
| „Dostupno u AU Šeki-Tilija apotekama.” | „Najbolje za vaše zdravlje!” |
| „Pitajte farmaceuta za savet prilagođen vama.” | „Ovo će rešiti vaš problem.” |
| „Pogledajte ponudu do [potvrđen datum].” | „Požurite, zalihe nestaju!” bez potvrde |
| „Za svakodnevnu negu / praktičnu rutinu.” | „Dokazano leči / garantuje rezultat.” |
| „Svratite u najbližu apoteku.” | „Kupite odmah!” kod zdravstveno osetljivih kategorija |

- Piši na srpskom, latinicom, uz obraćanje sa „vi”.
- Tekst mora biti pravopisno i gramatički ispravan. Ovo važi i za tekst koji ide na grafiku, Story i video, ne samo za caption.
- Ne koristi em crtu (`—`). Koristi tačku, zarez, dvotačku, zagradu ili novu rečenicu.
- Rečenice su kratke; jedan pasus ima najviše dve do tri rečenice.
- Emoji nisu obavezni. Podrazumevano ih ne koristiti; ako se koriste, najviše jedan do dva u celoj objavi i nikada kao zamenu za informaciju.
- Ne dodavati više od osam relevantnih hashtagova. U svakoj objavi mogu se ponoviti `#AUSekiTilia` i, kada je relevantno, potvrđeno mesto; ostali zavise od stvarne teme.

## Lokacije bez vizuelnog opterećenja

U opštoj objavi ne prepisuj kompletnu mrežu apoteka. Kada je relevantna dostupnost u mreži, koristi samo jednu završnu rečenicu: „Dostupno u AU Šeki-Tilia apotekama.”

Adresu, telefon i radno vreme navedi samo kada je objava lokalna i samo za taj ogranak, prema `brand/brand-config.json`. Ako podatak nedostaje, izostavi ga. Za stalni pregled svih lokacija usmeri na Story Highlight „Lokacije”, kada je ručno postavljen.

## Pravilo protiv generičkog AI teksta

Pre predaje, agent uklanja sve što može da zvuči kao prazna, univerzalna reklama. Posebno izbegava:

- „Vaše zdravlje je na prvom mestu”, „mali korak ka boljem sutra”, „otkrijte moć” i slične neodređene fraze;
- višestruke uzvičnike, hitnost bez potvrđenog razloga i superlative bez dokaza;
- nabrajanje opštih koristi koje nisu vezane za konkretan proizvod ili situaciju;
- pitanje na kraju objave koje nema prirodnu vezu sa sadržajem;
- ponavljanje iste poruke u grafici, videu i captionu bez nove korisne informacije.

Završni tekst mora da odgovori na tri pitanja: šta je konkretna informacija, zašto je korisna osobi koja prati profil i koji je jedan smislen sledeći korak.

## Svež sadržajni ugao

Za svaku novu objavu agent u `input.json` upisuje jedan `contentApproach` i u `copyFreshnessNote` konkretno objašnjava šta je novo u odnosu na poslednje tri objave. Dozvoljeni uglovi su: `offer-first`, `product-context`, `routine-moment`, `practical-guidance`, `seasonal-context`, `local-availability` i `professional-prompt`.

Isti ugao se ne koristi u poslednje tri objave. Agent ne menja samo prideve, redosled rečenica ili hashtagove, već menja stvarnu vrednost za publiku: na primer od potvrđene ponude ka praktičnoj rutini, od noviteta ka sezonskom kontekstu ili od opšte dostupnosti ka potvrđenoj lokalnoj informaciji. U svim formatima ostaju iste potvrđene činjenice, ali Feed, Story i Reels ne smeju biti ista poruka samo skraćena ili rastegnuta.

## Struktura po formatu

### Feed (Instagram i Facebook)

**Cilj:** kontekst + korist + jedan sledeći korak.

```text
[Hook: najvažnija potvrđena informacija ili korisna situacija]

[1–3 kratke rečenice konteksta. Samo proverene činjenice.]

[Jedan CTA.]

[3–8 relevantnih hashtagova]
```

Preporučena dužina: 50–120 reči. Prelomi redove radi čitljivosti. Za Facebook se može dodati jedna lokalna, praktična rečenica više, ali ne i novi zdravstveni savet.

### Reels

**Cilj:** hook pre prvog preloma teksta, zatim kratko objašnjenje i CTA.

```text
[Hook u prvoj rečenici]

[Jedna konkretna vrednost ili potvrđena ponuda.]

[CTA: sačuvajte / pogledajte / svratite / pitajte farmaceuta.]
```

Preporučena dužina: 25–70 reči. Ključna poruka mora biti i u samom videu, jer se Reels često gleda bez čitanja captiona. Reels je u 9:16 formatu, uvek ima nasumično izabranu odobrenu muzičku podlogu i drži ključne elemente unutar sigurnih margina, u skladu sa Meta preporukama. [Meta — Reels creative](https://www.facebook.com/business/ads/facebook-instagram-reels-ads)

### Story

**Cilj:** jedna radnja.

Tekst u Story-ju je dodatak vizualu, najčešće 3–12 reči. Primeri: „Pogledajte novu ponudu”, „Sačuvajte za kasnije”, „Svratite do najbliže apoteke”. Kada je prikladno, predložiti anketu ili pitanje, ne duži caption.

## Šabloni captiona

Tekst u uglastim zagradama agent popunjava isključivo potvrđenim podacima. Ako podatak nedostaje, agent ga izostavlja i upisuje u `review.md`.

### 1. Akcija na dozvoljen proizvod

Ovaj format koristi se samo kada su potvrđeni mehanika akcije, prikaziva vrednost, rok i izvor. Sam rok ili reč „akcija” nisu dovoljni. Ako mehanika nedostaje, paket ostaje blokiran ili korisnik eksplicitno menja nameru u neutralnu objavu dostupnosti.

```text
[Naziv/kategorija] je sada dostupan uz [potvrđen popust ili cenu].

[Jedna proverena, neutralna informacija o nameni ili karakteristici proizvoda.]

Ponuda važi do [datum] u [potvrđene lokacije]. Svratite do AU Šeki-Tilija apoteke i informišite se o ponudi.

#AUSekiTilia #[kategorija] #[mesto]
```

### 2. Novitet u ponudi

```text
Novo u AU Šeki-Tilija ponudi: [naziv ili kategorija].

[Jedna do dve proverene informacije: brend, linija, namenjena rutina ili dostupna varijanta.]

Za više informacija svratite do najbliže apoteke i pitajte farmaceuta.
```

### 3. Neutralan sezonski savet

```text
[Sezonska situacija] je dobar trenutak da osvežite svoju [rutinu / putnu torbicu / negu].

[2–3 praktične, neutralne stavke bez dijagnoze i terapijske preporuke.]

Sačuvajte objavu kao podsetnik, a za izbor proizvoda posavetujte se sa farmaceutom.
```

### 4. Nega i dermokozmetika

```text
Jednostavna rutina često počinje doslednošću.

[Potvrđena, nenametljiva informacija o kategoriji proizvoda ili koraku nege.]

U AU Šeki-Tilija apotekama možete pronaći [potvrđena kategorija]. Pitajte farmaceuta za pomoć pri izboru.
```

### 5. Lokacija i praktična informacija

```text
Blizu vas: AU Šeki-Tilija apoteka u [mesto/adresa].

Radno vreme: [potvrđeno radno vreme].
Telefon: [potvrđen telefon].

Vidimo se u apoteci.
```

## Matrica dozvoljenog sadržaja

| Kategorija | Copy pristup | Obavezna provera |
| --- | --- | --- |
| Kozmetika, dermokozmetika, higijena | karakteristike, rutina, dostupnost | tvrdnje i sastojci iz materijala proizvođača |
| Dodaci ishrani | kategorija, deklarisana/odobrena tvrdnja, dostupnost | izvor svake zdravstvene tvrdnje; ne predstavljati suplement kao lek |
| Medicinsko sredstvo | samo nakon posebne provere | pregled statusa i promotivnog materijala |
| Lek / antibiotik | ne generisati promociju | blokada |
| Informacija o lokaciji | adresa, radno vreme, kontakt | podaci iz centralne konfiguracije |

Srbija posebno uređuje zdravstvene izjave za hranu i dodatke ishrani, pa se takva tvrdnja ne preuzima sa konkurentskih profila niti iz opšteg znanja LLM-a: mora imati izvor u odobrenoj deklaraciji, materijalu proizvođača ili stručnoj proveri. [Ministarstvo zdravlja — propisi o zdravstvenim izjavama za hranu](https://www.zdravlje.gov.rs/tekst/342909/propisi.php), [registar dijetetskih proizvoda i zdravstvenih izjava](https://dijetetskiproizvodi.zdravlje.gov.rs/)

## Propisi koji imaju prednost nad marketinškim ciljem

- Zakon o zdravstvenoj zaštiti zabranjuje obmanjujuće oglašavanje zdravstvenih usluga, uporedno oglašavanje apotekarske delatnosti koje identifikuje konkurenta i određene promotivne poruke za lekove/medicinska sredstva koje narušavaju ugled profesije. [Zakon o zdravstvenoj zaštiti](https://www.zdravlje.gov.rs/tekst/350498/zakon-o-zdravstvenoj-zastiti.php)
- Za lekove ALIMS navodi da informacije moraju biti istinite, naučno zasnovane i neobmanjujuće; u ovom sistemu lekovi i antibiotici uopšte nisu promotivni sadržaj. [ALIMS — oglašavanje lekova](https://www.alims.gov.rs/humani-lekovi/oglasavanje-lekova/)
- Medicinska sredstva imaju zaseban režim oglašavanja; agent ih zato označava za stručnu proveru, a ne tretira kao običan maloprodajni proizvod. [ALIMS — medicinska sredstva](https://www.alims.gov.rs/medicinska-sredstva/oglasavanje-medicinskih-sredstava/)

## Obavezni izlaz agenta za svaki caption

`generated/caption.md` sadrži jedan gotov, univerzalan tekst za objavu: isti caption prati Feed, Story i Reels. Ne sadrži interne naslove, odvojene verzije po kanalu, tabelu izvora ni alternativne hookove. U tri kratka pasusa mora jasno navesti proizvod i akciju, dodati potvrđeni kontekst koji nije samo prepis grafike i završiti jednim prirodnim CTA-om, zatim relevantnim hashtagovima.

Agent uz njega popunjava `generated/copy-review.json`: primarnu radnju, potvrđenu vrednost, konkretnu informaciju koju caption dodaje vizualu, proveru činjenica i jezički pregled. Pre-flight blokira caption bez ovog dokaza, caption koji ponavlja samo grafiku ili tekst koji deli isti sadržaj na zasebne Feed, Story i Reels verzije.
