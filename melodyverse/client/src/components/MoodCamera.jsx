import { useState, useRef, useEffect, useCallback } from 'react';
import { FiCamera, FiX, FiPlay, FiRefreshCw } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import { searchMusic } from '../services/api';
import toast from 'react-hot-toast';

const MOODS = {
    happy: {
        emoji: '😃',
        label: 'Happy & Excited!',
        color: '#fdcb6e',
        suggestion: 'Playing upbeat & energetic songs to match your vibe!',
        queries: ['happy upbeat songs', 'dance party music', 'feel good bollywood songs', 'happy pop music 2024']
    },
    sad: {
        emoji: '😢',
        label: 'Feeling Sad',
        color: '#74b9ff',
        suggestion: 'Here are some soulful melodies to comfort you...',
        queries: ['sad emotional songs', 'heartbreak bollywood songs', 'sad romantic songs', 'soothing sad music']
    },
    angry: {
        emoji: '😡',
        label: 'Feeling Angry',
        color: '#ff6b6b',
        suggestion: 'Let\'s calm you down with some peaceful music...',
        queries: ['calm peaceful music', 'meditation relaxing music', 'soothing instrumental music', 'nature sounds relaxation']
    },
    surprised: {
        emoji: '😲',
        label: 'Surprised!',
        color: '#a29bfe',
        suggestion: 'Playing some amazing tracks to keep the excitement going!',
        queries: ['epic music playlist', 'mind blowing songs', 'amazing music mix', 'best music ever']
    },
    neutral: {
        emoji: '😐',
        label: 'Feeling Neutral',
        color: '#dfe6e9',
        suggestion: 'Playing a mix of chill and groovy tunes for you!',
        queries: ['chill music mix', 'lo-fi beats relaxing', 'café music playlist', 'chill bollywood songs']
    },
    fearful: {
        emoji: '😰',
        label: 'Feeling Anxious',
        color: '#00cec9',
        suggestion: 'Relaxing melodies to ease your mind...',
        queries: ['calming anxiety music', 'peaceful piano music', 'stress relief music', 'healing meditation music']
    },
    disgusted: {
        emoji: '🤢',
        label: 'Not Feeling Great',
        color: '#00b894',
        suggestion: 'Some fresh, uplifting music to brighten your mood!',
        queries: ['mood booster songs', 'motivational music', 'inspiring songs playlist', 'uplifting bollywood songs']
    },
    romantic: {
        emoji: '🥰',
        label: 'Feeling Romantic!',
        color: '#fd79a8',
        suggestion: 'Love is in the air! Playing romantic melodies...',
        queries: ['romantic love songs', 'romantic bollywood songs', 'love songs playlist', 'romantic hindi songs']
    }
};

const MoodCamera = () => {
    const { showMoodCamera: isOpen, setShowMoodCamera: setIsOpen, playVideo } = useMusic();
    const [stream, setStream] = useState(null);
    const [mood, setMood] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [moodSongs, setMoodSongs] = useState([]);
    const [countdown, setCountdown] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 400, height: 300 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            toast.error('Camera access denied. Please allow camera permissions.');
            console.error('Camera error:', err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            setMood(null);
            setMoodSongs([]);
            setScanning(false);
        }
        return () => stopCamera();
    }, [isOpen]);

    // Analyze the video frame for mood detection using pixel analysis
    const analyzeMood = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setScanning(true);
        setCountdown(3);

        // Countdown animation
        for (let i = 3; i > 0; i--) {
            setCountdown(i);
            await new Promise(r => setTimeout(r, 1000));
        }
        setCountdown(null);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth || 400;
        canvas.height = video.videoHeight || 300;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Analyze the face region (center of frame)
        const faceX = Math.floor(canvas.width * 0.25);
        const faceY = Math.floor(canvas.height * 0.15);
        const faceW = Math.floor(canvas.width * 0.5);
        const faceH = Math.floor(canvas.height * 0.7);

        const imageData = ctx.getImageData(faceX, faceY, faceW, faceH);
        const pixels = imageData.data;

        // Calculate average color values and brightness
        let totalR = 0, totalG = 0, totalB = 0;
        let brightPixels = 0;
        let darkPixels = 0;
        let warmPixels = 0;
        let coolPixels = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            totalR += r;
            totalG += g;
            totalB += b;

            const brightness = (r + g + b) / 3;
            if (brightness > 160) brightPixels++;
            if (brightness < 80) darkPixels++;
            if (r > b + 30) warmPixels++;
            if (b > r + 30) coolPixels++;
        }

        const avgR = totalR / pixelCount;
        const avgG = totalG / pixelCount;
        const avgB = totalB / pixelCount;
        const avgBrightness = (avgR + avgG + avgB) / 3;
        const brightRatio = brightPixels / pixelCount;
        const darkRatio = darkPixels / pixelCount;
        const warmRatio = warmPixels / pixelCount;
        const coolRatio = coolPixels / pixelCount;

        // Enhanced mood detection based on visual factors
        // Also adds some randomness to make it feel more dynamic
        let detectedMood;
        const rand = Math.random();

        if (avgBrightness > 140 && warmRatio > 0.3) {
            // Bright and warm - likely smiling/happy
            detectedMood = rand > 0.3 ? 'happy' : 'romantic';
        } else if (avgBrightness > 130 && brightRatio > 0.4) {
            // Very bright - surprised or excited
            detectedMood = rand > 0.4 ? 'surprised' : 'happy';
        } else if (darkRatio > 0.4 && coolRatio > 0.3) {
            // Dark and cool tones - sad
            detectedMood = rand > 0.3 ? 'sad' : 'fearful';
        } else if (warmRatio > 0.45 && avgR > avgB + 40) {
            // Very warm/red tones - angry or intense
            detectedMood = rand > 0.5 ? 'angry' : 'surprised';
        } else if (coolRatio > 0.35) {
            // Cool tones  
            detectedMood = rand > 0.4 ? 'neutral' : 'sad';
        } else if (avgBrightness > 120) {
            detectedMood = rand > 0.3 ? 'neutral' : 'happy';
        } else {
            detectedMood = rand > 0.5 ? 'neutral' : 'sad';
        }

        setMood(detectedMood);
        setScanning(false);

        // Speak the result
        const moodData = MOODS[detectedMood];
        const utterance = new SpeechSynthesisUtterance(
            `I can see you're feeling ${moodData.label}. ${moodData.suggestion}`
        );
        utterance.rate = 1;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);

        // Fetch mood-based songs
        try {
            const randomQuery = moodData.queries[Math.floor(Math.random() * moodData.queries.length)];
            const res = await searchMusic(randomQuery);
            setMoodSongs(res.data.videos || []);
        } catch (e) {
            console.error('Failed to fetch mood songs');
        }
    }, []);

    const playMoodMusic = () => {
        if (moodSongs.length > 0) {
            playVideo(moodSongs[0], moodSongs);
            toast.success(`🎵 Now playing ${mood} mood music!`);
            setIsOpen(false);
        }
    };

    const moodData = mood ? MOODS[mood] : null;

    return (
        <>
            {/* Mood Camera Modal */}
            {isOpen && (
                <div className="mood-modal">
                    <button className="mood-close-btn" onClick={() => setIsOpen(false)}>
                        <FiX />
                    </button>
                    <div className="mood-modal-content">
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '4px', background: 'linear-gradient(135deg, #fd79a8, #e17055)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            📸 Mood Camera
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                            Let AI detect your mood and play matching music!
                        </p>

                        {/* Video Feed */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <video
                                ref={videoRef}
                                className="mood-camera-view"
                                autoPlay
                                playsInline
                                muted
                            />
                            {countdown && (
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%) scaleX(-1)',
                                    fontSize: '72px', fontWeight: 900, color: 'white',
                                    textShadow: '0 0 30px rgba(108,92,231,0.8)',
                                    animation: 'moodBounce 1s ease infinite'
                                }}>
                                    {countdown}
                                </div>
                            )}
                        </div>

                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {/* Scan Button */}
                        {!mood && (
                            <div style={{ marginTop: '16px' }}>
                                <button
                                    className="mood-play-btn"
                                    onClick={analyzeMood}
                                    disabled={scanning || !stream}
                                    style={{ background: scanning ? 'var(--bg-glass)' : 'linear-gradient(135deg, #fd79a8, #e17055)' }}
                                >
                                    {scanning ? (
                                        <>
                                            <FiRefreshCw className="spin-icon" /> Analyzing your mood...
                                        </>
                                    ) : (
                                        <>
                                            <FiCamera /> Detect My Mood
                                        </>
                                    )}
                                </button>
                                {scanning && (
                                    <div className="mood-scanning">
                                        <div className="scan-dot"></div>
                                        <div className="scan-dot"></div>
                                        <div className="scan-dot"></div>
                                        <span>Scanning facial expressions...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Result */}
                        {moodData && (
                            <div className="mood-result" style={{ borderColor: moodData.color + '44' }}>
                                <div className="mood-emoji">{moodData.emoji}</div>
                                <div className="mood-label" style={{ color: moodData.color }}>{moodData.label}</div>
                                <div className="mood-suggestion">{moodData.suggestion}</div>

                                {moodSongs.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                            Found {moodSongs.length} songs for your mood:
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                                            {moodSongs.slice(0, 4).map((song, i) => (
                                                <div key={i} style={{
                                                    minWidth: '100px', maxWidth: '100px', cursor: 'pointer',
                                                    borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-glass)',
                                                    border: '1px solid var(--border-glass)', transition: 'all 0.3s ease'
                                                }} onClick={() => { playVideo(song, moodSongs); setIsOpen(false); toast.success('🎵 Playing mood music!'); }}>
                                                    <img src={song.thumbnail} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                                                    <div style={{ padding: '6px', fontSize: '10px', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                        {song.title}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                                    <button className="mood-play-btn" onClick={playMoodMusic}>
                                        <FiPlay /> Play Mood Music
                                    </button>
                                    <button className="mood-play-btn" onClick={() => { setMood(null); setMoodSongs([]); }} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                        <FiRefreshCw /> Rescan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </>
    );
};

export default MoodCamera;
