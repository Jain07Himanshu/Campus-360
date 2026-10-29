const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// POST /api/ai/query
router.post('/query', (req, res) => {
  const { prompt, studentId } = req.body;
  const q = (prompt || '').trim().toLowerCase();

  if (!q) {
    return res.json({
      answer: 'Hello! I am your **Campus 360 AI Operating System Assistant**. Ask me about your timetable, upcoming exams, urgent notices, assignment due dates, internships, or campus directions!',
      suggestions: [
        'What is my timetable today?',
        'Show urgent exam notices',
        'Pending assignments due soon',
        'Where is the HPC Lab?',
        'What is on the canteen menu?'
      ],
      references: []
    });
  }

  const references = [];
  let answer = '';

  // 1. Timetable / Schedule query
  if (q.includes('timetable') || q.includes('class') || q.includes('schedule') || q.includes('today')) {
    const classes = query.all(`
      SELECT t.*, c.subject, c.faculty 
      FROM timetable t
      JOIN courses c ON t.course_code = c.code
      WHERE t.day_of_week = 'Monday'
      ORDER BY t.period ASC
    `);
    const listStr = classes.map(c => `• **Period ${c.period} (${c.time_slot})**: ${c.subject} (${c.course_code}) in **${c.room}** with *${c.faculty}* [${c.class_type}]`).join('\n');
    answer = `📅 **Your Schedule for Today (Monday):**\n\n${listStr}\n\n💡 *Tip:* Next up is **Data Structures & Algorithms (CS301)** at 09:00 AM in Room L-201.`;
    references.push({ title: 'Academics Hub: Full Timetable', link: '/academics' });
  }

  // 2. Exam queries
  else if (q.includes('exam') || q.includes('mid-term') || q.includes('mid term') || q.includes('test') || q.includes('seat') || q.includes('hall')) {
    const exams = query.all(`
      SELECT e.*, c.subject 
      FROM exam_schedules e
      JOIN courses c ON e.course_code = c.code
      ORDER BY e.exam_date ASC
    `);
    const examStr = exams.map(e => `• **${e.exam_date} (${e.time_slot})**: ${e.subject} (${e.course_code}) — **Hall: ${e.hall}**, Designated Seat: **${e.seat}**`).join('\n');
    answer = `🚨 **Spring 2026 Mid-Semester Examination Schedule:**\n\n${examStr}\n\n⚠️ **Protocol Alert:** Hall tickets must be carried physically. Reporting time is strictly 09:30 AM (30 minutes before start).`;
    references.push({ title: 'Examination Seating Arrangement', link: '/academics' });
  }

  // 3. Attendance query
  else if (q.includes('attendance') || q.includes('bunk') || q.includes('safe') || q.includes('debar') || q.includes('percentage')) {
    const att = query.all(`
      SELECT a.*, c.subject 
      FROM attendance a
      JOIN courses c ON a.course_code = c.code
      WHERE a.student_id = ?
    `, [studentId || 'STU-2024-8842']);
    
    const attStr = att.map(a => `• **${a.subject}**: ${a.attended}/${a.total} classes (${a.percentage}%) — Status: **${a.status.toUpperCase()}** ${a.margin_note ? `[${a.margin_note}]` : ''}`).join('\n');
    answer = `📊 **Live Course Attendance Telemetry:**\n\n${attStr}\n\n⚠️ **Debarment Advisory:** Minimum threshold is 75%. Please prioritize DBMS (CS303) lectures to clear warning zone.`;
    references.push({ title: 'Student Dashboard: Attendance Ledger', link: '/dashboard' });
  }

  // 4. Assignments query
  else if (q.includes('assignment') || q.includes('homework') || q.includes('submission') || q.includes('deadline') || q.includes('due')) {
    const asgs = query.all(`
      SELECT a.*, c.subject 
      FROM assignments a
      JOIN courses c ON a.course_code = c.code
      ORDER BY a.due_date ASC
    `);
    const asgStr = asgs.map(a => `• **${a.title}** (${a.subject})\n  ⏰ Due: **${a.due_date}** | Total Marks: ${a.total_marks}`).join('\n\n');
    answer = `📝 **Current Coursework Assignments:**\n\n${asgStr}\n\n🚀 You can submit your GitHub repository or Google Colab links directly on the Academics Hub portal.`;
    references.push({ title: 'Submit Coursework on Academics Hub', link: '/academics' });
  }

  // 5. Notices / Circulars query
  else if (q.includes('notice') || q.includes('circular') || q.includes('urgent') || q.includes('announcement')) {
    const notices = query.all('SELECT * FROM notices WHERE status = "published" ORDER BY is_urgent DESC, date DESC LIMIT 4');
    const noticeStr = notices.map(n => `• ${n.is_urgent ? '🚨 **[URGENT]** ' : '📌 '}**${n.title}** (${n.category} Cell, ${n.date})\n  *${n.content.slice(0, 140)}...*`).join('\n\n');
    answer = `📢 **Campus Broadcast Highlights:**\n\n${noticeStr}`;
    references.push({ title: 'Official Digital Noticeboard', link: '/notices' });
  }

  // 6. Food / Canteen query
  else if (q.includes('canteen') || q.includes('food') || q.includes('eat') || q.includes('lunch') || q.includes('menu') || q.includes('snack')) {
    const menu = query.all('SELECT * FROM canteen_menu LIMIT 6');
    const menuStr = menu.map(m => `• **${m.name}** (${m.category}) — ₹${m.price} [${m.availability}]`).join('\n');
    answer = `🍔 **Central Canteen & Food Court Menu Highlights:**\n\n${menuStr}\n\n⏰ **Operating Hours:** 08:00 AM – 07:30 PM daily at Student Plaza (Ground Floor).`;
    references.push({ title: 'Campus Utilities: Full Canteen Menu', link: '/utilities' });
  }

  // 7. Navigation / Directions query
  else if (q.includes('where') || q.includes('location') || q.includes('room') || q.includes('map') || q.includes('hpc') || q.includes('library')) {
    const locs = query.all('SELECT * FROM campus_locations LIMIT 4');
    const locStr = locs.map(l => `• **${l.name} (${l.code})**: ${l.building}, ${l.floor} — *${l.operating_hours}*`).join('\n');
    answer = `🗺️ **Campus Facility Directory:**\n\n${locStr}\n\n🚶 High Performance Computing & AI Labs (HPC-402) is located in **Block B, 4th Floor** (open 08:30 AM - 07:00 PM).`;
    references.push({ title: 'Campus Navigation & Interactive Map', link: '/campus-life' });
  }

  // 8. General fallback
  else {
    answer = `🤖 I parsed your query: "*${prompt}*".\n\nHere are some things I can assist you with:\n• **Timetable & Attendance**: "What classes do I have today?" or "Check my attendance"\n• **Exams & Halls**: "Show my mid-term seating"\n• **Deadlines**: "Pending assignments due this week"\n• **Campus Facilities**: "Where is the HPC lab?" or "Canteen menu"\n• **Notices & Circulars**: "Show urgent exam notices"`;
    references.push({ title: 'Smart Dashboard', link: '/dashboard' });
  }

  res.json({
    answer,
    references,
    suggestions: [
      'What classes do I have today?',
      'Check my DBMS attendance status',
      'Show mid-term exam schedule',
      'Pending assignments due soon'
    ]
  });
});

module.exports = router;
