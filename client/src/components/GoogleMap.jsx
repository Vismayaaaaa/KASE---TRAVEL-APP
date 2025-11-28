import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect, useRef } from 'react';
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

const GoogleMapComponent = ({ listings: initialListings, apiKey }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: ['places']
    });

    const [map, setMap] = useState(null);
    const [listings, setListings] = useState(initialListings);
    const [selectedListing, setSelectedListing] = useState(null);
    const [showSearchButton, setShowSearchButton] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const navigate = useNavigate();
    const placesServiceRef = useRef(null);

    // Update internal listings when props change
    useEffect(() => {
        setListings(initialListings);
    }, [initialListings]);

    // Auto-fit bounds when listings change (only initially or if explicitly requested)
    useEffect(() => {
        if (map && initialListings.length > 0 && window.google && window.google.maps && !showSearchButton) {
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
        if (!showSearchButton && map) {
            setShowSearchButton(true);
        }
    };

    const searchThisArea = () => {
        if (!map || !placesServiceRef.current) return;

        setLoadingSearch(true);
        const bounds = map.getBounds();
        const center = map.getCenter();

        const request = {
            location: center,
            radius: 5000, // 5km radius
            type: ['lodging'],
            keyword: 'hotel' // Helps filter for accommodations
        };

        placesServiceRef.current.nearbySearch(request, (results, status) => {
            setLoadingSearch(false);
            setShowSearchButton(false);

            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                // Transform Google Places results to our Listing format
                const newExternalListings = results.map(place => {
                    // Mock price and image if missing
                    const photoUrl = place.photos && place.photos.length > 0
                        ? place.photos[0].getUrl({ maxWidth: 400 })
                        : "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606b6a0370b9.jpeg?im_w=720";

                    return {
                        _id: place.place_id, // Use place_id as ID
                        title: place.name,
                        location: place.vicinity,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        price: Math.floor(Math.random() * 300) + 50, // Mock price
                        rating: place.rating || 4.5,
                        image: photoUrl,
                        isExternal: true,
                        googlePlaceId: place.place_id
                    };
                });

                // Merge with existing listings, avoiding duplicates
                setListings(prev => {
                    const existingIds = new Set(prev.map(l => l._id));
                    const uniqueNew = newExternalListings.filter(l => !existingIds.has(l._id));
                    return [...prev, ...uniqueNew];
                });
            }
        });
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
                {listings.map((listing) => {
                    let position = null;
                    if (listing.latitude && listing.longitude) {
                        position = { lat: listing.latitude, lng: listing.longitude };
                    } else {
                        // Fallback for mock data without coords
                        const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
                        const lng = 2.3522 + (Math.random() - 0.5) * 0.1;
                        position = { lat, lng };
                    }

                    return (
                        <OverlayView
                            key={listing._id || listing.id}
                            position={position}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div style={{ position: 'relative' }}>
                                <div
                                    className={`price-pill ${selectedListing === listing ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedListing(listing);
                                    }}
                                    style={{
                                        backgroundColor: selectedListing === listing ? 'var(--text-main)' : 'var(--bg-white)',
                                        color: selectedListing === listing ? 'var(--bg-white)' : 'var(--text-main)',
                                        transform: selectedListing === listing ? 'scale(1.1)' : 'scale(1)',
                                        zIndex: selectedListing === listing ? 100 : 1
                                    }}
                                >
                                    ${listing.price}
                                </div>

                                {selectedListing === listing && (
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
                })}
            </GoogleMap>

            {/* Search This Area Button */}
            {showSearchButton && (
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 100
                    }}
                >
                    <button
                        onClick={searchThisArea}
                        disabled={loadingSearch}
                        style={{
                            backgroundColor: 'var(--bg-white)',
                            color: 'var(--text-main)',
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-full)',
                            border: 'none',
                            boxShadow: 'var(--shadow-md)',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {loadingSearch ? 'Searching...' : 'Search this area'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoogleMapComponent;
