import { useState } from 'react';
import { FaGlobe, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import LanguageModal from './LanguageModal';
import { usePreferences } from '../contexts/PreferencesContext';

const Footer = () => {
    const { language, setLanguage, currency, setCurrency, languages, currencies, t } = usePreferences();

    const sections = [
        {
            title: t('support'),
            links: [t('help'), 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report neighborhood concern']
        },
        {
            title: t('hosting'),
            links: [t('airbnbYourHome'), 'AirCover for Hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly', 'Airbnb-friendly apartments']
        },
        {
            title: t('company'),
            links: ['Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards', 'Airbnb.org emergency stays']
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <footer style={{
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-light)',
            fontSize: '14px',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ padding: '48px 40px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '32px',
                    paddingBottom: '48px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h3 style={{ fontWeight: '600', marginBottom: '16px', color: 'white' }}>{section.title}</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" style={{
                                            color: 'var(--text-light)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s ease'
                                        }}
                                            onMouseEnter={(e) => e.target.style.color = 'white'}
                                            onMouseLeave={(e) => e.target.style.color = 'var(--text-light)'}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '24px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>© 2025 Roam, Inc.</span>
                        <span>·</span>
                        <a href="#" style={{ color: 'inherit' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>{t('privacy')}</a>
                        <span>·</span>
                        <a href="#" style={{ color: 'inherit' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>{t('terms')}</a>
                        <span>·</span>
                        <a href="#" style={{ color: 'inherit' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>{t('sitemap')}</a>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontWeight: '600', color: 'white' }}>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <FaGlobe size={16} />
                            <span>{language.name} ({language.region})</span>
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {currency.symbol} {currency.code}
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <FaFacebookF size={18} style={{ cursor: 'pointer' }} />
                            <FaTwitter size={18} style={{ cursor: 'pointer' }} />
                            <FaInstagram size={18} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>
            </div>

            <LanguageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentLang={language}
                currentCurrency={currency}
                onSelectLang={setLanguage}
                onSelectCurrency={setCurrency}
                languages={languages}
                currencies={currencies}
            />
        </footer>
    );
};

export default Footer;
