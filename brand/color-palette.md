# Operativna paleta

Izvori su [paleta.jpg](../paleta.jpg) i [boje-dodatak.jpg](../public/boje-dodatak.jpg). Drugi izvor dodaje Abyssal Teal `#2C3638`, Matcha `#D0D1AF` i Desert Khaki `#DBCCB7`; prvobitnih devet boja ostaje neizmenjeno. `brand/color-palette.json` je mašinski čitljiv izvor istine.

## Obavezan izbor boja

Pri otvaranju paketa sistem nasumično bira `colorScheme` iz šest bezbednih `rendererThemes`. Agent proverava da li tema odgovara proizvodu i može je nasumično zameniti drugom kompatibilnom temom. `colorScheme` mora biti isti u `video-props.json` i `generated/design-direction.json`, a `palettePlan` mora doslovno odgovarati izabranoj temi. Ukupno je dostupno dvanaest tonova; samostalna kombinacija je dozvoljena tek kada se doda kao proverena `rendererThemes` tema.

Za normalan tekst, CTA, cenu, datum, naslov ili funkcionalnu ikonicu potrebna je kontrastna vrednost od najmanje 4,5:1. Parovi u `largeTextOnlyPairs` dozvoljeni su samo za krupan naslov ili krupnu dekorativnu reč, nikada za pomoćni tekst, CTA ili sitnu informaciju.

## Logo

Originalni znak se ne prebojava i nema belu ili krem karticu. Varijanta `on-light` koristi `logo-tamniji.svg` na odobrenoj svetloj kontrolisanoj pozadini, a `on-dark` koristi `logo-svetliji.svg` na odobrenoj tamnoj kontrolisanoj pozadini. Dozvoljene veze vode se u `approvedLogoPlacements` u JSON izvoru istine. Logo se ne postavlja direktno na limeta niti na fotografsku ili drugu nepredvidivu teksturu.

## Zabranjene kombinacije

- svetli tekst na `icy-tundra`, `deer-run`, `slate-gray`, `moss-gray`, `matcha` ili `desert-khaki` površini;
- tamni tekst na `black-is-back`, `royal-neptune`, `steel-blue` ili `abyssal-teal` površini;
- limeta tekst na `riviera-sea` ili bilo kojoj svetloj površini;
- pogrešna varijanta logoa za neposrednu pozadinu;
- logo na limeta ili fotografski nekontrolisanoj pozadini.

Riviera Sea i neutralni sivi tonovi mogu da grade površinu, krug, gradijent ili dekorativni ritam. Ne nose sitan tekst ako njihov par nije eksplicitno bezbedan u JSON-u.
