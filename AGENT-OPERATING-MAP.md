# Operativna mapa za LLM agente

Ovaj dokument je početna tačka rada u repou AU Šeki-Tilia. Služi da agent odmah zna koji je dokument izvor istine, kojim redosledom radi i gde upisuje rezultat. Završni sadržaj se nikada ne objavljuje automatski.

## Izvori istine

| Potreba | Obavezni izvor | Agent koristi za |
| --- | --- | --- |
| Redosled rada i nepregovariva pravila | `AGENTS.md` | obavezne korake, bezbednost, lokacije i izlazne fajlove |
| Identitet brenda | `brand/brand-guide.md` | paletu, Manrope, originalni logo, ton i vidljivost |
| Operativna paleta i kontrast | `brand/color-palette.json` | dva izolovana seta boja, njihove renderer teme, obaveznu smenu setova, bezbedne tekstualne parove i odobrene `on-light`/`on-dark` logo kombinacije |
| Plan sadržaja | `brand/content-framework.md` | rubriku, format i ulogu objave u seriji |
| Potvrđeni podaci o ograncima | `brand/brand-config.json` | adresu, telefon i radno vreme samo za lokalnu objavu |
| Copy i bezbednost | `production/copy-playbook.md`, `production/content-safety-rules.md` | caption, CTA, hashtagove, tvrdnje i blokade |
| Obavezni copywriting skill | `agent-skills-required/copywriting/SKILL.md` | jasnoću, konkretnu vrednost, aktivan CTA i redakturu copy-ja u svim formatima |
| Životni ciklus materijala | `production/artifact-lifecycle.md` | privremeni ulaz, aktivni paket, arhiva i bezbedno uklanjanje |
| Dizajnerski sistem i varijacije | `brand/design-system.md` | familiju, `signature`, svežu intervenciju i proveru poslednje tri objave |
| Obavezni vizuelni skill | `agent-skills-required/visual-design/SKILL.md` | art direkciju, kompoziciju, obradu i pregled rendera |
| Odobrene reference | `brand/design-references/references.json`, `catalog.md` i četiri slike iz istog foldera | kvalitet, ritam i produktnu scenu bez kopiranja sadržaja |
| Paket konkretne objave | `productions/.../<id>/` | jedini radni prostor za brief, izvore, generisane fajlove i finale |

Kada se dokumenti razlikuju, prednost imaju najnovije korisnikovo uputstvo, zatim `AGENTS.md`, potvrđene činjenice i bezbednosna pravila, pa brend i dizajnerski sistem. Referenca nikada ne nadjačava potvrđenu činjenicu ili bezbednosno pravilo.

## Obavezan tok rada

1. Pročitaj ovaj dokument, zatim `AGENTS.md` i sve dokumente koje on navodi. Otvori novi paket, sačuvaj brief/originale, proveri assete i popuni potvrđene činjenice pre prvog produkcionog koraka.
2. **Korak 1, tekst i Feed:** pre copy-ja pročitaj obavezni lokalni copywriting skill, zatim pripremi caption, tekst za grafiku, props i tačno jedan Feed render u `generated/`. Nema paralelnih varijanti, alternativnih kadrova ni audit-rendera: agent bira jednu namernu kompoziciju i koriguje je pre zamene istog izlaznog fajla. Agent korisniku šalje tačno jednu rečenicu izveštaja i ne radi Story dok korisnik izričito ne odobri nastavak. Posle odobrenja evidentira ga: `node production/scripts/advance-post-stage.mjs --post <paket> --approve text-and-feed --report "Jedna rečenica."`.
3. **Korak 2, Story:** prilagodi odobreni sistem samo za Story i renderuj tačno jedan Story izlaz u `generated/`; bez varijanti ili paralelnih rendera. Agent opet šalje jednu rečenicu izveštaja i čeka izričito odobrenje, zatim evidentira korak sa `--approve story`.
4. **Korak 3, Reels:** tek nakon odobrenog Story-ja izradi tačno jedan Reels MP4 i njegov obavezni set od tri ključna kadra u `generated/`; kadrovi su dokazi jednog videa, ne varijante. Agent šalje jednu rečenicu izveštaja i čeka izričito odobrenje, zatim evidentira korak sa `--approve video`.
5. **Korak 4, finalizacija:** tek nakon sva tri odobrenja pokreni `node production/scripts/finalize-post.mjs --post <paket>`. Komanda kopira odobren caption, Feed, Story i Reels iz `generated/` u `final/`.
6. Posle finalizacije uradi obavezni finalni pregled, `prepare-visual-review.mjs`, nezavisan pregled i `check-post.mjs`. Ne menja se sadržaj posle generisanja hash dokaza bez novog pregleda.

## Pravilo sveže intervencije

Kontinuitet brenda nije dozvola za recikliranje istog posta. Svaka nova objava mora imati novu, dokumentovanu intervenciju u sadržaju i dizajnu.

- `contentApproach` određuje novi sadržajni ugao captiona i poruke; isti ugao ne koristi se u poslednje tri objave.
- `designInterventions` beleži najmanje dve stvarno promenjene osi dizajna, na primer redosled čitanja, položaj proizvoda, tretman ponude, dubina scene, kadar slike, tipografska kompozicija, CTA/footer, uloga ikone ili ritam videa.
- `motionTreatment` je obavezan kada paket ima Reels, upisuje se identično u `design-direction.json` i `video-props.json`, utiče na render i ne sme se ponoviti u poslednje tri Reels objave.
- Reels tekst animira samo ulazak i izlazak. Kada postane čitljiv, ostaje stabilan bez pulsa, plutanja, skaliranja ili pomeranja; kontinuirani pokret nose proizvod, ikone i pozadinski akcenti. Finalni MP4 mora imati ne samo audio stream već i merljivo čujnu nasumično izabranu MP3 podlogu.
- `colorSet` se obavezno smenjuje između `legacy` i `alternative`. Jedna objava koristi boje samo iz jednog seta; mešanje setova u temi, rendereru ili `palettePlan` zapisu je blokada. Originalni logo i boje na fotografiji proizvoda nisu deo ove zabrane i ne smeju se prebojiti.
- `validatedRenders` koristi tačne putanje: `final/feed-1080x1350.png`, `final/story-1080x1920.png`, `generated/reels-intro.png`, `generated/reels-offer.png` i `generated/reels-closing.png`.
- Review hashom zaključava input, props, design-direction, renderer, CSS, manifest, paletu, brend konfiguraciju, oba logo originala i renderer kopije, lokalne fontove, izabrani audio, package manifest/lock, sve četiri reference, rendere i finalni MP4. Svaka kasnija promena zahteva novo pokretanje `prepare-visual-review.mjs` i novi nezavisni pregled.
- Svaki zahtev proizvodi Feed, Story i Reels. `formatAdaptations` mora objasniti šta se menja između njih; isti raspored se ne sme samo rastegnuti.

Pre-flight proverava ponovljeni `signature`, sadržajni ugao, kombinaciju dizajnerskih intervencija i Reels ritam. Opisna polja se proveravaju ručno u `review.md`: promena mora biti stvarna, ne samo druga boja, novi proizvod ili preformulisan isti tekst.

## Gde šta ide

```text
productions/.../<id>/
  brief.md                         # neizmenjen korisnikov brief
  input.json                       # činjenice, izvori i sadržajni ugao
  source/                          # neizmenjeni originali
  generated/caption.md             # radni caption i izvori tvrdnji
  generated/design-direction.json  # dizajnerske odluke i varijacije
  generated/asset-review.json       # hash, tehnički pregled i vizuelni defekti izvora
  generated/quality-review.json     # referentni prag, revizija i nezavisni verdict
  generated/*-comparison.png        # obavezni vizuelni dokazi poređenja
  video-props.json                 # tekst i rekviziti renderer-a
  generated/                       # radni renderi, kadrovi i pregledi
  review.md                        # kontrolna lista i ručna provera
  final/                           # samo Feed PNG, Story PNG, Reels MP4 i caption
```

Ne ostavljaj izvore, radne rendere ni testove van paketa objave. Ne menjaj originale u `source/`. Ne objavljuj sadržaj automatski.
