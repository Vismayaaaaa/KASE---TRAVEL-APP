import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../services/api';
import pngLogo from '../assets/pnglogo.png';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.forgotPassword(email);
            setSuccess(true);

            // For demo purposes, we'll redirect to the reset page after a short delay
            // passing the token that the server returned (simulating clicking an email link)
            if (response.resetToken) {
                setTimeout(() => {
                    navigate(`/reset-password?token=${response.resetToken}`);
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    flexDirection: 'column',
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
                        Reset Password
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        fontWeight: '400',
                        lineHeight: '1.5'
                    }}>
                        Enter your email address and we'll send you a link to reset your password.
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
                            Reset link sent! Redirecting you to the reset page...
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

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                marginBottom: '10px',
                                color: 'var(--text-main)'
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
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
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
