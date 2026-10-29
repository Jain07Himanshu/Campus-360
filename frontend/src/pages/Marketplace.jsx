import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShoppingBag,
  PlusCircle,
  Tag,
  Search,
  MessageSquare,
  ShieldCheck,
  User,
  CheckCircle2
} from 'lucide-react';

export default function Marketplace() {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [contactModalItem, setContactModalItem] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Textbooks',
    price: 300,
    condition_grade: 'Like New',
    description: ''
  });

  const categories = ['all', 'Textbooks', 'Electronics', 'Stationery', 'Lab Gear'];

  useEffect(() => {
    loadItems();
  }, [category, search]);

  const loadItems = async () => {
    try {
      const data = await api.getMarketplace(category, search);
      setItems(data);
    } catch (err) {
      console.error('Failed to load marketplace items:', err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.postMarketplaceItem({
        ...newItem,
        seller_id: user?.id || 'STU-2024-8842',
        seller_name: user?.name || 'Alex Turner',
        seller_contact: `${user?.email || 'student@campus360.edu'} • 9876543210`
      });
      setPostModalOpen(false);
      setNewItem({ title: '', category: 'Textbooks', price: 300, condition_grade: 'Like New', description: '' });
      loadItems();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Title & Action */}
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
            Student Marketplace
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Peer-to-peer campus exchange for textbooks, scientific calculators, and lab gear
          </p>
        </div>

        <button onClick={() => setPostModalOpen(true)} className="btn-primary">
          <PlusCircle size={16} />
          Sell an Item
        </button>
      </div>

      {/* Filter Chips & Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: category === c ? '1px solid var(--c-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: category === c ? 'rgba(113, 201, 206, 0.15)' : 'var(--bg-card)',
                color: category === c ? 'var(--c-lightest)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {c === 'all' ? 'All Items' : c}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          width: '280px'
        }}>
          <Search size={16} color="var(--c-mid)" />
          <input
            type="text"
            placeholder="Search books, calculators, lab gear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.84rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-teal">{item.category}</span>
                <span className="badge badge-aqua">{item.condition_grade}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.4 }}>
                {item.title}
              </h3>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--c-primary)', marginBottom: '10px' }}>
                ₹{item.price}
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '14px' }}>
                {item.description}
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Seller: <strong style={{ color: 'var(--c-lightest)' }}>{item.seller_name}</strong>
              </div>
            </div>

            <div style={{
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Listed on {item.item_date}
              </span>

              <button
                onClick={() => setContactModalItem(item)}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <MessageSquare size={14} color="#71C9CE" />
                Contact Seller
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          CONTACT SELLER MODAL
          ==================================================================== */}
      {contactModalItem && (
        <div className="modal-overlay" onClick={() => setContactModalItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '26px', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Contact Campus Seller
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Item: <strong>{contactModalItem.title}</strong> (₹{contactModalItem.price})
            </p>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>SELLER</span>
                <div style={{ fontWeight: 600, color: 'var(--c-lightest)' }}>{contactModalItem.seller_name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>DIRECT CONTACT COORDINATES</span>
                <div style={{ fontWeight: 600, color: 'var(--c-primary)' }}>{contactModalItem.seller_contact}</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(113, 201, 206, 0.08)',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              fontSize: '0.8rem',
              color: 'var(--c-lightest)',
              lineHeight: 1.4,
              marginBottom: '20px'
            }}>
              🛡️ <strong>Recommended Safe Meeting Spots:</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
                <li>Central Library 1st Floor Foyer</li>
                <li>Student Plaza Canteen Table Area</li>
                <li>Campus Security Desk Main Gate</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setContactModalItem(null)} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          POST ITEM MODAL
          ==================================================================== */}
      {postModalOpen && (
        <div className="modal-overlay" onClick={() => setPostModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              List an Item on Campus Marketplace
            </h3>
            <form onSubmit={handlePostSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Engineering Mathematics - B.S. Grewal"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Textbooks">Textbooks</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Lab Gear">Lab Gear</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Condition</label>
                  <select
                    value={newItem.condition_grade}
                    onChange={(e) => setNewItem({ ...newItem, condition_grade: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mention markings, edition, accessories included, and pickup spot..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setPostModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Post Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
