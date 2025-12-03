import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../services/api';
import pngLogo from '../assets/pnglogo.png';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authAPI.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-light)',
                padding: '40px 20px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '16px' }}>Invalid Request</h2>
                    <p style={{ marginBottom: '24px' }}>Missing reset token.</p>
                    <Link to="/login" style={{ color: 'var(--primary)' }}>Return to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-light)',
            padding: '40px 20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    backgroundColor: 'var(--bg-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '56px 48px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)'
                }}
            >
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '48px',
                    textDecoration: 'none'
                }}>
                    <div style={{
                        padding: '0',
                        borderRadius: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <img src={pngLogo} alt="aanandham.go Logo" style={{ width: '130px', height: '70px', objectFit: 'contain' }} />
                    </div>
                    <span style={{
                        color: '#1a1a1a',
                        fontSize: '25px',
                        fontWeight: '900',
                        letterSpacing: '-0.5px'
                    }}>
                        aanandham.go
                    </span>
                </Link>

                {/* Header */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: 'var(--text-main)',
                        letterSpacing: '-1px'
                    }}>
                        Set New Password
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        fontWeight: '400'
                    }}>
                        Create a strong password for your account
                    </p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '24px',
                            border: '1px solid #059669'
                        }}>
                            Password reset successfully! Redirecting to login...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                backgroundColor: '#fff8f6',
                                color: '#c13515',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '20px',
                                fontSize: '14px',
                                textAlign: 'center',
                                border: '1px solid #c13515'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginBottom: '20px', position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                marginBottom: '10px',
                                color: 'var(--text-main)'
                            }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 50px 16px 18px',
                                        border: '2px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'all 0.2s ease',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'var(--bg-light)',
                                        color: 'var(--text-main)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary)';
                                        e.target.style.backgroundColor = 'var(--bg-white)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border)';
                                        e.target.style.backgroundColor = 'var(--bg-light)';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                marginBottom: '10px',
                                color: 'var(--text-main)'
                            }}>
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 18px',
                                    border: '2px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'var(--bg-light)',
                                    color: 'var(--text-main)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.backgroundColor = 'var(--bg-white)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.backgroundColor = 'var(--bg-light)';
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: 'var(--primary-gradient)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '17px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginBottom: '24px',
                                transition: 'all 0.3s ease',
                                boxShadow: 'var(--shadow-floating)',
                                letterSpacing: '0.3px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontWeight: '500',
                        fontSize: '15px',
                        transition: 'color 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                        <FaArrowLeft size={14} />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
