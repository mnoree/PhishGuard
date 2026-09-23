# PhishGuard V3 — Foundation

Frontend-only academic demo. No real email delivery, no real phishing campaign deployment, and no real credential collection.

## Demo accounts
- Admin: admin@phishguard.demo / Admin123!
- User: sara@phishguard.demo / User123!

## Current scope
- Unified design system
- Centralized localStorage demo data layer
- Role-based client-side routing
- Login/register/reset demo flows
- User dashboard and simulation flow
- Admin dashboard foundation

## Important
localStorage is used only for the graduation-demo implementation. It is not a production authentication or security boundary. A real deployment would require a backend, secure password hashing, server-side authorization, and persistent database storage.


## Campaign Builder
Admin users can now create campaigns, choose a pre-made phishing scenario, select target users, save drafts or publish immediately, pause active campaigns, and inspect target/completion status. Campaigns are persisted in localStorage for the academic demo.
