# AU Šeki-Tilia: agent-pokretan studio za društvene mreže

Lokalni produkcioni sistem za pripremu Instagram i Facebook sadržaja za mrežu apoteka AU Šeki-Tilija. Namenjen je čoveku koji vodi društvene mreže i LLM agentima koji izrađuju materijale u ovom repou.

Sistem **ne objavljuje automatski** na društvene mreže. Agent priprema kompletan paket, a čovek proverava i ručno objavljuje.

## Šta agent izrađuje iz jednog briefa

- Feed grafiku — `1080×1350` PNG
- Story grafiku — `1080×1920` PNG
- Kratak vertikalni Reels — `1080×1920` MP4
- Instagram/Facebook caption, Reels caption, Story tekst i hashtagove
- AI vizual kada nema odgovarajuće fotografije
- `review.md` sa sadržajnom, operativnom i bezbednosnom proverom

## Preuzimanje i pokretanje na drugom računaru

Repo sadrži kompletan sistem, šablone, logo, skripte i zaključane JavaScript zavisnosti. Ne sadrži privatne briefove, fotografije klijenta niti gotove objave, jer oni ostaju lokalni na računaru sa kog radiš.

Potrebni su Git, Node.js 20 ili noviji i Codex/LLM agent koji ima pristup fajlovima repoa i generisanju slika.

```bash
git clone https://github.com/ivicajovanovic/seki-tilia.git
cd seki-tilia/video-renderer
npm ci
npm run lint
cd ..
```

Posle toga otvori root folder `seki-tilia` u Codex-u. `AGENTS.md` i `HANDOFF.md` daju agentu sav potreban kontekst za rad.

## Brz početak nove objave

Otvori novu Codex/LLM sesiju u root-u ovog repoa i pošalji:

```text
Napravi novu objavu za AU Šeki-Tilija.
Ovo je poruka klijenta: [nalepi tekst, zahteve i potvrđene podatke]
```

Po potrebi priloži fotografije proizvoda ili apoteke. Agent će napraviti numerisan paket u `productions/GGGG/MM/`, pripremiti materijale i na kraju navesti tačnu putanju do finalnih fajlova i eventualnih stavki za ručnu proveru.

## Kako sistem radi

```text
Klijentov brief + fotografije
        ↓
LLM agent: brend pravila, copy i provera tvrdnji
        ↓
AI vizual kada nedostaje odgovarajuća fotografija
        ↓
Remotion: Feed PNG + Story PNG + Reels MP4
        ↓
Automatski pre-flight check + ljudska/stručna provera
        ↓
Ručna objava na Instagramu i Facebooku
```

## Obavezni dokumenti za agenta

| Dokument | Svrha |
| --- | --- |
| [HANDOFF.md](HANDOFF.md) | Kratko operativno preuzimanje sistema u novoj sesiji |
| [AGENTS.md](AGENTS.md) | Obavezna pravila rada, organizacija fajlova i bezbednost |
| [brand/brand-guide.md](brand/brand-guide.md) | Identitet brenda, paleta, logo, ton i pravila vizuala |
| [brand/design-system.md](brand/design-system.md) | Familije kompozicija, logo podloga, tipografija i zaštita od monotonije |
| [production/copy-playbook.md](production/copy-playbook.md) | Copy pravila, CTA, strukture i šabloni captiona |
| [production/README.md](production/README.md) | Kreiranje paketa, render i validacija |

Ako tvoj LLM alat ne učitava automatski `AGENTS.md`, u prvom zahtevu dodaj: „Prvo pročitaj `HANDOFF.md` i `AGENTS.md`.”

## Za ljude koji rade u projektu

### Nova objava

Agent normalno otvara paket komandom:

```bash
node production/scripts/create-post.mjs --slug "kratak-naziv-objave"
```

Svaka objava ima zaseban folder sa originalima, radnim fajlovima, finalnim materijalima, captionom i proverom. Izvorni materijali klijenta se ne menjaju.

### Video renderer

```bash
cd video-renderer
npm install
npm run dev
```

Remotion šabloni izvoze Feed, Story i 12-sekundni promo Reels. Detaljne komande za render su u [production/README.md](production/README.md).

### Pre-flight provera

Pre završne predaje agent pokreće:

```bash
node production/scripts/check-post.mjs --post productions/GGGG/MM/NNN-GGGG-MM-DD-naziv
```

Skripta prepoznaje očigledne blokade, poput praznih podataka, nepotvrđene akcije i rizičnih formulacija. Ona **ne zamenjuje** stručnu proveru farmaceuta.

## Granice sistema

- Lekovi i antibiotici se ne promovišu.
- Zdravstvene i produktne tvrdnje moraju imati proverljiv izvor.
- Medicinska sredstva i nejasne kategorije traže dodatnu proveru.
- AI generisana osoba nikada se ne predstavlja kao stvarna zaposlena.
- Cene, rokovi akcija, adrese, telefoni i radno vreme koriste se samo kada su potvrđeni.
- Produkcioni paketi i klijentovi originalni materijali namerno nisu u Git-u; ostaju lokalni.

## Struktura

```text
brand/           # identitet, pravila i konfiguracija lokacija
logos/           # vektorski i PNG logo brenda
production/      # workflow, copy pravila, bezbednost i skripte
productions/     # lokalni paketi stvarnih objava (ignorisani u Git-u)
video-renderer/  # Remotion šabloni za PNG i MP4
AGENTS.md        # obavezna pravila za LLM agente
HANDOFF.md       # početna tačka za novu sesiju
```
