# SIH Procurement Backend

A beginner-friendly modular-monolith backend for the procurement verification/compliance system.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Multer document upload
- Rule-based compliance engine
- Government verification adapter layer (mock connectors for demo)
- Risk scoring + anomaly detection
- Immutable-style audit event records

## Run
1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `.env` and set `JWT_SECRET`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Check `GET http://localhost:5000/health`.

## Core API
### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Tenders
- GET `/api/tenders`
- GET `/api/tenders/:id`
- POST `/api/tenders`

### Bidders
- GET `/api/bidders`
- GET `/api/bidders/:id`
- POST `/api/bidders`

### Documents
- GET `/api/documents/bidder/:bidderId` — list a bidder's uploaded documents
- POST `/api/documents/bidder/:bidderId` with multipart field `document` (optional `documentType` field)
- DELETE `/api/documents/:id`

### Verification
- POST `/api/verification/start` body `{ "bidderId": "...", "tenderId": "..." }`
- POST `/api/verification/run-all` body `{ "tenderId": "...", "rerun": false }` — batch-runs verification for every bidder against a tender
- GET `/api/verification/matrix?tenderId=...` — Evaluation Matrix dashboard feed (defaults to the latest tender)
- GET `/api/verification/connectors/status` — live GSTN/UDYAM/MCA21/EPFO-ESIC connector probe (status + latency)
- GET `/api/verification/bid/:bidId`

### Grievances (RTI & Vigilance)
- POST `/api/grievances` body `{ "type": "RTI" | "GRIEVANCE", "subject": "...", "description": "..." }`
- GET `/api/grievances/mine` — the signed-in user's own filings
- GET `/api/grievances` — staff-only full ledger
- PATCH `/api/grievances/:id` — staff-only, body `{ "status": "...", "response": "..." }`

### Audit
- GET `/api/audit`

## Roles & bidder accounts
`POST /api/auth/register` accepts `role: "BIDDER"` plus a `legalName` (and optional `pan`, `gstin`, `udyamNo`,
`udyamScale`, `cin`, `gemSellerId`, `epfoCode`, `phone`). This creates both the `User` login and its linked
`Bidder` company profile in one step, and the resulting JWT carries `bidderId` so `/api/bidders/me`,
`/api/documents/bidder/:bidderId` etc. can be scoped to that bidder automatically.

## Seed data
`npm run seed` creates a procurement officer login (`officer@cpcl.gov.in` / `ChangeMe123!`), the NIT-882 tender,
five sample bidders, and runs verification/compliance/risk for each so the dashboards have real data immediately.

## Example tender requirements
```json
[
  { "field": "gstStatus", "operator": "EQ", "value": "PASS", "mandatory": true, "weight": 15 },
  { "field": "udyamStatus", "operator": "EQ", "value": "PASS", "mandatory": true, "weight": 10 },
  { "field": "turnover", "operator": "GTE", "value": 100000000, "mandatory": true, "weight": 30 },
  { "field": "experienceYears", "operator": "GTE", "value": 5, "mandatory": true, "weight": 25 }
]
```

## Important SIH note
The GST/Udyam/MCA connectors are deliberately mocked. Replace each adapter with the authorized integration/API available to your team. Do not scrape government sites or invent an official integration.

## Next build stages
1. Add Zod request validation and centralized schemas.
2. Add refresh tokens / token revocation.
3. Add OCR service and document extraction pipeline.
4. Add Redis + BullMQ workers for async verification.
5. Add real evidence snapshots and source metadata.
6. Add configurable anomaly rules and dashboard aggregation endpoints.
7. Add tests and API documentation (OpenAPI).

## Docker
```bash
docker compose up --build
```

The backend runs on port `5000` and MongoDB on `27017`.
