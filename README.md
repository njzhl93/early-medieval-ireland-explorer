# Early Medieval Ireland Explorer

Public showcase site for the **Become the High King / 成为至高王** historical research project.

Live site: https://njzhl93.github.io/early-medieval-ireland-explorer/

## Current public milestones

### Dublin / Dyflin — deep reconstruction

The Dublin deep dive covers **AD 900 / 950 / 1000 / 1050** and includes the v0.22 public bird’s-eye reconstruction for **Dyflin c. AD 950**.

The image is a **Geometry D presentation layer**. It is not a measured archaeological plan. The underlying AD950 constraints remain unchanged: Bank 2, compact post-917 urban mass, natural hydrology distinct from defence, and no continuous water-filled defensive moat.

### Waterford / Veðrafjǫrðr — research pilot

v0.23 introduces the first second-city pilot and a reusable public city-data contract.

Waterford deliberately exposes uneven evidence density rather than forcing a Dublin-like reconstruction:

- AD900 — first Viking occupation / longphort horizon; spatial extent unresolved
- AD950 — eastern Dundory-focused Hiberno-Norse settlement; exact defensive circuit unresolved
- AD1000 — westward development treated as a constrained trend, not a measured town boundary
- AD1050 — stronger 11th-century urban evidence, while the Bakehouse Lane defence dated c. AD1070–1080 is explicitly prevented from becoming an AD1050 default boundary

Public Waterford source references include Waterford City & County Council, Heritage Ireland / OPW, National Monuments Service and Excavations.ie records. Source plans are not reproduced.

## Multi-city framework

The public registry is now data-driven:

- `data/cities.json` — city registry and public navigation status
- `data/dublin.json` — Dublin shared-model registration / migration contract
- `data/waterford.json` — Waterford phases, controls, claims and provenance
- `assets/city-runtime.js` — reusable phase / control / evidence renderer for new city pilots

Dublin remains on its bespoke v0.22 renderer during v0.23 to avoid presentation regression. New cities can use the shared runtime first and be promoted to deep-reconstruction status only when their evidence base justifies it.

## Historical confidence contract

- **Geometry B** — independently reproducible control points
- **Geometry C** — constrained historical relationships
- **Geometry D** — public schematic reconstruction

A high-confidence historical claim does not automatically imply a high-confidence mapped boundary.

Historical research baseline: **Dublin v0.20; Waterford v0.23 research skeleton**  
Presentation layer: **v0.23 multi-city framework**
