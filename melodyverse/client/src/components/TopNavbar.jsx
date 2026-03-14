import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiLogOut, FiUser, FiShield, FiMenu, FiX, FiClock, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const TopNavbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
        { to: '/artists', label: 'Artists' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/time-machine', label: 'Time Machine' },
    ];

    return (
        <>
            <nav className="top-nav">
                <div className="top-nav-inner">
                    {/* Logo */}
                    <div className="top-nav-logo" onClick={() => navigate('/')}>
                        <div className="logo-icon-top">🎵</div>
                        <div className="logo-text-top">
                            <span className="logo-name">MELODY<span className="logo-accent">VERSE</span></span>
                            <span className="logo-sub">Music Video Streaming App</span>
                        </div>
                    </div>

                    {/* Nav Links - Desktop */}
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

                    {/* Search */}
                    <form className="top-nav-search" onSubmit={handleSearch}>
                        <FiSearch className="top-search-icon" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Auth Buttons */}
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

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Mobile Menu */}
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
