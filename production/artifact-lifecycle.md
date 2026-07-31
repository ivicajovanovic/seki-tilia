# Životni ciklus produkcionih artefakata

Ovaj dokument određuje gde žive privatni materijali, radni renderi i istorijske objave. Ne menja pravilo da se nijedan sadržaj ne objavljuje automatski.

## Aktivna objava

Aktivna objava je celina sa istim ID-jem na dve lokacije:

```text
productions/GGGG/MM/<id>/
video-renderer/public/jobs/<id>/
```

Paket sadrži brief, neizmenjene originale, manifest, dokaz pregleda i `final/`. Job folder sadrži samo kopiju asseta na koju pokazuje `video-props.json`. Ta dva dela se nikada ne brišu ili arhiviraju odvojeno.

## Stanja paketa

- `draft`: rad je u toku i nije spreman za pregled.
- `SPREMNO ZA LJUDSKU PROVERU`: pre-flight i nezavisni vizuelni pregled su završeni. Ovo nije dozvola za automatsku objavu.
- `published`: čovek je potvrdio ručnu objavu. Status se upisuje u `review.md` samo kada ga korisnik potvrdi.
- `archived`: paket više nije aktivan uzor, ali se čuva lokalno kao istorija.

Interni validacioni paketi ostaju u aktivnoj strukturi dok se ne zamene verzionisanim, sintetičkim fixture-om. Ne koriste se kao dokaz o objavljenom sadržaju.

## Arhiviranje

Pre arhiviranja se napravi lokalna struktura:

```text
archive/legacy/GGGG-MM/
  production/<id>/
  renderer-jobs/<id>/
  root-input/
  manifest.md
```

`manifest.md` za svaki predmet sadrži prethodnu putanju, SHA-256, razlog arhiviranja i datum. Arhiva je privatna i ostaje van Git-a. Ne brišu se finali, originali ni review dokazi pre nego što je paket kao celina premešten i provereno je da više nije referenciran.

## Brisanje

Trajno se uklanja samo fajl koji je potvrđeni duplikat ili nema referencu, nema istorijsku vrednost i za koji je korisnik dao potvrdu. Kada je moguće, prvo se koristi korpa sistema ili lokalna arhiva.

## Ulazni materijali

Novi, još nerazvrstani privatni materijali idu u `client-assets/inbox/`. Kada je brief otvoren, original se bez izmene kopira u `productions/.../<id>/source/`. Fotografije trajnih lokacija ostaju u `client-assets/locations/<id-lokacije>/`.
