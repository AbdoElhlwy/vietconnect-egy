# Architecture Overview

## High-level
- **Rendering:** Next.js 15 App Router, mostly React Server Components, with client components
  only where interactivity is required (forms, chat widget, language switcher).
- **Routing/i18n:** A `[locale]` dynamic segment (`ar` | `en` | `vi`) wraps every public/user page.
  `src/middleware.ts` detects the preferred locale (cookie first, default `ar`) and redirects
  un-prefixed paths.
- **Data layer:** Prisma Client (`src/lib/prisma.ts`) as a singleton, talking to PostgreSQL.
- **Auth:** Auth.js v5 credentials provider (`src/lib/auth.ts`), JWT session strategy, Prisma
  adapter for account/session persistence.
- **Authorization:** `src/lib/rbac.ts` provides `userHasPermission` / `requirePermission`, checked
  inside Server Actions and server-rendered pages (e.g. `admin/page.tsx`) — never only in the UI.
- **Mutations:** Next.js Server Actions (`src/actions/*.ts`) — validated with Zod, executed with
  Prisma, wrapped with `useActionState` on the client for progressive enhancement.
- **AI layer:** Adapter pattern (`src/lib/ai/adapter.ts`) picks Mock/OpenAI/Anthropic based on
  `AI_PROVIDER` and key presence, so the platform works fully offline by default.
- **Email:** `src/lib/mailer.ts` uses Nodemailer; without `SMTP_HOST` configured it logs a preview
  instead of failing, so the app works in development with zero email setup.

## Request lifecycle example (creating a service request)
1. User submits `NewRequestForm` (client component) → calls Server Action `createServiceRequest`.
2. Action calls `auth()` to get the session; rejects if absent.
3. Zod validates the form payload.
4. Prisma creates the `ServiceRequest` row and an `AuditLog` entry.
5. `revalidatePath` refreshes the dashboard; the client shows a success message with the reference
   number.

## Why Server Actions instead of a separate NestJS API
For an MVP of this scope, colocating mutations with the Next.js app removes an entire deployment
target, keeps types shared end-to-end, and still gives full server-side control (validation,
authz, DB access) with no client-exposed business logic. If/when this platform needs to expose a
public API for external integrations (Phase 3), a dedicated NestJS (or Next.js Route Handlers)
API layer can be added alongside without touching the existing Server Actions.
