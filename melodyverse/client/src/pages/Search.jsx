import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import SongCard from '../components/SongCard';
import { searchMusic } from '../services/api';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(query);
    const [nextPage, setNextPage] = useState(null);

    useEffect(() => {
        if (query) {
            setSearchInput(query);
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (q, pageToken = null) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const res = await searchMusic(q, pageToken);
            if (pageToken) {
                setResults(prev => [...prev, ...(res.data.videos || [])]);
            } else {
                setResults(res.data.videos || []);
            }
            setNextPage(res.data.nextPageToken);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            handleSearch(searchInput);
            window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchInput)}`);
        }
    };

    return (
        <div>
            <div className="search-results-header">
                <h2>🔍 Explore Music</h2>
                <p>Search for any song, artist, or genre</p>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
                <div className="navbar-search" style={{ maxWidth: '600px' }}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for songs, artists, genres..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ fontSize: '16px', padding: '14px 16px 14px 44px' }}
                    />
                </div>
            </form>

            {query && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
                    Showing results for "<strong style={{ color: 'var(--accent-primary)' }}>{query}</strong>"
                </p>
            )}

            {loading && results.length === 0 ? (
                <div className="loader"><div className="spinner"></div></div>
            ) : results.length > 0 ? (
                <>
                    <div className="songs-grid">
                        {results.map((video, i) => (
                            <SongCard key={`${video.videoId}-${i}`} song={video} songList={results} animDelay={i} />
                        ))}
                    </div>
                    {nextPage && (
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <button
                                className="hero-btn"
                                onClick={() => handleSearch(query || searchInput, nextPage)}
                                disabled={loading}
                                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            ) : query ? (
                <div className="empty-state">
                    <div className="empty-icon">🎵</div>
                    <h3>No results found</h3>
                    <p>Try searching for something else</p>
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>Search for music</h3>
                    <p>Find your favorite songs, artists, and more</p>
                </div>
            )}
        </div>
    );
};

export default Search;
