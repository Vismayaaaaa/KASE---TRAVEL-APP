import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';
import GoogleMapComponent from '../components/GoogleMap';
import CategoryBar from '../components/CategoryBar';
import FilterModal from '../components/FilterModal';
import { listingsAPI } from '../services/api';
import { stayCategories } from '../data/categories';
import { FaMap, FaList } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Beach');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                // Pass search query, category, and filters to API
                const data = await listingsAPI.getAllListings(searchQuery, selectedCategory, filters);
                setListings(data);
                setFilteredListings(data); // API handles filtering now
                setError(null);
            } catch (err) {
                console.error('Failed to fetch listings:', err);
                setError('Failed to load listings. Make sure the server is running.');
                // Fallback to mock data if API fails
                const { listings: mockListings } = await import('../data/mockData');
                setListings(mockListings);
                setFilteredListings(mockListings);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [searchQuery, selectedCategory, filters]); // Re-run when dependencies change

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{
                height: '400px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                marginBottom: '32px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.3)'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        Find Your Perfect Stay
                    </h1>
                    <p style={{ fontSize: '20px', fontWeight: '500', maxWidth: '600px', margin: '0 auto' }}>
                        Discover homes, cabins, and unique stays around the world.
                    </p>
                </div>
            </div>

            <CategoryBar
                categories={stayCategories}
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

            {error && (
                <div className="container" style={{ marginTop: '24px' }}>
                    <div style={{
                        padding: '24px 40px',
                        backgroundColor: '#FFF3CD',
                        border: '1px solid #FFE69C',
                        borderRadius: 'var(--radius-md)',
                        color: '#856404'
                    }}>
                        ⚠️ {error}
                    </div>
                </div>
            )}

            {showMap ? (
                <div style={{ height: 'calc(100vh - 160px)', width: '100%', position: 'relative', zIndex: 1 }}>
                    <GoogleMapComponent listings={filteredListings} apiKey={GOOGLE_MAPS_API_KEY} />
                </div>
            ) : (
                <div className="container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '32px',
                    paddingTop: '24px',
                    paddingBottom: '80px'
                }}>
                    {loading ? (
                        Array(8).fill(0).map((_, i) => <SkeletonListingCard key={i} />)
                    ) : (
                        filteredListings.map(listing => (
                            <ListingCard key={listing._id || listing.id} listing={listing} />
                        ))
                    )}
                </div>
            )}

            {/* Floating Map Button */}
            <button
                onClick={() => setShowMap(!showMap)}
                style={{
                    position: 'fixed',
                    bottom: '48px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    padding: '14px 24px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-floating)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(79, 70, 229, 0.5)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-floating)';
                }}
            >
                {showMap ? (
                    <>Show list <FaList size={16} /></>
                ) : (
                    <>Show map <FaMap size={16} /></>
                )}
            </button>
        </div>
    );
};

export default HomePage;
