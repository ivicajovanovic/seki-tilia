# AU Šeki-Tilia Remotion renderer

Ovaj folder sadrži Remotion šablone koji od odobrenog `video-props.json` prave:

- Feed PNG (`1080×1350`)
- Story PNG (`1080×1920`)
- standardni promo Reels MP4 (`reel-v1`, `1080×1920`)
- eksplicitno izabrani desetosekundni kumulativni Reels (`reel-v2`, `1080×1920`, 24 fps)

Za kompletan produkcioni tok pročitaj [`../production/README.md`](../production/README.md).

## Lokalni rad

```bash
npm install
npm run dev
```

Za proveru koda:

```bash
npm run lint
npm run build
```

Ne čuvati stvarne materijale klijenata u ovom folderu osim u `public/jobs/`; taj folder je namerno ignorisan u Git-u.

Renderer koristi samo lokalne Manrope WOFF2 fajlove iz `public/assets/`, tako da render ne zavisi od dostupnosti Google Fonts mreže. Standardne muzičke numere dolaze preko `public/mp3` veze ka root `public/mp3/`; njihovo poreklo i status prava opisani su u `../public/mp3/README.md`.

`colorScheme` u `video-props.json` bira jednu od šest tema iz `brand/color-palette.json > rendererThemes`. Renderer direktno učitava taj izvor istine, pa novi tonovi i bezbedne kombinacije stvarno menjaju Feed, Story i Reels, a ne ostaju samo dokumentacija.

`SekiTiliaReelV2` se ne bira automatski. Produkcioni wrapper ga koristi samo kada su `input.requestedVideoStyle`, `video-props.videoTemplate` i `generated/design-direction.json.videoTemplate` eksplicitno postavljeni na `reel-v2`. Sav tekst, vizueli i podaci u `reelV2` objektu moraju poticati iz aktuelnog briefa. Ovaj template trajno koristi slobodan proizvod bez podijuma, jedan slide-up/fade sloj po tekstualnom elementu bez trail kopija, outline MapPin sa vidljivim centrom, adaptivnu veličinu dužih naslova i normalizovano `staticFile()` učitavanje `/jobs/` asseta.
