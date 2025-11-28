const ListingImages = ({ listing }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: listing.images?.length > 1 ? '2fr 1fr 1fr' : '1fr',
            gridTemplateRows: listing.images?.length > 1 ? '200px 200px' : '400px',
            gap: '8px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '48px',
            boxShadow: 'var(--shadow-md)'
        }}>
            <div style={{ gridColumn: listing.images?.length > 1 ? '1 / 2' : '1', gridRow: listing.images?.length > 1 ? '1 / 3' : '1' }}>
                <img src={listing.image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {listing.images?.slice(1, 5)?.map((img, i) => (
                <div key={i}>
                    <img src={img} alt={`Sub ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ))}
        </div>
    );
};

export default ListingImages;
