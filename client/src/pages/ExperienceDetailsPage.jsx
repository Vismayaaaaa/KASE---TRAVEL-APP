import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { experiencesAPI, authAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import ListingHeader from '../components/listing/ListingHeader';
import ListingImages from '../components/listing/ListingImages';
import ExperienceInfo from '../components/experience/ExperienceInfo';
import ExperienceBookingCard from '../components/experience/ExperienceBookingCard';

const ExperienceDetailsPage = () => {
    const { id } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Wishlist State (Mocked for now as wishlist API might be listing-specific)
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setLoading(true);
                const data = await experiencesAPI.getExperienceById(id);
                setExperience(data);
            } catch (error) {
                console.error('Failed to fetch experience:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [id]);

    const handleWishlistToggle = () => {
        setIsInWishlist(!isInWishlist);
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!experience) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Experience not found</div>;
    }

    return (
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '24px 40px' }}>
            <ListingHeader
                listing={experience}
                reviewsCount={experience.reviews}
                isInWishlist={isInWishlist}
                onWishlistToggle={handleWishlistToggle}
                wishlistLoading={false}
            />

            <ListingImages listing={experience} />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '80px' }}>
                {/* Left Column */}
                <div>
                    <ExperienceInfo experience={experience} />
                </div>

                {/* Right Column - Booking Card */}
                <div>
                    <ExperienceBookingCard
                        experience={experience}
                        onReserve={() => setIsBookingModalOpen(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                listing={experience}
                isExperience={true}
            />
        </div>
    );
};

export default ExperienceDetailsPage;
