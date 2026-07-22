# Katalog dizajnerskih referenci

Ovo je katalog principa koji se mogu preuzeti bez kopiranja gotove grafike. Naziv datoteke je stabilan ASCII identifikator: navedi ga doslovno u `generated/design-direction.json`, uz najviše dve do tri stvarno korišćene osobine.

| Datoteka | Korisni principi | Ne preuzimati |
| --- | --- | --- |
| `ref-premium-product-stage.png` | Interna autorska referenca za premium produktnu scenu: asimetrična ponuda, velika produktna scena, organska masa i petrol CTA završetak. | Nepotvrđene produktne tvrdnje, konkretan copy ili raspored piksel-po-piksel. |
| `ref-product-stage-footer.png` | Interna autorska referenca: velika produktna scena, podijum, premium svetlo i funkcionalan lokacijski footer sa Lucide ikonom. | Sastojke, zdravstvene tvrdnje, brend proizvoda i konkretnu ponudu bez potvrde. |
| `ref-editorial-offer-stage.png` | Editorial odnos velike poruke levo i uzemljene produktne scene desno, kontrolisan informativni ritam, tekstura i jasan oštar footer. | Konkretan proizvod i copy, zdravstvene tvrdnje, benefit-ikonice, logo tretman i eventualne artefakte unutar fotografije proizvoda. |
| `ref-vertical-product-spotlight.png` | Snažna vertikalna skala proizvoda, slojevita kružna scenografija, prirodni akcenti i fokusiran lokacijski završetak. | Zaobljen strukturni footer, konkretne tvrdnje, proizvod, copy, kursor/UI artefakt ili direktno postavljanje znaka bez propisane krem logo-kartice. |

Mašinski izvor istine za dozvoljena imena je `references.json`. Sve četiri slike učestvuju u obaveznom referentnom comparison renderu, ali agent u `referenceFiles` navodi samo one čije je principe stvarno primenio.
