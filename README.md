# GSF — Global Society of Founders

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

> **A Society for Founders. Not Talkers.**

GSF is a professional platform connecting student founders with world-class expert mentors via video call and chat, and providing an equity-based venture marketplace where students can list startup ideas and attract investors.

---

## 📚 Table of Contents

- [Live Platform](#live-platform)
- [Features](#features)
- [What GSF Does](#what-gsf-does)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture-route-groups--role-areas)
- [Route Inventory](#route-inventory)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Repository Standards](#repository-standards)
- [Issue Labels](#issue-labels)
- [Contact](#contact)

---

## Live Platform

**URL:** [http://localhost:3000](http://localhost:3000) (development)  

---

## Features

- 1-on-1 mentorship calls with industry experts
- Equity-based venture marketplace
- Founder and expert role-based dashboards
- Secure authentication with Clerk
- Community-driven founder ecosystem
- Responsive and modern UI
- Venture listing and investor interaction
- Real-time collaboration experience

---

## What GSF Does

| Feature | Description |
|---|---|
| **GSF Connect** | Students book 1-on-1 video calls with expert mentors (VCs, founders, product leaders). Async chat follow-up included. |
| **GSF Ventures** | Students list startup ideas with equity terms. Venture creators fund them directly. GSF takes **1–2% platform fee** on completed equity deals. |
| **Expert Network** | 40+ vetted domain experts across fundraising, product, growth, legal, and impact. |
| **Community** | Global network of 500+ student founders with cohort calls, Slack, and accountability pods. |

### Pricing Model
- **Free for 30 days** — full platform access, no credit card required
- **₹999/month** — Builder plan (unlimited Connect calls, list ventures)
- **₹2,499/month** — Founder plan (everything + investor intros + dedicated advisor)
- **1–2% fee** on equity deals closed via GSF Ventures

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Primary blue | `#81A6C6` | Buttons, links, active states |
| Powder blue | `#AACDDC` | Badges, highlights, borders |
| Warm cream | `#F3E3D0` | Section backgrounds, warm cards |
| Warm taupe | `#D2C4B4` | Borders, dividers, muted elements |
| Background | `#FDFAF7` | Page background |
| Text primary | `#1A2332` | Headings, body |
| Text secondary | `#4A5668` | Body copy |

**Fonts:**
- `Playfair Display` — serif headings (premium editorial feel)
- `Inter` — body, UI elements, labels

---

## Project Structure

```
app/
├── page.tsx              # Homepage
├── connect/page.tsx      # Video call + expert chat platform
├── ventures/page.tsx     # Startup idea marketplace
├── experts/page.tsx      # Expert mentor directory
├── community/page.tsx    # Community hub
├── about/page.tsx        # About GSF
├── apply/page.tsx        # Student application form
├── sign-in/page.tsx      # Authentication - Login
├── sign-up/page.tsx      # Authentication - Register
├── contact/page.tsx      # Contact form
├── careers/page.tsx      # Open roles
├── insights/page.tsx     # Articles + founder resources
├── programs/page.tsx     # Platform overview
├── privacy/page.tsx      # Privacy policy
├── terms/page.tsx        # Terms of service
├── cookies/page.tsx      # Cookies policy
└── globals.css           # Design system tokens + utilities

components/
├── layout/
│   ├── Navbar.tsx        # Navigation with circular GSF logo
│   └── Footer.tsx        # Footer with links and brand tagline
├── landing/
│   └── HeroSection.tsx   # Homepage hero with stats
└── ui/
    └── Button.tsx        # Multi-variant button component
```

---

## Getting Started

### Prerequisites

Before running the project locally, ensure you have:

- Node.js 18+
- npm or yarn
- Git installed

---

### 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy.

---

### 2. Clone the Repository

```bash
git clone https://github.com/KGFCH2/GSF.git
cd GSF
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

---

### 5. Start Development Server

```bash
npm run dev
```

Open:

http://localhost:3000

---


### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.2.3](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI/UX | Framer Motion, Lucide React |
| Data/SQL | Drizzle ORM + Postgres |
| Auth | Clerk |
| Validation | Zod |
| Tests | Vitest |
| Deployment | Vercel (recommended) |

---

## Architecture: route groups & role areas

This project uses Next.js App Router route groups plus Clerk-based RBAC.

### 1) Route groups in `app/`
- `app/(marketing)/...` and `app/(auth)/...`: public marketing + auth-related pages (layout/grouper only; does not change URL)
- `app/(student)/...`, `app/(expert)/...`, `app/(admin)/...`: role-focused areas (URL paths still start at `/student`, `/expert`, `/admin` when used)

### 2) Role-based areas (URLs)
- **Founder**: `/dashboard/*` (implemented in `app/dashboard/*`)
- **Expert**: `/expert-dashboard/*` (implemented in `app/expert-dashboard/*`)

### 3) How authorization works
Authorization is enforced in `middleware.ts` using Clerk session claims (JWT metadata):
- public routes pass through without auth
- signed-in, not-yet-onboarded users are redirected to `/onboarding`
- role checks gate `/dashboard/*`, `/expert-dashboard/*`, and any `/admin/*` routes

> Update both: (1) the route inventory in this README, and (2) middleware role rules when adding new protected areas.

---

## Route Inventory

> Routes are organized into **public marketing pages**, **dashboards by role**, and **API endpoints** under `app/api`.

### Public pages (no role required)

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/about` | About GSF |
| `/apply` | Student application |
| `/careers` | Open roles |
| `/community` | Community hub |
| `/connect` | Expert booking + chat platform |
| `/contact` | Contact form |
| `/cookies` | Cookie policy |
| `/experts` | Expert directory |
| `/insights` | Articles/resources |
| `/login` | Login portal |
| `/privacy` | Privacy policy |
| `/programs` | Platform overview |
| `/sign-in` | Auth (alternative sign-in entry) |
| `/sign-up` | Auth (registration) |
| `/sso-callback` | SSO callback handler |
| `/terms` | Terms |
| `/ventures` | Venture marketplace |
| `/ventures/list` | Venture list editor/creator UI |
| `/unauthorized` | Unauthorized / access denied |

### Role-based dashboards

| Role area | Route prefix | Description |
|---|---|---|
| Founder | `/dashboard/*` | Founder journey: credits, sessions, venture, progress, chat, profile |
| Expert | `/expert-dashboard/*` | Expert portal: students, sessions, profile, credits, ventures, chat, investments |

#### Founder dashboard routes (`/dashboard/*`)
- `/dashboard` (`app/dashboard/page.tsx`) — overview
- `/dashboard/chat`
- `/dashboard/credits`
- `/dashboard/experts`
- `/dashboard/profile`
- `/dashboard/progress`
- `/dashboard/venture`

#### Expert dashboard routes (`/expert-dashboard/*`)
- `/expert-dashboard` (`app/expert-dashboard/page.tsx`) — overview
- `/expert-dashboard/chat`
- `/expert-dashboard/credits`
- `/expert-dashboard/investments`
- `/expert-dashboard/profile`
- `/expert-dashboard/sessions`
- `/expert-dashboard/students`
- `/expert-dashboard/ventures`

### API endpoints (under `app/api`)

| Endpoint | Method(s) | What it serves |
|---|---|---|
| `/api/credits` | GET | Credit balance + transaction log |
| `/api/expert-profile` | GET | Expert extended profile |
| `/api/onboarding-complete` | POST | Mark onboarding completion |
| `/api/profile` | GET | Clerk user data + app bio/links from metadata |
| `/api/sessions` | GET | Sessions for logged-in user |
| `/api/venture` | GET, POST | Fetch/update the founder venture |
| `/api/ventures` | (see `app/api/ventures/**`) | Ventures CRUD + interest |
| `/api/ventures/interest` | POST | Express interest in a venture |
| `/api/ventures/public` | GET | Public venture data |
| `/api/webhooks/clerk` | POST | Clerk webhook receiver for sync |


---

## Environment Variables

Create a `.env.local` file in the root:

```env
# Add your environment variables here
# Example:
# NEXT_PUBLIC_API_URL=https://api.gsf.community
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your changes to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Set the **Root Directory** to `GSF` (the inner folder)
4. Add environment variables if needed
5. Deploy

### Manual Build

```bash
npm run build
npm run start
```

---

## Contributing

New contributors should be able to:
- run the app locally
- lint/test before opening a PR
- understand which routes belong to which role area

### Local setup

```bash
npm install
npm run dev
```

Then open: http://localhost:3000

### Lint / Test / Build expectations

```bash
npm run lint   # ESLint (required)
npm run test   # Vitest (required if you touched logic)
npm run build  # Optional but recommended before PR
```

### Contribution workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b blackboxai/your-feature`
3. Make changes in small, focused commits
4. Run `npm run lint` (and `npm run test` if you changed logic)
5. Open a Pull Request

### Route & role guidance
- Finder for role-based areas: see **Architecture** section below.
- When adding a new protected page, ensure role gating is enforced consistently (middleware + UI routing expectations).

### Suggested PR checklist
- [ ] README updated if routes/APIs changed
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (when applicable)

---

## Repository Standards

### Branch Protection
- Direct pushes to `main` are restricted
- All contributions must go through Pull Requests

### Code Quality
- Run lint checks before opening PR
- Ensure project builds successfully

### Pull Request Expectations
- Keep PRs focused and meaningful
- Link related issues
- Add screenshots for UI changes when applicable

### Review Process
- Maintainer approval is required before merge

---

## Issue Labels

| Label | Description |
|---|---|
| `good first issue` | Beginner-friendly issues |
| `bug` | Something is broken |
| `enhancement` | Feature improvements |
| `documentation` | Documentation-related tasks |
| `help wanted` | Community contribution requested |

---


## Contact

**Email:** hello@gsf.community  
**Website:** gsf.community  
**GitHub:** [KGFCH2/GSF](https://github.com/KGFCH2/GSF)

---

*© 2026 Global Society of Founders. A Society for Founders — Not Talkers.*

---

---

## License

This project is licensed under the MIT License.