# Operativna paleta

Izvori su [paleta.jpg](../paleta.jpg) i početna vizuelna beleška [boje-dodatak.jpg](../public/boje-dodatak.jpg). Korisnik je naknadno potvrdio važeće vrednosti: Abyssal Teal `#063F48`, Matcha `#BDCCA5` i Desert Khaki `#F8E4C9`. Ove vrednosti imaju prednost nad starim natpisima na JPG-u; prvobitnih devet boja ostaje neizmenjeno. `brand/color-palette.json` je mašinski čitljiv izvor istine.

## Obavezan izbor boja

Boje su podeljene u dva strogo nezavisna seta. `legacy` sadrži prvobitnih devet tonova, a `alternative` isključivo Abyssal Teal, Matcha i Desert Khaki. Jedna objava koristi samo jedan set. Nije dozvoljeno uzeti pozadinu iz jednog, a tekst, akcenat, površinu, ikonu, geometriju ili gradijent iz drugog seta.

Sistem pri otvaranju paketa bira set suprotan setu poslednje objave spremne za ljudsku proveru. Ako istorija još ne postoji, početni set se bira nasumično. Zatim nasumično bira kompatibilan `colorScheme` samo unutar tog seta. `colorSet` i `colorScheme` moraju biti isti u `video-props.json` i `generated/design-direction.json`, a `palettePlan` mora doslovno odgovarati temi i ostati unutar izabranog seta. Agent može zameniti temu samo drugom temom iz istog automatski određenog seta.

Originalni logo se nikada ne prebojava, pa njegove sopstvene boje nisu predmet ograničenja seta. Isto važi za stvarne boje proizvoda i izvorne fotografije. Ovaj izuzetak ne dozvoljava uvođenje boja drugog seta u dizajnirane površine ili elemente.

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
