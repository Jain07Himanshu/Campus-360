-- ============================================================================
-- CAMPUS 360 — RELATIONAL SQL DATABASE SCHEMA
-- Compatible with SQLite, MySQL (v8.0+), and PostgreSQL (v13+)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION TABLE
-- Stores credentials and baseline system user profile
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    avatar VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. STUDENTS TABLE
-- Extended academic details for student role
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year_semester VARCHAR(50) NOT NULL,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 3. ADMINISTRATORS TABLE
-- Extended administrative role metadata
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administrators (
    id VARCHAR(50) PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. COURSES TABLE
-- Course catalog offered across departments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    code VARCHAR(20) PRIMARY KEY,
    subject VARCHAR(150) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT DEFAULT 4
);

-- ----------------------------------------------------------------------------
-- 5. TIMETABLE SCHEDULE
-- Day-wise class slots, room numbers, and lecture types
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week VARCHAR(20) NOT NULL,
    period INT NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    room VARCHAR(50) NOT NULL,
    class_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. ATTENDANCE TABLE
-- Course-by-course attendance logs per student
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    attended INT NOT NULL DEFAULT 0,
    total INT NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (ROUND((attended * 100.0) / CASE WHEN total = 0 THEN 1 ELSE total END, 1)) STORED,
    status VARCHAR(20) DEFAULT 'safe', -- safe, warning, critical
    margin_note VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. STUDY MATERIALS TABLE
-- Uploaded slides, lecture notes, lab manuals
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_materials (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    file_type VARCHAR(20) NOT NULL, -- PDF, PPTX, ZIP, DOCX
    size VARCHAR(50) NOT NULL,
    upload_date DATE NOT NULL,
    download_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'published',
    FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 8. ASSIGNMENTS TABLE
-- Academic coursework assignments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    total_marks INT NOT NULL DEFAULT 20,
    instructions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 9. ASSIGNMENT SUBMISSIONS TABLE
-- Student submissions, GitHub/Colab links, grades
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    submission_link VARCHAR(255) NOT NULL,
    comments TEXT,
    submitted_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted', -- submitted, graded
    score VARCHAR(50),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(assignment_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 10. EXAM SCHEDULES TABLE
-- Mid-term and end-term examination seating
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code VARCHAR(20) NOT NULL,
    exam_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    hall VARCHAR(50) NOT NULL,
    seat VARCHAR(50) NOT NULL,
    FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 11. CAMPUS NOTICES & CIRCULARS TABLE
-- Official notices, urgent emergency broadcasts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Exam, Event, Academic, Placement, Administration
    department VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time_ago VARCHAR(50),
    is_urgent BOOLEAN DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published', -- published, draft
    views INT DEFAULT 0,
    pinned BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 12. EVENTS & FESTS TABLE
-- Campus events, hackathons, guest lectures, cultural fests
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Fest, Hackathon, Workshop, Sports, Cultural
    date DATE NOT NULL,
    end_date DATE,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(100) NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 100,
    description TEXT NOT NULL,
    fee VARCHAR(50) DEFAULT 'Free',
    tags TEXT,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 13. EVENT REGISTRATIONS TABLE
-- Student tickets and registrations for events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ticket_id VARCHAR(100) UNIQUE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(event_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 14. STUDENT CLUBS & SOCIETIES TABLE
-- Tech, cultural, sports clubs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Technical, Cultural, Sports, Social
    lead_name VARCHAR(100) NOT NULL,
    meeting_info VARCHAR(255) NOT NULL,
    logo_icon VARCHAR(50) DEFAULT '🏛️',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 15. CLUB MEMBERSHIPS TABLE
-- Student memberships in campus clubs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS club_memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(club_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 16. LOST & FOUND ITEMS TABLE
-- Registry of reported lost or found items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lost_found_items (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('lost', 'found')),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    item_date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'reported', -- lost, found, claim_pending, returned
    reporter_id VARCHAR(50) NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 17. LOST & FOUND CLAIMS TABLE
-- Ownership verification claims by students
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lost_found_claims (
    id VARCHAR(50) PRIMARY KEY,
    item_id VARCHAR(50) NOT NULL,
    claimant_id VARCHAR(50) NOT NULL,
    claimant_name VARCHAR(100) NOT NULL,
    claimant_dept VARCHAR(100) NOT NULL,
    proof_description TEXT NOT NULL,
    claim_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    FOREIGN KEY (item_id) REFERENCES lost_found_items(id) ON DELETE CASCADE,
    FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 18. OPPORTUNITIES TABLE
-- Internships, scholarships, research grants, hackathons
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Internship, Scholarship, Competition, Certification
    company VARCHAR(150) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    deadline DATE NOT NULL,
    description TEXT NOT NULL,
    eligibility VARCHAR(255) NOT NULL,
    apply_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 19. OPPORTUNITY INTERACTIONS TABLE
-- Bookmarked/saved and applied opportunities
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opportunity_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('saved', 'applied')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(opportunity_id, student_id, action_type)
);

-- ----------------------------------------------------------------------------
-- 20. STUDENT MARKETPLACE TABLE
-- Buy, sell, exchange books, gadgets, equipment
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS marketplace_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Textbooks, Electronics, Stationery, Lab Gear
    price DECIMAL(10,2) NOT NULL,
    condition_grade VARCHAR(50) NOT NULL, -- Like New, Excellent, Good, Fair
    seller_id VARCHAR(50) NOT NULL,
    seller_name VARCHAR(100) NOT NULL,
    seller_contact VARCHAR(255) NOT NULL,
    item_date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'approved', -- pending, approved, sold
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 21. CAMPUS LOCATIONS TABLE
-- Map navigation & facility directory
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campus_locations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    operating_hours VARCHAR(100),
    contact VARCHAR(100)
);

-- ----------------------------------------------------------------------------
-- 22. TRANSPORT ROUTES TABLE
-- College bus routes, pickup points, timings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transport_routes (
    id VARCHAR(50) PRIMARY KEY,
    route_number VARCHAR(100) NOT NULL,
    pickup_points TEXT NOT NULL,
    morning_times VARCHAR(255) NOT NULL,
    evening_times VARCHAR(255) NOT NULL,
    vehicle VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'On Time'
);

-- ----------------------------------------------------------------------------
-- 23. CANTEEN MENU TABLE
-- Food court items, prices, veg/non-veg status
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS canteen_menu (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_veg BOOLEAN DEFAULT 1,
    availability VARCHAR(50) DEFAULT 'Available',
    description TEXT
);

-- ----------------------------------------------------------------------------
-- 24. EMERGENCY CONTACTS TABLE
-- Medical, security, counselor helplines
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(150) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    extension VARCHAR(20),
    available_hours VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 25. STUDENT FEEDBACK & GRIEVANCES TABLE
-- Issue tracking, ticket generation, admin resolution
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback_grievances (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    submission_date DATE NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, resolved
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 26. NOTIFICATIONS TABLE
-- Real-time system notifications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    target_role VARCHAR(20) DEFAULT 'all',
    link VARCHAR(255)
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR FAST PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day_of_week);
CREATE INDEX IF NOT EXISTS idx_lostfound_status ON lost_found_items(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_items(status);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_code);
