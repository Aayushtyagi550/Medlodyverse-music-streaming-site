import { useEffect, useRef, useState } from 'react';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiX, FiDownload } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';

const MusicPlayer = () => {
    const {
        currentVideo, isPlaying, queue, queueIndex,
        playNext, playPrev, togglePlay, closePlayer,
        volume, setVolume, setIsPlaying, setProgress, setDuration, progress, duration
    } = useMusic();

    const playerRef = useRef(null);
    const iframeRef = useRef(null);
    const [ytPlayer, setYtPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const progressInterval = useRef(null);

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
                height: '1',
                width: '1',
                videoId: currentVideo.videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
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

    if (!currentVideo) return null;

    return (
        <div className="music-player">
            {/* Hidden YouTube Player */}
            <div className="youtube-embed-container">
                <div id="yt-player"></div>
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
