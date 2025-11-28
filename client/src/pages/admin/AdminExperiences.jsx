import { useState, useEffect } from 'react';
import { adminAPI, experiencesAPI } from '../../services/api';
import { FaSearch, FaTrash, FaClock, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const data = await experiencesAPI.getAllExperiences();
            console.log('AdminExperiences fetched data:', data);
            setExperiences(data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExperience = async (experienceId) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await adminAPI.deleteExperience(experienceId);
                fetchExperiences();
            } catch (error) {
                console.error('Failed to delete experience:', error);
            }
        }
    };

    const handleAddExperience = async () => {
        const newExperience = {
            title: "New Cooking Class",
            location: "Paris, France",
            price: 120,
            duration: 3,
            image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            description: "Learn to cook authentic French cuisine.",
            rating: 5.0,
            reviews: 0
        };

        try {
            await experiencesAPI.createExperience(newExperience);
            fetchExperiences();
            alert('New experience created successfully!');
        } catch (error) {
            alert('Failed to create experience');
        }
    };

    const filteredExperiences = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExperience, setNewExperience] = useState({
        title: '',
        location: '',
        price: '',
        duration: '',
        image: '',
        description: ''
    });

    const handleCreateExperience = async (e) => {
        e.preventDefault();
        try {
            const experienceData = {
                ...newExperience,
                price: Number(newExperience.price),
                duration: Number(newExperience.duration),
                rating: 5.0,
                reviews: 0
            };
            await experiencesAPI.createExperience(experienceData);
            fetchExperiences();
            setIsModalOpen(false);
            setNewExperience({ title: '', location: '', price: '', duration: '', image: '', description: '' });
            alert('New experience created successfully!');
        } catch (error) {
            console.error('Failed to create experience:', error);
            alert('Failed to create experience');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading experiences...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                            Experiences Management
                        </h1>
                        <p style={{ color: '#717171', fontSize: '16px' }}>
                            Manage all experiences and activities
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
                            + Add Experience
                        </button>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                            {experiences.length} Total Experiences
                        </div>
                    </div>
                </div>

                {/* Add Experience Modal */}
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '90%',
                            maxHeight: '90vh', overflowY: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Add New Experience</h2>
                            <form onSubmit={handleCreateExperience}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Title</label>
                                    <input
                                        type="text"
                                        value={newExperience.title}
                                        onChange={e => setNewExperience({ ...newExperience, title: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Location</label>
                                    <input
                                        type="text"
                                        value={newExperience.location}
                                        onChange={e => setNewExperience({ ...newExperience, location: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price ($)</label>
                                        <input
                                            type="number"
                                            value={newExperience.price}
                                            onChange={e => setNewExperience({ ...newExperience, price: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Duration (hours)</label>
                                        <input
                                            type="number"
                                            value={newExperience.duration}
                                            onChange={e => setNewExperience({ ...newExperience, duration: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Image URL</label>
                                    <input
                                        type="url"
                                        value={newExperience.image}
                                        onChange={e => setNewExperience({ ...newExperience, image: e.target.value })}
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                                    <textarea
                                        value={newExperience.description}
                                        onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
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
                                        Create Experience
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
                        placeholder="Search experiences by title or location..."
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

                {/* Experiences Table */}
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
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Experience</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Location</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Price</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Duration</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Rating</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExperiences.map((exp) => (
                                <tr key={exp._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img
                                                src={exp.image}
                                                alt={exp.title}
                                                style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                            />
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                                {exp.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        {exp.location}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                        ${exp.price} <span style={{ fontWeight: '400', color: '#717171' }}>/ person</span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FaClock size={12} />
                                            {exp.duration} hours
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaStar color="#FF385C" size={12} />
                                            {exp.rating}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteExperience(exp._id)}
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

export default AdminExperiences;
