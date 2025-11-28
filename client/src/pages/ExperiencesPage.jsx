import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experiencesAPI } from '../services/api';
import { FaStar, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CategoryBar from '../components/CategoryBar';
import FilterModal from '../components/FilterModal';
import { experienceCategories } from '../data/categories';

const ExperiencesPage = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Art & Culture');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                const data = await experiencesAPI.getAllExperiences(selectedCategory, filters);
                setExperiences(data);
            } catch (error) {
                console.error('Failed to fetch experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, [selectedCategory, filters]);

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experiences...</div>;
    }

    return (
        <div style={{ padding: '0', maxWidth: '100%', margin: '0' }}>
            <CategoryBar
                categories={experienceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onFilterClick={() => setIsFilterModalOpen(true)}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
                initialFilters={filters}
            />

            <div style={{ padding: '40px 80px', maxWidth: '1600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', color: 'var(--text-main)' }}>
                    New this week
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '24px',
                    rowGap: '40px'
                }}>
                    {experiences.map((exp) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ cursor: 'pointer', position: 'relative' }}
                            onClick={() => navigate(`/experiences/${exp._id}`)}
                        >
                            {/* Image Container */}
                            <div style={{
                                position: 'relative',
                                aspectRatio: '3/4', // Portrait aspect ratio for experiences
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                marginBottom: '12px',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    color: 'white',
                                    opacity: 0.8
                                }}>
                                    <FaHeart size={24} stroke="white" strokeWidth="2" fill="rgba(0,0,0,0.5)" />
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>
                                <FaStar size={12} color="var(--accent)" />
                                <span>{exp.rating}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>({exp.reviews})</span>
                                <span style={{ color: 'var(--text-secondary)' }}>· {exp.location}</span>
                            </div>

                            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', lineHeight: '1.2' }}>
                                {exp.title}
                            </div>

                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                                From ${exp.price} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>/ person</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExperiencesPage;
