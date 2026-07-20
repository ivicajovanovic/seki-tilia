# Handoff — AU Šeki-Tilia produkcioni sistem

## Šta je ovo

Ovaj repo je lokalni, agent-pokretan sistem za izradu objava za AU Šeki-Tilija. Agent priprema sve materijale; korisnik ih na kraju ručno pregleda i objavljuje na Instagramu i Facebooku.

## Pročitaj pre bilo kakvog rada

1. `AGENTS.md` — obavezna pravila rada agenta.
2. `brand/brand-guide.md` — identitet brenda i bezbednosne granice.
3. `production/copy-playbook.md` — pravila za caption, hook i CTA.
4. `production/README.md` — folderi, renderovanje i provera.

## Kako obraditi zahtev: „Napravi novu objavu za AU Šeki-Tilija”

1. Sačuvaj kompletnu poruku klijenta u `brief.md` novog paketa objave.
2. Kreiraj paket:

   ```bash
   node production/scripts/create-post.mjs --slug "kratak-naziv-objave"
   ```

3. Sačuvaj originalne slike u `source/`, bez menjanja originala.
4. Popuni `input.json`, uključujući samo potvrđene činjenice, cenu/popust/rok i izvore za svaku tvrdnju.
5. Pripremi `generated/caption.md` prema copy priručniku i `video-props.json` za vizuale.
6. Ako nedostaje fotografija, direktno generiši potreban AI vizual. Samo ako to nije dostupno ili korisnik traži lokalni generator, napravi `generated/image-prompt.md` prema `production/image-prompt-guide.md`.
7. Uvezi generisanu ili korisnikovu sliku u `video-renderer/public/jobs/<id>/`, upiši `/jobs/<id>/ime-fajla` u `video-props.json`, pa renderuj Feed, Story i Reels u `final/`.
8. Popuni `review.md` i pokreni:

   ```bash
   node production/scripts/check-post.mjs --post productions/GGGG/MM/NNN-GGGG-MM-DD-naziv
   ```

9. Ako provera prođe, status je `SPREMNO ZA LJUDSKU PROVERU`. Ne objavljuj na društvene mreže.

## Šta sistem radi sada

| Stavka | Status |
| --- | --- |
| Organizacija po datumu i rednom broju | automatski |
| Pravila brenda i copy-ja u novoj chat sesiji | automatski, preko `AGENTS.md` |
| Caption, hook, CTA, hashtagovi i tekst za video | generiše LLM agent |
| Feed i Story PNG | renderuje Remotion nakon što agent popuni props |
| Kratak vertikalni Reels MP4 | renderuje Remotion nakon što agent popuni props |
| Pre-flight blokade | automatska skripta + obavezna ručna stručna provera |
| AI fotografija | podrazumevano: agent je direktno generiše; lokalni generator je rezervna opcija |
| Objavljivanje na Meta kanalima | ručno, nikada automatski |

## Važna ograničenja

- Sistem nema direktno povezivanje sa korisnikovim lokalnim generatorom slika, ali to više nije osnovni tok: agent koristi dostupno direktno generisanje slike. Lokalni generator se može naknadno povezati ako se dostavi njegov CLI ili API.
- Ne postoje još potvrđene adrese, telefoni i radna vremena; agent ne sme da ih izmišlja.
- Lekovi i antibiotici se ne promovišu. Medicinska sredstva, suplementi sa zdravstvenim tvrdnjama i svaka nejasna kategorija ostaju na ručnoj stručnoj proveri.
