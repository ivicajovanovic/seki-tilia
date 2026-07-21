# Dizajnerski sistem za seriju objava

Ovaj dokument pretvara brend vodič i vizuelne reference u operativna pravila za agente i renderer. Cilj je prepoznatljiv AU Šeki-Tilia identitet bez ponavljanja iste grafike.

## Nepromenjivi elementi

- Koristi se samo originalni logo iz `logos/`. Znak se nikada ne prebojava, rasteže niti postavlja direktno na limeta, fotografsku ili drugu nekontrolisanu podlogu.
- Znak bez naziva (`logo3.svg`) u rendereru uvek stoji na zasebnoj svetloj krem kartici. Time su vidljiva oba njegova originalna dela, petrol i limeta.
- Jedina porodica teksta na AU Šeki-Tilia vizualima je **Manrope**. Naslov koristi 700 ili 800, a ostali tekst 400, 500 ili 600. Renderer eksplicitno učitava oba potrebna latin podskupa iste Manrope porodice i ne koristi zamenski font.
- Paleta ostaje petrol, krem, limeta, bež i ugalj. Jedan vizual koristi najviše jedan dominantan akcenat i ne pretvara limetu u pozadinu za logo.
- Obavezni elementi ostaju čitljivi na punoj veličini i u približno 25% prikazu telefona: logo, glavna poruka, ponuda, proizvod i CTA kada postoje.

## Dizajnerske familije

Za akcije, novitete i proizvode postoje četiri različite kompozicione familije. Izaberi onu koja najbolje odgovara briefu, proizvodu i poslednjim objavama.

| Familija | Namena i vizuelna logika | Ne koristiti uzastopno sa |
| --- | --- | --- |
| `product-atelier` | Proizvod kao studijski heroj u organskom bež prozoru. Jasna, mirna hijerarhija za jednu ponudu. | istom familijom ili istim tretmanom ponude u naredne tri objave |
| `editorial-split` | Asimetrična tekstualna kolona i proizvod u velikom organskom isečku. Više ritma, ali jedna dominantna poruka. | `product-atelier` sa sličnim položajem proizvoda |
| `minimal-offer` | Tipografija i potvrđena ponuda nose kadar, proizvod je manji dokaz u kontrolisanoj kartici. Za kratke akcije i novitete. | drugom minimalnom objavom sa istim CTA modulom |
| `product-card` | Proizvod na krem kartici preko petrol polja, sa jasnim modularnim odnosom ponude i CTA-a. Za proizvod koji ima upečatljivo pakovanje. | istom kartičnom strukturom u naredne tri objave |

Familije se ne smeju svoditi na promenu boje istog šablona. Menjaju se čitanje kompozicije, odnos tipografije i proizvoda, položaj ponude i tretman praznog prostora. Brend margine, font, logo-kartica i ton ostaju konzistentni.

## Reference i odluka za objavu

Pre dizajna agent pregleda `brand/design-references/`. Za svaku objavu popunjava `generated/design-direction.json` sa:

- izabranom familijom i jedinstvenim `signature` zapisom;
- najmanje jednom korišćenom referencom i dve konkretne dizajnerske osobine preuzete kao inspiracija;
- kratkim opisom po čemu se objava razlikuje od poslednje tri;
- potvrdom da je logo na `cream-card` površini i da se koristi rendererova Manrope porodica `AUSekiManrope`;
- listom finalnih rendera pregledanih na punoj veličini i u umanjenom prikazu.

Reference služe samo za kompoziciju, ritam, odnos slike i teksta, obradu i kvalitet. Nikada se iz njih ne preuzimaju copy, proizvod, publika, tvrdnje, cena, rok, CTA ni tuđi brend elementi.

## Zaštita od monotonije

Pre-flight poredi `signature` aktuelne objave sa tri poslednje evidentirane objave. Ako se ponovi, paket se blokira dok agent ne izabere stvarno drugačiju familiju ili kombinaciju modula. Isti proizvod može dobiti novu kompoziciju; novi proizvod ne sme automatski dobiti staru.

## Finalna vizuelna provera

Pre statusa `SPREMNO ZA LJUDSKU PROVERU` agent mora:

1. pregledati Feed i Story u punoj veličini i kao umanjeni telefon-prikaz;
2. pregledati uvodni, ponudni i završni kadar Reels-a;
3. proveriti da je originalni logo celovit na krem kartici;
4. proveriti da je Manrope stvarno učitan tokom rendera; ako ne može da se učita, render mora ostati blokiran umesto da pređe na zamenski font;
5. upisati konkretna imena rendera u `design-direction.json` i `review.md`.
