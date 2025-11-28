import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsAPI } from '../services/api';
import { FaMoneyBillWave, FaLanguage, FaCalendarAlt } from 'react-icons/fa';

const DestinationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const data = await destinationsAPI.getDestinationById(id);
                setDestination(data);
            } catch (error) {
                console.error('Failed to fetch destination:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;
    if (!destination) return <div className="container" style={{ paddingTop: '40px' }}>Destination not found</div>;

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Hero Image */}
            <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                <img src={destination.image} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '40px 0',
                    color: 'white'
                }}>
                    <div className="container">
                        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>{destination.name}</h1>
                        <p style={{ fontSize: '20px', maxWidth: '600px' }}>{destination.description}</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                {/* Main Content */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>About {destination.name}</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        {destination.details}
                    </p>

                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Highlights</h3>
                    <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                        {destination.highlights.map((highlight, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px',
                                backgroundColor: 'var(--bg-off-white)',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '600'
                            }}>
                                <span style={{ color: 'var(--primary)' }}>•</span> {highlight}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sidebar */}
                <div>
                    <div style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Quick Facts</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ padding: '10px', background: '#EEF2FF', borderRadius: '50%', color: 'var(--primary)' }}>
                                <FaCalendarAlt size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Best Time to Visit</div>
                                <div style={{ fontWeight: '600' }}>{destination.bestTimeToVisit}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ padding: '10px', background: '#ECFDF5', borderRadius: '50%', color: 'var(--secondary)' }}>
                                <FaMoneyBillWave size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Currency</div>
                                <div style={{ fontWeight: '600' }}>{destination.currency}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ padding: '10px', background: '#FFFBEB', borderRadius: '50%', color: 'var(--accent)' }}>
                                <FaLanguage size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Language</div>
                                <div style={{ fontWeight: '600' }}>{destination.language}</div>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', textAlign: 'center' }}
                            onClick={() => navigate(`/?search=${encodeURIComponent(destination.name)}`)}
                        >
                            Plan a Trip to {destination.name}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationDetailsPage;
