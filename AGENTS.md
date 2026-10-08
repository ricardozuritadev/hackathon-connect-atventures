<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mis Tratamientos (Medicity) — Agent Guide

Actionable context for AI coding agents working in this repository. Base changes on the codebase and this file; do not invent libraries, databases, or auth that are not present.

---

## 1. Project overview

**Mis Tratamientos** is a Farmaenlace hackathon demo embedded in a **Medicity** storefront shell. Patients register recurring treatments, digitize prescriptions with AI, confirm extracted instructions, see simulated insurance/copay and PMF promotions, complete a simulated purchase, activate simulated WhatsApp reminders, and manage continuity (panel + repurchase).

| Real (production-like) | Simulated (demo-labeled) |
|------------------------|--------------------------|
| Prescription image upload + validation | Insurance coverage lookup |
| OpenAI structured OCR (`POST /api/prescriptions/extract`) | Payment / delivery fulfillment |
| Human review/edit of extraction before continuing | WhatsApp messaging |
| Client demo session state (`sessionStorage`) | PMF catalog / promotion progress |

Product copy and UI language: **Spanish**. Code, routes, files, and identifiers: **English**.

Functional specification (business context, not runtime): `docs/mis_tratamientos_especificacion_dev.pdf` (path may be gitignored via `/docs/*`). Prefer code as source of truth for implemented behavior. `README.md` still describes an earlier “Phase 1” OCR-only entry URL; the live app centers on `/` and `/treatments/*`.

---

## 2. Technology stack

Verified from `package.json` / config (do not assume extras):

| Area | Choice |
|------|--------|
| Framework | Next.js **16.4.0** (App Router) |
| UI runtime | React **19.3.0**, React DOM **19.3.0** |
| Language | TypeScript **^5**, `strict: true` (`tsconfig.json`) |
| Styling | Tailwind CSS **^4**, `tw-animate-css`, shadcn **^4.21.4** |
| UI primitives | `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react` |
| Validation | Zod **^4.6.5** |
| AI | `openai` **^7.30.1** (Responses API + Zod structured output) |
| Fonts | Roboto (`--font-sans`), Geist Mono (`app/layout.tsx`) |
| Path alias | `@/*` → repo root |

**Not present in this repo:** database, ORM, auth provider, `middleware.ts`, Server Actions for mutations, React Query/SWR, react-hook-form/Formik, i18n framework, E2E test runner, Storybook.

Next config (`next.config.ts`): `cacheComponents: true`, `partialPrefetching: true`, Turbopack CSS via `@tailwindcss/turbopack`.

---

## 3. Architecture

```
Browser (Medicity shell + treatment screens)
    │
    ├─ Client demo store (useSyncExternalStore + sessionStorage)
    │
    └─ POST /api/prescriptions/extract  →  validate image  →  OpenAI  →  Zod parse
```

- **App Router** with thin Server Component `page.tsx` files (metadata + `Suspense`) and named client screens for interactivity.
- **Root layout** (`app/layout.tsx`) wraps the tree in `TreatmentDemoProvider` (client).
- **One API route:** `app/api/prescriptions/extract/route.ts` (`maxDuration = 60`).
- **Domain types / demo entities:** Zod schemas in `lib/treatments/types.ts`.
- **OCR pipeline:** `lib/validations/image.ts` → `lib/ai/openai.ts` + `lib/ai/prompts.ts` → `lib/validations/prescription.ts`.
- **API envelope:** `lib/api/errors.ts` — `{ success: true, data }` | `{ success: false, error: { code, message } }`.

Prefer Server Components unless interactivity, browser APIs, or demo-store hooks are required (`"use client"`).

---

## 4. Directory map

```
app/
  layout.tsx, page.tsx, globals.css
  treatments/                    # Mis tratamientos flows
    page.tsx                     # list / empty state
    promotions/page.tsx
    register/{profile,prescription,confirm,insurance,benefits,checkout,confirmation}/
    [treatmentId]/page.tsx
    [treatmentId]/repurchase/page.tsx
  prescriptions/extract/page.tsx # redirects → register/prescription
  api/prescriptions/extract/route.ts
components/
  medicity/                      # header, drawer, shell, home, logo
  treatments/                    # flow screens, provider, shared UI
  prescriptions/                 # OCR building blocks (some legacy extract UI)
  ui/                            # shadcn primitives
lib/
  ai/                            # OpenAI client + prompts
  api/                           # HTTP error/success helpers
  demo/                          # fixtures, sessionStorage, external store
  treatments/types.ts            # demo domain schemas
  validations/                   # image + prescription Zod/tests
  utils.ts                       # re-exports `cn`
public/medicity/                 # brand assets
```

---

## 5. Routes and user flows

| URL | Purpose |
|-----|---------|
| `/` | Medicity home → Mis tratamientos |
| `/treatments` | Empty state or treatment list |
| `/treatments/promotions` | Demo promotions |
| `/treatments/register/profile` | Minimal profile (demo: “Para mí”) |
| `/treatments/register/prescription` | Upload + real OCR |
| `/treatments/register/confirm` | Confirm instructions (+ insurance modal) |
| `/treatments/register/insurance` | Simulated insurer form |
| `/treatments/register/benefits` | Price / coverage / copay vs promo |
| `/treatments/register/checkout` | Delivery + simulated pay |
| `/treatments/register/confirmation` | Success + WhatsApp prefs (simulated) |
| `/treatments/[treatmentId]` | Treatment panel + demo time jump |
| `/treatments/[treatmentId]/repurchase` | Simulated repurchase |
| `/prescriptions/extract` | Legacy redirect to prescription step |
| `POST /api/prescriptions/extract` | OCR API |

Happy path: Home → treatments → profile → prescription (OpenAI) → confirm → insurance (optional) → benefits → checkout → confirmation (WhatsApp) → panel → (demo jump) → repurchase.

---

## 6. Data and state (no database)

There is **no** persistence database. Demo state lives in memory + `sessionStorage` key `mis-tratamientos-demo-v1` (`lib/demo/session-store.ts`, `lib/demo/demo-store.ts`).

Core entities (Zod-inferred in `lib/treatments/types.ts`):

- `UserProfile`, `DraftFlow`, `Treatment`
- `InsuranceInfo`, `PricingSummary`, `PromotionProgress`
- `DeliveryMode`, `NotificationPreferences`, `ConfirmedMedication`
- `DemoState` (`profile`, `draft`, `treatments`, `demoClock`, `doseConfirmedToday`)

Fixtures: `lib/demo/fixtures.ts` (pricing, insurers, promotion labels, date helpers).

Access pattern: `useTreatmentDemo()` from `components/treatments/treatment-demo-provider.tsx`. SSR snapshot uses a placeholder `demoClock`; real clock is set on client hydrate.

Prescription OCR entity: `PrescriptionExtraction` / `Medication` in `lib/validations/prescription.ts` (`status`: `success` | `partial` | `unreadable`).

---

## 7. Prescription OCR integration (preserve)

Working path (do not break without strong justification):

1. Client: `components/treatments/register/prescription-upload-flow.tsx` — `FormData` field `image`.
2. Client validates size/MIME (magic bytes helpers shared with server).
3. `POST /api/prescriptions/extract` → `validatePrescriptionImage` → `extractPrescriptionFromImage`.
4. OpenAI `responses.parse` + `prescriptionExtractionSchema`; default model `gpt-4.1-mini`.
5. Navigate to confirm; user must review/edit before continuing.

**Do not:** move `OPENAI_API_KEY` to the client; silently mock OCR; change the success/error JSON contract without updating all callers; invent dosages in prompts or UI.

Legacy UI: `components/prescriptions/prescription-extract-client.tsx` is not mounted by current pages (route redirects). Reuse pieces (upload/preview/privacy) rather than duplicating.

---

## 8. Coding standards

### TypeScript
- Keep `strict: true`. **Never use `any`.** Prefer Zod-inferred types and explicit unions.
- English names for types, functions, files, and routes.

### Components
- Thin `page.tsx`; screen logic in named components under `components/`.
- Reuse `components/ui/*` and existing treatments/medicity pieces before adding primitives.
- Single responsibility; composition over deep abstraction.
- Avoid new dependencies unless necessary.

### Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Functions/vars: `camelCase`
- UI strings and visible ARIA labels: Spanish

### Imports
- Prefer `@/` alias for project modules.
- `cn` via `@/lib/utils` or `cn` package (project already uses both patterns; match the file you edit).

### Forms
- No shared form library today. Profile/insurance use controlled inputs + manual checks; domain schemas exist in Zod for store/API — prefer aligning new validation with those schemas when extending.

---

## 9. Next.js App Router practices

- Prefer Server Components; add `"use client"` only for interactivity / hooks / browser APIs.
- With `cacheComponents` / PPR enabled: wrap dynamic `params` / `searchParams` / client-hook trees in `<Suspense>` with a fallback (see `components/treatments/loading-fallback.tsx`). Await `params` **inside** a Suspense child, not in the page shell before Suspense.
- Do not introduce Server Actions casually; current mutations are client demo-store updates + one Route Handler.
- Before using unfamiliar Next 16 APIs, read `node_modules/next/dist/docs/`.

---

## 10. Styling guidelines

- Tailwind v4 + CSS variables in `app/globals.css`.
- Brand tokens: `--medicity-blue` `#0070ba`, `--medicity-green` `#8db944`, `--medicity-blue-light` `#eaf5fb`, `--whatsapp` `#128c7e`, text/border/surface tokens, `--radius-pill` / `--radius-field` / `--radius-card`.
- Buttons: pill primary/outline/whatsapp variants in `components/ui/button.tsx`.
- Mobile-first; desktop uses Medicity header + narrow content column (~`max-w-xl`) for flow screens (`AppShell`).
- Assets: `public/medicity/` (do not leave temporary Figma MCP URLs in code).

---

## 11. Security and environment variables

| Variable | Where | Notes |
|----------|-------|--------|
| `OPENAI_API_KEY` | Server only | Required for OCR |
| `OPENAI_MODEL` | Server only | Optional; defaults to `gpt-4.1-mini` |
| `NEXT_PUBLIC_DEMO_MODE` | Client | Legacy flag; unused for autofill. Profile/insurance/start-date fill on input focus from `lib/demo/persona.ts` (never medication dose/frequency). |
| `NODE_ENV` | Runtime | Used for limited API error logging |

- Never prefix secrets with `NEXT_PUBLIC_`.
- Never commit `.env*` (gitignored). Do not paste real keys into docs or code.
- Validate uploads on the server (magic bytes, 5 MB, jpeg/png/webp).
- Do not log image bytes or full prescription payloads.
- Demo only: instruct users to use fictional prescriptions (`PrivacyNotice`).

There is **no** authentication or authorization layer in this codebase.

---

## 12. Error handling

- API: use `errorResponse` / `successResponse` and `ErrorCodes` from `lib/api/errors.ts`; map OpenAI failures via `mapOpenAIError`.
- Client OCR: show `payload.error.message`; network failures get a Spanish connection message; use `requestIdRef` (or equivalent) to ignore stale responses.
- Flow guards: client redirects when draft prerequisites are missing (e.g. no extraction → prescription step).
- Simulated failures should remain honest (Demo banner), not silent fakes of OpenAI.

---

## 13. Testing and validation commands

```bash
npm run dev          # local development
npm run build        # production build (Cache Components / PPR)
npm run start        # serve build
npm run lint         # ESLint (eslint-config-next)
npm test             # tsx --test lib/**/*.test.ts
npx tsc --noEmit     # typecheck (not an npm script; useful before PR)
```

Existing tests: `lib/validations/image.test.ts`, `lib/validations/prescription.test.ts`, `lib/treatments/confirm-medications.test.ts`, `lib/demo/persona.test.ts`. There is no E2E suite; when changing OCR or flows, manually smoke the happy path and upload validation.

---

## 14. Important business rules

1. **OCR is a proposal, not truth.** User must confirm instructions before continuing; never activate reminders directly from raw OCR.
2. **Do not invent** medication names, doses, frequencies, or durations in prompts or UI fill-ins.
3. **Block progress** when extraction is `unreadable`, empty medications, or ambiguous dose/frequency on confirm.
4. **Insurance coverage ≠ PMF promotion** — keep them visually and semantically separate (see benefits / copay UI).
5. **Demo path defaults:** self patient, home delivery + online pay enabled; other delivery modes may be visible but disabled.
6. **Simulated integrations** (insurance, payment, WhatsApp, promo catalog) must remain explicitly labeled (`DemoBanner` or equivalent).
7. **Prescription optional in product principle**, but the implemented demo happy path requires a prescription scan.
8. WhatsApp copy must clarify reminders **do not replace medical advice** (confirmation screen).
9. **Tap-to-fill** on profile/insurance/start date may fill empty fields from the fictional persona on focus. It must never autofill medication dose/frequency or skip the “¿Has revisado las instrucciones…?” modal after valid confirm.

---

## 15. Known constraints and non-goals

- Hackathon / demo scope — not a production pharmacy system.
- No real WhatsApp, payment gateway, insurer API, or inventory.
- No multi-user family consent flows (UI may show disabled “familiar”).
- No durable server persistence of treatments.
- Desktop page frames are limited; responsive behavior is mobile-first + header adaptation.
- Do not introduce a second design system; extend Medicity tokens + shadcn.

---

## 16. Instructions for future AI agents

1. Read this file and inspect existing files before adding patterns or dependencies.
2. For Next.js APIs, consult `node_modules/next/dist/docs/` (this is Next 16, not older mental models).
3. Preserve the OpenAI OCR contract and server-side key handling.
4. Keep route/file/code identifiers in **English**; user-facing strings in **Spanish**.
5. Reuse `components/ui`, `components/medicity`, `components/treatments`, and `lib/*` helpers.
6. Prefer adapting UI to existing services over rewriting working OCR.
7. Label every simulation; never silently replace OpenAI with mocks.
8. Respect Cache Components: Suspense boundaries for dynamic client/params usage.
9. Never use TypeScript `any`; keep changes small and consistent with neighboring files.
10. Before finishing: run `npm run lint`, `npm test`, and `npx tsc --noEmit` (and `npm run build` for route/PPR-sensitive changes).
11. Do not remove the `BEGIN:nextjs-agent-rules` / `END:nextjs-agent-rules` block at the top of this file.
12. Do not commit secrets or patient-real prescription images.
