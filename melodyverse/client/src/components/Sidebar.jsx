import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiMusic, FiHeart, FiList, FiUsers, FiSettings, FiStar, FiRadio, FiHeadphones, FiClock, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const mainNav = [
        { path: '/', icon: <FiHome />, label: 'Home' },
        { path: '/search', icon: <FiSearch />, label: 'Explore' },
        { path: '/artists', icon: <FiUsers />, label: 'Artists' },
    ];

    const libraryNav = [
        { path: '/favorites', icon: <FiHeart />, label: 'Favorites' },
        { path: '/playlists', icon: <FiList />, label: 'Playlists' },
        { path: '/time-machine', icon: <FiClock />, label: 'Time Machine' },
    ];

    const genreLinks = [
        { path: '/category/Bollywood', label: '🎬 Bollywood' },
        { path: '/category/Indian Classical', label: '🎵 Classical' },
        { path: '/category/Pop', label: '🎤 Pop' },
        { path: '/category/Rock', label: '🎸 Rock' },
        { path: '/category/Hip Hop', label: '🎧 Hip Hop' },
        { path: '/category/Lo-Fi', label: '☕ Lo-Fi' },
        { path: '/category/Sufi', label: '🌀 Sufi' },
        { path: '/category/EDM', label: '🎛️ EDM' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">🎵</div>
                <h1>MelodyVerse</h1>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Menu</div>
                    {mainNav.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end={item.path === '/'}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Your Library</div>
                    {libraryNav.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Genres</div>
                    {genreLinks.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon" style={{ fontSize: '16px' }}>{item.label.split(' ')[0]}</span>
                            {item.label.split(' ').slice(1).join(' ')}
                        </NavLink>
                    ))}
                </div>

                {user?.role === 'admin' && (
                    <div className="nav-section">
                        <div className="nav-section-title">Admin</div>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon"><FiSettings /></span>
                            Admin Panel
                        </NavLink>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
