import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiLogOut, FiShield, FiMenu, FiX, FiClock, FiHeart, FiCamera, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import AuthModal from './AuthModal';

const TopNavbar = ({ onToggleSidebar }) => {
    const { setShowAIAssistant, setShowMoodCamera, showAIAssistant, showMoodCamera } = useMusic();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const suggestionRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = (query) => {
        if (!query.trim()) { setSuggestions([]); return; }
        const popular = [
            "Arijit Singh", "Taylor Swift", "Lata Mangeshkar", "Kishore Kumar", "Ed Sheeran",
            "Shreya Ghoshal", "Bollywood Hits", "90s Songs", "Pop Mix", "Lo-Fi Beats", 
            "Hindi Sad Songs", "Punjabi Pop", "Michael Jackson", "Neha Kakkar"
        ];
        const res = popular.filter(p => p.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        setSuggestions(res);
    };

    const handleInput = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        fetchSuggestions(val);
    };

    const handleSuggestionClick = (sug) => {
        setSearchQuery(sug);
        setSuggestions([]);
        navigate(`/search?q=${encodeURIComponent(sug)}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const openAuth = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/search', label: 'Explore' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/time-machine', label: 'Time Machine' },
    ];

    return (
        <>
            <nav className="top-nav">
                {/* Row 1: Logo + Nav Links + Buttons */}
                <div className="top-nav-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                            className="top-nav-btn menu-toggle"
                            onClick={onToggleSidebar}
                            style={{ border: 'none', background: 'transparent', boxShadow: 'none', fontSize: '24px', padding: '0', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
                            title="Toggle Sidebar"
                        >
                            <FiMenu />
                        </button>
                        <div className="top-nav-logo" onClick={() => navigate('/')}>
                            <div className="logo-icon-top">🎵</div>
                            <div className="logo-text-top">
                                <span className="logo-name">MELODY<span className="logo-accent">VERSE</span></span>
                                <span className="logo-sub">Music Video Streaming App</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="top-nav-links">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
                                end={link.to === '/'}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
                                Admin
                            </NavLink>
                        )}
                    </div>

                    {/* Feature Buttons */}
                    <div className="top-feature-btns">
                        <button
                            className={`top-nav-btn ${showMoodCamera ? 'active' : ''}`}
                            onClick={() => setShowMoodCamera(true)}
                            title="Mood Camera"
                        >
                            <FiCamera />
                        </button>
                        <button
                            className={`top-nav-btn ${showAIAssistant ? 'active' : ''}`}
                            onClick={() => setShowAIAssistant(true)}
                            title="AI Assistant"
                        >
                            <FiMessageCircle />
                        </button>
                    </div>

                    {/* Auth */}
                    <div className="top-nav-auth">
                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <div className="top-user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                {showUserMenu && (
                                    <div className="user-menu" style={{ top: '50px', right: '0' }}>
                                        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-glass)', marginBottom: '4px' }}>
                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                        {user.role === 'admin' && (
                                            <button className="user-menu-item" onClick={() => { navigate('/admin'); setShowUserMenu(false); }}>
                                                <FiShield /> Admin Panel
                                            </button>
                                        )}
                                        <button className="user-menu-item" onClick={() => { navigate('/favorites'); setShowUserMenu(false); }}>
                                            <FiHeart /> Favorites
                                        </button>
                                        <button className="user-menu-item" onClick={() => { navigate('/time-machine'); setShowUserMenu(false); }}>
                                            <FiClock /> Time Machine
                                        </button>
                                        <button className="user-menu-item danger" onClick={() => { logout(); setShowUserMenu(false); }}>
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="top-auth-btn login" onClick={() => openAuth('login')}>LOGIN</button>
                                <button className="top-auth-btn register" onClick={() => openAuth('register')}>REGISTER</button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle (hamburger for nav links) */}
                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Row 2: Search bar - always visible on both desktop and mobile */}
                <div className="top-nav-search-row" ref={suggestionRef} style={{ position: 'relative' }}>
                    <form className="top-nav-search" onSubmit={handleSearch}>
                        <FiSearch className="top-search-icon" />
                        <input
                            type="text"
                            placeholder="Search for songs, albums, artists..."
                            value={searchQuery}
                            onChange={handleInput}
                            onFocus={() => fetchSuggestions(searchQuery)}
                        />
                    </form>
                    {suggestions.length > 0 && (
                        <div className="search-suggestions" style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'rgba(13, 13, 18, 0.95)', border: '1px solid var(--border)', borderRadius: '16px', backdropFilter: 'blur(30px)', zIndex: 1200, padding: '10px 0', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                            {suggestions.map((sug, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSuggestionClick(sug)}
                                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s', color: 'var(--text-main)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass-hover)'; e.currentTarget.style.color = 'var(--accent-pink)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-main)'; }}
                                >
                                    <FiSearch style={{ color: 'var(--text-dim)' }} />
                                    <span>{sug}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile dropdown nav links */}
                {mobileMenuOpen && (
                    <div className="mobile-dropdown">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className="mobile-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            {showAuthModal && (
                <AuthModal
                    mode={authMode}
                    onClose={() => setShowAuthModal(false)}
                    onSwitchMode={(mode) => setAuthMode(mode)}
                />
            )}
        </>
    );
};

export default TopNavbar;
