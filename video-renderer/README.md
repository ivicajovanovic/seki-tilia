# AU Šeki-Tilia Remotion renderer

Ovaj folder sadrži Remotion šablone koji od odobrenog `video-props.json` prave:

- Feed PNG (`1080×1350`)
- Story PNG (`1080×1920`)
- 12-sekundni promo Reels MP4 (`1080×1920`)

Za kompletan produkcioni tok pročitaj [`../production/README.md`](../production/README.md).

## Lokalni rad

```bash
npm install
npm run dev
```

Za proveru koda:

```bash
npm run lint
```

Ne čuvati stvarne materijale klijenata u ovom folderu osim u `public/jobs/`; taj folder je namerno ignorisan u Git-u.
