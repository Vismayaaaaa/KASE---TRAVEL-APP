import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';
import GoogleMapComponent from '../components/GoogleMap';
import FilterModal from '../components/FilterModal';
import { listingsAPI } from '../services/api';
import { FaMap, FaList } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SearchResultsPage = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get('search');
    const guestsParam = searchParams.get('guests');
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const guests = guestsParam;
                const queryFilters = { ...filters, guests };

                // Fetch listings based on search query
                // We pass empty category because we are searching globally
                const data = await listingsAPI.getAllListings(searchQuery, '', queryFilters);
                setListings(data);
                setFilteredListings(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch listings:', err);
                setError('Failed to load listings. Make sure the server is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
        window.scrollTo(0, 0);
    }, [searchQuery, guestsParam, filters]);

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    const getSearchDescription = () => {
        const parts = [];
        if (searchQuery) parts.push(`"${searchQuery}"`);
        if (guestsParam) parts.push(`${guestsParam} guest${guestsParam > 1 ? 's' : ''}`);
        if (checkin && checkout) {
            const start = new Date(checkin).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const end = new Date(checkout).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            parts.push(`${start} - ${end}`);
        }
        return parts.length > 0 ? `Results for ${parts.join(' • ')}` : 'All listings';
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '24px' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {getSearchDescription()}
                    </h1>
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-full)',
                            background: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                    >
                        Filters
                    </button>
                </div>
            </div>

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
                    paddingBottom: '80px'
                }}>
                    {loading ? (
                        Array(8).fill(0).map((_, i) => <SkeletonListingCard key={i} />)
                    ) : (
                        filteredListings.length > 0 ? (
                            filteredListings.map(listing => (
                                <ListingCard key={listing._id || listing.id} listing={listing} />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No results found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
                            </div>
                        )
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
                    zIndex: 2000,
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

export default SearchResultsPage;
