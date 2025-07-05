import React, { useState, useEffect, createContext, useContext } from 'react';
import Sidebar from './Sidebar';

// Context to share sidebar state
const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Provide sidebar state to Sidebar
  const sidebarContextValue = {
    sidebarOpen,
    setSidebarOpen,
    isMobile
  };

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fff9fb',
        display: 'flex'
      }}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
        <div style={{
          flex: 1,
          padding: '2rem',
          marginLeft: 0,
          transition: 'margin 0.2s',
          minWidth: 0
        }}>
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout; 