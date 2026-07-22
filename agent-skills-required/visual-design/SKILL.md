---
name: social-media-post-design
description: Create finished, agency-grade static social media advertising graphics and supporting captions for businesses. Use whenever the user asks to design, generate, remake, improve, or adapt an Instagram, Facebook, LinkedIn, or similar feed post; paid ad creative; promotional graphic; product or service announcement; event poster; real-estate listing; tourism offer; medical-service post; company-page "objava"; or an individual carousel slide. Trigger even from a sparse brief or supplied logo, photo, website, or reference image. The primary deliverable is the rendered visual, not design advice. Infer art direction, hierarchy, and layout, but never invent publishable facts. Do not use for video, Reels, or full campaign strategy unless creating a static cover or slide.
metadata:
  version: "2.0"
---

# Social Media Post Design

Create a finished commercial social media graphic that looks deliberately art-directed, professionally typeset, brand-consistent, and ready to publish. The visual is the primary deliverable. The caption is supporting material.

## Non-negotiable outcome

When suitable tools are available:

1. Produce the actual final graphic.
2. Render critical text with a reliable layout or text-rendering tool, not inside an image-generation prompt.
3. Inspect the rendered result and revise it before delivery.
4. Deliver the visual plus a publishable caption when relevant.

Do not stop at a concept, moodboard, prompt, wireframe, or list of recommendations unless the user explicitly asks for one.

## Instruction priority

Resolve conflicts in this order:

1. The user's latest explicit instructions
2. Supplied brand guidelines, logo files, approved posts, and mandatory copy
3. Verified business facts and source material
4. Supplied visual references
5. This skill's defaults
6. General design judgment

Reference images define a quality bar and design grammar. They do not override the user's brand or facts.

## Workflow

### 1. Inspect the full input

Review all available material before designing:

- business, offer, audience, objective, and CTA
- logo, brand colors, typography, website, photos, product images, and previous posts
- mandatory facts, dates, prices, addresses, credentials, disclaimers, and contact details
- requested platform, dimensions, language, script, and number of variants or slides
- reference images and the qualities the user wants carried over

Do not ask for information already present in the conversation, files, website, or supplied assets.

Za AU Šeki-Tilia produktni vizual, pre kompozicije pokreni `production/scripts/inspect-assets.mjs` nad paketom i otvori svaki generisani svetli/tamni asset pregled. Umereno slabija rezolucija, kompresija, mekoća ili nečitljivost sitnog teksta nisu automatska blokada kada je proizvod pouzdano prepoznatljiv. Upiši ih u `qualityLimitations`, koristi `approved-with-limitations` i prilagodi kadar, familiju, veličinu i završnu obradu realnom kapacitetu slike. Proizvod može ostati dominantan kroz položaj, kontrast i scenu, bez preteranog povećanja. Blokiraj samo kursor ili drugi UI/screenshot trag, pogrešan proizvod, ozbiljnu deformaciju, obmanjujuću obradu, neupotrebljivu alfa ivicu ili nemogućnost pouzdane identifikacije; takve nalaze upiši u `blockingDefects`. Original ostaje u `source/`; renderer koristi samo hashom odobrenu pripremljenu kopiju. Ne uklanjaj generativno defekt koji prekriva etiketu, ambalažu ili providni prozor proizvoda, jer bi to izmislilo proizvodni detalj. Traži čist izvor ili koristi bezbedan kadar koji taj detalj ne falsifikuje.

### 2. Create a fact ledger

Privately separate input into:

- **Verified facts:** safe to publish
- **Creative decisions:** layout, crop, palette extension, typography, mood, and visual metaphor
- **Unresolved business facts:** anything that would become a factual claim

Infer creative decisions freely. Never invent prices, dates, availability, discounts, credentials, addresses, phone numbers, URLs, statistics, testimonials, guarantees, urgency, or legal and medical claims.

Ask one concise question only when a missing fact blocks a correct and useful post. Otherwise use a visible placeholder such as `[DATE]`, `[PRICE]`, or `[PHONE]`, and list it once after the deliverable.

### 3. Define the communication core

Before composing, define internally:

- **Objective:** what the post must cause
- **Audience:** who must understand or desire it
- **Core message:** one sentence
- **Proof:** the strongest concrete reason to believe or act
- **CTA:** one primary next action
- **Visual hook:** the element that earns attention before reading

If the core message contains two unrelated promises, choose the stronger one or split the work into separate posts.

### 4. Analyze references without copying them

When references are supplied, extract their reusable grammar:

1. reading order
2. ratio of image to text
3. grid and shape language
4. headline scale and typography roles
5. photo treatment and cropping
6. information modules such as schedules, cards, callouts, icons, and contact strips
7. color relationships, texture, and finish
8. conversion mechanism and CTA emphasis

Use the principles that make the references effective. Do not copy another brand's logo, text, proprietary artwork, distinctive campaign device, or exact composition unless the user owns it or explicitly requests a close adaptation.

### AU Šeki-Tilia: premium produktna scena

Za AU Šeki-Tilia produktnu akciju, novitet ili promotivnu objavu sa dominantnim pakovanjem, vizuelni kvalitet i dizajnerska gramatika iz `brand/design-references/ref-premium-product-stage.png` i `brand/design-references/ref-product-stage-footer.png` predstavljaju obavezan prag izvedbe. To nije poziv na kopiranje: svaka objava mora imati novu kompoziciju i jedinstven `signature` zapis.

Kada brief odgovara familiji `premium-product-stage`, gradi scenu namerno, a ne kao ravan šablon:

- proizvod je veliki, glavni vizuelni element i optički je povezan sa scenom;
- asimetrična, ali uravnotežena hijerarhija prvo vodi do potvrđene ponude ili naslova, zatim do proizvoda, pa do jednog CTA-a;
- organska masa, podijum, kontaktna senka i kontrolisano premium osvetljenje stvaraju dubinu oko proizvoda, bez pravougaonog rama ili kartice oko transparentnog PNG-a;
- krem, bež i petrol grade mirnu bazu, dok limeta služi kao štedljiv akcenat za potvrđenu ponudu, kratku oznaku ili CTA;
- petrol završni blok može objediniti kratak CTA i neutralnu informaciju o dostupnosti, ali footer nije obavezan modul svake objave.

Iz referenci se ne preuzimaju zdravstvene tvrdnje, benefit-ikonice, sastojci, proizvod, cena, rok, copy, položaj logoa ni zaobljeni footer. Za AU Šeki-Tilia logo ostaje originalan, na zasebnoj krem `cream-card` podlozi sa oštrim uglovima. Pravougaoni paneli, footeri, kartice i logo-kartica ostaju oštrih uglova. Kada ikona može jasno da unapredi razumevanje informacije ili navigaciju, njeno korišćenje je obavezno i koristi se odgovarajuća semantička Lucide ikona, na primer ikona lokacije uz potvrđenu dostupnost ili CTA. Ikona nikada nije nasumična dekoracija, a medicinska ili benefit-ikona traži potvrđenu tvrdnju koju tačno predstavlja.

Ovaj sloj pojačava vizuelni standard reference, ali ne menja činjenice, obavezni Manrope font, pravila kontrasta, ograničenja za transparentni PNG niti bezbednosna pravila projekta. Kada postoji sukob, brend i potvrđene činjenice imaju prednost nad referencom.

### AU Šeki-Tilia: kontinuirana varijacija

Za kontinuiranu seriju objava ne ponavljaj istu grafiku uz novu boju, novi proizvod ili preformulisan naslov. Pre dizajna pregledaj poslednje tri evidencije i izaberi najmanje dve stvarne intervencije iz `brand/design-system.md`: redosled čitanja, položaj proizvoda, tretman ponude, dubina scene, kadar slike, tipografska kompozicija, CTA/footer, uloga ikone ili ritam videa. Renderer ima osam familija, uključujući `offer-orbit`, `type-stage` i `gallery-shelf`; njihova razlika mora biti vidljiva u stvarnoj kompoziciji, ne samo u nazivu props-a.

Kvalitet ima prednost nad novošću. Ne biraj novu familiju samo da bi prošla istorijsku proveru. Najpre popuni `familyFit` prema obliku proizvoda, snazi potvrđene ponude i potrebnoj dubini scene. Ako nova familija nije kompatibilna, koristi kompatibilnu familiju sa novim redosledom, kadrom ili scenografijom i jedinstvenom signature kombinacijom.

Za svaki traženi format zapiši namernu adaptaciju: Feed može graditi sporiju hijerarhiju, Story jednu brzu radnju, a Reels zaseban ritam otkrivanja. Ne rasteži isti layout između formata. Kada postoji Reels, promeni i dokumentuj `motionTreatment` u odnosu na prethodne tri Reels objave. Razlika mora ostati u okvirima palete, Manrope tipografije, krem logo-kartice, oštrih pravougaonih uglova i potvrđenih činjenica.

### 5. Choose one design architecture

Choose the architecture that best serves the content. Do not combine patterns merely to appear creative.

#### Editorial portrait or service announcement

Use for medical, professional, educational, personal-brand, or specialist services.

- dominant portrait or service image
- strong factual or authority-led headline
- restrained supporting copy
- optional appointment, credential, or availability card
- calm CTA and contact zone

#### Architecture or real-estate split

Use for property, interiors, construction, and premium location offers.

- text column or shaped negative-space field
- large architectural image or render
- short identity or location headline
- two to four meaningful proof points
- restrained footer or inquiry CTA

#### Full-bleed destination or product offer

Use when the image itself sells the experience or product.

- full-bleed hero image
- copy placed in genuine negative space or on a controlled scrim
- large offer or destination name
- compact price, duration, date, or benefit modules
- one clear CTA

#### Event or tour schedule poster

Use for concerts, multi-date events, tours, clinics, and itineraries.

- event identity and hero subject
- large title
- ordered, highly scannable date or location rows
- supporting venue and time details
- unified destination, performer, or theme imagery

#### Product-detail commercial ad

Use for physical products, materials, home improvement, apparel, and branded merchandise.

- hero product in context
- one useful detail inset when it proves quality
- concise benefit labels
- strong product name or benefit headline
- direct quote, order, or inquiry CTA

#### Minimal brand announcement

Use when the message is simple and brand recognition matters more than feature density.

- one visual idea
- one headline
- one supporting line at most
- logo and CTA only when necessary

### 6. Construct the visual system

#### Composition and hierarchy

- Establish one dominant focal point and an unambiguous reading order.
- Use a stable grid, deliberate alignment, and consistent spacing increments.
- Keep the primary message visually separate from details and contact information.
- Let important imagery breathe. Do not fill whitespace merely because it exists.
- Use asymmetry when it improves energy, but maintain optical balance.
- Keep important text, logos, faces, and products inside crop-safe areas.
- Use decorative shapes only when they organize content, direct attention, mask imagery, or reinforce the concept.

Useful defaults, not rigid rules:

- outer safe margin: approximately 5–7% of the short edge
- dominant visual: approximately 45–70% of the composition
- headline: usually 2–4 lines and 2–9 words
- supporting modules: usually 0–4
- type roles: usually display, supporting, detail, and CTA/footer

#### Typography

- Treat the headline as a compositional form, not merely text placed on top.
- Use supplied brand fonts whenever they exist. Do not override an established brand type system with these defaults.
- When no fonts are supplied, use **Literata + IBM Plex Sans** as the default pairing. Use Literata for primary headlines, editorial statements, large numerals, and occasional expressive italic accents. Use IBM Plex Sans for subheadlines, descriptions, dates, benefits, calls to action, and contact information.
- Use IBM Plex Sans Condensed selectively for compact dates, locations, labels, schedules, and narrow information modules. Do not use it for longer paragraphs.
- Avoid Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, Nunito, and generic display-sans pairings by default. Use them only when they belong to the supplied brand system or are explicitly requested.
- Use no more font personalities than the concept requires. Weight, width, case, scale, and spacing can create hierarchy within one family.
- Control line breaks manually. Avoid orphaned words, awkward hyphenation, compressed line spacing, and accidental tangencies.
- Use all caps only for short labels, dates, places, or deliberately forceful headlines.
- Keep body copy and contact information legible on a phone, not only at full canvas size.
- Preserve spelling, names, local grammar, capitalization, currency formatting, diacritics, and script exactly.

##### Default type hierarchy when no brand fonts are supplied

- Primary headline: Literata 700–900
- Expressive accent: Literata Italic 500–700
- Subheadline: IBM Plex Sans 500–600
- Dates, locations, and compact labels: IBM Plex Sans Condensed 600–700
- Body copy and contact information: IBM Plex Sans 400–500
- CTA: IBM Plex Sans 600–700, with restrained letter spacing when useful

Use no more than two font families in one graphic. Treat variants from the same family as one family. Do not pair two highly expressive display faces.

Choose an alternative pairing only when the creative direction clearly calls for it:

- Fraunces + Source Sans 3 for warm, crafted, hospitality, food, interior, and lifestyle communication.
- Unbounded + IBM Plex Sans for culture, events, music, youth, and bold contemporary campaigns. Reserve Unbounded for short display text.
- Source Serif 4 + IBM Plex Sans for restrained institutional, professional, and premium communication.

Verify before finalizing that every chosen typeface supports all required Serbian Latin characters: `Č Ć Š Ž Đ č ć š ž đ`. When Cyrillic is required, verify the complete Serbian Cyrillic character set before building the layout. Never replace a missing glyph with a different font inside the same word.

#### Imagery

- Prefer strong supplied photography or renders over generic stock.
- Crop for communication: protect faces, products, architecture, embroidery, packaging, and important details.
- Preserve the identity and geometry of supplied products, logos, buildings, people, and artwork.
- When compositing, match perspective, lighting direction, sharpness, grain, depth, and color temperature.
- Remove cutout halos, implausible reflections, distorted hands, duplicated objects, warped architecture, fake product details, and inconsistent shadows.
- Do not use a smiling generic person when a specific product, service action, place, material, or real customer-facing detail would be more credible.

When generating imagery:

- Generate the photographic or illustrative scene without critical text, logos, prices, dates, or contact details.
- Plan negative space for the intended layout.
- Add all publishable typography afterward using a deterministic design or rendering tool.
- Never trust generated lettering without visual verification.

#### Color and finish

- Use the supplied brand system first.
- Extend it with neutrals, tints, shades, or one campaign accent only when needed.
- When no brand system exists, derive color from the subject, audience, image, and market position rather than generic industry stereotypes.
- Ensure text contrast remains strong across the full image.
- Inspect every exported format at full size and at thumbnail size. Keep the logo, primary message, offer, product, and CTA, when present, immediately visible against their direct backgrounds.
- Never place a logo, text, icon, or CTA in the same or nearly the same color and value as its direct background. When contrast is insufficient, move it to a controlled solid surface or use an appropriate supplied logo variant. Never recolor, redraw, stretch, or otherwise alter the original logo to solve contrast.
- Apply texture, grain, gradients, shadows, metallic effects, and blur sparingly and consistently.
- Premium does not automatically mean black and gold. Medical does not automatically mean blue. Youth does not automatically mean neon.

#### Information modules

Logo, subheadline, badge, icon row, schedule, price card, detail inset, testimonial, CTA button, and footer are optional modules, not mandatory anatomy.

Add a module only when it improves comprehension, proof, navigation, or action. Use one icon family, one border logic, one radius logic, and one stroke weight throughout the post.

### 7. Write concise on-canvas copy

Choose the headline mode that matches the objective:

- **Direct offer:** what is available
- **Benefit-led:** what changes for the customer
- **Identity-led:** the lifestyle, place, or belonging being sold
- **Authority-led:** specialist, credential, or trust signal
- **Event-led:** performer, event, date, or location
- **Urgency-led:** only when urgency is verified

Prefer concrete language over adjectives. A specific offer, number, material, destination, credential, or date is usually stronger than generic claims such as "quality you deserve" or "an unforgettable experience."

Use one CTA. Make it operational: `Book an examination`, `Request a quote`, `Reserve your place`, `See available apartments`, or `Send an inquiry`.

Do not add claims, benefits, or urgency that are not supported by the input.

### 8. Execute with separate asset and type layers

Use this production order:

1. prepare or generate the main image
2. retouch and color-match visual assets
3. establish canvas, grid, margins, and image crop
4. place logo and mandatory brand elements
5. typeset headline and supporting copy
6. add only necessary information modules
7. add CTA and contact zone
8. export a draft
9. inspect the actual draft at full size and thumbnail size
10. correct and re-export

Prefer editable vector or layout-based text. Do not rasterize small text early. Export in sRGB and at the requested dimensions.

If the user requested a revision, change only what was requested unless another visible defect prevents professional delivery. Preserve approved content, proportions, brand elements, and overall system.

For a series or carousel, lock the master system after the first approved visual: margins, type roles, logo behavior, CTA treatment, icon style, and color logic. Vary imagery and composition enough to avoid mechanical repetition.

### 9. Apply a validation loop

Inspect the rendered output, not just the source or prompt. Revise until all applicable checks pass.

#### Content accuracy

- [ ] Every visible fact is verified or clearly marked as a placeholder.
- [ ] Names, dates, prices, phone numbers, URLs, credentials, and diacritics are correct.
- [ ] No unsupported claim, urgency, guarantee, or superlative appears.
- [ ] The graphic and caption use the same offer and CTA.

#### Design quality

- [ ] One dominant message is understood within two seconds.
- [ ] The reading order is clear without explanation.
- [ ] The headline, image, proof, CTA, and brand have intentional relative emphasis.
- [ ] The composition is balanced and not template-like.
- [ ] Whitespace is deliberate.
- [ ] Alignment, spacing, icon style, strokes, borders, and radii are consistent.
- [ ] The design has at least one brief-specific visual decision rather than only generic polish.

#### Mobile and technical quality

- [ ] Headline and essential details remain readable at approximately 25% preview size.
- [ ] Logo, primary message, offer, product, and CTA, when present, are clearly visible and contrast with their direct backgrounds in every exported format.
- [ ] Critical content stays inside safe margins and survives likely feed crops.
- [ ] Text does not sit over uncontrolled visual noise.
- [ ] Supplied images are used at the best credible quality their source permits; documented client-side softness or compression is not treated as an agent failure by itself.
- [ ] No element is accidentally clipped, duplicated, stretched, or misaligned.
- [ ] The exported file uses the requested ratio, dimensions, and format.

#### Commercial quality

- [ ] The audience can identify what is being offered.
- [ ] The strongest proof or differentiator is visible.
- [ ] The CTA is specific and easy to find.
- [ ] The design fits the business's price position and trust requirements.
- [ ] Decorative elements do not compete with conversion-critical information.

Do not present the output as final while any critical check fails.

Za AU Šeki-Tilia posle prvog drafta napravi najmanje jednu stvarnu korekciju i pokreni `production/scripts/prepare-visual-review.mjs`. Pregledaj `reference-comparison.png`, `format-comparison.png`, Feed, Story, sva tri Reels ključna kadra i finalni MP4, pa u `quality-review.json` oceni kompoziciju, mobilnu hijerarhiju, integraciju i uzemljenje proizvoda, dubinu i završnu obradu, upečatljivost prema referencama, formatnu adaptaciju i Reels dinamiku. Svaki kriterijum mora imati najmanje 4/5 i konkretan dokaz. Draft i final moraju imati različite hasheve. Drugi agent sa drugačijim `reviewerId` od dizajnerovog `authorId` radi nezavisni pregled direktno nad sirovim artefaktima; bez drugog agenta paket ostaje blokiran. Posle generisanja hash dokaza ne menjaj input, props, design-direction, renderer, CSS, reference ni rendere bez ponovnog pregleda. Checkbox u `review.md` nije dokaz kvaliteta.

## High-trust and regulated categories

For medical, legal, financial, political, employment, education, real-estate, and other trust-sensitive posts:

- use only supplied or authoritative facts
- prefer direct, calm, factual language over emotional pressure
- do not imply guaranteed outcomes
- do not invent credentials, approvals, prices, availability, or disclaimers
- preserve required qualifications, limitations, and material conditions
- avoid fear-based or exploitative imagery and copy
- leave an unresolved claim out rather than making it sound plausible

## Common failure modes

Prevent these recurring low-quality outcomes:

- generating the complete poster, including text, inside an image model
- treating every post as logo + headline + four icons + button + footer
- using tiny explanatory copy to compensate for a weak concept
- placing text wherever empty space happens to exist without a grid
- choosing a generic palette before examining the brand and subject
- using random pills, circles, gradients, glass effects, or decorative microtext
- mixing unrelated typefaces, icon families, photo styles, or corner radii
- creating a visually impressive image that hides the actual offer
- making every element equally prominent
- using generic stock imagery instead of the supplied product or real context
- copying a reference literally rather than understanding why it works
- returning design rationale instead of producing the requested visual

## Caption

Write a caption only when relevant to the request. It should add context rather than transcribe the graphic.

Use:

1. one specific opening line
2. one to three concise sentences of useful context
3. the same concrete CTA as the visual
4. only a few genuinely relevant local or niche hashtags, when useful

Match the language, script, tone, and trust level of the visual. Avoid greetings, filler, engagement bait, repeated slogans, and inflated claims.

## Delivery contract

When production tools are available, return:

1. the final rendered graphic or file link
2. the publishable caption, when relevant
3. a short list of unresolved placeholders, only if any remain

Do not include a long explanation of the design unless the user asks for one.

When production tools are unavailable, state that the visual was not rendered and use this fallback:

```markdown
## Creative direction
[One-sentence concept and the brief-specific visual hook]

## Canvas
[Platform, ratio, dimensions, and safe-area notes]

## On-canvas copy
- Headline: ...
- Supporting line: ...
- CTA: ...
- Mandatory details: ...

## Layout and art direction
[Precise placement, image crop, type roles, color system, modules, and finish]

## Asset plan
[What to use, generate, retouch, or keep unchanged]

## Caption
[Publishable caption]

## Unresolved facts
[Only facts that must be supplied or verified]
```

## Scope

Use this skill for static promotional graphics, static ad creatives, feed posts, event posters, listing posts, covers, and individual carousel slides.

Do not silently expand the task into video production, media buying, analytics, a full content calendar, or complete brand identity design. Use another workflow for those tasks unless the user explicitly includes them.
