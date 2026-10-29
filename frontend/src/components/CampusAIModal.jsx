import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, X, Send, Bot, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CampusAIModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your **Campus 360 AI Assistant**, backed by your live SQL database. Ask me about class schedules, attendance margins, pending coursework, or examination hall tickets!',
      references: [],
      suggestions: [
        'What classes do I have today?',
        'Check my DBMS attendance status',
        'Show mid-term exam schedule',
        'Pending assignments due soon',
        'Where is the HPC Lab?'
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const promptToSend = queryText || input;
    if (!promptToSend.trim() || loading) return;

    // Add user message
    const userMsg = { sender: 'user', text: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.queryAI(promptToSend, user?.id);
      const aiMsg = {
        sender: 'ai',
        text: res.answer,
        references: res.references || [],
        suggestions: res.suggestions || []
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ Sorry, I could not query the campus database. Please ensure the backend server is running.',
          references: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          height: '620px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: 'rgba(113, 201, 206, 0.12)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--c-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#07171e'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Campus 360 AI Operating System
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--c-mid)' }}>
                Grounded relational database reasoning engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'ai' && (
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(113, 201, 206, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={16} color="#71C9CE" />
                </div>
              )}

              <div>
                <div style={{
                  backgroundColor: m.sender === 'user' ? 'var(--c-primary)' : 'rgba(166, 227, 233, 0.08)',
                  color: m.sender === 'user' ? '#07171e' : 'var(--text-main)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}
                </div>

                {/* References */}
                {m.references && m.references.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {m.references.map((ref, rIdx) => (
                      <Link
                        key={rIdx}
                        to={ref.link}
                        onClick={onClose}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(113, 201, 206, 0.15)',
                          color: 'var(--c-lightest)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          textDecoration: 'none',
                          border: '1px solid rgba(113, 201, 206, 0.3)'
                        }}
                      >
                        <ExternalLink size={11} />
                        {ref.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Quick suggestions if AI */}
                {m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {m.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(s)}
                        style={{
                          backgroundColor: 'var(--bg-card-hover)',
                          color: 'var(--c-mid)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 12px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--c-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#07171e',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {user?.avatar || 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--c-mid)', fontSize: '0.85rem' }}>
              <Bot size={18} color="#71C9CE" />
              <span>Querying Campus 360 database...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '14px 20px',
          backgroundColor: 'var(--bg-topbar)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about timetable, attendance margin, exams, notices..."
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{
              backgroundColor: 'var(--c-primary)',
              color: '#07171e',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !input.trim() || loading ? 0.5 : 1
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
