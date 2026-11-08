# DEVFLOW CRM — The Intelligent Operating System for Software Companies

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748.svg)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C2.svg)](https://deepmind.google/technologies/gemini/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

> **DevFlow CRM** is a commercial-grade, multi-tenant enterprise operating system engineered exclusively for software development agencies, web/mobile studios, SaaS teams, AI/ML firms, and IT consultancies.
> It unifies the entire software agency lifecycle:
> **Enquiry → Lead → Client → Deal → Proposal → Contract → Project → Sprints → Kanban → Delivery → Billing → SLA Support → Retention.**

---

## 1. System Architecture

```
DEVFLOW-CRM/
├── apps/
│   ├── web/                    # Next.js 14 App Router, Tailwind CSS, Recharts, Framer Motion
│   └── api/                    # Enterprise Modular Node.js / Express Server & WebSockets
├── packages/
│   ├── database/               # Prisma ORM, PostgreSQL models, migrations, demo seed
│   ├── shared-types/           # TypeScript interfaces, enums (14 user roles, statuses)
│   └── validation/             # Zod input validation schemas
├── infrastructure/
│   └── docker/                 # Dockerfiles for API and Web services
├── tests/                      # Automated business logic and tenant isolation tests
├── docker-compose.yml          # PostgreSQL 16 + Redis 7 + API + Web
└── DEVELOPMENT_STATUS.md       # Complete 10-Stage progress matrix
```

---

## 2. All 16 Core Business Modules

| Module # | Module Name | Capabilities & Features |
|:---:|---|---|
| **01** | **Executive Dashboard** | Real-time MRR, billed revenue, project health distribution, sales funnel, and Gemini AI insights. |
| **02** | **Client Directory** | Account categorization, contact directory, 0-100 health scoring, and CSV export. |
| **03** | **Lead Management** | Inbound capture (Clutch, Website, LinkedIn), AI lead scoring, and 1-click deal conversion. |
| **04** | **Sales Pipeline** | Multi-stage Kanban pipeline, deal probabilities, revenue forecasting, proposals, and contracts. |
| **05** | **Project Management** | Web, Mobile, SaaS, AI/ML projects, Gantt timeline view, sprints, and budget margins. |
| **06** | **Tasks & Bug Tracking** | Agile Kanban board (Backlog, Todo, In Progress, Review, Testing, Done), P1 bug flags, time estimates. |
| **07** | **Team & Skills Matrix** | Employee rosters, technical skills tags, hourly billable rates, and 40h/wk capacity tracking. |
| **08** | **Time Tracking** | Live engineer stopwatch timer, billable vs non-billable entries, timesheets, and margin sync. |
| **09** | **Client Portal** | Isolated client login view (`/portal`), deliverable review, milestone approvals, invoice payment. |
| **10** | **Finance & Billing** | Precise decimal calculations, itemized line-item invoices, payment recording, profit margins. |
| **11** | **Support & Helpdesk** | SLA countdown timers, priority matrix (Urgent, High, Medium, Low), and ticket resolution workflows. |
| **12** | **Communication Hub** | Engineering discussions, technical RFCs, sprint standup threads, and system activity logs. |
| **13** | **AI Business Copilot** | Gemini 2.5 Flash / Pro integration, context retrieval across tenant DB, proposal generation. |
| **14** | **Workflow Automations** | Visual Trigger-Condition-Action builder with real-time test execution simulator. |
| **15** | **Business Analytics** | Developer productivity matrix, monthly P&L charts, acquisition channel ROI, SLA compliance. |
| **16** | **SaaS Administration** | SuperAdmin tenant directory, 4 subscription tiers (Starter, Pro, Business, Enterprise), audit vault. |

---

## 3. Visual Identity & Design System

- **Background**: `#090B12` (Ultra Dark Studio)
- **Secondary Background**: `#101421`
- **Card Background**: `#151A29`
- **Primary Accent**: Electric Violet (`#8B5CF6`)
- **Secondary Accent**: Cyan (`#06B6D4`)
- **Positive / Margin Accent**: Emerald (`#10B981`)
- **Critical / Bug Accent**: Rose (`#F43F5E`)
- **Warning / Pipeline Accent**: Amber (`#F59E0B`)

---

## 4. Multi-Tenant Isolation & Security

1. **Mandatory Tenant Context**: Every database record includes an `organizationId` foreign key referencing the tenant organization.
2. **Session Verification**: The API middleware verifies JWT tokens and extracts the active workspace. Browser-supplied tenant IDs are strictly verified against user membership permissions.
3. **Decimal Arithmetic**: All financial calculations (budgets, invoices, taxes, hourly labor costs) use precise decimal math to eliminate floating-point drift.

---

## 5. Quickstart & Local Setup

### Option A: Standard Local Development

1. **Clone & Install Dependencies**:
   ```bash
   cd DevFlow-CRM
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Optional: set your `GEMINI_API_KEY` for live AI generation).*

3. **Start the API Server**:
   ```bash
   npm run dev:api
   ```
   *The backend starts at `http://localhost:4000` with pre-seeded enterprise demo data ("Nexus Software Labs").*

4. **Start the Web Frontend**:
   ```bash
   npm run dev:web
   ```
   *The frontend dashboard opens at `http://localhost:3000`.*

5. **Run the Automated Business Tests**:
   ```bash
   node tests/business-workflow.test.js
   ```

---

### Option B: Docker Compose Full Stack

To spin up PostgreSQL 16, Redis 7, the NestJS/Express API, and the Next.js Frontend in containers:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- API Healthcheck: `http://localhost:4000/health`
