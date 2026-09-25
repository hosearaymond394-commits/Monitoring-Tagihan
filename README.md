# Monitoring Tagihan Vendor — Distribution

Aplikasi monitoring tagihan vendor untuk tim Distribution (Pertamina Lubricants).
Migrasi dari prototype HTML statis ke aplikasi Next.js (App Router + TypeScript)
yang benar-benar runnable, siap dikembangkan lebih lanjut, dan siap dideploy
sebagai container ke Google Cloud Run.

**Bukan pengganti SAP.** Aplikasi ini hanya untuk monitoring, tracking, visibility,
notifikasi, aging, dan follow-up. Proses transaksi/finance tetap di SAP.

---

## 1. Project Overview

Fitur yang tersedia:

- **Dashboard** — KPI (total/submitted/finance process/SAP posted/paid/overdue),
  Invoice Aging, Status Distribution, Trend, Alur Proses, tabel Tagihan Perlu
  Perhatian & Tagihan Terbaru — dengan filter vendor/DSP/status/pencarian.
- **Input Tagihan** — form input tagihan baru + upload dokumen pendukung (mock).
- **Daftar Tagihan** — tabel dengan filter lengkap (vendor, status, DSP, aging,
  pencarian) dan pagination.
- **Tracking Tagihan** — pencarian tagihan, detail, timeline proses, activity
  history, dan panel follow-up (last/next follow-up, riwayat, PIC ownership).
- **Laporan** — ringkasan KPI, trend, distribusi status/aging, outstanding per
  vendor. Tombol export Excel/PDF (placeholder, belum terhubung backend nyata).
- **Master Data** — referensi Vendor, DSP/Plant, PIC, Status, Payment Terms.
- **Notification Center** — dihitung otomatis dari data billing (overdue, aging
  warning, dokumen belum lengkap, aksi Finance yang menunggu).
- **API** — `GET/POST /api/billings`, `GET/PATCH /api/billings/[id]`,
  `GET /api/health`.

## 2. Architecture

```
/app                 Next.js App Router (pages per route + /api route handlers)
  /dashboard, /input-tagihan, /daftar-tagihan, /tracking-tagihan, /laporan, /master-data
  /api/billings, /api/billings/[id], /api/health
/components          UI components, split by area (layout, ui, dashboard, billing, tracking, notifications, master)
/lib                  Pure business logic: aging.ts, format.ts, filters.ts, timeline.ts
/types                TypeScript type definitions (billing.ts, reference.ts)
/data                 Reference/master data + mock billing dataset (mockBillings.ts)
/repositories         BillingRepository interface + MockBillingRepository (in-memory)
/services             NotificationService, UploadService (mock implementations, ready for real providers)
/public               Static assets
```

**Data flow today:** Page (server component) → `billingRepository` (mock,
in-memory) → rendered by components. Nothing is hard-coded directly in UI
components — all data comes through `/data` and `/repositories`.

**Swapping in a real database:** implement `BillingRepository`
(`repositories/billingRepository.ts`) against Postgres/Supabase/Cloud SQL —
e.g. `repositories/postgresBillingRepository.ts` — then change the export in
`repositories/mockBillingRepository.ts` (or point `app/api/*` and pages at the
new file). No page or component needs to change.

**File uploads** currently go through `services/uploadService.ts`, which does
**not** persist anything remotely — it only reports the selected file name back
to the form. Wire it to Google Cloud Storage (bucket via `STORAGE_BUCKET`) when
ready; the `uploadDocument()/getDocument()/deleteDocument()` contract stays the
same.

**Notifications** go through `services/notificationService.ts`. Notification
Center content (`buildNotifications`) is computed live from billing data.
Actual delivery (`sendNotification/sendEmail/sendWhatsApp`) is currently mocked
(logs only) — connect a real provider via `EMAIL_SERVICE_URL` /
`NOTIFICATION_PROVIDER`.

## 3. Local Development

Requirements: Node.js 20+.

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build & run production mode locally (without Docker):

```bash
npm run build
npm start
# reads PORT env var, defaults to 3000
```

## 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in what you have:

```bash
cp .env.example .env.local
```

| Variable                  | Purpose                                                        |
|----------------------------|------------------------------------------------------------------|
| `NEXT_PUBLIC_APP_NAME`     | Display name, currently informational                          |
| `PORT`                     | Port the server listens on (Cloud Run sets this automatically) |
| `DATABASE_URL`             | Empty = uses `MockBillingRepository`. Set once a real DB repository is implemented |
| `STORAGE_BUCKET`           | Google Cloud Storage bucket, for a real `UploadService`         |
| `EMAIL_SERVICE_URL`        | For a real `NotificationService.sendEmail`                     |
| `NOTIFICATION_PROVIDER`    | For a real `NotificationService.sendWhatsApp` / push provider  |

No secrets are committed to source control — `.env`, `.env.local` are gitignored.

## 5. Docker Build

```bash
docker build -t monitoring-tagihan:local .
```

## 6. Docker Run (local)

```bash
docker run --rm -p 8080:8080 -e PORT=8080 monitoring-tagihan:local
# open http://localhost:8080
```

Or via docker-compose:

```bash
docker compose up --build
```

Health check: `curl http://localhost:8080/api/health` → `{"status":"ok"}`

## 7. Google Cloud Setup

```bash
# One-time setup
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

## 8. Artifact Registry

```bash
# 1. Create the repository (once)
gcloud artifacts repositories create REPOSITORY \
  --repository-format=docker \
  --location=REGION \
  --description="Monitoring Tagihan images"

# 2. Configure Docker auth
gcloud auth configure-docker REGION-docker.pkg.dev

# 3. Build
docker build -t REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY/SERVICE_NAME:v1 .

# 4. Tag (if you built with a different local tag)
docker tag monitoring-tagihan:local REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY/SERVICE_NAME:v1

# 5. Push
docker push REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY/SERVICE_NAME:v1
```

Use a version tag (`v1`, `v2`, ...) or the Git commit SHA — avoid relying only
on `latest`.

## 9. Cloud Run Deployment

```bash
gcloud run deploy SERVICE_NAME \
  --image=REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY/SERVICE_NAME:v1 \
  --region=REGION \
  --platform=managed \
  --port=8080 \
  --cpu=1 \
  --memory=512Mi \
  --min-instances=0 \
  --max-instances=3 \
  --allow-unauthenticated
```

Adjust `--min-instances` / `--max-instances` / `--memory` for your traffic.
Set environment variables (never secrets in Git) via:

```bash
gcloud run services update SERVICE_NAME \
  --region=REGION \
  --set-env-vars=NEXT_PUBLIC_APP_NAME="Monitoring Tagihan"
```

For actual secrets (DB credentials, API keys), use Secret Manager and
`--set-secrets` instead of `--set-env-vars`.

**Or use `cloudbuild.yaml`** (build → push → deploy in one pipeline):

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_REGION=REGION,_REPOSITORY=REPOSITORY,_SERVICE_NAME=SERVICE_NAME
```

## 10. Troubleshooting

- **Build fails on `npm run build`** — check `npm run lint` first; TypeScript
  errors block the production build by design.
- **Container starts but Cloud Run reports "container failed to start"** —
  confirm the app listens on `0.0.0.0:$PORT` (it does, via `next start -p
  ${PORT}` / the standalone `server.js`), and that `--port` in the deploy
  command matches `EXPOSE`/`ENV PORT` in the Dockerfile (8080).
- **`/api/health` returns 404** — make sure you're hitting the deployed
  revision's URL, not a stale one; Cloud Run keeps old revisions around unless
  you clean them up.
- **Data resets after restart** — expected: `MockBillingRepository` is
  in-memory. Implement a real repository once a database is available.

## 11. Future Roadmap

- **Database**: implement `PostgresBillingRepository` (or Supabase/Cloud SQL)
  against the existing `BillingRepository` interface.
- **Storage**: wire `UploadService` to Google Cloud Storage.
- **Notifications**: connect `NotificationService` to a real email/WhatsApp
  provider.
- **Auth & role-based access**: `ADMIN / DISTRIBUTION / FINANCE / VENDOR /
  MANAGEMENT` roles are modeled (`types/reference.ts`) but not yet enforced —
  add real authentication and per-route guards.
- **SAP / ERP integration**: current flow is `Manual Input → Web Monitoring →
  Notification`. Future flow is `SAP / ERP → Billing Monitoring →
  Notification / Analytics` — out of scope for this phase by design.
