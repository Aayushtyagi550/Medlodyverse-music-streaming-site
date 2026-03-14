import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import { getArtists } from '../services/api';

const Artists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadArtists();
    }, []);

    const loadArtists = async () => {
        try {
            const res = await getArtists();
            setArtists(res.data.artists || []);
        } catch (error) {
            console.error('Failed to load artists:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="search-results-header">
                <h2>⭐ All Artists</h2>
                <p>Legendary singers from India and around the world</p>
            </div>

            <div className="artists-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                {artists.map((artist, i) => (
                    <div
                        key={artist._id}
                        className="artist-card animate-in"
                        style={{ animationDelay: `${i * 0.06}s` }}
                        onClick={() => navigate(`/artist/${artist._id}`)}
                    >
                        <img
                            className="artist-card-img"
                            src={artist.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6c5ce7&color=fff&size=200`}
                            alt={artist.name}
                            loading="lazy"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6c5ce7&color=fff&size=200`; }}
                        />
                        <div className="artist-card-overlay">
                            <div className="artist-card-name">{artist.name}</div>
                            <div className="artist-card-genre">{artist.genre?.slice(0, 2).join(' • ')}</div>
                        </div>
                        <button className="artist-play-btn"><FiPlay /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Artists;
