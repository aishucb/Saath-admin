import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaChevronLeft, FaHome, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  // Load settings state from localStorage on component mount
  useEffect(() => {
    const savedSettingsState = localStorage.getItem('sidebarSettingsOpen');
    if (savedSettingsState) {
      setShowSettings(JSON.parse(savedSettingsState));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('sidebarSettingsOpen');
    navigate('/login');
  };

  const toggleSettings = () => {
    const newState = !showSettings;
    setShowSettings(newState);
    localStorage.setItem('sidebarSettingsOpen', JSON.stringify(newState));
  };

  // Overlay for mobile
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('sidebar-overlay')) {
      setSidebarOpen(false);
    }
  };

  // Hamburger button for mobile
  const Hamburger = () => (
    <button
      onClick={() => setSidebarOpen(true)}
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1001,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        cursor: 'pointer',
      }}
      aria-label="Open menu"
    >
      <FaBars />
    </button>
  );

  return (
    <>
      {isMobile && !sidebarOpen && <Hamburger />}
      {((!isMobile) || (isMobile && sidebarOpen)) && (
        <div
          className={isMobile ? 'sidebar-overlay' : ''}
          onClick={isMobile ? handleOverlayClick : undefined}
          style={isMobile && sidebarOpen ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.18)',
            zIndex: 1000,
            display: 'flex',
          } : {}}
        >
          <div
            style={{
              width: sidebarOpen ? 220 : 60,
              background: '#fff',
              borderRight: '1px solid #eee',
              transition: 'width 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? '1.5rem 1rem' : '1.5rem 0.5rem',
              boxSizing: 'border-box',
              zIndex: 1001,
              minHeight: '100vh',
              position: isMobile ? 'relative' : 'static',
              boxShadow: isMobile ? '2px 0 16px rgba(0,0,0,0.08)' : undefined
            }}
          >
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2rem',
                alignSelf: sidebarOpen ? 'flex-end' : 'center',
                fontSize: 20
              }}
              aria-label={sidebarOpen ? 'Collapse menu' : 'Expand menu'}
            >
              {sidebarOpen ? <FaChevronLeft /> : <FaBars />}
            </button>
            <div style={{ width: '100%', flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? 12 : 0,
                padding: '0.75rem 0',
                color: '#333',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                borderRadius: 8,
                transition: 'background 0.2s',
                marginBottom: 4
              }} onClick={() => { setSidebarOpen(!isMobile); navigate('/dashboard'); }}>
                <FaHome style={{ fontSize: 18 }} />
                {sidebarOpen && <span>Home</span>}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? 12 : 0,
                padding: '0.75rem 0',
                color: '#333',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                borderRadius: 8,
                transition: 'background 0.2s',
                marginBottom: 4
              }}>
                <FaChartBar style={{ fontSize: 18 }} />
                {sidebarOpen && <span>Analytics</span>}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? 12 : 0,
                padding: '0.75rem 0',
                color: '#333',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                borderRadius: 8,
                transition: 'background 0.2s',
                marginBottom: 4
              }} onClick={() => { setSidebarOpen(!isMobile); navigate('/forums'); }}>
                <FaUsers style={{ fontSize: 18 }} />
                {sidebarOpen && <span>Forum</span>}
              </div>
            </div>
            {/* Settings at bottom */}
            <div style={{ width: '100%', marginTop: 'auto' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? 12 : 0,
                padding: '0.75rem 0',
                color: '#333',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                borderRadius: 8,
                transition: 'background 0.2s',
                marginBottom: 4
              }} onClick={toggleSettings}>
                <FaCog style={{ fontSize: 18 }} />
                {sidebarOpen && <span>Settings</span>}
              </div>
              {showSettings && sidebarOpen && (
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: 8,
                  padding: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#621d1d',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar; 