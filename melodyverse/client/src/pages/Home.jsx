import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiChevronRight, FiChevronLeft, FiEye } from 'react-icons/fi';
import SongCard from '../components/SongCard';
import { getFeaturedArtists, getCategories, getTrending, searchMusic } from '../services/api';
import { useMusic } from '../context/MusicContext';

const HERO_ARTISTS_LEFT = [
    { name: 'Lata Mangeshkar', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lata_Mangeshkar_%28cropped%29.jpg/440px-Lata_Mangeshkar_%28cropped%29.jpg' },
    { name: 'Mukesh', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mukesh_singer.jpg/440px-Mukesh_singer.jpg' },
    { name: 'A.R. Rahman', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/A._R._Rahman_at_the_2019_Toronto_International_Film_Festival.jpg/440px-A._R._Rahman_at_the_2019_Toronto_International_Film_Festival.jpg' },
    { name: 'Kishore Kumar', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Kishore_Kumar_in_1970s.jpg/440px-Kishore_Kumar_in_1970s.jpg' },
];

const HERO_ARTISTS_RIGHT = [
    { name: 'Freddie Mercury', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg/440px-Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg' },
    { name: 'Michael Jackson', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Michael_Jackson_in_1988.jpg/440px-Michael_Jackson_in_1988.jpg' },
    { name: 'Beyoncé', img: 'https://ui-avatars.com/api/?name=Beyonce&background=fd79a8&color=fff&size=200' },
    { name: 'Elvis Presley', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elvis_Presley_promoting_Jailhouse_Rock.jpg/440px-Elvis_Presley_promoting_Jailhouse_Rock.jpg' },
];

const QUICK_PLAYS = [
    { title: 'Lata Mangeshkar: Golden Hits', query: 'Lata Mangeshkar greatest hits', img: '/assets/artists/lata.png', views: '1.2M views' },
    { title: 'Freddie Mercury: Live at Wembley', query: 'Queen Freddie Mercury live Wembley', img: '/assets/artists/freddie.png', views: '850K views' },
    { title: 'Bollywood Classics Revisited', query: 'best old Bollywood songs 60s 70s 80s', img: '/assets/artists/bollywood.png', views: '2.4M views' },
    { title: 'Icons of Pop Music', query: 'pop music icons greatest hits', img: '/assets/artists/pop.png', views: '3.1M views' },
];

const Home = () => {
    const [featuredArtists, setFeaturedArtists] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const navigate = useNavigate();
    const { playVideo } = useMusic();
    const carouselRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [artistsRes, catsRes] = await Promise.all([
                getFeaturedArtists().catch(() => ({ data: { artists: [] } })),
                getCategories().catch(() => ({ data: { categories: [] } })),
            ]);
            setFeaturedArtists(artistsRes.data.artists || []);
            setCategories(catsRes.data.categories || []);
            try {
                const trendRes = await getTrending('IN');
                setTrendingVideos(trendRes.data.videos || []);
            } catch (e) {
                try {
                    const fallback = await searchMusic('trending music 2024');
                    setTrendingVideos(fallback.data.videos || []);
                } catch (e2) { }
            }
        } catch (error) {
            console.error('Failed to load home data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPlay = async (item) => {
        try {
            const res = await searchMusic(item.query);
            const videos = res.data.videos || [];
            if (videos.length > 0) {
                playVideo(videos[0], videos);
            }
        } catch (e) { }
    };

    const scrollCarousel = (dir) => {
        if (carouselRef.current) {
            const scrollAmount = 300;
            carouselRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="home-fullwidth">
            {/* ===== PREMIUM HERO ===== */}
            <div className="fw-hero-premium" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('/hero-bg.jpg')`,
            }}>
                <div className="fw-hero-glow"></div>

                <div className="fw-hero-content-clean">
                    <div className="fw-hero-badge">BEST OF MUSIC</div>
                    <div className="fw-hero-actions">
                        <button className="premium-play-btn" onClick={() => navigate('/search')}>
                            <FiPlay /> START STREAMING
                        </button>
                        <button className="premium-outline-btn" onClick={() => navigate('/artists')}>
                            VIEW ALL LEGENDS
                        </button>
                    </div>
                </div>
            </div>
            {/* ===== CAROUSEL DOTS ===== */}
            <div className="fw-dots">
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`fw-dot ${carouselIndex === i ? 'active' : ''}`} onClick={() => setCarouselIndex(i)} />
                ))}
            </div>

            {/* ===== QUICK PLAY CAROUSEL ===== */}
            <div className="fw-carousel-section">
                <button className="fw-carousel-arrow left" onClick={() => scrollCarousel(-1)}>
                    <FiChevronLeft />
                </button>
                <div className="fw-carousel" ref={carouselRef}>
                    {QUICK_PLAYS.map((item, i) => (
                        <div key={i} className="fw-card" onClick={() => handleQuickPlay(item)}>
                            <div className="fw-card-thumb">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=6c5ce7&color=fff&size=200`; }}
                                />
                                <div className="fw-card-play">
                                    <FiPlay /> Play
                                </div>
                            </div>
                            <div className="fw-card-info">
                                <div className="fw-card-title">{item.title}</div>
                                <div className="fw-card-meta">
                                    <span>Animated videos</span>
                                    <span><FiEye style={{ fontSize: '11px' }} /> {item.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="fw-carousel-arrow right" onClick={() => scrollCarousel(1)}>
                    <FiChevronRight />
                </button>
            </div>

            {/* ===== TRENDING SECTION ===== */}
            {trendingVideos.length > 0 && (
                <div className="fw-section">
                    <div className="section-header">
                        <h2 className="section-title"><span className="emoji">🔥</span> Trending Now</h2>
                        <span className="section-link" onClick={() => navigate('/search?q=trending music')}>
                            See All <FiChevronRight />
                        </span>
                    </div>
                    <div className="songs-grid">
                        {trendingVideos.slice(0, 8).map((video, i) => (
                            <SongCard key={video.videoId} song={video} songList={trendingVideos} animDelay={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* ===== ARTISTS SECTION ===== */}
            {featuredArtists.length > 0 && (
                <div className="fw-section">
                    <div className="section-header">
                        <h2 className="section-title"><span className="emoji">⭐</span> Legendary Artists</h2>
                        <span className="section-link" onClick={() => navigate('/artists')}>View All <FiChevronRight /></span>
                    </div>
                    <div className="artists-grid">
                        {featuredArtists.map((artist, i) => (
                            <div key={artist._id} className="artist-card animate-in" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => navigate(`/artist/${artist._id}`)}>
                                <img className="artist-card-img" src={artist.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6c5ce7&color=fff&size=200`} alt={artist.name} loading="lazy" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6c5ce7&color=fff&size=200`; }} />
                                <div className="artist-card-overlay">
                                    <div className="artist-card-name">{artist.name}</div>
                                    <div className="artist-card-genre">{artist.genre?.slice(0, 2).join(' • ')}</div>
                                </div>
                                <button className="artist-play-btn"><FiPlay /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== CATEGORIES ===== */}
            {categories.length > 0 && (
                <div className="fw-section">
                    <div className="section-header">
                        <h2 className="section-title"><span className="emoji">🎵</span> Browse by Genre</h2>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <div key={cat._id} className="category-card animate-in" style={{ animationDelay: `${i * 0.05}s`, background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}08)`, color: cat.color }} onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: cat.color, opacity: 0.06 }}></div>
                                <div className="category-emoji">{cat.image}</div>
                                <div className="category-name">{cat.name}</div>
                                <div className="category-desc">{cat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== BOTTOM FOOTER ===== */}
            <footer className="fw-footer">
                <div className="fw-footer-links">
                    <span onClick={() => navigate('/')}>Home Video</span>
                    <span onClick={() => navigate('/search?q=genres music')}>Genres Music</span>
                    <span onClick={() => navigate('/artists')}>Artists</span>
                    <span onClick={() => navigate('/artists')}>Artists</span>
                    <span>Contact Us</span>
                </div>
                <p className="fw-footer-copy">© 2024 MelodyVerse — Stream the Greatest Musical Legends ⭐</p>
            </footer>
        </div>
    );
};

export default Home;
