# Early Medieval Ireland Explorer

Public showcase site for the **Become the High King / 成为至高王** historical research project.

Live site: https://njzhl93.github.io/early-medieval-ireland-explorer/

## Current public milestones

### Dublin / Dyflin — deep reconstruction

The Dublin deep dive covers **AD 900 / 950 / 1000 / 1050** and includes the v0.22 public bird’s-eye reconstruction for **Dyflin c. AD 950**.

The image is a **Geometry D presentation layer**. It is not a measured archaeological plan. The underlying AD950 constraints remain unchanged: Bank 2, compact post-917 urban mass, natural hydrology distinct from defence, and no continuous water-filled defensive moat.

### Waterford / Veðrafjǫrðr — archaeological reconstruction pack

v0.24 promotes Waterford from a research skeleton to a public-safe archaeological reconstruction pack.

The pack now separates direct observations from published interpretation and rendering choices:

- **AD900** — Viking occupation / longphort presence; spatial footprint unresolved
- **AD950** — Dundory-focused eastern settlement as a source-backed interpretation; Bailey’s New Street ditches are direct excavation evidence but not a proven exact AD950 circuit
- **AD1000** — westward development can be shown as a constrained trend, not a measured town boundary
- **AD1050** — stronger 11th-century urban language from Arundel Square / Peter Street, while AD1070–1080 and c.AD1083 features are treated as post-1050 chronological controls

The public Waterford dataset now contains six public excavation-site controls, eleven claims and phase-specific `must_show / may_show / prohibitions` rules.

The early Viking quay remains deliberately unresolved: the site may show generalized river-facing activity, but it must not render a continuous measured early quay or later monumental stone frontage by default.

The full public-safe research summary is available at:

- `research/waterford-reconstruction-pack-v024.md`

Waterford is **not yet approved for final bird’s-eye generation**. The current preferred first visual candidate is AD1050 because the 11th-century urban evidence is materially stronger than the 10th-century spatial evidence.

## Multi-city framework

The public registry is data-driven:

- `data/cities.json` — city registry and public navigation status
- `data/dublin.json` — Dublin shared-model registration / migration contract
- `data/waterford.json` — Waterford phases, controls, claims, reconstruction constraints and provenance
- `assets/city-runtime.js` — reusable phase / control / evidence / reconstruction-gate renderer

Dublin remains on its bespoke v0.22 renderer to avoid presentation regression. Waterford uses the shared runtime and now acts as the first full test of the reusable reconstruction-contract model.

## Historical confidence contract

- **Geometry B** — independently reproducible control points
- **Geometry C** — constrained historical relationships
- **Geometry D** — public schematic reconstruction

A high-confidence historical claim does not automatically imply a high-confidence mapped boundary. An excavation-site coordinate at Geometry B also does not mean every excavated feature inside that site is available as public Geometry B linework.

Historical research baseline: **Dublin v0.20; Waterford v0.24 archaeological reconstruction pack**  
Presentation layer: **v0.24 multi-city framework**
