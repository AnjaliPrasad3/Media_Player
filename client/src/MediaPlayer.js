import React, { useState, useRef, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import './MediaPlayer.css';

// Import the music.gif image
import musicGif from './images/music.gif';

const MediaPlayer = () => {
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    const handleFileChange = (type, event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading(true);
            setError('');
            setMediaUrl(URL.createObjectURL(file)); 
            setMediaType(type);
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsPlaying(false);

        if (mediaType === 'audio' && mediaUrl) {
            audioRef.current.load();
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((e) => {
                setError('Failed to play audio');
                console.error(e);
            });
        } else if (mediaType === 'video' && mediaUrl) {
            videoRef.current.load();
            videoRef.current.play().catch((e) => {
                setError('Failed to play video');
                console.error(e);
            });
        }
    }, [mediaUrl, mediaType]);

    return (
        <div className="media-player">
            <h1>Media Player</h1>
            <div className="controls">
                <label className="file-input">
                    Choose Audio
                    <input type="file" accept="audio/*" onChange={(e) => handleFileChange('audio', e)} />
                </label>
                <label className="file-input">
                    Choose Video
                    <input type="file" accept="video/*" onChange={(e) => handleFileChange('video', e)} />
                </label>
            </div>
            {loading ? (
                <ClipLoader color="#C8ACD6" loading={loading} size={150} />
            ) : (
                <>
                    {error && <div className="error">{error}</div>}
                    {mediaType === 'audio' && (
                        <>
                            <audio ref={audioRef} src={mediaUrl} controls />
                            {isPlaying && <img src={musicGif} alt="music gif" />}
                        </>
                    )}
                    {mediaType === 'video' && <video ref={videoRef} src={mediaUrl} controls />}
                </>
            )}
        </div>
    );
};

export default MediaPlayer;
