# HackMate (SkillSync)

> **Find Your People. Build Your Team.**

HackMate is a smart hackathon team formation and candidate selection web platform designed for college students participating in hackathons such as the Smart India Hackathon (SIH).

> 🔒 **Unified User Architecture**: There is **only ONE unified User Login (`/login`)**. Every student registers and authenticates as a standard **User**. From a single dashboard, any user can both discover/join hackathon teams AND create/manage their own squads.

---

## 🌟 Key Features

### 1. Website Entry Experience
- **Screen 1: Hero / Project Logo**: Centered HackMate logo reveal, tagline *"Find Your People. Build Your Team."*, ambient particle motion, and *"Swipe up to explore ↑"* indicator.
- **Screen 2: Why SkillSync?**: Clear problem and solution statements with 4 modern feature cards (**Discover**, **Evaluate**, **Match**, **Build**).
- **Screen 3: Unified Platform**: Interactive overview of platform capabilities (**Join Teams** & **Build Teams**) with 1-click instant User Login buttons for rapid evaluation.

### 2. Candidate & Teammate Capabilities (Find & Join Teams)
- **Step-by-Step Profile Building**:
  - Personal & academic profile (College, Department, Year, Bio)
  - Categorized technical skills (Programming, Web Dev, AI/ML, Data, Other)
  - Preferred hackathon roles (AI/ML, Frontend, Backend, UI/UX, IoT, etc.)
  - Previous hackathon experience, projects, achievements, and availability
  - Public GitHub verification
- **GitHub Public Analysis**:
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
  *(Weights configurable via Admin Console)*
- **Team Invitations & Acceptance Flow**:
  - Review custom invitations sent by Team Owners
  - 1-click **Accept** or **Decline**
  - Instant team membership update and celebration confetti

### 3. Team Owner & Recruitment Capabilities (Build & Manage Teams)
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

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd hackmate

# Install dependencies across all workspaces
npm install

# Initialize database and seed demo data
npm run prisma:generate
npm run prisma:push
npm run seed
```

### Running Locally
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
npm run dev:backend   # API running on http://localhost:5000
npm run dev:frontend  # React App running on http://localhost:5173
```

---

## 🔑 Single User Login (1-Click Instant Demo Accounts)

There is **only ONE login page** (`/login`). All users log in with their email and password:

| User Account | Email | Password | Account Details & Capabilities |
|---|---|---|---|
| **Demo User: Arjun Sharma** | `arjun@hackmate.dev` | `student123` | Active User: Both Team Owner & Member (IIT Bombay, CSE) |
| **Demo User: Priya Patel** | `priya@hackmate.dev` | `student123` | Active User: Candidate looking for a team (BITS Pilani) |
| **Demo User: Aarav Mehta** | `aarav@hackmate.dev` | `student123` | Active User: Team Owner of NeuralNomads (SIH 2026) |
| **Platform Admin** | `admin@hackmate.dev` | `admin123` | HackMate Platform Admin Console |

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Framer Motion, Lucide Icons, Canvas Confetti, Vanilla CSS Design System.
- **Backend**: Node.js, Express, TypeScript, JWT Authentication, bcryptjs, Axios.
- **Database**: Prisma ORM with SQLite (portable zero-setup) / easily switchable to PostgreSQL in `schema.prisma`.
