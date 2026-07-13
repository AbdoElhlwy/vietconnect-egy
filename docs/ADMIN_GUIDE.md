# Admin Guide

Access `/[locale]/admin` while logged in with a staff role (Super Admin, Embassy Admin, Consular
Officer, Student Officer, Business Officer, Analyst, Content Editor, or Emergency Officer). Access
is enforced **server-side** in `src/app/[locale]/admin/page.tsx` — non-staff users are redirected.

## What's included in this MVP admin panel
- Live KPI cards: total users, students, companies, requests, open requests, confirmed
  appointments, open emergencies, published news.
- A table of the most recent service requests with requester name, type, and status.
- **`/admin/requests`** — change the status/assignee of any service request, with a CSV export
  button.
- **`/admin/users`** — approve/suspend accounts, activate/deactivate accounts, and assign roles.
- **`/admin/news`** — create news articles (trilingual) and move them through the editorial
  workflow: Draft → Pending Review → Published → Archived (and back). Only `PUBLISHED` articles
  appear on the public site.

## Managing data not yet covered by a dedicated admin UI
Until admin CRUD screens exist for every entity (events, scholarships, internships, jobs,
directory places, partners, FAQs, translations, system settings), the fastest safe path is:
```bash
npx prisma studio
```
This opens a local GUI over the real database — safe for demo/staging use to add universities,
companies, events, directory places, FAQs, and to adjust `SystemSetting` values such as
`officialEndorsement`.

## Adding staff and assigning roles
1. Have the person register normally (or create the user directly in Prisma Studio).
2. Go to `/admin/users` and use the role dropdown next to their name to assign a role — this calls
   the same `assignRole` Server Action used everywhere else, so it is permission-checked
   server-side.
3. Roles inherit permissions from `RolePermission` — see `prisma/seed.ts` for how permissions are
   currently wired to `SUPER_ADMIN`; extend this pattern (or build a `/admin/permissions` screen)
   for other staff roles as needed.

## Toggling "official" status
The `officialEndorsement` key in `SystemSetting` exists specifically so the platform never implies
official embassy endorsement unless an authorized admin explicitly sets it to `"true"`. Front-end
copy referencing official status should always check this flag before rendering.
