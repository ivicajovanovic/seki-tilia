# AU Šeki-Tilia — brend vodič za društvene mreže

## Osnovni identitet

- **Javni naziv:** AU Šeki-Tilia
- **Delatnost:** apotekarska ustanova sa mrežom od najmanje 14 apoteka u Petrovcu na Mlavi i drugim mestima.
- **Pozicioniranje:** lokalna, porodična apoteka koja pruža pouzdanu i ljubaznu uslugu.
- **Cilj prvih 90 dana:** izgradnja prepoznatljivosti i vidljivosti na Instagramu i Facebooku.
- **Obraćanje:** sa „vi”.
- **Ton:** stručan, smiren, topao, razumljiv i nenametljiv.

Nikada ne predstavljamo generisanu osobu kao stvarnu zaposlenu apoteke.

## Paleta

| Uloga | Naziv | Hex |
| --- | --- | --- |
| Primarna tamna | Royal Neptune | `#1C3B42` |
| Osnovna pozadina | Icy Tundra | `#F7F5EC` |
| Akcenat / CTA | Livid Lime | `#B8E100` |
| Sekundarna površina | Deer Run | `#B2A69A` |
| Tehnički tamna | Black is Back | `#0F1519` |
| Sekundarni akcenat | Riviera Sea | `#1B8188` |
| Neutralna srednja | Sivi ton A | `#7A7C7A` |
| Neutralna topla | Sivi ton B | `#7D7D79` |
| Neutralna hladna | Sivi ton C | `#4E5A5F` |
| Alternativna tamna | Abyssal Teal | `#063F48` |
| Alternativna svetlozelena | Matcha | `#BDCCA5` |
| Alternativna topla svetla | Desert Khaki | `#F8E4C9` |

Operativni izbor i kontrastne kombinacije vode se u [color-palette.md](color-palette.md) i `color-palette.json`. Postojećih devet tonova čini nezavisni `legacy` set, a Abyssal Teal, Matcha i Desert Khaki čine nezavisni `alternative` set. Jedna objava koristi isključivo jedan set, a sistem ih obavezno smenjuje između uzastopnih objava. Unutar izabranog seta tema se bira nasumično. Mešanje tonova između setova nije dozvoljeno. Izuzetak su neizmenjive boje originalnog logoa i stvarne boje proizvoda ili izvorne fotografije. Tekst, CTA i funkcionalne ikonice koriste samo unapred odobrene kontrastne parove. Logo koristi odgovarajuću `on-light` ili `on-dark` varijantu i samo kombinaciju iz `approvedLogoPlacements`; kontrast se ne rešava belom karticom.

## Tipografija

- **Naslovi:** Manrope, 700 ili 800.
- **Tekst i praktične informacije:** Manrope, 400, 500 ili 600.
- **Logo:** isključivo originalni vektorski fajl; ne rekreirati ga fontom.

Manrope je jedina tipografska porodica za ovaj brend. Ne koristiti generički podrazumevani par iz dizajn-skilla, serifni fallback, Arial ni drugi zamenski font na finalnim vizualima. Jedna objava ima najviše dve težine fonta. Tekst na vizualu treba da bude kratak, čitljiv na telefonu i bez medicinskog žargona.

## Logo

Originali se nalaze u `logos/`:

- `logo-tamniji.svg` — tamnija varijanta znaka, isključivo za svetle kontrolisane pozadine;
- `logo-svetliji.svg` — svetlija varijanta znaka, isključivo za tamne kontrolisane pozadine.

Za avatar profila koristi se varijanta koja odgovara pozadini profila. Za feed se koristi odgovarajuća varijanta znaka prema neposrednoj pozadini. Logo se postavlja bez bele, krem ili druge pravougaone kartice oko znaka. Njegov neposredni deo kompozicije mora imati kontrolisan kontrast, tako da oba originalna dela znaka, petrol i limeta, ostanu čitljiva. Logo nikada ne sme biti rastegnut, obojen drugom bojom ili postavljen preko nečitljive fotografije, limeta polja ili druge nekontrolisane podloge.

## Vizuelni princip

Objava treba da deluje čisto, savremeno i ljudski:

- jedna glavna poruka i jedna dominantna fotografija ili ilustrativni element;
- mnogo praznog prostora;
- geometrijski čist prozor ili blok uz fotografiju, sa oštrim uglovima na pravougaonim površinama;
- mali potpis logom, diskretno u donjem uglu;
- najviše tri grupe sadržaja: naslov, proizvod/savet, poziv na akciju.

Izbegavamo kolaže, agresivne akcijske poruke, previše ikona, medicinske simbole van znaka i „luksuzni” vizuelni ton.

Pravougaoni paneli, kartice, podloge proizvoda, footeri i okviri imaju oštre uglove. Zaobljenje je dozvoljeno samo za pill-dugme ili kratku CTA/ponudnu oznaku, kao i za namerno kružne dekorativne oblike. Ne koristiti zaobljene pravougaonike kao podrazumevani vizuelni motiv.

Senke i zamućenja nisu dozvoljeni, ni kao vektorski CSS/SVG efekat ni kao rasterski dodatak. Dubina se gradi isključivo geometrijom, kontrastom i vektorskim gradijentima.

Kada klijent dostavi proizvod kao transparentni PNG, proizvod se postavlja direktno na kompoziciju, bez spoljnog pravougaonog rama, kartice, okvira ili podloge. Dobija dominantnu zonu u kadru i ne sme ostati sitan unutar velike praznine. Ako je izvor slabije rezolucije, dominacija se gradi položajem, kontrastom i scenom umesto forsiranim uvećanjem koje razara sliku. Pravougaona podloga može da se koristi samo za neprovidnu fotografiju proizvoda kada je neophodna radi čitljivosti i ne sme se dodavati transparentnom PNG-u.

Grafike i video kadrovi koriste najmanje jednu funkcionalnu profesionalnu ikonu iz Lucide biblioteke. Ikona označava stvarnu radnju ili informaciju, na primer lokaciju/dostupnost uz CTA. Čiste tekstualne objave su izuzetak. Medicinske ikone i benefit-ikonice nisu dozvoljene bez potvrđene tvrdnje koju tačno predstavljaju.

## Premium produktna scena

Interna autorska referenca `ref-premium-product-stage.png` postavlja kvalitet za produktne akcije. Njena dizajnerska logika može da se koristi sa varijacijama: velika ponuda, dominantan proizvod, organska pozadina i izražen podijum sa vektorskim gradijentom koji daje dubinu, uz petrol završni blok sa jednim CTA-om.

Proizvod u takvoj sceni ostaje slobodan glavni element. Organski oblik i podijum grade prostor oko proizvoda, ali ga ne zatvaraju u pravougaonu karticu, okvir ili podlogu. Gornja ravan podijuma mora jasno da nosi proizvod, a njegova prednja masa da uđe iza footera. Za transparentni PNG to pravilo je obavezno.

Na grafiku se ne prenose automatski ikone, benefit-redovi ni zdravstvene tvrdnje iz prethodnih primera. Prikazuju se samo kada su konkretne formulacije za aktuelni proizvod potvrđene. U suprotnom prednost imaju velika ponuda, proizvod, jasan CTA i mirna, dovršena kompozicija.

## Sadržajne rubrike

1. **Akcije i popusti** — samo proizvodi dozvoljeni za oglašavanje; jasni datum i uslovi akcije.
2. **Noviteti u ponudi** — novopristigli proizvodi, brendovi i sezonska ponuda.
3. **Nega i dermokozmetika** — rutina, SPF, nega kože i praktični saveti.
4. **Vitamini, suplementi i probiotici** — opšti, proverljivi sadržaj bez terapijskih obećanja.
5. **Bebi i dečji program** — neutralne informacije o kategorijama proizvoda.
6. **Sezonski savet** — putna apoteka, letnja zaštita, zimska nega i slično.
7. **Blizu vas** — lokacije, radno vreme, korisna informacija o apoteci.

## Obavezna zdravstvena i promotivna pravila

- Ne promovišemo lekove ni antibiotike.
- Ne dijagnostikujemo, ne preporučujemo terapiju i ne obećavamo ishod ili izlečenje.
- Ne koristimo formulacije kao što su „leči”, „garantuje”, „bezbedno za svakoga”, „najbolje”, „trenutno rešava”.
- Kod konkretnog proizvoda tvrdnje moraju poticati iz materijala proizvođača/distributera ili od stručne osobe iz apoteke.
- Sve objave prolaze ručnu proveru stručne tačnosti pre objavljivanja.
- Ako je status proizvoda nejasan (lek, medicinsko sredstvo ili dodatak ishrani), materijal se označava za proveru pre generisanja promocije.

## Operativni podaci

- **Sedište:** Petrovac na Mlavi.
- **Lokacije:** najmanje 14; adrese, posebni telefoni i eventualna odstupanja u radnom vremenu prikupljaju se postepeno.
- **Privremeni kontakt:** 064 27 97 501 — promenljiv, ne ugrađivati trajno u šablone.
- **Opšte radno vreme:** ponedeljak–subota, 07:00–20:00; nedeljom ne rade. Potvrditi po lokaciji.

Podaci za svaku apoteku vode se centralno u `brand/brand-config.json`, a fotografije se čuvaju u zasebnom folderu označenom nazivom te lokacije.
