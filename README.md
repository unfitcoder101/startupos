# StartupOS

A unified internal operations dashboard for early-stage startups. Pulls GitHub activity, lead data from Google Sheets, and automates alerts via Slack — all in one place.

Built for founders running 2-10 person teams who can't afford a $500/month Zapier + Notion stack.

**Live Demo:** https://startupos-beta.vercel.app  
**Backend API:** https://your-render-url.onrender.com                 
**Demo Video:** [Loom link — add after recording]

---
                                 
## What It Does                                 

- **Multi-tenant workspaces** — each founder manages their own startup data
- **GitHub integration** — live PR, issue, and commit counts for any repo
- **Google Sheets integration** — reads lead/data sheets directly via service account
- **Alert engine** — rule-based threshold alerts (e.g. "if open PRs > 10, ping Slack")
- **Automated scheduling** — hourly cron job auto-checks all alerts
- **Weekly email digest** — every Monday, users get a summary of their workspace metrics
- **GitHub webhook receiver** — accepts real-time push events from GitHub
- **React dashboard** — create workspaces, set alerts, trigger engine manually

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose)  
**Frontend:** React, Tailwind CSS, React Router  
**Auth:** JWT + bcrypt  
**External APIs:** GitHub REST API, Google Sheets API v4  
**Automation:** node-cron, Slack incoming webhooks, Nodemailer  
**Architecture:** MVC + service layer pattern  
**Deployment:** Render (backend), Vercel (frontend), MongoDB Atlas (database)

---

## Architecture

Routes → Middleware (JWT auth) → Controllers → Services → External APIs / DB       

- **Controllers** stay thin — just request/response handling           
- **Services** hold all business logic (testable, reusable, callable from cron OR HTTP)
- **Models** define data shape and relationships          
- **Middleware** handles cross-cutting auth concerns            
       
This separation means the alert engine runs identically from a cron job, an HTTP endpoint, or any future trigger — no code duplication.

---

## API Endpoints

### Auth
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — get JWT token         
- `GET /api/auth/me` — current user (protected)        

### Workspaces
- `POST /api/workspaces` — create workspace (protected)
- `GET /api/workspaces` — list user's workspaces (protected)

### Integrations
- `GET /api/integrations/github/:owner/:repo` — fetch live repo stats        
- `GET /api/integrations/sheets/:sheetId` — fetch sheet rows           
- `POST /api/integrations/webhook/github` — receive GitHub webhook events         

### Alerts 
- `POST /api/alerts` — create alert rule (protected)
- `GET /api/alerts` — list user's alerts (protected)              
- `POST /api/alerts/run` — manually trigger alert engine (protected)
- `POST /api/alerts/digest` — manually trigger weekly digest (protected)            

---

## Data Model

User → owns → Workspace → has many → Alert

Each alert references a workspace. Each workspace references a user. Ownership enforced at every endpoint via JWT + Mongoose population.

---

## Local Setup

```bash
git clone https://github.com/unfitcoder101/startupos.git
cd startupos
npm install
```

Create `.env`:
PORT=5050

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

GITHUB_TOKEN=your_github_pat

GOOGLE_SHEET_ID=your_test_sheet_id

EMAIL_USER=your_gmail

EMAIL_PASS=your_gmail_app_password

Add `google-credentials.json` (Google Cloud service account key) to project root.

```bash
node index.js
```

Frontend setup:

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
- Cooldown logic prevents spam (1-hour minimum between fires)
- Weekly email digest keeps founders informed without logging in
- GitHub webhook receiver enables real-time event processing
- All external API calls isolated in service modules — swap GitHub for GitLab in one file

---

## Roadmap

- [x] Backend (auth, integrations, alerts, cron)
- [x] React dashboard with full CRUD UI
- [x] Deployed to Render + Vercel
- [x] Weekly email digest
- [x] GitHub webhook receiver
- [ ] AI workflow suggestions (future)
- [ ] Drag-and-drop workflow builder (future)
- [ ] Multi-channel alerts — SMS, Discord (future)

---

## Author

Built by [Harshvardhan Kasliwal](https://github.com/unfitcoder101) — MCA student at NIT Jamshedpur, founder of Elevana Global.

Open to remote backend / full-stack internships.  
[Twitter/X](https://x.com/unfitcoder) · [LinkedIn](https://www.linkedin.com/in/harshvardhan-kasliwal-675207229/)
