import { FaStar } from 'react-icons/fa';
import { usePreferences } from '../../contexts/PreferencesContext';

const ListingReviews = ({ listing, reviews, user, onWriteReview }) => {
    const { t } = usePreferences();

    return (
        <div style={{ paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                    <FaStar color="var(--accent)" /> {listing.rating} · {reviews.length} {t('reviews')}
                </h3>
                {user && (
                    <button
                        onClick={onWriteReview}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid var(--text-main)',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--bg-light)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        {t('writeReview')}
                    </button>
                )}
            </div>

            {/* Rating Breakdown */}
            {reviews.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: '80px',
                    rowGap: '16px',
                    marginBottom: '32px'
                }}>
                    {['cleanliness', 'accuracy', 'checkIn', 'communication', 'location', 'value'].map(category => {
                        const validReviews = reviews.filter(r => r.subRatings && r.subRatings[category]);
                        const average = validReviews.length
                            ? (validReviews.reduce((acc, r) => acc + r.subRatings[category], 0) / validReviews.length).toFixed(1)
                            : '0.0';

                        return (
                            <div key={category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ textTransform: 'capitalize', color: 'var(--text-main)' }}>
                                    {t(category)}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                                    <div style={{
                                        flex: 1,
                                        height: '4px',
                                        backgroundColor: 'var(--border)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(parseFloat(average) / 5) * 100}%`,
                                            height: '100%',
                                            backgroundColor: 'var(--text-main)'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: '600', width: '24px', color: 'var(--text-main)' }}>{average}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {reviews.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>{t('noReviews')}</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    {reviews.map((review) => (
                        <div key={review._id}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <img
                                    src={review.user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                    alt={review.user?.name}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{review.user?.name || 'User'}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', color: 'var(--accent)', fontSize: '12px' }}>
                                {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <p style={{ lineHeight: '1.5', color: 'var(--text-main)' }}>
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListingReviews;
