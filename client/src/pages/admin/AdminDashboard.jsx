import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaUsers, FaHome, FaCalendarCheck, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Users', value: stats?.stats.totalUsers || 0, icon: FaUsers, color: '#667eea', bg: '#E8EAFF' },
        { title: 'Total Listings', value: stats?.stats.totalListings || 0, icon: FaHome, color: '#FF385C', bg: '#FFE8EC' },
        { title: 'Total Bookings', value: stats?.stats.totalBookings || 0, icon: FaCalendarCheck, color: '#00D9A5', bg: '#E0FFF8' },
        { title: 'Total Revenue', value: `$${stats?.stats.totalRevenue || 0}`, icon: FaDollarSign, color: '#FFA500', bg: '#FFF4E0' }
    ];

    // Mock data for charts
    const revenueData = [
        { month: 'Jan', revenue: 4000 },
        { month: 'Feb', revenue: 3000 },
        { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4500 },
        { month: 'May', revenue: 6000 },
        { month: 'Jun', revenue: 5500 }
    ];

    const bookingsData = [
        { month: 'Jan', bookings: 40 },
        { month: 'Feb', bookings: 30 },
        { month: 'Mar', bookings: 50 },
        { month: 'Apr', bookings: 45 },
        { month: 'May', bookings: 60 },
        { month: 'Jun', bookings: 55 }
    ];

    return (
        <div style={{ padding: '40px', backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                        Dashboard Overview
                    </h1>
                    <p style={{ color: '#717171', fontSize: '16px' }}>
                        Welcome back! Here's what's happening with your platform.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    {statCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid #E8E8E8'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ color: '#717171', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                                        {card.title}
                                    </p>
                                    <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#222' }}>
                                        {card.value}
                                    </h2>
                                </div>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: card.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <card.icon size={28} color={card.color} />
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaChartLine size={14} color="#00D9A5" />
                                <span style={{ fontSize: '13px', color: '#00D9A5', fontWeight: '600' }}>+12.5%</span>
                                <span style={{ fontSize: '13px', color: '#717171' }}>from last month</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E8E8E8'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>
                            Revenue Overview
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                                <XAxis dataKey="month" stroke="#717171" />
                                <YAxis stroke="#717171" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Bookings Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E8E8E8'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>
                            Bookings Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bookingsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                                <XAxis dataKey="month" stroke="#717171" />
                                <YAxis stroke="#717171" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="bookings" fill="#FF385C" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Recent Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #E8E8E8'
                    }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>
                        Recent Bookings
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E8E8E8' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Guest</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Listing</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Check-in</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Total</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBookings?.slice(0, 5).map((booking, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#222' }}>
                                            {booking.user?.name || 'Guest'}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#222' }}>
                                            {booking.listing?.title || 'Listing'}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                            {new Date(booking.checkIn).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                            ${booking.totalPrice}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor: booking.status === 'confirmed' ? '#E0FFF8' : '#FFF4E0',
                                                color: booking.status === 'confirmed' ? '#00D9A5' : '#FFA500'
                                            }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
