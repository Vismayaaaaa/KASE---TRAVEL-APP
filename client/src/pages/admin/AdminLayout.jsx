import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarCheck, FaList, FaStar, FaSignOutAlt, FaChartBar, FaCompass } from 'react-icons/fa';
import { authAPI } from '../../services/api';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/admin', icon: FaChartBar, label: 'Dashboard', exact: true },
        { path: '/admin/users', icon: FaUsers, label: 'Users' },
        { path: '/admin/listings', icon: FaHome, label: 'Listings' },
        { path: '/admin/bookings', icon: FaCalendarCheck, label: 'Bookings' },
        { path: '/admin/experiences', icon: FaCompass, label: 'Experiences' },
        { path: '/admin/reviews', icon: FaStar, label: 'Reviews' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                backgroundColor: '#1a1a2e',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                boxShadow: '4px 0 12px rgba(0,0,0,0.1)'
            }}>
                {/* Logo */}
                <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '20px'
                        }}>A</div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '700' }}>Shalus Homestay</div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>Admin Panel</div>
                        </div>
                    </Link>
                </div>

                {/* Menu Items */}
                <nav style={{ flex: 1, padding: '24px 0', overflowY: 'auto' }}>
                    {menuItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '14px 24px',
                                    margin: '4px 12px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#FF385C' : 'rgba(255,255,255,0.8)',
                                    backgroundColor: isActive ? 'rgba(255,56,92,0.1)' : 'transparent',
                                    fontWeight: isActive ? '600' : '500',
                                    fontSize: '15px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#FF385C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700'
                        }}>
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name || 'Admin'}</div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        <FaSignOutAlt size={16} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '280px', flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
