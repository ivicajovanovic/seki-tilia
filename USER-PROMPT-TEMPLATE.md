# Prompt za novu objavu

Ovaj tekst kopiraj u novu Codex/LLM sesiju. Uz poruku priloži fotografiju ili PNG proizvoda kada ga imaš. Polja u uglastim zagradama popuni, a nepoznato ostavi prazno.

```text
Radimo novu objavu za AU Šeki-Tilia.

Pre rada pročitaj `HANDOFF.md`, `AGENT-OPERATING-MAP.md`, `AGENTS.md` i dokumente na koje oni upućuju. Prati postojeći sistem. Ne objavljuj ništa automatski.

Korisnikov brief, sačuvaj ga doslovno u `brief.md`:
[ovde nalepi poruku klijenta, bez prepravljanja]

Podaci za objavu:
- Slug: [kratak-naziv-objave]
- Datum: [GGGG-MM-DD ili ostavi prazno]
- Formati: [Feed + Story + Reels / samo Feed / drugo]
- Cilj: [akcija / novitet / produktna objava / sezonski savet / lokacija]
- Proizvod ili tema: [naziv]
- Obavezna poruka na grafici: [tekst ili „predloži”]
- Željeni CTA: [tekst ili „predloži neutralan CTA”]
- Potvrđene činjenice koje smeš da koristiš: [navedi samo proverene podatke i njihov izvor]
- Lokacija: [ID lokacije iz brand-config.json, samo ako je lokalna objava]

Ako je akcija, obavezno navodim:
- mehaniku: [npr. 20% popusta, 1+1, cena]
- prikazivu vrednost: [cena/popust/poklon]
- rok: [datum]
- lokacije na kojima važi: [potvrđene lokacije]
- izvor potvrde: [ko je potvrdio ili dokument]

Materijali koje sam priložio uz ovu poruku:
- [naziv slike / opis]
- Tip slike: [transparentni PNG / fotografija / nije poznato]
- Dodatna napomena o slici: [npr. koristiti samo prednju stranu pakovanja]

Dodatne napomene klijenta:
[tekst ili „nema”]

Zadatak:
1. Otvori novi production paket postojećom skriptom. Sačuvaj priložene originale bez izmene u `source/`.
2. Koristi samo potvrđene činjenice. Ne izmišljaj cenu, popust, rok, lokaciju, sastojke, dostupnost ni zdravstvenu korist. Lekove i antibiotike ne promoviši.
3. Ako je podatak potreban za akciju, a nije potvrđen, ne predstavljaj objavu kao akciju. Jasno ga označi kao nedostajući.
4. Primeni kompletan asset, copy, dizajn, render i review tok iz sistema. Za vizual poštuj paletu i kontrast, logo bez pravougaone podloge, zabranu senki i blur-a, kao i pravila za transparentni proizvod i podijum.
5. Ne označavaj rad spremnim dok nisu završeni obavezni review i pre-flight. Finalne fajlove čuvaj samo u `final/`.

Na kraju mi isporuči:
- kratko obrazloženje kreativne odluke;
- spisak nedostajućih ili nepotvrđenih podataka;
- putanje do Feed, Story, Reels i caption fajlova;
- status: `SPREMNO ZA LJUDSKU PROVERU` ili jasno objašnjenje blokade.
```

Za neutralnu objavu nisu potrebni cena, popust i rok. Za lokalnu objavu koristi samo potvrđeni ID lokacije, ne slobodno upisanu adresu ili telefon.
