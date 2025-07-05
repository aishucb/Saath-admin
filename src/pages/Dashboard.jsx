import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/me');
        console.log('Admin data response:', response.data);
        setAdmin(response.data.admin); // Response data is the admin object directly
      } catch (err) {
        setError('Failed to fetch admin data');
        console.error('Error fetching admin data:', err);
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff9fb'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

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
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #eee'
        }}>
          <h1 style={{ color: '#333', margin: 0 }}>Admin Dashboard</h1>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        {admin && (
          <div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#333', marginTop: 0 }}>Welcome, {admin.name}!</h2>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>Email: {admin.email}</p>
              <p style={{ color: '#666', margin: '0.5rem 0 0' }}>
                Member since: {new Date(admin.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Dashboard cards can be added here */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#333', marginTop: 0 }}>Quick Stats</h3>
                <p style={{ color: '#666' }}>Coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
