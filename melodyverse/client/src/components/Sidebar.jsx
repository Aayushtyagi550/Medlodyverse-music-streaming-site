import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCompass, FiMusic, FiUsers, FiRadio, FiClock, FiHeart, FiFolder, FiPlusCircle, FiBarChart } from 'react-icons/fi';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <FiHome />, label: 'Home', to: '/' },
        { icon: <FiCompass />, label: 'Explore', to: '/search' },
        { icon: <FiMusic />, label: 'Album', to: '/search?q=albums' },
        // { icon: <FiRadio />, label: 'Radio', to: '/radio' },
    ];

    const libraryItems = [
        { icon: <FiClock />, label: 'Recents', to: '/search?q=recent' },
        { icon: <FiHeart />, label: 'Favourites', to: '/favorites' },
        { icon: <FiFolder />, label: 'Local', to: '/search?q=local' },
    ];

    const playlistItems = [
        { label: 'Hip-Hop', to: '/category/Hip%20Hop' },
        { label: 'Classical', to: '/category/Classical' },
        { label: 'Bollywood', to: '/category/Bollywood' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate('/')}>
                <div className="logo-icon-side">🎵</div>
                <div className="logo-text-side">
                    MELODY<span className="logo-accent">VERSE</span>
                </div>
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">RECOMMEND</div>
                {menuItems.map(item => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">LIBRARY</div>
                {libraryItems.map(item => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">PLAYLIST</div>
                <div className="sidebar-item">
                    <span className="sidebar-icon"><FiPlusCircle /></span>
                    <span className="sidebar-label">Create New</span>
                </div>
                {playlistItems.map(item => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                        <span className="sidebar-icon"><FiBarChart /></span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
