Good call separating the mock interview into its own chat — keeps this one focused on building.

---

## README — Use This Now, Update Tomorrow

Your README is solid as-is. Just add live links at the top and fix two stale lines:

```markdown
# StartupOS

A unified internal operations dashboard for early-stage startups. Pulls GitHub activity, lead data from Google Sheets, and automates alerts via Slack — all in one place.

Built for founders running 2-10 person teams who can't afford a $500/month Zapier + Notion stack.

**Live Demo:** https://startupos-beta.vercel.app
**Backend API:** https://startupos-backend.onrender.com

---

## What It Does

- **Multi-tenant workspaces** — each founder manages their own startup data
- **GitHub integration** — live PR, issue, and commit counts for any repo
- **Google Sheets integration** — reads lead/data sheets directly via service account
- **Alert engine** — rule-based threshold alerts (e.g. "if open PRs > 10, ping Slack")
- **Automated scheduling** — hourly cron job auto-checks all alerts
- **React dashboard** — live metrics, JWT-secured, deployed

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose)
**Frontend:** React, Tailwind CSS
**Auth:** JWT + bcrypt
**External APIs:** GitHub REST API, Google Sheets API v4
**Automation:** node-cron, Slack incoming webhooks
**Architecture:** MVC + service layer pattern

---

## Architecture

```
Routes → Middleware (auth) → Controllers → Services → External APIs / DB
```

- **Controllers** stay thin — just request/response handling
- **Services** hold all business logic (testable, reusable)
- **Models** define data shape and relationships
- **Middleware** handles cross-cutting auth concerns

This separation means the alert engine can run from a cron job, an HTTP endpoint, or any future trigger without rewriting logic.

---

## API Endpoints

### Auth
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — get JWT
- `GET /api/auth/me` — current user (protected)

### Workspaces
- `POST /api/workspaces` — create workspace (protected)
- `GET /api/workspaces` — list user's workspaces (protected)

### Integrations
- `GET /api/integrations/github/:owner/:repo` — fetch repo stats
- `GET /api/integrations/sheets/:sheetId` — fetch sheet rows

### Alerts
- `POST /api/alerts` — create alert rule (protected)
- `GET /api/alerts` — list user's alerts (protected)
- `POST /api/alerts/run` — manually trigger alert engine (protected)

---

## Data Model

```
User → owns → Workspace → has many → Alert
```

Each alert references a workspace. Each workspace references a user. Ownership is enforced at every endpoint via JWT + Mongoose population.

---

## Local Setup

```bash
git clone https://github.com/unfitcoder101/startupos.git
cd startupos
npm install
```

Create `.env`:
```
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
GITHUB_TOKEN=your_github_pat
GOOGLE_SHEET_ID=your_test_sheet_id
```

Add `google-credentials.json` (Google Cloud service account key) to project root.

Run:
```bash
node index.js
```

For frontend:
```bash
cd client
npm install
npm run dev
```

---

## What Makes This Different

Most "dashboards" are CRUD apps with charts. StartupOS is an **event-driven automation engine**:

- Alerts evaluate rules on a schedule, not just on demand
- Slack webhooks fire automatically when thresholds cross
- Cooldown logic prevents spam (1-hour minimum between fires of same alert)
- All external API calls are isolated in service modules — swap GitHub for GitLab in one file

---

## Roadmap

- [x] Backend complete (auth, integrations, alerts, cron)
- [x] React dashboard
- [x] Deployed to Render + Vercel
- [ ] Workspace + alert creation UI
- [ ] Email digest (weekly summary)
- [ ] Webhook receiver (auto-create requests from external events)

---

## Author

Built by [Harshvardhan Kasliwal](https://github.com/unfitcoder101) — MCA student at NIT Jamshedpur, founder of Elevana Global.

Open to remote backend / full-stack internships. Reach out on [Twitter/X](https://x.com/unfitcoder) or [LinkedIn](https://www.linkedin.com/in/harshvardhan-kasliwal-675207229/).
