# Campus 360 — Smart College Management Operating System
> **Tech Stack:** React (Vite) • Node.js (Express) • Relational SQL Database (SQLite / MySQL)

Campus 360 is a full-stack, futuristic web application and centralized operating system for college students, faculty, and administrators. Redesigned with a modern **React** frontend, a lightweight **Express** backend, a **26-table Relational SQL database**, and a customized fresh aesthetic color palette.

---

## 🎨 Official Color Theme

The interface utilizes the designated 4-tier palette:
* `#E3FDFD` — Level 1: Ice Mint Light (Highlights, badges, text tints)
* `#CBF1F5` — Level 2: Pale Aqua (Borders, accents, secondary badges)
* `#A6E3E9` — Level 3: Soft Cyan (Vibrant borders, active tabs, subheadings)
* `#71C9CE` — Level 4: Primary Seafoam Teal (Primary brand color, buttons, metrics, glow)

---

## 🏛️ System Architecture

```
Campus-360-main/
├── backend/                       # Express.js REST API Backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js        # Native Node SQL Database connection & helpers
│   │   │   └── campus360.db       # Active SQLite database file
│   │   ├── routes/                # Modular API endpoints (Auth, Academics, Notices, Events, etc.)
│   │   └── server.js              # Express app entry point (Port 5000)
│   └── package.json
│
├── frontend/                      # Modern React Frontend (Vite)
│   ├── src/
│   │   ├── components/            # Navbar, Sidebar, Campus AI Modal, Notification Drawer
│   │   ├── context/               # AuthContext (Role switching: Student <-> Admin)
│   │   ├── pages/                 # Dashboard, Academics, Notices, Campus Life, Opportunities, etc.
│   │   ├── services/              # api.js API client (communicates with backend)
│   │   ├── styles/                # theme.css (CSS variables for the 4 colors)
│   │   ├── App.jsx                # Router & main shell
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── database/                      # Relational SQL Assets
│   ├── schema.sql                 # Universal SQL DDL Schema (26 Tables)
│   ├── seed.sql                   # Comprehensive SQL INSERT seed data
│   └── README_DATABASE.md         # Database ER diagrams & MySQL/PostgreSQL import guides
│
├── docs/                          # Project Report & Presentation Slides
│   ├── Campus_360_Mini_Project_Report.pdf
│   ├── Campus_360_Mini_Project_Report.md
│   └── Campus_360_Presentation.pptx
│
├── start.bat                      # 1-Click Windows Startup Script
├── start-dev.js                   # Unified Node concurrent runner
└── README.md                      # Project documentation
```

---

## 🌟 Key Functional Modules

1. **Smart Dashboard (`/dashboard`)**
   - **Student Console**: Overall attendance percentage tracker, today's lecture schedule with live highlights, pending coursework deadlines, mid-term examination hall ticket seating allocation (`Hall 301, Seat B-14`), and quick utility shortcuts.
   - **Administrator Command Center**: Real-time metrics overview, student grievance resolution console (mark resolved with tracking IDs), and Lost & Found ownership claims verification desk.

2. **Academics Hub (`/academics`)**
   - **Interactive Timetable**: Day-wise timetable (Monday through Saturday) with room and faculty tags.
   - **Study Materials Repository**: Course notes and slides with download simulator.
   - **Coursework Submissions**: Submit GitHub repositories or Google Colab links with live evaluation status (`Pending`, `Submitted`, `Graded`).
   - **Mid-Term Exam Seating**: Examination dates, halls, and desk allocations.

3. **Campus Noticeboard (`/notices`)**
   - Urgent emergency spotlight ticker for time-sensitive announcements.
   - Departmental filters (Exam, Event, Academic, Placement, Administration).
   - Modal viewer with circular text.
   - Admin circular drafting and publication tool.

4. **Campus Life & Communities (`/campus-life`)**
   - **Events & Fests**: Cultural fests, HackSpark 36h Hackathon, Autonomous Agents Workshop with 1-click digital entry pass generator.
   - **Lost & Found Center**: Complete registry of lost and found items with student ownership claim submission and admin verification flow.
   - **Campus Navigation**: Directory of classrooms, labs, and facilities with an interactive point-to-point walking route calculator.
   - **Student Clubs**: Technical societies (GDSC, AI/ML Cell), dramatics, and sports teams with 1-click join/leave simulation.

5. **Opportunities Hub (`/opportunities`)**
   - Internships (Google Summer of Code, DRDO AI Fellowship), merit scholarships, and hackathons.
   - 1-Click Fast Apply modal pre-populated with student credentials.
   - Bookmark/Save toggle.

6. **Student Marketplace (`/marketplace`)**
   - Peer-to-peer campus exchange for textbooks, scientific calculators, and lab gear.
   - Post item modal and secure contact seller modal with verified meeting spot recommendations.

7. **Campus Utilities (`/utilities`)**
   - **Canteen Menu**: Categorized menu, pricing, vegetarian indicators, and opening hours.
   - **Transport Bus Routes**: Live bus routes, pickup points, morning pickup and evening return times, vehicle numbers.
   - **Emergency Contacts**: 24/7 campus ambulance, security desk, and student counseling helplines with direct call links.
   - **Grievance Tracking**: Student feedback submission generating unique tracking IDs (`ISSUE-2026-xxx`).

8. **Campus AI Operating System Assistant**
   - Omnipresent floating assistant and topbar launcher.
   - Backed by `/api/ai/query` which directly queries the SQL database to answer student questions regarding timetables, attendance margins, exam hall seating, and assignment deadlines without external hallucination.

---

## 🔐 Role-Based Access Control (RBAC) & Demo Switcher

The application features a 1-click role switcher pinned on the top navigation bar for viva evaluations:

| Role | Default Email | Default Password | Permissions |
|---|---|---|---|
| **Student (Alex Turner)** | `student@campus360.edu` | `student123` | View timetable, track attendance, submit coursework, register for events, claim lost items, submit grievances. |
| **Administrator (Dr. Vikram Malhotra)** | `admin@campus360.edu` | `admin123` | Publish circulars, add events, upload study notes, verify Lost & Found claims, resolve student grievances. |

---

## 🚀 How to Run the Project

### Option 1: Double-Click (Windows)
Simply double-click the **`start.bat`** file in the root folder. It starts both the backend and frontend servers and launches your browser to:
```
http://localhost:5173
```

---

### Option 2: Command Line (Cross-Platform)

1. Open your terminal in the project root:
   ```bash
   cd "C:\Users\Himanshu Jain\Downloads\Campus-360-main\Campus-360-main"
   ```

2. Start both backend and frontend together:
   ```bash
   npm run dev
   ```

3. Open your browser:
   * **Frontend Application:** `http://localhost:5173`
   * **Backend API Health Check:** `http://localhost:5000/api/health`

---

## 📊 Database Management

The database utilizes Node.js native SQLite database (`backend/src/db/campus360.db`) which is self-contained with **zero configuration required**. 

If your university requires MySQL or PostgreSQL:
- **`database/schema.sql`**: Full DDL statements compatible with MySQL / PostgreSQL / SQLite.
- **`database/seed.sql`**: Complete sample records for all 26 tables.
- Refer to **`database/README_DATABASE.md`** for step-by-step import instructions.
