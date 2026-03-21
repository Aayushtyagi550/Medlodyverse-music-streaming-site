import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCompass, FiMusic, FiUsers, FiRadio, FiClock, FiHeart, FiFolder, FiPlusCircle, FiBarChart, FiInfo, FiSettings } from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
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

    const otherItems = [
        { icon: <FiInfo />, label: 'About', to: '/about' },
        { icon: <FiSettings />, label: 'Settings', to: '/settings' },
    ];

    const handleItemClick = (to) => {
        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
        navigate(to);
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
            <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', padding: '0 10px' }}>
                <div className="sidebar-logo" onClick={() => handleItemClick('/')} style={{ margin: 0 }}>
                    <div className="logo-icon-side">🎵</div>
                    <div className="logo-text-side">
                        MELODY<span className="logo-accent">VERSE</span>
                    </div>
                </div>
                {window.innerWidth <= 768 && (
                    <button 
                        onClick={() => setIsOpen(false)} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <FiX />
                    </button>
                )}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">RECOMMEND</div>
                {menuItems.map(item => (
                    <NavLink 
                        key={item.to} 
                        to={item.to} 
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            if (window.innerWidth <= 768) {
                                setIsOpen(false);
                            }
                        }}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">LIBRARY</div>
                {libraryItems.map(item => (
                    <NavLink 
                        key={item.to} 
                        to={item.to} 
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            if (window.innerWidth <= 768) {
                                setIsOpen(false);
                            }
                        }}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">PLAYLIST</div>
                <div className="sidebar-item" onClick={() => { if (window.innerWidth <= 768) setIsOpen(false); }}>
                    <span className="sidebar-icon"><FiPlusCircle /></span>
                    <span className="sidebar-label">Create New</span>
                </div>
                {playlistItems.map(item => (
                    <NavLink 
                        key={item.to} 
                        to={item.to} 
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            if (window.innerWidth <= 768) {
                                setIsOpen(false);
                            }
                        }}
                    >
                        <span className="sidebar-icon"><FiBarChart /></span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-title">OTHER</div>
                {otherItems.map(item => (
                    <NavLink 
                        key={item.to} 
                        to={item.to} 
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            if (window.innerWidth <= 768) {
                                setIsOpen(false);
                            }
                        }}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
