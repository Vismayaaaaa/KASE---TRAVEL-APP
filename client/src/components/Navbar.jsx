import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobe, FaBars, FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import SearchCompact from './SearchCompact';
import SearchExpanded from './SearchExpanded';
import { authAPI } from '../services/api';
import { usePreferences } from '../contexts/PreferencesContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(authAPI.getCurrentUser());
  const navigate = useNavigate();
  const { t } = usePreferences();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleStorageChange = () => {
      setUser(authAPI.getCurrentUser());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={isScrolled ? 'glass-panel' : ''}
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          zIndex: 1000,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
          padding: isScrolled ? '16px 0' : '24px 0 0 0'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isScrolled ? 0 : '16px' }}>
            {/* Logo - New Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, textDecoration: 'none' }}>
              <div style={{
                background: 'var(--primary-gradient)',
                padding: '8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}>
                <FaPaperPlane size={20} color="white" style={{ transform: 'translate(-1px, 1px)' }} />
              </div>
              <span style={{
                color: 'var(--primary)',
                fontSize: '22px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Shalu bbg
              </span>
            </Link>

            {/* Center Search - Animated */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                {isScrolled ? (
                  <SearchCompact key="compact" onClick={() => setIsScrolled(false)} />
                ) : (
                  <div style={{ width: '300px', height: '48px' }}></div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', position: 'relative' }}>
              <div style={{
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '10px 16px',
                borderRadius: '22px',
                transition: 'background 0.2s',
                color: 'var(--text-main)'
              }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-off-white)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t('airbnbYourHome')}
              </div>
              <div style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-off-white)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaGlobe size={16} color="var(--text-main)" />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid var(--border)',
                borderRadius: '32px',
                padding: '6px 6px 6px 14px',
                cursor: 'pointer',
                marginLeft: '8px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-sm)'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaBars size={16} color="var(--text-main)" />
                {user && user.avatar ? (
                  <img src={user.avatar} alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <FaUserCircle size={32} color="var(--text-light)" />
                )}
              </div>

              {/* Minimal Dropdown Menu */}
              {isMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 16px)',
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  width: '260px',
                  padding: '8px 0',
                  zIndex: 2000,
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
                        <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--text-main)' }}>{user.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.email}</div>
                      </div>
                      <MenuItem onClick={() => { navigate('/trips'); setIsMenuOpen(false); }}>Trips</MenuItem>
                      <MenuItem onClick={() => { navigate('/wishlists'); setIsMenuOpen(false); }}>Wishlists</MenuItem>
                      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '8px 0' }}></div>
                      <MenuItem onClick={() => { navigate('/account'); setIsMenuOpen(false); }}>Account</MenuItem>
                      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '8px 0' }}></div>
                      <MenuItem onClick={handleLogout} danger>{t('logout')}</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={() => { navigate('/signup'); setIsMenuOpen(false); }} bold>{t('signup')}</MenuItem>
                      <MenuItem onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>{t('login')}</MenuItem>
                      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '8px 0' }}></div>
                      <MenuItem>{t('help')}</MenuItem>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expanded Search Container */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div
                initial={{ opacity: 0, height: 0, scaleY: 0 }}
                animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
                exit={{ opacity: 0, height: 0, scaleY: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ paddingBottom: '24px', transformOrigin: 'top' }}
              >
                <SearchExpanded />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};

const MenuItem = ({ children, onClick, bold, danger }) => (
  <div
    onClick={onClick}
    style={{
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: bold ? '600' : '500',
      color: danger ? '#EF4444' : 'var(--text-main)',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-off-white)'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {children}
  </div>
);

export default Navbar;
