import React from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { FaMapMarkedAlt, FaSuitcaseRolling, FaBookOpen } from 'react-icons/fa';

const PlacesPage = () => {
    const location = useLocation();

    // Redirect to destinations if exactly /places
    if (location.pathname === '/places' || location.pathname === '/places/') {
        return <Navigate to="/places/destinations" replace />;
    }

    const tabs = [
        { path: 'destinations', label: 'Destinations', icon: <FaMapMarkedAlt /> },
        { path: 'packages', label: 'Packages', icon: <FaSuitcaseRolling /> },
        { path: 'guides', label: 'Guides', icon: <FaBookOpen /> }
    ];

    return (
        <div>
            {/* Sub Navigation for Places */}
            <div style={{
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-white)',
                paddingTop: '10px',
                paddingBottom: '0'
            }}>
                <div className="container" style={{ display: 'flex', gap: '32px' }}>
                    {tabs.map(tab => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: isActive ? '600' : '500',
                                borderBottom: isActive ? '2px solid var(--text-main)' : '2px solid transparent',
                                paddingBottom: '8px',
                                minWidth: '64px',
                                transition: 'color 0.2s, border-bottom 0.2s'
                            })}
                        >
                            <div style={{ fontSize: '24px', opacity: 0.8 }}>{tab.icon}</div>
                            <span>{tab.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <Outlet />
        </div>
    );
};

export default PlacesPage;
