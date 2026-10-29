import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Calendar,
  BookOpen,
  FileCheck,
  Award,
  Upload,
  PlusCircle,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function Academics() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable', 'materials', 'assignments', 'exams'
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetable, setTimetable] = useState({});
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  // Modals state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionComments, setSubmissionComments] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    course_code: 'CS301',
    semester: 'Sem 6',
    uploaded_by: 'Prof. Sharma',
    file_type: 'PDF',
    size: '3.5 MB'
  });

  const [createAsgModalOpen, setCreateAsgModalOpen] = useState(false);
  const [newAsg, setNewAsg] = useState({
    title: '',
    course_code: 'CS301',
    due_date: '2026-03-05',
    total_marks: 20,
    instructions: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadAcademicsData();
  }, [user]);

  const loadAcademicsData = async () => {
    try {
      const [tt, mat, asg, ex] = await Promise.all([
        api.getTimetable(),
        api.getMaterials(),
        api.getAssignments(user?.id || 'STU-2024-8842'),
        api.getExams()
      ]);
      setTimetable(tt);
      setMaterials(mat);
      setAssignments(asg);
      setExams(ex);
    } catch (err) {
      console.error('Failed to load academic data:', err);
    }
  };

  const handleOpenSubmit = (asg) => {
    setSelectedAssignment(asg);
    setSubmissionLink(asg.submission_link || '');
    setSubmissionComments('');
    setSubmitModalOpen(true);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submissionLink.trim()) return;

    try {
      await api.submitAssignment(selectedAssignment.id, {
        studentId: user?.id || 'STU-2024-8842',
        submissionLink,
        comments: submissionComments
      });
      setSubmitModalOpen(false);
      loadAcademicsData();
    } catch (err) {
      alert('Error submitting assignment: ' + err.message);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    try {
      await api.uploadMaterial(newMaterial);
      setUploadModalOpen(false);
      loadAcademicsData();
    } catch (err) {
      alert('Error uploading material');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.createAssignment(newAsg);
      setCreateAsgModalOpen(false);
      loadAcademicsData();
    } catch (err) {
      alert('Error creating assignment');
    }
  };

  const downloadSimulator = (item) => {
    alert(`📥 Downloading: "${item.title}" (${item.file_type}, ${item.size})\nSource verified by Dean of Academic Affairs.`);
  };

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header with Sub-Navigation Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Academics Hub
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Curriculum schedules, study records, submissions, and hall ticket allocations
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          gap: '4px'
        }}>
          {[
            { id: 'timetable', label: 'Timetable', icon: Calendar },
            { id: 'materials', label: 'Study Materials', icon: BookOpen },
            { id: 'assignments', label: 'Assignments', icon: FileCheck },
            { id: 'exams', label: 'Mid-Term Exams', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: active ? 'var(--c-primary)' : 'transparent',
                  color: active ? '#07171e' : 'var(--text-muted)',
                  boxShadow: active ? 'var(--shadow-teal)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          TAB 1: TIMETABLE
          ==================================================================== */}
      {activeTab === 'timetable' && (
        <div className="animate-fade">
          {/* Day selection tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedDay === day ? '1px solid var(--c-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: selectedDay === day ? 'rgba(113, 201, 206, 0.15)' : 'var(--bg-card)',
                  color: selectedDay === day ? 'var(--c-lightest)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Day's Classes Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(timetable[selectedDay] || []).length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                No scheduled lectures for {selectedDay}.
              </div>
            ) : (
              (timetable[selectedDay] || []).map((period, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(113, 201, 206, 0.12)',
                      color: 'var(--c-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      border: '1px solid var(--border-highlight)'
                    }}>
                      P{period.period}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {period.subject}
                        </h4>
                        <span className="badge badge-aqua">{period.course_code}</span>
                        <span className="badge badge-ice">{period.class_type}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Faculty: <strong>{period.faculty}</strong> • Hall: <strong>{period.room}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-lightest)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="#71C9CE" />
                      {period.time_slot}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Attendance verified at door</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: STUDY MATERIALS
          ==================================================================== */}
      {activeTab === 'materials' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Course Handouts, Notes & Reference Slides
            </h3>
            {isAdmin && (
              <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
                <Upload size={16} />
                Upload Course Slides / Notes
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '18px'
          }}>
            {materials.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge badge-teal">{item.course_code}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--c-mid)', fontWeight: 600 }}>{item.file_type} • {item.size}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '6px' }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Uploaded by: {item.uploaded_by} • {item.semester}
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Added on {item.upload_date}</span>
                  <button
                    onClick={() => downloadSimulator(item)}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    <Download size={14} color="#71C9CE" />
                    Download File
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: ASSIGNMENTS
          ==================================================================== */}
      {activeTab === 'assignments' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Coursework Assignments & Digital Records
            </h3>
            {isAdmin && (
              <button onClick={() => setCreateAsgModalOpen(true)} className="btn-primary">
                <PlusCircle size={16} />
                Create New Assignment
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {assignments.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: item.status === 'submitted' || item.status === 'graded' 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : '1px solid var(--border-highlight)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="badge badge-teal">{item.course_code}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)', fontWeight: 600 }}>{item.subject}</span>
                    <span className={`badge ${item.status === 'graded' ? 'badge-teal' : item.status === 'submitted' ? 'badge-aqua' : 'badge-urgent'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.instructions}
                  </p>
                  {item.submission_link && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--c-mid)' }}>
                      Submitted repository: <a href={item.submission_link} target="_blank" rel="noreferrer" style={{ color: 'var(--c-primary)' }}>{item.submission_link}</a>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Due Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: item.status === 'pending' ? '#fb7185' : 'var(--c-lightest)' }}>
                      {item.due_date} {item.dueInDays !== undefined && item.status === 'pending' ? `(${item.dueInDays} days left)` : ''}
                    </div>
                  </div>

                  {item.score && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--c-primary)' }}>
                      Grade: {item.score}
                    </div>
                  )}

                  {!isAdmin && (
                    <button
                      onClick={() => handleOpenSubmit(item)}
                      className={item.status === 'pending' ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      {item.status === 'pending' ? 'Submit Record' : 'Update Submission'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: MID-TERM EXAMS
          ==================================================================== */}
      {activeTab === 'exams' && (
        <div className="animate-fade">
          <div style={{
            backgroundColor: 'rgba(113, 201, 206, 0.08)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={22} color="#71C9CE" />
            <div style={{ fontSize: '0.85rem', color: 'var(--c-lightest)', lineHeight: 1.4 }}>
              <strong>Examination Protocol Alert:</strong> Hall tickets will be verified at the entrance. Smart devices, programmable calculators, and earphones are strictly barred from all examination wings.
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {exams.map((exam, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-teal">{exam.course_code}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--c-mid)', fontWeight: 600 }}>{exam.time_slot}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                  {exam.subject}
                </h4>
                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                  <span style={{ fontWeight: 600, color: 'var(--c-lightest)' }}>{exam.exam_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Examination Wing:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{exam.hall}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Allocated Desk:</span>
                  <span style={{ fontWeight: 700, color: 'var(--c-primary)' }}>{exam.seat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          SUBMIT ASSIGNMENT MODAL
          ==================================================================== */}
      {submitModalOpen && (
        <div className="modal-overlay" onClick={() => setSubmitModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Submit Coursework Record
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              {selectedAssignment?.title} ({selectedAssignment?.course_code})
            </p>

            <form onSubmit={handleSubmitAssignment}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>
                  Submission URL (GitHub Repo / Google Colab / Drive Link)*
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project-repo"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>
                  Student Comments / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention test outputs, compile instructions, or edge cases handled..."
                  value={submissionComments}
                  onChange={(e) => setSubmissionComments(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          UPLOAD MATERIAL MODAL (ADMIN)
          ==================================================================== */}
      {uploadModalOpen && (
        <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Upload Study Notes / Lecture Deck
            </h3>
            <form onSubmit={handleUploadMaterial}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Networks Sliding Window Protocols Guide"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Course Code</label>
                  <select
                    value={newMaterial.course_code}
                    onChange={(e) => setNewMaterial({ ...newMaterial, course_code: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <option value="CS301">CS301 (DSA)</option>
                    <option value="CS302">CS302 (OS)</option>
                    <option value="CS303">CS303 (DBMS)</option>
                    <option value="CS304">CS304 (Networks)</option>
                    <option value="CS305">CS305 (AI/ML)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>File Type</label>
                  <select
                    value={newMaterial.file_type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, file_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPTX">PowerPoint Deck</option>
                    <option value="ZIP">Code Archive (ZIP)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setUploadModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Publish to Repository</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          CREATE ASSIGNMENT MODAL (ADMIN)
          ==================================================================== */}
      {createAsgModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateAsgModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Publish Course Assignment
            </h3>
            <form onSubmit={handleCreateAssignment}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 4: Deadlock Avoidance Algorithm"
                  value={newAsg.title}
                  onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Course</label>
                  <select
                    value={newAsg.course_code}
                    onChange={(e) => setNewAsg({ ...newAsg, course_code: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <option value="CS301">CS301</option>
                    <option value="CS302">CS302</option>
                    <option value="CS303">CS303</option>
                    <option value="CS304">CS304</option>
                    <option value="CS305">CS305</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAsg.due_date}
                    onChange={(e) => setNewAsg({ ...newAsg, due_date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Instructions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail programming constraints, submission link requirements, marks..."
                  value={newAsg.instructions}
                  onChange={(e) => setNewAsg({ ...newAsg, instructions: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setCreateAsgModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
