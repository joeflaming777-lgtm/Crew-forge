# HackMate

> **Find Your People. Build Your Team.**

HackMate is a smart hackathon team formation and candidate selection web platform designed for college students participating in hackathons such as the Smart India Hackathon (SIH).

---

## 🌟 Key Features

### 1. Website Entry Experience
- **Screen 1: Hero / Project Logo**: Centered HackMate logo reveal, tagline *"Find Your People. Build Your Team."*, ambient particle motion, and *"Swipe up to explore ↑"* indicator.
- **Screen 2: Why HackMate?**: Clear problem and solution statements with 4 modern feature cards (**Discover**, **Evaluate**, **Match**, **Build**).
- **Screen 3: Choose Your Path**: Dual interactive cards for **Candidate Portal** and **Team Leader Portal**, with 1-click demo login buttons for rapid evaluation.

### 2. Candidate Portal
- **Step-by-Step Onboarding**:
  - Step 1: Personal & academic profile (College, Department, Year, Bio)
  - Step 2: Categorized technical skills (Programming, Web Dev, AI/ML, Data, Other)
  - Step 3: Preferred hackathon roles (AI/ML, Frontend, Backend, UI/UX, IoT, etc.)
  - Step 4: Previous hackathon experience, projects, achievements, and availability
  - Step 5: Mandatory public GitHub verification
- **GitHub Public Analysis**:
  - Live GitHub API integration with fallback handling
  - Analyzes public repos, top languages, recent commit activity, and README coverage
  - Explainable technical score from 0 to 100
- **Personalized Skill Assessment**:
  - Dynamically generated from the candidate's preferred role and selected skills
  - 20-question randomized test with Easy, Medium, and Hard difficulty distributions
  - 20-minute countdown timer with auto-submit
  - Detailed results with skill breakdown, difficulty breakdown, and question explanations
- **Explainable Overall Candidate Scoring**:
  $$\text{Score} = (\text{Quiz} \times 50\%) + (\text{GitHub} \times 25\%) + (\text{Skill Match} \times 15\%) + (\text{Experience} \times 10\%)$$
  *(Weights configurable via Admin Console)*
- **Team Invitations & Acceptance Flow**:
  - Review custom invitations from Team Leaders
  - 1-click **Accept** or **Decline**
  - Instant team membership update and celebration confetti

### 3. Team Leader Portal
- **Create Hackathon Team**:
  - Select hackathon (e.g., SIH 2026, HackX 2026, AI Genesis)
  - Define required roles, required skills, and team quotas
  - Set minimum candidate selection threshold (e.g., 75%)
- **Leader Dashboard**:
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

### 4. Admin Portal
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

## 🔑 Demo Accounts (1-Click Instant Login)

| Role | Email | Password | Details |
|---|---|---|---|
| **Candidate** | `candidate@hackmate.dev` | `candidate123` | Arjun Verma (IIT Bombay, CSE) |
| **Team Leader** | `leader@hackmate.dev` | `leader123` | Aarav Sharma (NeuralNomads - SIH 2026) |
| **Admin** | `admin@hackmate.dev` | `admin123` | HackMate Platform Admin |

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Framer Motion, Lucide Icons, Canvas Confetti, Vanilla CSS Design System.
- **Backend**: Node.js, Express, TypeScript, JWT Authentication, bcryptjs, Axios.
- **Database**: Prisma ORM with SQLite (portable zero-setup) / easily switchable to PostgreSQL in `schema.prisma`.
