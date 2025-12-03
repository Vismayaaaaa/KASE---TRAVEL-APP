import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendar, FaUsers, FaUser, FaEnvelope, FaCreditCard, FaPrint, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { bookingsAPI, authAPI } from '../services/api';
import { usePreferences } from '../contexts/PreferencesContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const BookingModal = ({ isOpen, onClose, listing, isExperience = false, isPackage = false }) => {
    const [step, setStep] = useState('details'); // details, payment, receipt
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const { formatPrice, t } = usePreferences();
    const receiptRef = useRef();

    const user = authAPI.getCurrentUser();

    const calculateNights = () => {
        if (isExperience || isPackage) return 1;
        if (!startDate || !endDate) return 0;
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };

    const calculateTotal = () => {
        if (isExperience || isPackage) {
            return listing.price * guests;
        }
        return calculateNights() * listing.price;
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const bookingData = {
                listingId: listing._id,
                checkIn: format(startDate, 'yyyy-MM-dd'),
                checkOut: format(endDate, 'yyyy-MM-dd'),
                guests,
                totalPrice: calculateTotal()
            };

            if (user) {
                bookingData.userId = user.id || user._id;
            } else {
                bookingData.guest = {
                    name: guestName,
                    email: guestEmail
                };
            }

            const newBooking = await bookingsAPI.createBooking(bookingData);
            setBookingDetails(newBooking);
            setStep('receipt');
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
            setStep('details');
            setStartDate(null);
            setEndDate(null);
            setGuests(1);
            setGuestName('');
            setGuestEmail('');
            setBookingDetails(null);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    backdropFilter: 'blur(4px)'
                }}
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="booking-modal-content" // Added class for print styling
                    style={{
                        backgroundColor: 'var(--bg-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        maxWidth: step === 'receipt' ? '600px' : '500px',
                        width: '100%',
                        boxShadow: 'var(--shadow-xl)',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        margin: '16px'
                    }}
                >
                    {step === 'receipt' ? (
                        <div ref={receiptRef} className="receipt-container">
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ color: '#10B981', fontSize: '48px', marginBottom: '16px' }}>
                                    <FaCheckCircle />
                                </div>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Payment Successful!</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Your booking has been confirmed.</p>
                            </div>

                            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px', backgroundColor: '#F9FAFB' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Receipt ID</span>
                                    <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>#{bookingDetails?._id?.slice(-8).toUpperCase()}</span>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{listing.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{listing.location}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>Check-in</span>
                                        <span style={{ fontWeight: '600' }}>{format(new Date(bookingDetails?.checkIn), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>Check-out</span>
                                        <span style={{ fontWeight: '600' }}>{format(new Date(bookingDetails?.checkOut), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>Total Amount Paid</span>
                                        <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>{formatPrice(bookingDetails?.totalPrice)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        <FaCreditCard /> Paid with Card ending in 4242
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }} className="no-print">
                                <button
                                    onClick={handlePrint}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: 'var(--bg-white)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <FaPrint /> Print Receipt
                                </button>
                                <button
                                    onClick={handleClose}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                            <style>{`
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    .booking-modal-content, .booking-modal-content * {
                                        visibility: visible;
                                    }
                                    .booking-modal-content {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        box-shadow: none !important;
                                    }
                                    .no-print {
                                        display: none !important;
                                    }
                                }
                            `}</style>
                        </div>
                    ) : step === 'payment' ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Payment</h2>
                                <button onClick={() => setStep('details')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Back</button>
                            </div>

                            <form onSubmit={handlePaymentSubmit}>
                                <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ fontWeight: '600' }}>Total to pay</span>
                                        <span style={{ fontWeight: '700', fontSize: '18px' }}>{formatPrice(calculateTotal())}</span>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Card Information</label>
                                        <div style={{ position: 'relative' }}>
                                            <FaCreditCard style={{ position: 'absolute', left: '12px', top: '14px', color: '#9CA3AF' }} />
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                defaultValue="4242 4242 4242 4242"
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Expiration</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                defaultValue="12/25"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                defaultValue="123"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'var(--primary-gradient)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    {loading ? 'Processing Payment...' : `Pay ${formatPrice(calculateTotal())}`}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>
                                    {user ? (isPackage ? 'Book Package' : t('bookStay')) : t('guestCheckout')}
                                </h2>
                                <button
                                    onClick={handleClose}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <img
                                        src={listing.image}
                                        alt={listing.title}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: 'var(--radius-md)',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>
                                            {listing.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{listing.location}</p>
                                        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
                                            {formatPrice(listing.price)} / {isPackage ? 'person' : t('night')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!user && (
                                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>{t('guestDetails')}</h4>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                            <FaUser style={{ marginRight: '8px' }} />
                                            {t('fullName')}
                                        </label>
                                        <input
                                            type="text"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="John Doe"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '15px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                backgroundColor: 'var(--bg-white)',
                                                color: 'var(--text-main)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                            <FaEnvelope style={{ marginRight: '8px' }} />
                                            {t('email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '15px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                backgroundColor: 'var(--bg-white)',
                                                color: 'var(--text-main)'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>
                                    <FaCalendar style={{ marginRight: '8px' }} />
                                    {isExperience || isPackage ? 'Date' : t('dates')}
                                </label>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '16px',
                                    backgroundColor: 'var(--bg-white)'
                                }}>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => {
                                            if (isExperience || isPackage) {
                                                setStartDate(date);
                                                setEndDate(date);
                                            } else {
                                                const [start, end] = date;
                                                setStartDate(start);
                                                setEndDate(end);
                                            }
                                        }}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange={!isExperience && !isPackage}
                                        inline
                                        minDate={new Date()}
                                        monthsShown={1}
                                        dateFormat="yyyy/MM/dd"
                                    />
                                </div>
                                {!isExperience && !isPackage && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '12px',
                                        fontSize: '14px',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <div>
                                            <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{t('checkIn')}</span>
                                            {startDate ? format(startDate, 'MMM dd, yyyy') : '-'}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{t('checkOut')}</span>
                                            {endDate ? format(endDate, 'MMM dd, yyyy') : '-'}
                                        </div>
                                    </div>
                                )}
                                {(isExperience || isPackage) && startDate && (
                                    <div style={{ marginTop: '12px', textAlign: 'center', fontWeight: '600', color: 'var(--text-main)' }}>
                                        {format(startDate, 'MMM dd, yyyy')}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                                    <FaUsers style={{ marginRight: '8px' }} />
                                    {t('guests')}
                                </label>
                                <input
                                    type="number"
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    min="1"
                                    max={listing.details?.guests || 10}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'var(--bg-white)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                            </div>

                            {(isExperience || isPackage || calculateNights() > 0) && (
                                <div style={{
                                    backgroundColor: 'var(--bg-light)',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {(isExperience || isPackage)
                                                ? `${formatPrice(listing.price)} x ${guests} guests`
                                                : `${formatPrice(listing.price)} x ${calculateNights()} ${t('night')}s`
                                            }
                                        </span>
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                            {formatPrice((isExperience || isPackage) ? listing.price * guests : listing.price * calculateNights())}
                                        </span>
                                    </div>
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)' }}>{t('total')}</span>
                                            <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>
                                                {formatPrice(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (!user && (!guestName || !guestEmail)) {
                                        alert('Please enter your name and email to continue.');
                                        return;
                                    }
                                    setStep('payment');
                                }}
                                disabled={!startDate || !endDate}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'var(--primary-gradient)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: !startDate || !endDate ? 'not-allowed' : 'pointer',
                                    opacity: !startDate || !endDate ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                Continue to Payment
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BookingModal;
