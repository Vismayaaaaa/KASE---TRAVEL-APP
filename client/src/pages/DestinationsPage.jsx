import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsAPI } from '../services/api';

const DestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await destinationsAPI.getAllDestinations();
                setDestinations(data);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Top Destinations</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px' }}>
                Choose your next adventure from our most popular destinations around the globe.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                {destinations.map((dest) => (
                    <Link to={`/destinations/${dest._id}`} key={dest._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            position: 'relative',
                            height: '300px',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '24px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                color: 'white'
                            }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{dest.name}</h3>
                                <p style={{ fontSize: '14px', opacity: 0.9 }}>{dest.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DestinationsPage;
