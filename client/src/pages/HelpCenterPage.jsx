import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaComments } from 'react-icons/fa';

const HelpCenterPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faqs = [
        {
            question: "How do I cancel my booking?",
            answer: "You can cancel your booking by going to your Trips page, selecting the booking you wish to cancel, and clicking the 'Cancel Booking' button. Please note that cancellation policies vary by listing."
        },
        {
            question: "When will I receive my refund?",
            answer: "Refunds are processed immediately upon cancellation, but it may take 5-10 business days for the funds to appear in your account depending on your bank."
        },
        {
            question: "How do I contact the host?",
            answer: "Once you have a confirmed booking, you can message the host directly through your Trips page or the Messages section."
        },
        {
            question: "Is my payment secure?",
            answer: "Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details."
        },
        {
            question: "What if I have an issue during my stay?",
            answer: "If you encounter any issues, please contact your host first. If they are unable to resolve it, you can contact our 24/7 support team for assistance."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', paddingTop: '80px' }}>
            {/* Hero Section */}
            <div style={{
                backgroundColor: 'var(--bg-white)',
                padding: '60px 20px',
                textAlign: 'center',
                borderBottom: '1px solid var(--border)'
            }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>
                    How can we help you?
                </h1>
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    <FaSearch style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '16px 16px 16px 50px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border)',
                            fontSize: '16px',
                            outline: 'none',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    />
                </div>
            </div>

            <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Contact Options */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '60px'
                }}>
                    <ContactCard
                        icon={<FaComments size={24} />}
                        title="Live Chat"
                        description="Chat with our support team 24/7."
                        action="Start Chat"
                    />
                    <ContactCard
                        icon={<FaEnvelope size={24} />}
                        title="Email Us"
                        description="Get a response within 24 hours."
                        action="Send Email"
                    />
                    <ContactCard
                        icon={<FaPhone size={24} />}
                        title="Call Us"
                        description="Speak directly with an agent."
                        action="1-800-123-4567"
                    />
                </div>

                {/* FAQs */}
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>
                    Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredFaqs.map((faq, index) => (
                        <div key={index} style={{
                            backgroundColor: 'var(--bg-white)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>{faq.question}</span>
                                {openFaqIndex === index ? <FaChevronUp color="var(--primary)" /> : <FaChevronDown color="var(--text-secondary)" />}
                            </button>
                            <AnimatePresence>
                                {openFaqIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div style={{ padding: '0 20px 20px 20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            No results found for "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, title, description, action }) => (
    <div style={{
        backgroundColor: 'var(--bg-white)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
    }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--bg-off-white)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--primary)'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{description}</p>
        <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{action}</div>
    </div>
);

export default HelpCenterPage;
