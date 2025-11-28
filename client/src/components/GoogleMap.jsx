import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { listingsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect, useRef, memo } from 'react';
import './Map.css';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: 'var(--radius-lg)'
};

// Paris default center
const defaultCenter = {
    lat: 48.8566,
    lng: 2.3522
};

// Custom map styles
const mapStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "on" }]
    },
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#c9c9c9" }]
    }
];

const PriceMarker = memo(({ listing, selectedListing, setSelectedListing, navigate }) => {
    let position = null;
    if (listing.latitude && listing.longitude) {
        position = { lat: listing.latitude, lng: listing.longitude };
    } else {
        // Fallback for mock data without coords
        const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
        const lng = 2.3522 + (Math.random() - 0.5) * 0.1;
        position = { lat, lng };
    }

    const isSelected = selectedListing === listing;

    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div style={{ position: 'relative' }}>
                <div
                    className={`price-pill ${isSelected ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedListing(listing);
                    }}
                    style={{
                        backgroundColor: isSelected ? 'var(--text-main)' : 'var(--bg-white)',
                        color: isSelected ? 'var(--bg-white)' : 'var(--text-main)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        zIndex: isSelected ? 100 : 1
                    }}
                >
                    ${listing.price}
                </div>

                {isSelected && (
                    <div
                        className="google-map-popup"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '260px',
                            backgroundColor: 'var(--bg-white)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            overflow: 'hidden',
                            zIndex: 200
                        }}
                    >
                        <div style={{ position: 'relative', height: '160px', width: '100%' }}>
                            <img
                                src={listing.image}
                                alt={listing.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedListing(null);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'var(--bg-white)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    lineHeight: '1',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', lineHeight: '1.2', color: 'var(--text-main)' }}>{listing.title}</div>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{listing.location}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>${listing.price}</span>
                                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/ night</span>
                            </div>
                            <button
                                onClick={() => navigate(`/listings/${listing._id || listing.id}`)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: 'var(--primary-gradient)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                View Listing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </OverlayView>
    );
});

const GoogleMapComponent = ({ listings: initialListings, apiKey }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: ['places']
    });

    const [map, setMap] = useState(null);
    const [listings, setListings] = useState(initialListings || []);
    const [selectedListing, setSelectedListing] = useState(null);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const navigate = useNavigate();
    const placesServiceRef = useRef(null);
    const debounceTimeout = useRef(null);

    // Update internal listings when props change
    useEffect(() => {
        setListings(initialListings || []);
    }, [initialListings]);

    // Auto-fit bounds when listings change (only initially or if explicitly requested)
    useEffect(() => {
        if (map && initialListings && initialListings.length > 0 && window.google && window.google.maps) {
            const bounds = new window.google.maps.LatLngBounds();
            let hasValidCoords = false;

            initialListings.forEach(l => {
                if (l.latitude && l.longitude) {
                    bounds.extend({ lat: l.latitude, lng: l.longitude });
                    hasValidCoords = true;
                }
            });

            if (hasValidCoords) {
                map.fitBounds(bounds);
                // Optional: Check if bounds are too tight
                const listener = window.google.maps.event.addListenerOnce(map, "idle", () => {
                    if (map.getZoom() > 14) map.setZoom(14);
                });
            }
        }
    }, [initialListings, map]);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
        placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const isInitialLoad = useRef(true);

    const handleBoundsChanged = () => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        // Debounced auto-search
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            searchThisArea();
        }, 300); // 300ms debounce
    };

    const searchThisArea = async () => {
        if (!map) return;

        setLoadingSearch(true);
        const bounds = map.getBounds();
        if (!bounds) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const boundsData = {
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng()
        };

        try {
            const newListings = await listingsAPI.getListingsByBounds(boundsData);

            // Merge with existing listings, avoiding duplicates
            setListings(prev => {
                const existingIds = new Set(prev.map(l => l._id));
                const uniqueNew = newListings.filter(l => !existingIds.has(l._id));
                return [...prev, ...uniqueNew];
            });
        } catch (error) {
            console.error('Failed to search area:', error);
        } finally {
            setLoadingSearch(false);
        }
    };

    if (!isLoaded) return <div style={{ height: '100%', width: '100%', backgroundColor: 'var(--bg-off-white)', borderRadius: 'var(--radius-lg)' }}></div>;

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onIdle={handleBoundsChanged}
                onDragEnd={handleBoundsChanged}
                onZoomChanged={handleBoundsChanged}
                options={{
                    styles: mapStyles,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    zoomControl: true,
                    clickableIcons: false,
                    minZoom: 3,
                    maxZoom: 18
                }}
                onClick={() => setSelectedListing(null)}
            >
                {(listings || []).map((listing) => (
                    <PriceMarker
                        key={listing._id || listing.id}
                        listing={listing}
                        selectedListing={selectedListing}
                        setSelectedListing={setSelectedListing}
                        navigate={navigate}
                    />
                ))}
            </GoogleMap>

            {/* Search This Area Button - Removed for auto-search behavior */}
        </div>
    );
};

export default GoogleMapComponent;
