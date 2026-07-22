# Operativna mapa za LLM agente

Ovaj dokument je početna tačka rada u repou AU Šeki-Tilia. Služi da agent odmah zna koji je dokument izvor istine, kojim redosledom radi i gde upisuje rezultat. Završni sadržaj se nikada ne objavljuje automatski.

## Izvori istine

| Potreba | Obavezni izvor | Agent koristi za |
| --- | --- | --- |
| Redosled rada i nepregovariva pravila | `AGENTS.md` | obavezne korake, bezbednost, lokacije i izlazne fajlove |
| Identitet brenda | `brand/brand-guide.md` | paletu, Manrope, originalni logo, ton i vidljivost |
| Plan sadržaja | `brand/content-framework.md` | rubriku, format i ulogu objave u seriji |
| Potvrđeni podaci o ograncima | `brand/brand-config.json` | adresu, telefon i radno vreme samo za lokalnu objavu |
| Copy i bezbednost | `production/copy-playbook.md`, `production/content-safety-rules.md` | caption, CTA, hashtagove, tvrdnje i blokade |
| Dizajnerski sistem i varijacije | `brand/design-system.md` | familiju, `signature`, svežu intervenciju i proveru poslednje tri objave |
| Obavezni vizuelni skill | `agent-skills-required/visual-design/SKILL.md` | art direkciju, kompoziciju, obradu i pregled rendera |
| Odobrene reference | `brand/design-references/catalog.md` i dve slike iz istog foldera | kvalitet, ritam i produktnu scenu bez kopiranja sadržaja |
| Paket konkretne objave | `productions/.../<id>/` | jedini radni prostor za brief, izvore, generisane fajlove i finale |

Kada se dokumenti razlikuju, prednost imaju najnovije korisnikovo uputstvo, zatim `AGENTS.md`, potvrđene činjenice i bezbednosna pravila, pa brend i dizajnerski sistem. Referenca nikada ne nadjačava potvrđenu činjenicu ili bezbednosno pravilo.

## Obavezan tok rada

1. Pročitaj ovaj dokument, zatim `AGENTS.md` i sve dokumente koje on navodi.
2. Otvori novi paket komandom `node production/scripts/create-post.mjs --slug "kratak-naziv"`.
3. Doslovno sačuvaj korisnikov brief u `brief.md`, a originale bez izmene u `source/`.
4. Popuni `input.json`: potvrđene činjenice, izvore, format, `contentApproach` i `copyFreshnessNote`.
5. Za lokalnu objavu proveri `brand/brand-config.json`; za sve zdravstvene i produktne tvrdnje proveri izvor ili ih izostavi.
6. Pregledaj obe reference i poslednje tri evidentirane objave. Izaberi familiju i popuni `generated/design-direction.json`, uključujući dve stvarne dizajnerske intervencije, formatne adaptacije i Reels ritam kada postoji.
7. Napiši sadržaj prema `production/copy-playbook.md`, a tekst za grafiku i `video-props.json` prema potvrđenim činjenicama. Kada postoji Reels, `video-props.json.motionTreatment` mora doslovno odgovarati vrednosti u `design-direction.json`.
8. Napravi vizual i video. Za svaku korisnu informaciju ili navigaciju koristi odgovarajuću Lucide ikonu; ne koristi ikone kao dekoraciju.
9. Pregledaj Feed, Story i ključne Reels kadrove u punoj veličini i kao umanjeni prikaz telefona. Popuni `review.md`.
10. Pokreni `node production/scripts/check-post.mjs --post productions/GGGG/MM/<id>` i ispravi svaku blokadu pre statusa `SPREMNO ZA LJUDSKU PROVERU`.

## Pravilo sveže intervencije

Kontinuitet brenda nije dozvola za recikliranje istog posta. Svaka nova objava mora imati novu, dokumentovanu intervenciju u sadržaju i dizajnu.

- `contentApproach` određuje novi sadržajni ugao captiona i poruke; isti ugao ne koristi se u poslednje tri objave.
- `designInterventions` beleži najmanje dve stvarno promenjene osi dizajna, na primer redosled čitanja, položaj proizvoda, tretman ponude, dubina scene, kadar slike, tipografska kompozicija, CTA/footer, uloga ikone ili ritam videa.
- `motionTreatment` je obavezan kada paket ima Reels, upisuje se identično u `design-direction.json` i `video-props.json`, utiče na render i ne sme se ponoviti u poslednje tri Reels objave.
- `formatAdaptations` mora objasniti šta se menja između Feed-a, Story-ja i Reels-a. Isti raspored se ne sme samo rastegnuti na drugi format.

Pre-flight proverava ponovljeni `signature`, sadržajni ugao, kombinaciju dizajnerskih intervencija i Reels ritam. Opisna polja se proveravaju ručno u `review.md`: promena mora biti stvarna, ne samo druga boja, novi proizvod ili preformulisan isti tekst.

## Gde šta ide

```text
productions/.../<id>/
  brief.md                         # neizmenjen korisnikov brief
  input.json                       # činjenice, izvori i sadržajni ugao
  source/                          # neizmenjeni originali
  generated/caption.md             # radni caption i izvori tvrdnji
  generated/design-direction.json  # dizajnerske odluke i varijacije
  video-props.json                 # tekst i rekviziti renderer-a
  generated/                       # radni renderi, kadrovi i pregledi
  review.md                        # kontrolna lista i ručna provera
  final/                           # samo Feed PNG, Story PNG, Reels MP4 i caption
```

Ne ostavljaj izvore, radne rendere ni testove van paketa objave. Ne menjaj originale u `source/`. Ne objavljuj sadržaj automatski.
