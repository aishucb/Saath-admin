import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    eventName: '',
    date: '',
    eventTime: { from: '', to: '' },
    place: '',
    organizer: '',
    description: '',
    duration: '',
    maxAttendees: '',
    availableSlots: '',
    tags: '',
    image: null,
    pricing: [],
    discountOptions: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('everyone');
  const [admin, setAdmin] = useState(null);
  const [pricingInput, setPricingInput] = useState({ name: '', description: '', price: '', tags: '', slotsAvailable: '' });
  const [discountInput, setDiscountInput] = useState({ name: '', totalMembersNeeded: '', percentageDiscount: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/admin/me');
      setAdmin(response.data.admin);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchEvents = async (tab = 'everyone') => {
    setLoading(true);
    try {
      if (tab === 'everyone') {
        const response = await api.get('/admin-events');
        setEvents(response.data.data || []);
      } else if (tab === 'me' && admin) {
        const adminId = admin._id;
        const response = await api.get(`/admin-events?adminId=${adminId}`);
        if (response.data.success) {
          setEvents(response.data.data || []);
        } else {
          setEvents([]);
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'everyone') {
      fetchEvents('everyone');
    } else if (activeTab === 'me' && admin) {
      fetchEvents('me');
    }
  }, [activeTab, admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventTimeChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, eventTime: { ...prev.eventTime, [name]: value } }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const base64 = await toBase64(file);
      setForm((prev) => ({ ...prev, image: base64 }));
    }
  };

  const handleAddPricing = (e) => {
    e.preventDefault();
    if (!pricingInput.name || !pricingInput.price) return;
    setForm((prev) => ({
      ...prev,
      pricing: [
        ...prev.pricing,
        {
          name: pricingInput.name,
          description: pricingInput.description,
          price: parseFloat(pricingInput.price),
          tags: pricingInput.tags ? pricingInput.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          slotsAvailable: pricingInput.slotsAvailable ? parseInt(pricingInput.slotsAvailable) : undefined
        }
      ]
    }));
    setPricingInput({ name: '', description: '', price: '', tags: '', slotsAvailable: '' });
  };

  const handleRemovePricing = (idx) => {
    setForm((prev) => ({ ...prev, pricing: prev.pricing.filter((_, i) => i !== idx) }));
  };

  const handleAddDiscount = (e) => {
    e.preventDefault();
    if (!discountInput.name || !discountInput.percentageDiscount) return;
    setForm((prev) => ({
      ...prev,
      discountOptions: [
        ...prev.discountOptions,
        {
          name: discountInput.name,
          totalMembersNeeded: discountInput.totalMembersNeeded ? parseInt(discountInput.totalMembersNeeded) : 1,
          percentageDiscount: parseFloat(discountInput.percentageDiscount)
        }
      ]
    }));
    setDiscountInput({ name: '', totalMembersNeeded: '', percentageDiscount: '' });
  };

  const handleRemoveDiscount = (idx) => {
    setForm((prev) => ({ ...prev, discountOptions: prev.discountOptions.filter((_, i) => i !== idx) }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const payload = {
        eventName: form.eventName,
        date: form.date,
        eventTime: form.eventTime,
        place: form.place,
        organizer: form.organizer,
        description: form.description,
        duration: form.duration,
        maxAttendees: parseInt(form.maxAttendees),
        availableSlots: parseInt(form.availableSlots),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        image: form.image,
        pricing: form.pricing,
        discountOptions: form.discountOptions
      };
      await api.post('/admin-events', payload);
      setShowForm(false);
      setForm({
        eventName: '', date: '', eventTime: { from: '', to: '' }, place: '', organizer: '', description: '', duration: '', maxAttendees: '', availableSlots: '', tags: '', image: null, pricing: [], discountOptions: []
      });
      setImagePreview(null);
      fetchEvents(activeTab);
    } catch (err) {
      console.error('Error adding event:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add event';
      setFormError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div>Loading events...</div>;
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
          <h2 style={{ color: '#621d1d', margin: 0 }}>Events</h2>
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
            {showForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #eee', 
          marginBottom: '1.5rem' 
        }}>
          <button
            onClick={() => setActiveTab('everyone')}
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
            onClick={() => setActiveTab('me')}
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
          <form onSubmit={handleAddEvent} style={{
            background: '#f8f9fa',
            borderRadius: 12,
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Event Name *</label>
              <input type="text" name="eventName" value={form.eventName} onChange={handleInputChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleInputChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Time From *</label>
                <input type="time" name="from" value={form.eventTime.from} onChange={handleEventTimeChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Time To *</label>
                <input type="time" name="to" value={form.eventTime.to} onChange={handleEventTimeChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Place *</label>
              <input type="text" name="place" value={form.place} onChange={handleInputChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Organizer *</label>
              <input type="text" name="organizer" value={form.organizer} onChange={handleInputChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleInputChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', minHeight: 80 }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Duration *</label>
              <input type="text" name="duration" value={form.duration} onChange={handleInputChange} required placeholder="e.g. 4 hours, 2 days" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Max Attendees *</label>
                <input type="number" name="maxAttendees" value={form.maxAttendees} onChange={handleInputChange} required min={1} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Available Slots *</label>
                <input type="number" name="availableSlots" value={form.availableSlots} onChange={handleInputChange} required min={1} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Tags (comma separated)</label>
              <input type="text" name="tags" value={form.tags} onChange={handleInputChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: 8, maxWidth: 200, borderRadius: 8 }} />}
            </div>
            {/* Pricing Section */}
            <div style={{ marginBottom: '1rem', background: '#f3f3f3', borderRadius: 8, padding: 12 }}>
              <label style={{ fontWeight: 500 }}>Pricing Options</label>
              {form.pricing.length > 0 && (
                <ul style={{ paddingLeft: 20 }}>
                  {form.pricing.map((p, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <span>{p.name} - ₹{p.price} ({p.description}) [Slots: {p.slotsAvailable || 'N/A'}] [Tags: {p.tags && p.tags.length > 0 ? p.tags.join(', ') : 'None'}]</span>
                      <button type="button" onClick={() => handleRemovePricing(idx)} style={{ marginLeft: 8, color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input type="text" placeholder="Name" value={pricingInput.name} onChange={e => setPricingInput(i => ({ ...i, name: e.target.value }))} style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <input type="text" placeholder="Description" value={pricingInput.description} onChange={e => setPricingInput(i => ({ ...i, description: e.target.value }))} style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <input type="number" placeholder="Price" value={pricingInput.price} onChange={e => setPricingInput(i => ({ ...i, price: e.target.value }))} style={{ width: 90, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <input type="text" placeholder="Tags (comma)" value={pricingInput.tags} onChange={e => setPricingInput(i => ({ ...i, tags: e.target.value }))} style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <input type="number" placeholder="Slots" value={pricingInput.slotsAvailable} onChange={e => setPricingInput(i => ({ ...i, slotsAvailable: e.target.value }))} style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <button type="button" onClick={handleAddPricing} style={{ background: '#621d1d', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Add</button>
              </div>
            </div>
            {/* Discount Section */}
            <div style={{ marginBottom: '1rem', background: '#f3f3f3', borderRadius: 8, padding: 12 }}>
              <label style={{ fontWeight: 500 }}>Discount Options</label>
              {form.discountOptions.length > 0 && (
                <ul style={{ paddingLeft: 20 }}>
                  {form.discountOptions.map((d, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <span>{d.name} - {d.percentageDiscount}% off (Min members: {d.totalMembersNeeded})</span>
                      <button type="button" onClick={() => handleRemoveDiscount(idx)} style={{ marginLeft: 8, color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input type="text" placeholder="Name" value={discountInput.name} onChange={e => setDiscountInput(i => ({ ...i, name: e.target.value }))} style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <input type="number" placeholder="Min Members" value={discountInput.totalMembersNeeded} onChange={e => setDiscountInput(i => ({ ...i, totalMembersNeeded: e.target.value }))} style={{ width: 110, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <input type="number" placeholder="% Discount" value={discountInput.percentageDiscount} onChange={e => setDiscountInput(i => ({ ...i, percentageDiscount: e.target.value }))} style={{ width: 110, padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
                <button type="button" onClick={handleAddDiscount} style={{ background: '#621d1d', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Add</button>
              </div>
            </div>
            {formError && <div style={{ color: 'red', marginBottom: 8 }}>{formError}</div>}
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
              {formLoading ? 'Adding...' : 'Add Event'}
            </button>
          </form>
        )}

        {events.length === 0 ? (
          <div>No events found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {events.map(event => (
              <div key={event._id} style={{
                background: '#f8f9fa',
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <h3 
                  onClick={() => navigate(`/event/${event._id}`)}
                  style={{ 
                    margin: 0, 
                    color: '#333', 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: '#621d1d'
                  }}
                >
                  {event.eventName}
                </h3>
                <p style={{ color: '#666', margin: '0.5rem 0 1rem' }}>{event.description}</p>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
                  Tags: {event.tags && event.tags.length > 0 ? event.tags.join(', ') : 'None'}
                </div>
                <div style={{ color: '#888', fontSize: 13 }}>
                  By: {event.createdBy?.name || event.createdBy || 'Unknown'} | {event.createdAt ? new Date(event.createdAt).toLocaleString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage; 