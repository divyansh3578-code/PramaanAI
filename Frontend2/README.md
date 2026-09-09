# TenderVerify AI — CPCL Statutory Eligibility & Compliance Console

A React + Vite + Tailwind CSS console for automated statutory eligibility
verification of tender bidders (GSTN, MCA-21, Udyam, EPFO/ESIC, GeM, and
allied government registries), built for a fictional CPCL (Chennai
Petroleum Corporation Limited) procurement scenario, NIT-882.

## Setup

```bash
cp .env.example .env   # set VITE_API_URL if the backend isn't on localhost:5000
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

This app talks to the companion **SIH Procurement Backend** (Express + MongoDB) for
authentication, document upload, connector status and RTI/grievance filing — see
`src/api/client.js` for the full set of calls. Run the backend (`npm run dev` +
`npm run seed`) before signing in.

## Routes

| Path                        | Page                                              |
|------------------------------|----------------------------------------------------|
| `/`                          | Home — KPI overview + section links                |
| `/tender-notices`            | Tender NIT Notices list                            |
| `/evaluation-matrix`         | Stage-1 bidder matrix + statutory dossier (core UI)|
| `/statutory-bridges`         | Full 11-connector statutory bridge network          |
| `/disqualification-ledger`   | CVC disqualification / high-risk ledger             |
| `/gem-incident-log`          | GeM/CPPP ingestion incident log                     |
| `/rti-grievance`             | RTI & vigilance grievance form                      |

## Data

All data is mocked client-side in `src/data/`:

- `constants.js` — org, tender, officer, nav metadata (provided)
- `connectors.js` — statutory registry connector definitions (provided)
- `bidders.js` — **generated in this pass**: a 100-bidder cohort with a
  seeded PRNG (fixed seed, so it's stable across reloads/builds). Bidder
  `BID-882-049` (Apex Infra Projects) is hand-authored as the reference
  disqualification dossier — GSTIN cancelled + MCA-21 struck-off. The
  status distribution is fixed at 62 Eligible / 12 Scrutiny / 26 High-Risk
  or Disqualified, matching the filter bar counts.

## Notes

- No backend — everything (registry sync %, connector health, DSC
  signing, toast confirmations) is simulated client-side for demo
  purposes.
- Tailwind v3 with a custom design-token palette (navy / saffron /
  teal / verdigris / compliant-cautionary-noncompliant) defined in
  `tailwind.config.js`.

## Login, Document Repository & backend integration

- **`/login`** — role-tabbed sign-in (Procurement Officer / Registered Bidder),
  each with a Sign In / Register toggle. Registration calls
  `POST /api/auth/register` (bidders also create their linked `Bidder` company
  profile in the same call); sign-in calls `POST /api/auth/login`. The JWT and
  a lightweight profile are persisted in `localStorage` via `AuthContext`, so a
  session survives a page refresh. `PROCUREMENT_OFFICER` / `ADMIN` / `AUDITOR`
  backend roles all present as `ROLE.OFFICER` here; `BIDDER` presents as
  `ROLE.BIDDER`.
- **`/documents`** — role-aware Document Repository, live against the backend
  for bidders:
  - Signed in as **Officer** → tender-side document categories (still local
    state — publishing to GeM/CPPP is simulated).
  - Signed in as **Bidder** → real upload/list/delete against
    `/api/documents/bidder/:bidderId`, scoped to the account's linked bidder
    profile (`user.bidderId` from the JWT).
  - Not signed in → prompt to sign in as either role.
- **Evaluation Matrix dashboard** — `ConnectorGrid` polls
  `GET /api/verification/connectors/status` once signed in and overlays live
  latency/status onto the four primary connector cards; the 100-bidder matrix
  itself still uses the seeded demo cohort in `data/bidders.js` unless a
  `bidders` prop is supplied.
- **`/rti-grievance`** — files real RTI applications / vigilance grievances via
  `POST /api/grievances`, requires sign-in.
- Officer-only pages (`/evaluation-matrix`, `/statutory-bridges`,
  `/disqualification-ledger`, `/gem-incident-log`) are guarded by
  `RequireRole` and redirect unauthenticated/bidder sessions to `/login`. The
  main nav filters itself the same way.
