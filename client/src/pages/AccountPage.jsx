import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const [user, setUser] = useState(authAPI.getCurrentUser());
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');

    // Edit States
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    // Bank Modal
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [bankData, setBankData] = useState({ holderName: '', bankName: '', accountNumber: '' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user, navigate]);

    const handleEdit = (field) => {
        setEditingField(field);
    };

    const handleCancel = () => {
        setEditingField(null);
        // Reset form data to current user data
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || ''
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedUser = await authAPI.updateProfile(formData);
            setUser(updatedUser);
            setEditingField(null);
            // Dispatch storage event to update other components if needed
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBank = (e) => {
        e.preventDefault();
        // Mock API call
        alert('Bank account added successfully!');
        setIsBankModalOpen(false);
        setBankData({ holderName: '', bankName: '', accountNumber: '' });
    };

    if (!user) return null;

    const renderEditableField = (label, fieldKey, value, placeholder = 'Not provided') => {
        const isEditing = editingField === fieldKey;

        return (
            <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="account-field-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="account-field-label" style={{ flex: 1, marginRight: '24px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>{label}</div>
                        {isEditing ? (
                            <input
                                type={fieldKey === 'email' ? 'email' : 'text'}
                                value={formData[fieldKey]}
                                onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--primary)',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                                autoFocus
                            />
                        ) : (
                            <div style={{ color: value ? 'var(--text-secondary)' : '#999' }}>{value || placeholder}</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid var(--text-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--primary)',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        color: 'white'
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => handleEdit(fieldKey)}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid var(--text-main)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                {value ? 'Edit' : 'Add'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: '1120px', margin: '0 auto', paddingTop: '40px', paddingBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Account</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                {user.name}, {user.email}
            </p>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '32px', overflowX: 'auto' }}>
                    {['personal', 'security', 'preferences', 'payments'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '16px 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                                transition: 'all 0.2s ease',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab === 'personal' ? 'Personal info' :
                                tab === 'payments' ? 'Payments & Payouts' :
                                    tab === 'security' ? 'Login & security' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {activeTab === 'personal' && (
                <div>
                    {renderEditableField('Legal name', 'name', user.name)}
                    {renderEditableField('Email address', 'email', user.email)}
                    {renderEditableField('Phone number', 'phone', user.phone)}
                    {renderEditableField('Address', 'address', user.address)}
                </div>
            )}

            {activeTab === 'security' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Password</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Last updated recently</div>
                            </div>
                            <button
                                onClick={() => navigate('/forgot-password')}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid var(--text-main)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Two-factor authentication</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Not enabled</div>
                            </div>
                            <button style={{
                                padding: '8px 16px',
                                border: '1px solid var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Enable
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'preferences' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Currency</div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>United States Dollar (USD)</div>
                        <button style={{
                            padding: '8px 16px',
                            border: '1px solid var(--text-main)',
                            borderRadius: 'var(--radius-md)',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Change
                        </button>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Language</div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>English</div>
                        <button style={{
                            padding: '8px 16px',
                            border: '1px solid var(--text-main)',
                            borderRadius: 'var(--radius-md)',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Change
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)' }}>Bank Accounts</h3>
                            <button
                                onClick={() => setIsBankModalOpen(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Bank Account
                            </button>
                        </div>

                        {/* Mock Bank Account List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        🏦
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Chase Bank</div>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>**** 1234</div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#e6fffa', color: '#047857', borderRadius: '12px', fontWeight: '600' }}>Primary</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Payout History</h3>
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No payouts yet.</div>
                    </div>
                </div>
            )}

            {/* Add Bank Modal */}
            {isBankModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-white)',
                        padding: '32px',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Add Bank Account</h2>
                        <form onSubmit={handleAddBank}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Account Holder Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankData.holderName}
                                    onChange={(e) => setBankData({ ...bankData, holderName: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankData.bankName}
                                    onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Account Number</label>
                                <input
                                    type="text"
                                    required
                                    value={bankData.accountNumber}
                                    onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsBankModalOpen(false)}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #222',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
