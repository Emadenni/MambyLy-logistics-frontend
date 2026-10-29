# Admin

Sign-in at `/login`, admin at `/admin/*` (code in `src/admin`, styles in `src/admin/admin.scss`,
all scoped under `.ad-*`).

| Route | Screen |
| --- | --- |
| `/admin/messages` | Client messages: table on tablet/desktop, cards on phones |
| `/admin/messages/:id` | One message: full text, copy email, reply in the email app, delete |
| `/admin/applications(/:id)` | Job applications, same views, with the CV link |
| `/admin/positions` | Open job positions (shown on the public jobs page): add, delete |
| `/admin/admins` | Admin accounts: add, edit name/email/role, delete |

The account menu holds change password, change profile image, a link to the website and sign out.

## What did not change

Requests go through the existing hooks in `src/hooks` with the same endpoints, methods, headers
and bodies. The session also works as before: the token and admin id live in `sessionStorage`,
and a 401 calls `useAuthStore.handleUnauthorized`, which shows "session expired" on `/login`. The
hooks now return their outcome to the screen instead of calling `alert()` or reloading the page.

## Limits of the API (as it is today)

- `GET /clientsMessages` and `GET /jobMessages` return the whole collection at once, with no
  paging, server-side search or filtering. The search and filters in the admin only work on what
  was loaded, and the screen says so.
- Messages have no read/unread state, so the admin does not show one.
- Messages are only stored. No e-mail is sent when one arrives (see the contact notes).
- After a password change, the hook signs out after 5 seconds and opens the home page.

## Tests

The e2e suite (`adm-e2e.mjs`, local, against a build with
`VITE_API_BASE_URL=https://execute-api.invalid`) answers every request with a mock. It covers:

- sign-in success and failure;
- session expiry;
- list, empty and error states, and retry;
- search and filters;
- detail and Back (filters and scroll position are kept);
- deletes with confirmation;
- double-click guards;
- phone, tablet, desktop and 200 % zoom.
