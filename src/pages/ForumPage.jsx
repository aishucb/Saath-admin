import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', tags: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('everyone');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/admin/me');
      console.log('Admin data:', response.data);
      setAdmin(response.data.admin);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchForums = async (tab = 'everyone') => {
    setLoading(true);
    try {
      if (tab === 'everyone') {
        const response = await api.get('/forum');
        console.log('Everyone tab forums:', response.data.forums);
        setForums(response.data.forums || []);
      } else if (tab === 'me' && admin) {
        console.log('Triggering fetchForums for Me tab, admin:', admin);
        const adminId = admin._id;
        console.log('Using admin ID:', adminId);
        const response = await api.get(`/forum/admin/${adminId}`);
        console.log('Me tab forums:', response.data.forums);
        if (response.data.success) {
          setForums(response.data.forums || []);
        } else {
          setForums([]);
        }
      }
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to fetch forums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'everyone') {
      fetchForums('everyone');
    } else if (activeTab === 'me' && admin) {
      fetchForums('me');
    }
  }, [activeTab, admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddForum = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const tagsArray = form.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await api.post('/forum', {
        title: form.title,
        body: form.body,
        tags: tagsArray
      });
      setShowForm(false);
      setForm({ title: '', body: '', tags: '' });
      fetchForums(activeTab);
    } catch (err) {
      setFormError('Failed to add forum');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ color: '#621d1d', margin: 0 }}>Forums</h2>
          <button
            onClick={() => setShowForm((show) => !show)}
            style={{
              backgroundColor: '#621d1d',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {showForm ? 'Cancel' : 'Add Forum'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #eee', 
          marginBottom: '1.5rem' 
        }}>
          <button
            onClick={() => {
              console.log('Switching to Everyone tab');
              setActiveTab('everyone');
            }}
            style={{
              background: activeTab === 'everyone' ? '#621d1d' : 'transparent',
              color: activeTab === 'everyone' ? 'white' : '#333',
              border: 'none',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: 500,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }}
          >
            Everyone
          </button>
          <button
            onClick={() => {
              console.log('Switching to Me tab');
              setActiveTab('me');
            }}
            style={{
              background: activeTab === 'me' ? '#621d1d' : 'transparent',
              color: activeTab === 'me' ? 'white' : '#333',
              border: 'none',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: 500,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }}
          >
            Me
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddForum} style={{
            background: '#f8f9fa',
            borderRadius: 12,
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            maxWidth: 500
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>Body</label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleInputChange}
                required
                rows={4}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleInputChange}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              />
            </div>
            {formError && <div style={{ color: 'red', marginBottom: 10 }}>{formError}</div>}
            <button
              type="submit"
              disabled={formLoading}
              style={{
                backgroundColor: '#621d1d',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {formLoading ? 'Adding...' : 'Add Forum'}
            </button>
          </form>
        )}

        {forums.length === 0 ? (
          <div>No forums found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {forums.map(forum => (
              <div key={forum._id} style={{
                background: '#f8f9fa',
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <h3 
                  onClick={() => navigate(`/forum/${forum._id}`)}
                  style={{ 
                    margin: 0, 
                    color: '#333', 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: '#621d1d'
                  }}
                >
                  {forum.title}
                </h3>
                <p style={{ color: '#666', margin: '0.5rem 0 1rem' }}>{forum.body}</p>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
                  Tags: {forum.tags && forum.tags.length > 0 ? forum.tags.join(', ') : 'None'}
                </div>
                <div style={{ color: '#888', fontSize: 13 }}>
                  By: {forum.createdBy?.name || forum.createdBy || 'Unknown'} | {forum.createdAt ? new Date(forum.createdAt).toLocaleString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ForumPage; 