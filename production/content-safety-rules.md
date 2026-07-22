# Provera sadržaja pre objave

## Obavezna blokada

Agent ne sme označiti materijal kao spreman ako je prisutno bilo šta od sledećeg:

- promocija leka ili antibiotika;
- nejasan status proizvoda;
- dijagnoza, preporuka terapije ili doziranja;
- tvrdnja o lečenju, izlečenju, garantovanom ili trenutnom rezultatu;
- nepotvrđena cena, procenat popusta, rok akcije, adresa, telefon ili radno vreme;
- objava označena kao akcija bez potvrđene mehanike, prikazive vrednosti, roka i izvora;
- osoba generisana veštačkom inteligencijom predstavljena kao stvarna zaposlena;
- zdravstvena tvrdnja bez izvora ili stručne provere.

## Dopuštena formulacija

Koristi neutralan i praktičan jezik, na primer:

- „Dostupno u AU Šeki-Tilija apotekama.”
- „Pitajte farmaceuta za savet prilagođen vašim potrebama.”
- „Pogledajte aktuelnu ponudu u najbližoj apoteci.”
- „Za svakodnevnu negu kože.”

Izbegavaj superlative i apsolutne tvrdnje.

## Format `review.md`

```markdown
# Provera objave

Status: SPREMNO ZA LJUDSKU PROVERU | BLOKIRANO

- [ ] Proizvod nije lek ni antibiotik / status je potvrđen.
- [ ] Sve informacije o proizvodu potiču od klijenta, proizvođača ili stručne osobe.
- [ ] Cena, popust i datum su potvrđeni ili nisu navedeni.
- [ ] Lokacijski podaci su potvrđeni ili nisu navedeni.
- [ ] Nema dijagnoze, terapijske preporuke ni obećanja rezultata.
- [ ] Vizual ne predstavlja generisanu osobu kao stvarnog zaposlenog.
- [ ] Logo, glavna poruka, ponuda, proizvod i CTA, kada postoje, jasno su vidljivi i kontrastni u svakom formatu.
- [ ] Tekst je jezički i vizuelno pregledan.

Napomene i nedostajući podaci:
```
