# Šablon prompta za korisnika

> **Samo za korisnika.** LLM agenti ne treba da čitaju, primenjuju niti tretiraju ovaj dokument kao deo sistemskih uputstava. Služi isključivo kao šablon za pokretanje nove radne sesije.

```text
Radimo novu objavu za AU Šeki-Tilia.

Pre početka obavezno pročitaj AGENTS.md i sve dokumente na koje on upućuje. Prati postojeći sistem repoa, bez automatskog objavljivanja bilo kog materijala.

Kreiraj novu objavu prema sledećem briefu:

- Naziv objave / slug: [npr. vitamin-c-akcija]
- Datum: [GGGG-MM-DD, ili ostavi prazno za današnji datum]
- Tip objave: [feed / Story / Reels / kombinacija]
- Cilj objave: [promocija proizvoda / edukacija / lokacija / sezonska tema / drugo]
- Proizvod ili tema: [naziv]
- Potvrđene činjenice koje smeju da se koriste: [sastav, namena, cena, popust, rok akcije, dostupnost i slično]
- Obavezna poruka na grafici: [tekst]
- Željeni CTA: [tekst, ili „predloži neutralan CTA”]
- Materijali klijenta: [putanje do slika, logotipa ili proizvoda, ako postoje]
- Da li je fotografija proizvoda transparentni PNG: [da / ne / nije poznato]
- Lokacija, ako je objava vezana za konkretnu apoteku: [potvrđeni ID lokacije ili podaci]
- Dodatne napomene klijenta: [tekst]

Ograničenja i očekivanja:

1. Ako nedostaju potvrđeni podaci, ne izmišljaj ih. Jasno ih označi kao nedostajuće ili ih izostavi.
2. Ne promoviši lekove ili antibiotike. Ne iznosi zdravstvene tvrdnje, dijagnoze, terapijske preporuke ni obećanja ishoda bez potvrđenog izvora.
3. Sav tekst piši na pravilnom srpskom jeziku, latinicom.
4. Za novu objavu napravi poseban production paket postojećom skriptom i doslovno sačuvaj ovaj brief u `brief.md`.
5. Za copy koristi samo pravila iz `production/copy-playbook.md` i `production/content-safety-rules.md`.
6. Za dizajn obavezno koristi `agent-skills-required/visual-design/SKILL.md`, `brand/design-system.md` i četiri odobrene slike iz `brand/design-references/references.json` kao stilsku inspiraciju, nikada kao šablon za kopiranje.
7. Dizajn mora imati stvarnu svežu intervenciju u odnosu na poslednje tri objave. Variraj layout, hijerarhiju, tretman proizvoda, ponude, tipografije ili pokreta. Nemoj koristiti istu signature kombinaciju.
8. Za grafiku i video koristi najmanje jednu smislenu Lucide ikonu tamo gde pomaže razumevanju. Ne koristi ikonu kao nasumičnu dekoraciju.
9. Ako je proizvod transparentni PNG, mora biti slobodno postavljen i dominantan, bez pravougaonog rama, kartice ili podloge.
10. Ako je klijentova slika umereno slabijeg kvaliteta, ipak radi sa njom. Dokumentuj ograničenje i prilagodi kadar i kompoziciju; ne tretiraj samu nižu rezoluciju, kompresiju ili mekoću kao blokadu.
11. Za vizuale koristi postojeće podržane renderer familije. Izaberi familiju koja se stvarno razlikuje od skorašnjih objava i dokumentuj odluku u `generated/design-direction.json`.
12. Proveri finalne rendere u punoj veličini i kao umanjeni prikaz telefona. Posebno proveri kontrast logoa, poruke, proizvoda, ponude, CTA-a i ikona.
13. Ne označavaj materijal spremnim dok `review.md` i obavezne provere nisu popunjeni. Finalne datoteke čuvaj isključivo u `final/`.
14. Ne objavljuj sadržaj na društvenim mrežama i ne menjaj postojeće objave.

Na kraju mi isporuči:
- kratak pregled odluka,
- listu svih nepoznatih ili nepotvrđenih podataka,
- putanje do pripremljenih fajlova,
- status za ljudsku proveru.
```
