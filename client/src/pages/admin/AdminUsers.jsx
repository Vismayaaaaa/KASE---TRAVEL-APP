import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaSearch, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminAPI.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        // Temporary bypass of confirm dialog
        // if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await adminAPI.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
        // }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                            User Management
                        </h1>
                        <p style={{ color: '#717171', fontSize: '16px' }}>
                            Manage all users and their roles
                        </p>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                        {users.length} Total Users
                    </div>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#717171' }} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 14px 14px 48px',
                            border: '2px solid #E8E8E8',
                            borderRadius: '12px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
                    />
                </div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #E8E8E8'
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E8E8E8' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>User</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Email</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Role</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Joined</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: user.role === 'admin' ? '#667eea' : '#FF385C',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: '700'
                                            }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #E8E8E8',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: user.role === 'admin' ? '#E8EAFF' : '#FFE8EC',
                                                color: user.role === 'admin' ? '#667eea' : '#FF385C',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#FFE8EC',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#FF385C',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#FFD4DC'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFE8EC'}
                                        >
                                            <FaTrash size={12} />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminUsers;
