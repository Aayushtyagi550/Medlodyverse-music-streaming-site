import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SongCard from '../components/SongCard';
import { getByCategory } from '../services/api';

const CategoryPage = () => {
    const { name } = useParams();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(null);

    useEffect(() => {
        loadSongs();
    }, [name]);

    const loadSongs = async (pageToken = null) => {
        if (!pageToken) setLoading(true);
        try {
            const res = await getByCategory(name, pageToken);
            if (pageToken) {
                setSongs(prev => [...prev, ...(res.data.videos || [])]);
            } else {
                setSongs(res.data.videos || []);
            }
            setNextPage(res.data.nextPageToken);
        } catch (error) {
            console.error('Failed to load category:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="search-results-header">
                <h2>🎵 {decodeURIComponent(name)}</h2>
                <p>Explore the best {decodeURIComponent(name)} music</p>
            </div>

            {songs.length > 0 ? (
                <>
                    <div className="songs-grid">
                        {songs.map((song, i) => (
                            <SongCard key={`${song.videoId}-${i}`} song={song} songList={songs} animDelay={i} />
                        ))}
                    </div>
                    {nextPage && (
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <button className="hero-btn" onClick={() => loadSongs(nextPage)} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🎵</div>
                    <h3>No songs found</h3>
                    <p>Try a different genre</p>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
