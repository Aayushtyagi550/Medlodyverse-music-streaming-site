import { useEffect, useRef, useState } from 'react';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiX, FiDownload, FiTv, FiMaximize, FiAirplay, FiSettings, FiSquare } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';

const MusicPlayer = () => {
    const {
        currentVideo, isPlaying, queue, queueIndex,
        playNext, playPrev, togglePlay, closePlayer,
        volume, setVolume, setIsPlaying, setProgress, setDuration, progress, duration,
        showVideo, setShowVideo, isTheaterMode, setIsTheaterMode
    } = useMusic();

    const playerRef = useRef(null);
    const iframeRef = useRef(null);
    const [ytPlayer, setYtPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const progressInterval = useRef(null);
    const [videoSize, setVideoSize] = useState({ width: 320, height: 180 });
    const isResizing = useRef(false);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [quality, setQuality] = useState('auto');

    // Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(tag, firstScript);
        }
    }, []);

    // Create/update player when video changes
    useEffect(() => {
        if (!currentVideo) return;

        const createPlayer = () => {
            if (ytPlayer) {
                ytPlayer.loadVideoById(currentVideo.videoId);
                return;
            }

            if (!window.YT || !window.YT.Player) {
                // Wait for API to load
                window.onYouTubeIframeAPIReady = () => {
                    initPlayer();
                };
                return;
            }
            initPlayer();
        };

        const initPlayer = () => {
            const player = new window.YT.Player('yt-player', {
                height: '100%',
                width: '100%',
                videoId: currentVideo.videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 1,
                    modestbranding: 1,
                    rel: 0,
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(volume);
                        event.target.playVideo();
                        setYtPlayer(event.target);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            startProgressTracking(event.target);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        } else if (event.data === window.YT.PlayerState.ENDED) {
                            playNext();
                        }
                    }
                }
            });
            setYtPlayer(player);
        };

        createPlayer();

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [currentVideo?.videoId]);

    // Handle play/pause
    useEffect(() => {
        if (!ytPlayer) return;
        try {
            if (isPlaying) {
                ytPlayer.playVideo();
            } else {
                ytPlayer.pauseVideo();
            }
        } catch (e) { }
    }, [isPlaying, ytPlayer]);

    // Handle volume
    useEffect(() => {
        if (ytPlayer) {
            try {
                ytPlayer.setVolume(volume);
            } catch (e) { }
        }
    }, [volume, ytPlayer]);

    const startProgressTracking = (player) => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            try {
                const current = player.getCurrentTime();
                const total = player.getDuration();
                setCurrentTime(current);
                setTotalTime(total);
                if (total > 0) {
                    setProgress((current / total) * 100);
                    setDuration(total);
                }
            } catch (e) { }
        }, 500);
    };

    const handleProgressClick = (e) => {
        if (!ytPlayer || !totalTime) return;
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        ytPlayer.seekTo(percent * totalTime, true);
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleDownload = () => {
        if (currentVideo) {
            window.open(`https://www.youtube.com/watch?v=${currentVideo.videoId}`, '_blank');
        }
    };

    const changeQuality = (level) => {
        if (ytPlayer) {
            try {
                ytPlayer.setPlaybackQuality(level);
                setQuality(level);
                setShowQualityMenu(false);
            } catch (e) { }
        }
    };

    // Resizing Logic
    const startResize = (e) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'nwse-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };

    const handleResize = (e) => {
        if (!isResizing.current) return;
        const minWidth = 200;
        const maxWidth = 800;
        const rect = document.querySelector('.youtube-embed-container').getBoundingClientRect();
        
        // Use mouse position relative to the container for resizing
        // Since it's fixed at bottom-right, moving mouse left/up increases size
        const newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
        const newHeight = newWidth * (9 / 16);
        
        setVideoSize({ width: newWidth, height: newHeight });
    };

    const stopResize = () => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        };
    }, []);

    if (!currentVideo) return null;

    return (
        <div className="music-player">
            {/* YouTube Player Container */}
            <div 
                className={`youtube-embed-container ${showVideo ? 'show-video' : 'hide-video'} ${isTheaterMode ? 'theater-mode' : ''}`}
                style={!isTheaterMode ? { width: `${videoSize.width}px`, height: `${videoSize.height}px` } : {}}
            >
                <div id="yt-player"></div>
                {showVideo && (
                    <>
                        <button className="video-close-btn" onClick={() => setShowVideo(false)}>
                            <FiX />
                        </button>
                        <div className="video-controls-top">
                            <div className="quality-menu-container">
                                <button className={`video-control-btn ${showQualityMenu ? 'active' : ''}`} onClick={() => setShowQualityMenu(!showQualityMenu)} title="Quality Settings">
                                    <FiSettings />
                                </button>
                                {showQualityMenu && (
                                    <div className="quality-dropdown">
                                        <div className="quality-title">Quality</div>
                                        {['hd1080', 'hd720', 'large', 'medium', 'small', 'auto'].map(q => (
                                            <button key={q} className={`quality-item ${quality === q ? 'active' : ''}`} onClick={() => changeQuality(q)}>
                                                {q === 'hd1080' ? '1080p HD' : q === 'hd720' ? '720p HD' : q === 'large' ? '480p' : q === 'medium' ? '360p' : q === 'small' ? '240p' : 'Auto'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="video-control-btn" onClick={() => setIsTheaterMode(!isTheaterMode)} title="Theater Mode">
                                <FiAirplay />
                            </button>
                            <button className="video-control-btn" onClick={() => document.getElementById('yt-player').requestFullscreen()} title="Fullscreen">
                                <FiMaximize />
                            </button>
                        </div>
                        {!isTheaterMode && <div className="video-resize-handle" onMouseDown={startResize} title="Drag to Resize"></div>}
                    </>
                )}
            </div>

            {/* Track Info */}
            <div className="player-track-info">
                <img
                    className="player-thumb"
                    src={currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.videoId}/mqdefault.jpg`}
                    alt={currentVideo.title}
                />
                <div>
                    <div className="player-track-title">{currentVideo.title}</div>
                    <div className="player-track-artist">{currentVideo.channelTitle}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
                <div className="player-buttons">
                    <button className="player-btn" onClick={playPrev} title="Previous">
                        <FiSkipBack />
                    </button>
                    <button className="player-btn play-pause" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? <FiPause /> : <FiPlay style={{ marginLeft: '2px' }} />}
                    </button>
                    <button className="player-btn" onClick={playNext} title="Next">
                        <FiSkipForward />
                    </button>
                </div>
                <div className="player-progress">
                    <span className="player-time">{formatTime(currentTime)}</span>
                    <div className="progress-bar" onClick={handleProgressClick}>
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="player-time">{formatTime(totalTime)}</span>
                </div>
            </div>

            {/* Extra Controls */}
            <div className="player-extra">
                <button className={`player-btn ${showVideo ? 'active' : ''}`} onClick={() => setShowVideo(!showVideo)} title="Toggle Video">
                    <FiTv />
                </button>
                <button className="player-btn" onClick={closePlayer} title="Stop & Close Player">
                    <FiSquare />
                </button>
                <button className="player-btn" onClick={handleDownload} title="Open in YouTube">
                    <FiDownload />
                </button>
                <div className="volume-control">
                    <button className="player-btn" onClick={() => setVolume(volume === 0 ? 80 : 0)}>
                        {volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
                    </button>
                    <input
                        type="range"
                        className="volume-slider"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                    />
                </div>
                <button className="player-close" onClick={closePlayer} title="Close">
                    <FiX />
                </button>
            </div>
        </div>
    );
};

export default MusicPlayer;
