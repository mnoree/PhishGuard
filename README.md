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

## Public demo safety

PhishGuard is a frontend-only academic cybersecurity awareness simulation. The GitHub Pages demo uses role-based demo access instead of collecting real passwords. It does not send real email/SMS/phone messages and does not transmit or store real credentials. Simulation credential-attempt events represent awareness behavior only.

Demo access:
- Admin: `admin@phishguard.demo`
- User: `sara@phishguard.demo`
