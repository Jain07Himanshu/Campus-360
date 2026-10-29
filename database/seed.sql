-- ============================================================================
-- CAMPUS 360 — COMPREHENSIVE SEED DATA
-- ============================================================================

-- 1. USERS
INSERT OR REPLACE INTO users (id, name, email, password, role, avatar, phone) VALUES
('STU-2024-8842', 'Alex Turner', 'student@campus360.edu', 'student123', 'student', 'AT', '+91 98765 43210'),
('ADM-2024-001', 'Dr. Vikram Malhotra', 'admin@campus360.edu', 'admin123', 'admin', 'VM', '+91 98200 11223'),
('STU-2024-4110', 'Rohan Patil', 'rohan.patil@campus360.edu', 'student123', 'student', 'RP', '+91 98112 23344'),
('STU-2024-7719', 'Priya Nair', 'priya.nair@campus360.edu', 'student123', 'student', 'PN', '+91 98450 12345'),
('STU-2024-3201', 'Kavita Singh', 'kavita.s@campus360.edu', 'student123', 'student', 'KS', '+91 98330 67890');

-- 2. STUDENTS
INSERT OR REPLACE INTO students (id, roll_no, department, year_semester, cgpa) VALUES
('STU-2024-8842', '21BCSE042', 'Computer Science & Engineering', '3rd Year (Sem 6)', 8.85),
('STU-2024-4110', '20BCSE018', 'Computer Science & Engineering', '4th Year (Sem 8)', 8.40),
('STU-2024-7719', '21BEXT029', 'Electronics & Telecommunication', '3rd Year (Sem 6)', 8.92),
('STU-2024-3201', '22BCHM012', 'Chemical Engineering', '2nd Year (Sem 4)', 8.15);

-- 3. ADMINISTRATORS
INSERT OR REPLACE INTO administrators (id, department, designation) VALUES
('ADM-2024-001', 'Dean of Academic Affairs', 'Senior Administrator & Professor');

-- 4. COURSES
INSERT OR REPLACE INTO courses (code, subject, faculty, department, credits) VALUES
('CS301', 'Data Structures & Algorithms', 'Prof. Sharma', 'Computer Engineering', 4),
('CS302', 'Operating Systems', 'Prof. Deshmukh', 'Computer Engineering', 4),
('CS303', 'Database Management Systems', 'Prof. Rao', 'Computer Engineering', 4),
('CS304', 'Computer Networks', 'Dr. Sengupta', 'Computer Engineering', 4),
('CS305', 'Artificial Intelligence & ML', 'Dr. Vikram Malhotra', 'Computer Engineering', 4),
('CS301L', 'DSA & Competitive Coding Lab', 'Prof. Sharma', 'Computer Engineering', 2),
('CS302L', 'Operating Systems Kernel Lab', 'Prof. Deshmukh', 'Computer Engineering', 2),
('CS303L', 'DBMS Query Lab', 'Prof. Rao', 'Computer Engineering', 2),
('CS304L', 'Computer Networks Packet Lab', 'Dr. Sengupta', 'Computer Engineering', 2),
('CS305L', 'Machine Learning Model Lab', 'Dr. Vikram Malhotra', 'Computer Engineering', 2),
('HS301', 'Engineering Ethics & IPR', 'Dr. Kulkarni', 'Humanities & Management', 2);

-- 5. TIMETABLE
INSERT OR REPLACE INTO timetable (day_of_week, period, time_slot, course_code, room, class_type) VALUES
('Monday', 1, '09:00 - 10:00', 'CS301', 'L-201', 'Lecture'),
('Monday', 2, '10:00 - 11:00', 'CS302', 'L-201', 'Lecture'),
('Monday', 3, '11:15 - 01:15', 'CS303L', 'Lab 4', 'Lab'),
('Monday', 4, '02:00 - 03:00', 'CS304', 'L-204', 'Lecture'),
('Monday', 5, '03:00 - 04:00', 'CS305', 'L-204', 'Lecture'),

('Tuesday', 1, '09:00 - 10:00', 'CS304', 'L-204', 'Lecture'),
('Tuesday', 2, '10:00 - 11:00', 'CS305', 'L-204', 'Lecture'),
('Tuesday', 3, '11:15 - 01:15', 'CS301L', 'Lab 2', 'Lab'),
('Tuesday', 4, '02:00 - 03:00', 'CS302', 'L-201', 'Lecture'),
('Tuesday', 5, '03:00 - 04:00', 'HS301', 'Seminar 1', 'Tutorial'),

('Wednesday', 1, '09:00 - 10:00', 'CS303', 'L-201', 'Lecture'),
('Wednesday', 2, '10:00 - 11:00', 'CS301', 'L-201', 'Lecture'),
('Wednesday', 3, '11:15 - 12:15', 'CS304', 'L-204', 'Lecture'),
('Wednesday', 4, '01:00 - 03:00', 'CS302L', 'Lab 3', 'Lab'),

('Thursday', 1, '09:00 - 10:00', 'CS305', 'L-204', 'Lecture'),
('Thursday', 2, '10:00 - 11:00', 'CS302', 'L-201', 'Lecture'),
('Thursday', 3, '11:15 - 01:15', 'CS304L', 'Lab 5', 'Lab'),
('Thursday', 4, '02:00 - 03:00', 'CS303', 'L-201', 'Lecture'),

('Friday', 1, '09:00 - 10:00', 'CS301', 'L-201', 'Lecture'),
('Friday', 2, '10:00 - 11:00', 'CS303', 'L-201', 'Lecture'),
('Friday', 3, '11:15 - 01:15', 'CS305L', 'Lab 1 (GPU)', 'Lab');

-- 6. ATTENDANCE
INSERT OR REPLACE INTO attendance (student_id, course_code, attended, total, status, margin_note) VALUES
('STU-2024-8842', 'CS301', 22, 25, 'safe', 'Comfortably above 75% requirement'),
('STU-2024-8842', 'CS302', 23, 25, 'safe', 'Excellent consistency'),
('STU-2024-8842', 'CS303', 18, 25, 'warning', 'Need 3 more consecutive classes to reach 75%'),
('STU-2024-8842', 'CS304', 20, 25, 'safe', 'On track'),
('STU-2024-8842', 'CS305', 17, 20, 'safe', 'Safe zone');

-- 7. STUDY MATERIALS
INSERT OR REPLACE INTO study_materials (id, title, course_code, semester, uploaded_by, file_type, size, upload_date, download_url, status) VALUES
('mat-001', 'B-Trees, AVL Trees & Red-Black Trees Complete Master Notes', 'CS301', 'Sem 6', 'Prof. Sharma', 'PDF', '4.8 MB', '2026-02-14', '#preview-pdf-mat001', 'published'),
('mat-002', 'OS Virtual Memory, Paging, and Page Replacement Algorithms Guide', 'CS302', 'Sem 6', 'Prof. Deshmukh', 'PDF', '3.2 MB', '2026-02-12', '#preview-pdf-mat002', 'published'),
('mat-003', 'DBMS Relational Calculus, 3NF/BCNF Normalization Cheatsheet', 'CS303', 'Sem 6', 'Prof. Rao', 'PDF', '2.1 MB', '2026-02-10', '#preview-pdf-mat003', 'published'),
('mat-004', 'Neural Networks, Backpropagation & Gradient Descent Slide Deck', 'CS305', 'Sem 6', 'Dr. Vikram Malhotra', 'PPTX', '8.4 MB', '2026-02-08', '#preview-pdf-mat004', 'published');

-- 8. ASSIGNMENTS
INSERT OR REPLACE INTO assignments (id, title, course_code, due_date, total_marks, instructions) VALUES
('asg-001', 'Assignment 3: Implement Self-Balancing AVL Trees with Visual Rotation Traversal', 'CS301', '2026-02-24', 20, 'Implement AVL Tree insertion, deletion and rotation operations in C++ or Java. Include output test runs for at least 15 edge nodes.'),
('asg-002', 'Lab Assignment 4: Dining Philosophers & Producer-Consumer via POSIX Semaphores', 'CS302', '2026-02-26', 20, 'Write a multi-threaded C program using pthread and sem_wait / sem_post primitives to prevent deadlock and starvation.'),
('asg-003', 'Assignment 2: Complex SQL Queries, Window Functions & Index Profiling', 'CS303', '2026-02-15', 20, 'Analyze PostgreSQL EXPLAIN ANALYZE queries on a 100k row dataset.'),
('asg-004', 'Assignment 1: Convolutional Neural Network (CNN) for CIFAR-10 Image Classification', 'CS305', '2026-03-02', 25, 'Train a PyTorch or TensorFlow model achieving at least 82% validation accuracy. Submit Google Colab notebook link.');

-- 9. ASSIGNMENT SUBMISSIONS
INSERT OR REPLACE INTO assignment_submissions (assignment_id, student_id, submission_link, comments, submitted_date, status, score) VALUES
('asg-003', 'STU-2024-8842', 'https://github.com/alexturner/dbms-assignment2', 'Implemented all query plans with btree indexes.', '2026-02-14', 'graded', '19 / 20');

-- 10. EXAM SCHEDULES
INSERT OR REPLACE INTO exam_schedules (course_code, exam_date, time_slot, hall, seat) VALUES
('CS301', '2026-03-02', '10:00 AM - 12:00 PM', 'Exam Hall 301', 'Block B-14'),
('CS302', '2026-03-04', '10:00 AM - 12:00 PM', 'Exam Hall 301', 'Block B-14'),
('CS303', '2026-03-06', '10:00 AM - 12:00 PM', 'Exam Hall 302', 'Block C-08'),
('CS304', '2026-03-09', '10:00 AM - 12:00 PM', 'Exam Hall 302', 'Block C-08'),
('CS305', '2026-03-11', '10:00 AM - 12:00 PM', 'Exam Hall 303', 'Block A-22');

-- 11. NOTICES
INSERT OR REPLACE INTO notices (id, title, category, department, content, author, date, time_ago, is_urgent, status, views, pinned) VALUES
('notif-001', 'Revised Schedule for Mid-Semester Examinations (Spring 2026)', 'Exam', 'Examination Cell', 'All undergraduate students are hereby notified that the Spring 2026 Mid-Semester Examinations have been rescheduled to commence from March 2, 2026. Hall tickets will be released on the portal 3 days prior. Mobile phones and smartwatches are strictly prohibited in the exam halls.', 'Dr. Vikram Malhotra (Dean)', '2026-02-18', '2 hours ago', 1, 'published', 342, 1),
('notif-002', 'Technova 2026: Annual Inter-College Tech Symposium Registrations Open', 'Event', 'Student Affairs', 'Registrations are now open for Technova 2026! Featuring over 15 events including Hackathons, Robotics Arenas, Code Sprint, and Gaming Tournaments with prize pools exceeding Rs. 3,50,000. Early bird passes available until February 25.', 'Student Council Tech Lead', '2026-02-17', '1 day ago', 0, 'published', 610, 0),
('notif-003', 'Submission Deadline Extended: Computer Networks Lab Record', 'Academic', 'Computer Engineering', 'The deadline for submitting the verified hard copy of Computer Networks Lab records (Assignments 1-6 with Wireshark packet captures) has been extended to Friday, 5:00 PM. Late submissions will incur a 20% mark penalty.', 'Prof. Anjali Deshmukh', '2026-02-16', '2 days ago', 0, 'published', 185, 0),
('notif-004', 'Microsoft & TCS Campus Recruitment Drive: Registration Protocol', 'Placement', 'Training & Placement Cell', 'Eligible 3rd and final year students (B.Tech CSE, IT, EXTC with CGPA >= 7.5 and no active backlogs) must complete their mandatory profile verification on the T&P portal before February 22. Online assessments begin next week.', 'Placement Officer', '2026-02-15', '3 days ago', 1, 'published', 890, 1),
('notif-005', 'Draft: Campus Wi-Fi 6 Upgrade Maintenance Window (Admin Only)', 'Administration', 'IT Infrastructure', 'Internal draft notice for scheduled core network maintenance during the upcoming weekend. Not yet published to general students.', 'Dr. Vikram Malhotra', '2026-02-19', 'Just now', 0, 'draft', 0, 0);

-- 12. EVENTS
INSERT OR REPLACE INTO events (id, title, category, date, end_date, time, venue, organizer, capacity, description, fee, tags, status) VALUES
('evt-001', 'Technova 2026: Flagship Tech & Innovation Fest', 'Fest', '2026-03-05', '2026-03-07', '09:00 AM - 08:00 PM', 'Main Auditorium & Innovation Labs', 'Council of Student Affairs', 1200, 'The biggest annual tech carnival of the institute! 3 days packed with drone racing, paper presentations, AI exhibits, coding battles, and keynotes by prominent industry leaders from Google, NVIDIA, and Microsoft.', 'Free for Students', 'Tech Fest, Hackathon, Cash Prizes, Certificates', 'published'),
('evt-002', 'HackSpark: 36-Hour National AI & Cloud Hackathon', 'Hackathon', '2026-03-12', '2026-03-13', '08:00 AM Kickoff', 'High Performance Computing Lab (HPC-402)', 'Google Developer Student Club (GDSC)', 250, 'Build real-world AI, Web3, and HealthTech applications within 36 hours. Free food, mentors from top startups, exclusive AWS credits, and seed funding opportunities for winning prototypes.', 'Free', 'Hackathon, AI, Cloud, Networking', 'published'),
('evt-003', 'Hands-on Workshop: Building Autonomous Agents with Python', 'Workshop', '2026-02-27', '2026-02-27', '02:00 PM - 05:30 PM', 'Seminar Hall 2, Dept of CSE', 'AI & Data Science Research Cell', 80, 'Comprehensive technical workshop covering tool calling, multi-agent workflows, vector retrieval, and deployment using open source models. Bring your own laptop with Python 3.11+ installed.', 'Free', 'Workshop, Python, Generative AI, Certificate', 'published'),
('evt-004', 'Inter-Department Badminton & Futsal Championship', 'Sports', '2026-03-18', '2026-03-20', '04:00 PM - 08:30 PM', 'Campus Indoor Sports Complex', 'Athletics & Sports Committee', 300, 'Cheer for your department or compete in the annual indoor racket and futsal trophy. Refreshments and trophies for winners.', 'Free', 'Sports, Badminton, Futsal, Trophy', 'published'),
('evt-005', 'Symphony 2026: Annual Cultural Gala & Battle of Bands', 'Cultural', '2026-03-28', '2026-03-28', '06:00 PM - 10:30 PM', 'Campus Open Air Amphitheatre', 'Cultural Arts Society', 2000, 'An evening of musical euphoria, drama club showcases, choreography performances, and celebrity live band headline act.', 'Free Student Pass', 'Cultural, Music, Live Band, Drama', 'published');

-- 13. EVENT REGISTRATIONS
INSERT OR REPLACE INTO event_registrations (event_id, student_id, ticket_id) VALUES
('evt-001', 'STU-2024-8842', 'TCK-TECHNOVA-8842');

-- 14. CLUBS
INSERT OR REPLACE INTO clubs (id, name, category, lead_name, meeting_info, logo_icon, description) VALUES
('clb-01', 'Google Developer Student Club (GDSC)', 'Technical', 'Aarav Sharma', 'Every Thursday, 4 PM @ HPC Lab', '💻', 'Community exploring Google Cloud, Android, Flutter, and web technologies.'),
('clb-02', 'AI & Machine Learning Research Cell', 'Technical', 'Priya Nair', 'Every Tuesday, 4 PM @ Lab 4', '🤖', 'Focused on paper readings, deep learning projects, and Kaggle competitions.'),
('clb-03', 'Robotics & Hardware Systems Club', 'Technical', 'Sameer Kulkarni', 'Every Friday, 3 PM @ Workshop', '🛠️', 'Autonomous rovers, drone mechanics, Arduino, and embedded systems.'),
('clb-04', 'Cultural Arts & Dramatics Society', 'Cultural', 'Divya Iyer', 'Every Wednesday, 4:30 PM @ Amphitheatre', '🎭', 'Stage plays, street theatre, mono-acts, and collegiate drama fest participation.'),
('clb-05', 'Athletics & Sports Committee', 'Sports', 'Rohan Patil', 'Daily Practice @ Sports Complex', '🏆', 'Coordinating inter-college tournaments in football, cricket, badminton, and athletics.');

-- 15. CLUB MEMBERSHIPS
INSERT OR REPLACE INTO club_memberships (club_id, student_id) VALUES
('clb-01', 'STU-2024-8842'),
('clb-05', 'STU-2024-8842');

-- 16. LOST & FOUND ITEMS
INSERT OR REPLACE INTO lost_found_items (id, type, title, category, location, item_date, description, status, reporter_id, reporter_name) VALUES
('lf-001', 'found', 'Brown Leather Bi-fold Wallet with Library Card', 'Keys & Wallets', 'Central Canteen (Table 14)', '2026-02-18', 'Found on table 14 after afternoon lunch hour. Contains student library card and small change. Deposited safely at Security Desk.', 'found', 'ADM-2024-001', 'Canteen Staff (Security Desk)'),
('lf-002', 'lost', 'Apple AirPods Pro (2nd Gen) in White MagSafe Case', 'Electronics', 'High Performance Computing Lab (HPC-402)', '2026-02-17', 'Left near workstation 18 during evening GPU practicals. Case has a small blue astronaut vinyl decal.', 'claim_pending', 'STU-2024-8842', 'Alex Turner'),
('lf-003', 'found', 'Official Institute Student RFID ID Card (2nd Year)', 'ID Cards', 'Library 2nd Floor Reading Hall', '2026-02-16', 'Student ID card found near Reference Shelf B-08. Cardholder has been notified via portal broadcast.', 'returned', 'ADM-2024-001', 'Library Desk'),
('lf-004', 'lost', 'Casio fx-991EX ClassWiz Calculator with Transparent Slide Cover', 'Electronics', 'Lecture Hall L-201', '2026-02-15', 'Misplaced on the third row bench after Operating Systems lecture.', 'lost', 'STU-2024-7719', 'Priya Nair'),
('lf-005', 'found', 'Set of 3 Yale Keys on Navy Blue Paracord Keychain', 'Keys & Wallets', 'Sports Ground Pavilion', '2026-02-14', 'Found on the first bleacher row after the inter-department football practice.', 'found', 'STU-2024-4110', 'Athletics Committee');

-- 17. LOST & FOUND CLAIMS
INSERT OR REPLACE INTO lost_found_claims (id, item_id, claimant_id, claimant_name, claimant_dept, proof_description, claim_date, status) VALUES
('cl-001', 'lf-002', 'STU-2024-8842', 'Alex Turner', 'Computer Engineering', 'Case has a blue astronaut sticker on back and engraving initials AT.', '2026-02-17', 'pending'),
('cl-002', 'lf-003', 'STU-2024-4110', 'Rohan Patil', 'Mechanical Engineering', 'Verified with physical student photo database.', '2026-02-16', 'approved');

-- 18. OPPORTUNITIES
INSERT OR REPLACE INTO opportunities (id, title, type, company, stipend, location, deadline, description, eligibility, apply_url, status) VALUES
('opp-001', 'Google Summer of Code (GSoC) 2026 Mentorship Program', 'Internship', 'Google Open Source Organizations', '$1,500 - $3,000 Stipend', 'Remote', '2026-03-24', 'Global program focused on bringing student developers into open source software development. Work with mentors on cutting-edge real-world open source codebases.', 'All Enrolled College Students (18+), Git & Programming familiarity', 'https://summerofcode.withgoogle.com', 'published'),
('opp-002', 'DRDO Defense AI & Cybersecurity Research Fellowship', 'Internship', 'Defence Research and Development Organisation', '₹25,000 / month', 'Pune / Bangalore Labs', '2026-03-15', 'Prestigious 6-month hands-on research fellowship working on secure computer vision, autonomous embedded systems, and threat intelligence telemetry.', 'B.Tech 3rd/4th Year with CGPA > 8.0 in CSE/ECE/IT', '#apply-drdo', 'published'),
('opp-003', 'National Merit STEM Innovation Scholarship 2026', 'Scholarship', 'Ministry of Education & Tech Council', '₹50,000 Annual Grant', 'National Level', '2026-03-30', 'Financial grant awarded to top 5% academic achievers pursuing engineering and technology degrees to sponsor research, books, and international conference papers.', 'Full-time engineering students with family income < 8 LPA or CGPA >= 8.5', '#apply-scholarship', 'published'),
('opp-004', 'Smart India Hackathon (SIH) 2026 — Internal College Selection', 'Competition', 'Government of India Innovation Cell', '₹1,00,000 First Prize', 'On-Campus Screening', '2026-03-08', 'Form teams of 6 students (with mandatory at least 1 female teammate) to tackle national problem statements in Smart Agriculture, Clean Water, and Cyber Defense.', 'Teams of 6 students from any engineering branch', '#apply-sih', 'published'),
('opp-005', 'AWS Certified Solutions Architect Student Exam Voucher 2026', 'Certification', 'Amazon Web Services Academy', '100% Exam Fee Waiver ($150 value)', 'Online Examination', '2026-04-10', 'Full voucher sponsorship provided by Institute Cloud Excellence Center for students who complete the 40-hour AWS Cloud Academy modules.', 'Students with > 80% attendance in Cloud Computing module', '#apply-aws', 'published');

-- 19. OPPORTUNITY INTERACTIONS
INSERT OR REPLACE INTO opportunity_interactions (opportunity_id, student_id, action_type) VALUES
('opp-001', 'STU-2024-8842', 'saved'),
('opp-002', 'STU-2024-8842', 'applied'),
('opp-003', 'STU-2024-8842', 'saved');

-- 20. MARKETPLACE ITEMS
INSERT OR REPLACE INTO marketplace_items (id, title, category, price, condition_grade, seller_id, seller_name, seller_contact, item_date, description, status) VALUES
('mkt-001', 'Higher Engineering Mathematics — B.S. Grewal (44th Edition)', 'Textbooks', 320.00, 'Like New', 'STU-2024-4110', 'Rohan Patil (CSE Final Year)', 'rohan.patil@campus360.edu • WhatsApp: 9811223344', '2026-02-16', 'Hardcover edition with all solved examples for Sem 1-4. No markings or folded pages. Pickup near Central Library.', 'approved'),
('mkt-002', 'Casio fx-991EX ClassWiz Scientific Calculator (Original with Case)', 'Electronics', 850.00, 'Excellent', 'STU-2024-7719', 'Priya Nair (EXTC 3rd Year)', 'priya.nair@campus360.edu • 9845012345', '2026-02-15', 'High-res natural textbook display with matrix, vector, and polynomial solvers. Battery replaced last month.', 'approved'),
('mkt-003', 'Arduino Uno Ultimate Starter Kit with Sensors, Breadboard & Cables', 'Electronics', 950.00, 'Like New', 'STU-2024-8842', 'Alex Turner', 'student@campus360.edu', '2026-02-17', 'Used only once for IoT mini-project. Includes ultrasonic sensor, servo motor, jumper wires, relay, and OLED module.', 'approved'),
('mkt-004', 'Standard White Lab Coat / Apron (Size 38 / M) with Institute Crest', 'Stationery', 180.00, 'Good', 'STU-2024-3201', 'Kavita Singh (Chemical Dept)', 'kavita.s@campus360.edu', '2026-02-14', 'Freshly laundered, pure cotton, no chemical stains or tears. Ideal for first/second year chemistry and physics labs.', 'approved'),
('mkt-005', 'Omega Mini-Drafter with 360° Scale and Canvas Carrying Case', 'Lab Gear', 400.00, 'Like New', 'STU-2024-4110', 'Sameer Kulkarni (Mech 2nd Year)', 'sameer.k@campus360.edu', '2026-02-12', 'Precision engineering drawing mini drafter with steel rod clamp. Smooth rotation, zero wobble.', 'approved'),
('mkt-006', 'Data Structures and Algorithms in C++ — Adam Drozdek', 'Textbooks', 250.00, 'Fair', 'STU-2024-7719', 'Divya Iyer', 'divya.i@campus360.edu', '2026-02-11', 'Good reference book for tree and graph algorithms. Some highlighter notes in Chapter 5.', 'approved');

-- 21. CAMPUS LOCATIONS
INSERT OR REPLACE INTO campus_locations (id, name, code, building, floor, category, description, operating_hours, contact) VALUES
('loc-01', 'Main Academic Block A', 'BLOCK-A', 'Block A', 'Ground to 4th Floor', 'Classrooms', 'Core lecture halls (L-101 to L-204), Faculty Cabins, and Dean Office.', '08:00 AM - 06:30 PM', 'Office of Academics: Ext 101'),
('loc-02', 'High Performance Computing & AI Labs', 'HPC-402', 'Block B', '4th Floor', 'Laboratories', 'NVIDIA RTX GPU clusters, Linux workstations, and AI research workstations.', '08:30 AM - 07:00 PM', 'Prof. Sharma: Ext 402'),
('loc-03', 'Central Knowledge Center & Library', 'LIB-CENTRAL', 'Library Block', 'Ground to 3rd Floor', 'Library & Study', 'Over 45,000 engineering volumes, silent study zones, e-resource portals, and discussion carrels.', '08:00 AM - 09:30 PM', 'Chief Librarian: Ext 300'),
('loc-04', 'Student Plaza & Central Canteen', 'FOOD-COURT', 'Student Center', 'Ground Floor', 'Food & Dining', 'Fresh vegetarian meals, combo thalis, snacks, beverages, and outdoor patio seating.', '08:00 AM - 07:30 PM', 'Canteen Desk: Ext 501'),
('loc-05', 'Dr. APJ Abdul Kalam Auditorium', 'AUDI-MAIN', 'Central Campus', 'Ground Floor', 'Facilities', '1,200-seat state-of-the-art auditorium for symposiums, cultural nights, and corporate recruitment keynotes.', 'Event-based / 09:00 AM - 09:00 PM', 'Auditorium In-charge: Ext 205'),
('loc-06', 'Campus Emergency Health & First Aid Clinic', 'MED-CLINIC', 'Near Main Gate', 'Ground Floor', 'Facilities', 'Resident medical physician, emergency oxygen, observation beds, and rapid ambulance dispatch.', '24/7 Service', 'Emergency Medical Hotline: Ext 108'),
('loc-07', 'Indoor Sports Complex & Gymnasium', 'SPORTS-COMPLEX', 'Sports Block', 'Ground Floor', 'Sports & Amenities', 'Synthetic badminton courts, table tennis tables, chess room, and full gym.', '06:00 AM - 08:30 PM', 'Athletics Office: Ext 601'),
('loc-08', 'Training & Placement Corporate Center', 'TNP-SUITE', 'Block A', '1st Floor', 'Administration', 'Group discussion conference halls, interview cubicles, and aptitude testing lab.', '09:00 AM - 05:30 PM', 'T&P Officer: Ext 150');

-- 22. TRANSPORT ROUTES
INSERT OR REPLACE INTO transport_routes (id, route_number, pickup_points, morning_times, evening_times, vehicle, status) VALUES
('tr-01', 'Route 1: Thane Station East', 'Thane Stn → Teen Hath Naka → Cadbury Junction → Majiwada → Campus Gate', '07:45 AM, 08:15 AM, 08:45 AM', '04:30 PM, 05:15 PM, 06:00 PM', 'Bus #14 (45-Seater AC)', 'On Time'),
('tr-02', 'Route 2: Borivali & Western Corridor', 'Borivali National Park → Dahisar Check Naka → Ghodbunder Flyover → Campus Gate', '07:15 AM, 08:00 AM', '04:45 PM, 05:30 PM', 'Bus #08 (52-Seater)', 'On Time'),
('tr-03', 'Route 3: Navi Mumbai & Vashi', 'Vashi Plaza → Airoli Toll Naka → Rabale → Mulund Naka → Campus Gate', '07:30 AM, 08:10 AM', '04:45 PM, 05:15 PM', 'Bus #22 (45-Seater AC)', 'Departed'),
('tr-04', 'Route 4: Kalyan & Dombivli Ring', 'Kalyan Station → Dombivli Circle → Shilphata → Mumbra Bypass → Campus Gate', '07:20 AM, 08:05 AM', '04:50 PM, 05:25 PM', 'Bus #05 (52-Seater)', 'On Time');

-- 23. CANTEEN MENU
INSERT OR REPLACE INTO canteen_menu (id, name, category, price, is_veg, availability, description) VALUES
('cnt-01', 'Veg Poha with Roasted Peanuts', 'Breakfast', 35.00, 1, 'Available', 'Warm flaked rice tempered with mustard, curry leaves, and fresh lime.'),
('cnt-02', 'Steamed Idli & Medu Vada Sambar', 'Breakfast', 45.00, 1, 'Available', 'Fluffy steamed rice cakes and crispy lentil fritters with spiced lentil stew.'),
('cnt-03', 'Paneer Cheese Grilled Sandwich', 'Breakfast', 65.00, 1, 'Available', 'Herb seasoned paneer cottage cheese and melting cheddar on toasted multigrain bread.'),
('cnt-04', 'Executive Veg Special Thali', 'Lunch', 140.00, 1, 'Popular', '2 Veg Gravies, Dal Tadka, Jeera Rice, 3 Butter Rotis, Gulab Jamun, Papad.'),
('cnt-05', 'Dal Tadka with Steam Rice', 'Lunch', 90.00, 1, 'Available', 'Comforting yellow lentils tempered with garlic and cumin, served with basmati rice.'),
('cnt-06', 'Crispy Veg Spring Rolls (6 pcs)', 'Snacks', 50.00, 1, 'Available', 'Golden fried rolls stuffed with crunchy shredded cabbage, carrots, and sweet chili dip.'),
('cnt-07', 'Hot Samosa Pav with Spicy Chutney (2 pcs)', 'Snacks', 28.00, 1, 'Available', 'Classic spiced potato turnover tucked into soft pav with green and tamarind chutney.'),
('cnt-08', 'Cold Coffee with Vanilla Ice Cream', 'Beverages', 55.00, 1, 'Available', 'Rich brewed espresso blended with chilled milk and topped with vanilla ice cream scoop.'),
('cnt-09', 'Fresh Masala Cutting Chai', 'Beverages', 15.00, 1, 'Available', 'Steaming aromatic tea brewed with ginger, green cardamom, and lemongrass.');

-- 24. EMERGENCY CONTACTS
INSERT OR REPLACE INTO emergency_contacts (id, title, contact_number, extension, available_hours) VALUES
(1, 'Campus Health Clinic & First Aid', '+91 98200 11999', '108', '24/7 On-Duty Resident Doctor'),
(2, 'Campus Security & Gate Control', '+91 98200 11000', '100', '24/7 Patrol & Emergency Escort'),
(3, 'Women Safety & Grievance Cell', '+91 98200 11555', '155', 'Confidential Dean Line'),
(4, 'Student Counseling & Wellness', '+91 98200 11333', '133', '09:00 AM - 06:00 PM (Confidential)'),
(5, 'IT Services & Wi-Fi Emergency Helpdesk', '+91 98200 11444', '404', '08:30 AM - 07:00 PM');

-- 25. FEEDBACK & GRIEVANCES
INSERT OR REPLACE INTO feedback_grievances (id, category, title, description, submission_date, student_name, status, admin_notes) VALUES
('ISSUE-2026-881', 'Wi-Fi & Network', 'Intermittent Wi-Fi signal drop on Library 3rd Floor', 'High packet loss while accessing IEEE Xplore digital library research papers.', '2026-02-16', 'Alex Turner', 'under_review', 'Network team deploying an additional Cisco Catalyst Wi-Fi 6 access point on Feb 19.'),
('ISSUE-2026-874', 'Facilities & Infrastructure', 'Loose HDMI cable in Seminar Hall 2 presentation podium', 'Display project switches off intermittently during group slides.', '2026-02-14', 'Priya Nair', 'resolved', 'Replaced with 4K gold-plated braided HDMI cable by campus AV support.'),
('ISSUE-2026-890', 'Canteen & Hygiene', 'Evening snack counter runs out early during exam weeks', 'Need extended bakery and tea availability until 06:30 PM for lab students.', '2026-02-18', 'Rohan Patil', 'submitted', NULL);

-- 26. NOTIFICATIONS
INSERT OR REPLACE INTO notifications (id, title, message, timestamp, type, is_read, target_role, link) VALUES
('notif-sys-01', 'Mid-Semester Exam Schedule Published', 'The examination timetable for Spring 2026 is now live on the noticeboard.', '2 hours ago', 'exam', 0, 'all', '/notices'),
('notif-sys-02', 'Technova 2026 Registration Confirmed', 'You have successfully registered for the Technova 2026 pass! Check your ticket in profile.', '1 day ago', 'event', 1, 'student', '/campus-life'),
('notif-sys-03', 'Attendance Warning in DBMS', 'Your current attendance in Database Management Systems is 72% (below required 75%).', '2 days ago', 'academic', 0, 'student', '/academics'),
('notif-sys-04', 'New Opportunity: DRDO Research Fellowship', 'Dean of Academic Affairs published a new verified defense fellowship opportunity.', '3 days ago', 'opportunity', 1, 'student', '/opportunities');
