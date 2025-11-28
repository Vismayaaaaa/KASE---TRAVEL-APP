import { useState, useEffect } from 'react';
import { adminAPI, listingsAPI } from '../../services/api';
import { FaSearch, FaTrash, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const data = await adminAPI.getAllListings();
            setListings(data);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (listingId) => {
        // Temporary bypass of confirm dialog to debug user issue
        // if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        try {
            await adminAPI.deleteListing(listingId);
            fetchListings();
        } catch (error) {
            console.error('Failed to delete listing:', error);
            alert('Failed to delete listing');
        }
        // }
    };

    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListing, setNewListing] = useState({
        title: '',
        location: '',
        price: '',
        image: '',
        description: ''
    });

    const handleCreateListing = async (e) => {
        e.preventDefault();
        try {
            const listingData = {
                ...newListing,
                price: Number(newListing.price),
                details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 }, // Default details
                amenities: ["Wifi", "Kitchen", "Air conditioning"] // Default amenities
            };
            await listingsAPI.createListing(listingData);
            fetchListings();
            setIsModalOpen(false);
            setNewListing({ title: '', location: '', price: '', image: '', description: '' });
            alert('New listing created successfully!');
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Failed to create listing');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading listings...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                            Listings Management
                        </h1>
                        <p style={{ color: '#717171', fontSize: '16px' }}>
                            Manage all properties and listings
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#222',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            + Add Listing
                        </button>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                            {listings.length} Total Listings
                        </div>
                    </div>
                </div>

                {/* Add Listing Modal */}
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '90%',
                            maxHeight: '90vh', overflowY: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Add New Listing</h2>
                            <form onSubmit={handleCreateListing}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Title</label>
                                    <input
                                        type="text"
                                        value={newListing.title}
                                        onChange={e => setNewListing({ ...newListing, title: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Location</label>
                                    <input
                                        type="text"
                                        value={newListing.location}
                                        onChange={e => setNewListing({ ...newListing, location: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price ($)</label>
                                    <input
                                        type="number"
                                        value={newListing.price}
                                        onChange={e => setNewListing({ ...newListing, price: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Image URL</label>
                                    <input
                                        type="url"
                                        value={newListing.image}
                                        onChange={e => setNewListing({ ...newListing, image: e.target.value })}
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                                    <textarea
                                        value={newListing.description}
                                        onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                                        required
                                        rows={4}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#f7f7f7', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#222', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        Create Listing
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#717171' }} />
                    <input
                        type="text"
                        placeholder="Search listings by title or location..."
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

                {/* Listings Table */}
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
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Property</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Location</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Price</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Rating</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredListings.map((listing) => (
                                <tr key={listing._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img
                                                src={listing.image}
                                                alt={listing.title}
                                                style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                            />
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                                {listing.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FaMapMarkerAlt size={12} />
                                            {listing.location}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                        ${listing.price} <span style={{ fontWeight: '400', color: '#717171' }}>/ night</span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaStar color="#FF385C" size={12} />
                                            {listing.rating}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteListing(listing._id)}
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

export default AdminListings;
