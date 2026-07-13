# API Documentation

Most mutations in this MVP go through **Next.js Server Actions** (see `src/actions/`), which are
not traditional REST endpoints — they are called directly from React forms. The following are the
actual HTTP endpoints exposed by the app:

## `POST /api/auth/[...nextauth]`
Handled by Auth.js. Used internally by `signIn()` / `signOut()` on the client. Do not call
directly; use the NextAuth client helpers.

## `POST /api/assistant`
Chat with the VietConnect AI assistant.

**Request body**
```json
{
  "locale": "ar" | "en" | "vi",
  "messages": [{ "role": "user", "content": "How do I book an appointment?" }]
}
```

**Response**
```json
{ "reply": "...", "provider": "mock" }
```

Validated with Zod server-side; messages capped at 20 per request and 2000 characters each.

## Server Actions (called from forms, not fetch())
| Action | File | Purpose |
|---|---|---|
| `registerUser` | `src/actions/register.ts` | Create a new account + role assignment |
| `createServiceRequest` | `src/actions/requests.ts` | Open a new consular/support case |
| `bookAppointment` | `src/actions/appointments.ts` | Book an appointment slot (capacity-checked) |
| `submitEmergency` | `src/actions/emergency.ts` | Create an emergency case ticket |
| `translateText` | `src/actions/translate.ts` | Translate text via the AI provider, logged to `Translation` |

## Extending with a public REST/GraphQL API
Because all business logic already lives in typed functions backed by Prisma, adding
`src/app/api/v1/**/route.ts` Route Handlers that call the same underlying Prisma queries (wrapped
in the same `requirePermission` checks) is a mechanical, low-risk extension for Phase 3 external
integrations.
