import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

const cardStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
  padding: '2rem',
  marginBottom: '2rem',
  maxWidth: 800,
  margin: '2rem auto',
};
const sectionTitle = {
  color: '#621d1d',
  fontWeight: 600,
  fontSize: 20,
  marginBottom: 12,
  marginTop: 24,
};
const label = {
  fontWeight: 500,
  color: '#333',
  minWidth: 140,
  display: 'inline-block',
};
const value = {
  color: '#444',
  fontWeight: 400,
};
const meta = {
  color: '#888',
  fontSize: 13,
  marginTop: 16,
};
const divider = {
  border: 'none',
  borderTop: '1px solid #eee',
  margin: '24px 0',
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/admin-events/${id}`);
        setEvent(response.data.data);
      } catch (err) {
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <Layout>
      <div style={cardStyle}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#621d1d', cursor: 'pointer', fontWeight: 500, fontSize: 16 }}>&larr; Back</button>
        {/* Main Info */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 260 }}>
            <h2 style={{ color: '#621d1d', marginBottom: 8 }}>{event.eventName}</h2>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Organizer:</span> <span style={value}>{event.organizer}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Date:</span> <span style={value}>{event.date ? new Date(event.date).toLocaleDateString() : ''}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Time:</span> <span style={value}>{event.eventTime?.from} - {event.eventTime?.to}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Place:</span> <span style={value}>{event.place}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Duration:</span> <span style={value}>{event.duration}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Max Attendees:</span> <span style={value}>{event.maxAttendees}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Available Slots:</span> <span style={value}>{event.availableSlots}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={label}>Tags:</span> <span style={value}>{event.tags && event.tags.length > 0 ? event.tags.join(', ') : 'None'}</span>
            </div>
          </div>
          {event.image && (
            <div style={{ flex: 1, minWidth: 180, textAlign: 'center' }}>
              <img src={event.image} alt="Event" style={{ maxWidth: 200, borderRadius: 12, marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            </div>
          )}
        </div>
        <hr style={divider} />
        {/* Description */}
        <div>
          <div style={sectionTitle}>Description</div>
          <div style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>{event.description}</div>
        </div>
        {/* Pricing */}
        {event.pricing && event.pricing.length > 0 && (
          <>
            <hr style={divider} />
            <div>
              <div style={sectionTitle}>Pricing Options</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {event.pricing.map((p, idx) => (
                  <div key={idx} style={{ background: '#f8f9fa', borderRadius: 10, padding: 16, minWidth: 180, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: 600, color: '#621d1d', marginBottom: 4 }}>{p.name}</div>
                    <div style={{ color: '#444', marginBottom: 4 }}>{p.description}</div>
                    <div style={{ color: '#333', fontWeight: 500, marginBottom: 4 }}>₹{p.price}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>Slots: {p.slotsAvailable || 'N/A'}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>Tags: {p.tags && p.tags.length > 0 ? p.tags.join(', ') : 'None'}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Discounts */}
        {event.discountOptions && event.discountOptions.length > 0 && (
          <>
            <hr style={divider} />
            <div>
              <div style={sectionTitle}>Discount Options</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {event.discountOptions.map((d, idx) => (
                  <div key={idx} style={{ background: '#f8f9fa', borderRadius: 10, padding: 16, minWidth: 180, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: 600, color: '#621d1d', marginBottom: 4 }}>{d.name}</div>
                    <div style={{ color: '#444', marginBottom: 4 }}>{d.percentageDiscount}% off</div>
                    <div style={{ color: '#888', fontSize: 13 }}>Min members: {d.totalMembersNeeded}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div style={meta}>
          Created: {event.createdAt ? new Date(event.createdAt).toLocaleString() : ''}
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage; 