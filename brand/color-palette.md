# Operativna paleta

Izvor je [paleta.jpg](../paleta.jpg). `brand/color-palette.json` je mašinski čitljiv izvor istine za izbor boja u grafici, videu, promptovima i dizajnerskom smeru.

## Obavezan izbor boja

Pre prvog drafta agent bira `palettePlan` u `generated/design-direction.json`: pozadinu, površinu, tekst, akcenat i kontrolisanu podlogu za logo. Može da počne od jednog od `suggestedSchemes` iz JSON-a ili da sastavi novu kombinaciju od devet dozvoljenih tonova, ako je svaki tekstualni par naveden u `safeTextPairs`.

Za normalan tekst, CTA, cenu, datum, naslov ili funkcionalnu ikonicu potrebna je kontrastna vrednost od najmanje 4,5:1. Parovi u `largeTextOnlyPairs` dozvoljeni su samo za krupan naslov ili krupnu dekorativnu reč, nikada za pomoćni tekst, CTA ili sitnu informaciju.

## Logo

Originalni znak se ne prebojava i nema belu ili krem karticu. Varijanta `on-light` koristi `logo-tamniji.svg` na odobrenoj svetloj kontrolisanoj pozadini, a `on-dark` koristi `logo-svetliji.svg` na odobrenoj tamnoj kontrolisanoj pozadini. Dozvoljene veze vode se u `approvedLogoPlacements` u JSON izvoru istine. Logo se ne postavlja direktno na limeta niti na fotografsku ili drugu nepredvidivu teksturu.

## Zabranjene kombinacije

- svetli tekst na `icy-tundra`, `deer-run`, `slate-gray` ili `moss-gray` površini;
- tamni tekst na `black-is-back`, `royal-neptune` ili `steel-blue` površini;
- limeta tekst na `riviera-sea` ili bilo kojoj svetloj površini;
- pogrešna varijanta logoa za neposrednu pozadinu;
- logo na limeta ili fotografski nekontrolisanoj pozadini.

Riviera Sea i neutralni sivi tonovi mogu da grade površinu, krug, gradijent ili dekorativni ritam. Ne nose sitan tekst ako njihov par nije eksplicitno bezbedan u JSON-u.
