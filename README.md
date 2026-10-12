# CrewForge

> **Find Your People. Build Your Team.**

🌐 **Live Website Deployment:** [https://crewforge-00vh.onrender.com/](https://crewforge-00vh.onrender.com/)

[![Live Deployment](https://img.shields.io/badge/Live%20Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://crewforge-00vh.onrender.com/)

CrewForge is an intelligent hackathon team formation and candidate selection web platform designed for college students participating in hackathons such as the Smart India Hackathon (SIH).

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20(Zero--Config)-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 🔒 Unified User Model (Single Login)

CrewForge uses a **single, unified User Login (`/login`)** for all students and participants. There are no split or separate logins:

- Every student registers and logs in through one single authentication portal.
- Every user account has full access to:
  - **Teammate / Candidate Features**: Find teams to join, build your verified profile, analyze your GitHub code, and take skill assessments.
  - **Team Owner Features**: Create hackathon teams, set member quotas, discover matching candidates, and send team invitations.

---

## 🌟 Key Platform Features

### 1. Website Entry Experience
- **Screen 1: Hero / Project Reveal**: Centered CrewForge logo reveal, tagline *"Find Your People. Build Your Team."*, ambient particle motion, and *"Swipe up to explore ↑"* indicator.
- **Screen 2: Why CrewForge?**: Clear problem and solution statements with 4 interactive feature cards (**Discover**, **Evaluate**, **Match**, **Build**).
- **Screen 3: Unified Platform**: Overview of platform capabilities (**Join Teams** & **Build Teams**) with 1-click instant User Login buttons for rapid evaluation.

### 2. Candidate & Teammate Features (Find & Join Teams)
- **Step-by-Step Profile Building**:
  - Personal & academic profile (College, Department, Year, Bio, Availability)
  - Categorized technical skills (Languages, Frontend, Backend, AI/ML, DevOps, Design)
  - Preferred hackathon roles (AI/ML, Frontend, Backend, UI/UX, IoT, Full Stack)
  - Previous hackathon experience, projects, achievements, and availability
  - Public GitHub username verification
- **GitHub Public Repository Analysis**:
  - Live GitHub API integration with fallback handling
  - Analyzes public repos, top languages, recent commit activity, and README coverage
  - Explainable technical score from 0 to 100
- **Personalized Skill Assessment**:
  - Dynamically generated from the user's preferred role and selected skills
  - 20-question randomized test with Easy, Medium, and Hard difficulty distributions
  - 20-minute countdown timer with auto-submit
  - Detailed results with skill breakdown, difficulty breakdown, and question explanations
- **Explainable Overall Candidate Scoring**:
  $$\text{Score} = (\text{Quiz} \times 50\%) + (\text{GitHub} \times 25\%) + (\text{Skill Match} \times 15\%) + (\text{Experience} \times 10\%)$$
  *(Weights dynamically configurable via Admin Console)*
- **Team Invitations & Acceptance Flow**:
  - Review custom invitations sent by Team Owners
  - 1-click **Accept** or **Decline**
  - Instant team membership update and celebration confetti

### 3. Team Owner & Recruitment Features (Build & Lead Teams)
- **Create Hackathon Team**:
  - Select hackathon (e.g., SIH 2026, HackX 2026, AI Genesis)
  - Define required roles, required skills, and team quotas
  - Set minimum candidate selection threshold (e.g., 75%)
- **Team Management Dashboard**:
  - Team progress tracking (e.g., 4 / 6 Members)
  - Required roles status (Filled ✓ vs Missing ⚠)
  - Missing roles alert banner with instant *"Find Matching Candidates"* action
  - Candidate statistics (Total, Eligible, Top Matches, Invitations Sent, Accepted)
- **Candidate Discovery & Matching Engine**:
  - Advanced search and filters (role, skill, department, score sliders, availability)
  - Compatibility match percentage and classification (Excellent, Strong, Eligible, Below Requirement)
  - Explainable *"Why This Candidate Matches"* checkmarks and *"Skill Gaps"* warnings
  - Multi-candidate side-by-side comparison tray
  - Send custom invitations with personalized messages
- **Visual Team Builder Canvas**:
  - Visual team composition slots showing leader and members
  - Open slots with 1-click search buttons

### 4. Admin Console
- Platform KPI analytics (users, candidates, teams, invitations, acceptance rate)
- Dynamic scoring weight sliders with real-time target validation
- Assessment question bank CRUD (difficulty, topic, options, explanations)
- User accounts directory

---

## 📁 Project Architecture

```
hackmate/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma data models (User, Team, Quiz, GitHub, etc.)
│   │   ├── seed.ts             # Rich database seeder with 30+ candidates & teams
│   │   └── dev.db              # SQLite zero-config database
│   ├── src/
│   │   ├── controllers/        # Express request controllers (auth, candidate, team, quiz, etc.)
│   │   ├── middleware/         # JWT authentication & role authorization
│   │   ├── routes/api.ts       # Unified API endpoints (/api/auth/login, etc.)
│   │   └── server.ts           # Express server entry point (Port 5000)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Landing screens, etc.)
│   │   ├── contexts/           # AuthContext (Unified state), ToastContext
│   │   ├── pages/
│   │   │   ├── auth/           # Unified LoginPage and RegisterPage
│   │   │   ├── dashboard/      # UserDashboard
│   │   │   ├── profile/        # UserProfileView, UserProfileEdit
│   │   │   ├── teams/          # FindTeamPage, BuildTeamPage, MyTeamsPage, TeamDetailPage
│   │   │   ├── team-owner/     # TeamOwnerDashboard, TeamCandidatesDiscovery
│   │   │   └── verification/   # GitHubVerificationPage, PersonalizedQuizPage
│   │   ├── App.tsx             # Route definitions & guards
│   │   └── index.css           # Vanilla CSS Design System (dark mode, glassmorphism)
│   └── package.json
├── package.json                # Monorepo root scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/joeflaming777-lgtm/Hackmate-.git
cd Hackmate-

# Install root, backend, and frontend dependencies
npm install
```

### 2. Initialize Database & Seed Demo Data
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to SQLite database
npm run prisma:push

# Seed realistic demo data (teams, candidates, questions)
npm run seed
```

### 3. Start the Development Servers
```bash
# Runs backend (Port 5000) and frontend (Port 5173) concurrently
npm run dev
```

Or run services individually:
```bash
npm run dev:backend   # API running on http://localhost:5000
npm run dev:frontend  # Web App running on http://localhost:5173
```

---

## 🔑 Single User Login (1-Click Instant Demo Accounts)

Open **[https://crewforge-00vh.onrender.com/login](https://crewforge-00vh.onrender.com/login)** *(or locally at `http://localhost:5173/login`)* to access the single User Login page. You can click any 1-click button or use the credentials below:

| Account | Email | Password | Role & Permissions |
|---|---|---|---|
| **Demo User: Arjun Sharma** | `arjun@skillsync.dev` | `student123` | Active User: Both Team Owner & Member (IIT Bombay, CSE) |
| **Demo User: Priya Patel** | `priya@skillsync.dev` | `student123` | Active User: Candidate looking for a team (BITS Pilani) |
| **Demo User: Aarav Mehta** | `aarav@skillsync.dev` | `student123` | Active User: Team Owner of NeuralNomads (SIH 2026) |
| **Platform Admin** | `admin@skillsync.dev` | `admin123` | CrewForge Platform Admin Console |

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Unified user authentication for all accounts |
| `POST` | `/api/auth/register` | Unified user registration |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |
| `GET` | `/api/candidates` | Candidate discovery with multi-criteria filtering |
| `GET` | `/api/candidates/:id` | Candidate profile details and scores |
| `GET` | `/api/teams` | Browse open hackathon teams |
| `POST` | `/api/teams` | Create a new hackathon team |
| `GET` | `/api/teams/:id` | Team details, members, and open quotas |
| `POST` | `/api/invitations` | Send a team invitation to a candidate |
| `POST` | `/api/invitations/:id/accept` | Accept a team invitation |
| `POST` | `/api/invitations/:id/decline` | Decline a team invitation |
| `POST` | `/api/github/analyze` | Run public GitHub repository analysis |
| `GET` | `/api/quiz/start` | Start personalized skill assessment quiz |
| `POST` | `/api/quiz/submit` | Submit quiz answers and calculate score |
| `GET` | `/api/admin/analytics` | Admin KPI analytics |
| `PUT` | `/api/admin/scoring-config` | Update scoring weights configuration |

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Framer Motion, Lucide Icons, Canvas Confetti, Vanilla CSS Design System.
- **Backend**: Node.js, Express, TypeScript, JWT Authentication, bcryptjs, Axios.
- **Database & ORM**: Prisma ORM with SQLite (zero-setup portability; easily switchable to PostgreSQL in `schema.prisma`).

---

## 📄 License

This project is licensed under the MIT License.
