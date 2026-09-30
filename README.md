# Early Medieval Ireland Explorer

Public showcase site for the **Become the High King / 成为至高王** historical research project.

Live site: https://njzhl93.github.io/early-medieval-ireland-explorer/

## Current public milestones

### Dublin / Dyflin — deep reconstruction

The Dublin deep dive covers **AD 900 / 950 / 1000 / 1050** and includes the v0.22 public bird’s-eye reconstruction for **Dyflin c. AD 950**.

The image is a **Geometry D presentation layer**. It is not a measured archaeological plan. The underlying AD950 constraints remain unchanged: Bank 2, compact post-917 urban mass, natural hydrology distinct from defence, and no continuous water-filled defensive moat.

### Waterford / Veðrafjǫrðr — AD1050 reconstruction pre-production

v0.25 advances Waterford from an archaeological reconstruction pack to **first-candidate pre-production**.

This does **not** mean that Waterford is historically resolved. Instead, the remaining uncertainties have been converted into explicit rendering rules so that a first Geometry D candidate can be generated without silently inventing precision.

The six generation gates are now handled as follows:

- **Hydrology** — Suir + St John’s marsh relationship locked; exact AD1050 marsh edge remains Geometry D
- **Street axes** — Peter Street strongest; High Street usable as a principal late-Viking axis; Olaf Street remains tentative for AD1050
- **Westward extent** — allowed as a Geometry D envelope, not a later-city boundary
- **Defence** — presence may be expressed schematically, while the AD1070–1080 Bakehouse Lane line remains a negative chronological control
- **Waterfront** — river-facing activity allowed; continuous measured quay prohibited
- **St Olaf context** — no dominant stone church in Candidate 1 without a separate dating review

The target is now:

`READY_FOR_FIRST_GEOMETRY_D_CANDIDATE`

The first image target is **Waterford / Veðrafjǫrðr c. AD1050** because mid-eleventh-century urban morphology is better supported than the 10th-century street and boundary evidence.

Public pre-production files:

- `data/waterford-ad1050-preproduction.json`
- `research/waterford-ad1050-master-constraints-v025.md`
- `research/waterford-ad1050-image-prompt-v025.txt`
- `research/waterford-reconstruction-pack-v024.md`

The first image review must remain geography-first: Suir, St John’s marsh, triangular ground, east-to-west urban extent, street hierarchy, and separation between defence and natural water are reviewed before individual building detail.

## Multi-city framework

The public registry is data-driven:

- `data/cities.json` — city registry and public navigation status
- `data/dublin.json` — Dublin shared-model registration / migration contract
- `data/waterford.json` — Waterford phase research pack
- `data/waterford-ad1050-preproduction.json` — Waterford first-candidate constraints
- `assets/city-runtime.js` — reusable phase / control / evidence / reconstruction-gate renderer

Dublin remains on its bespoke v0.22 renderer to avoid presentation regression. Waterford uses the shared runtime and is the first city to pass from research skeleton → reconstruction pack → controlled image pre-production.

## Historical confidence contract

- **Geometry B** — independently reproducible control points
- **Geometry C** — constrained historical relationships
- **Geometry D** — public schematic reconstruction

A high-confidence historical claim does not automatically imply a high-confidence mapped boundary. An excavation-site coordinate at Geometry B also does not mean every excavated feature inside that site is available as public Geometry B linework.

Historical research baseline: **Dublin v0.20; Waterford v0.25 AD1050 pre-production**  
Presentation layer: **v0.25 multi-city framework**
