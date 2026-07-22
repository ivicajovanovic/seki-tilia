# Operativni okvir sadržaja

## Mesečni ritam

Za Instagram i Facebook priprema se isti osnovni materijal:

- 12 feed objava mesečno;
- 4 Reels videa mesečno;
- Story verzija po potrebi, izvedena iz feed objave ili Reels-a.

Preporučena raspodela za jedan mesec:

| Rubrika | Feed | Reels |
| --- | ---: | ---: |
| Akcije i promocije | 3 | 1 |
| Noviteti | 2 | 1 |
| Nega / dermokozmetika | 2 | 1 |
| Edukativni sezonski sadržaj | 2 | 1 |
| Bebi/dečji program | 1 | – |
| Lokalna apoteka / praktična informacija | 1 | – |
| Savet farmaceuta (uz proveru) | 1 | – |

Raspodela je početna smernica, ne obaveza: aktuelne akcije klijenta imaju prednost.

## Kontinuitet bez ponavljanja

Mesečni ritam gradi prepoznatljivost, ali nijedna uzastopna objava ne sme biti ista poruka ili isti vizuelni obrazac uz drugi proizvod. Za svaku novu objavu agent bira drugačiji `contentApproach`, najmanje dve `designInterventions` i, kada postoji Reels, drugačiji `motionTreatment` od poslednje tri objave. Ta pravila, dozvoljene vrednosti i pre-flight provera nalaze se u `brand/design-system.md` i `AGENT-OPERATING-MAP.md`.

## Mreža lokacija

Mreža apoteka treba da bude lako dostupna, ali ne sme da optereti redovne objave.

- Za opšte akcije, proizvode i savete koristi samo diskretnu poruku: „Dostupno u AU Šeki-Tilia apotekama.”
- Kompletne podatke o jednoj apoteci koristi samo u lokalnoj objavi ili kada osoba treba da dođe do konkretnog ogranka.
- Za stalni pregled mreže predlaži ručno objavljeni Story Highlight „Lokacije”, sa jednom do tri lokacije po Story-ju i samo potvrđenim adresama, telefonima i radnim vremenom.
- Povremena objava „Gde se nalazimo?” može biti carousel ili serija Story-ja. Ne pretvaraj je u stalni footer redovnih objava.
- U Reels-u koristi lokacijski završni kadar samo kada je lokacija relevantna za poruku. Ne prikazuj kompletnu listu ogranaka na kraju videa.

## Ulaz za jednu objavu

Za svaku objavu dovoljno je poslati:

```text
Tip: akcija | novitet | savet | lokacija | sezonsko
Proizvod/brend:
Informacije od klijenta:
Cena / popust / rok akcije:
Mehanika akcije i izvor potvrde:
Lokacija (ako je relevantno): sve | 1 | 2 | 3
Fotografije: putanje ili fajlovi
Željeni formati: feed | story | reels
Napomena za stručnu proveru:
```

## Paket koji sistem pravi

```text
izvozi/GGGG-MM-DD-slug-objave/
  feed-1080x1350.png
  story-1080x1920.png
  reels-1080x1920.mp4
  caption.md
  input.json
  review.md
```

`review.md` jasno navodi korišćene tvrdnje, izvor informacija, nedostajuće podatke i stavke koje traže ručnu proveru.

## Kontrolna lista pre objave

- Da li je proizvod dozvoljen za promociju?
- Da li su mehanika, prikaziva vrednost, rok i izvor akcije potvrđeni?
- Da li su zdravstvene tvrdnje proverene ili uklonjene?
- Da li je odabrana ispravna lokacija i njen kontakt?
- Da li je lokacijski podatak relevantan za ovu objavu, bez nepotrebnog spiska svih ogranaka?
- Da li je tekst na grafici čitljiv na telefonu?
- Da li su logo, glavna poruka, ponuda, proizvod i CTA, kada postoje, jasno vidljivi i kontrastni u svakom formatu?
- Da li caption sadrži jasan, nenametljiv poziv na akciju?
- Da li je stručna osoba pregledala objavu kada je to potrebno?
