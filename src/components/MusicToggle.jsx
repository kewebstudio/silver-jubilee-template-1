import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MusicToggle() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;
    audio.loop = true;

    const startMusic = async () => {
      if (audioRef.current && !audioRef.current.paused) return;

      try {
        await audio.play();
        setIsPlaying(true);
        setHasStarted(true);
      } catch (error) {
        console.error("Music playback failed:", error);
      }
    };

    window.addEventListener("jubilee-start-music", startMusic);

    return () => {
      window.removeEventListener("jubilee-start-music", startMusic);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        setHasStarted(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Music toggle failed:", error);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/wedding-music.mp3"
        preload="none"
        loop
      />

      {hasStarted && (
        <motion.button
          type="button"
          className="jubilee-music-toggle"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={isPlaying ? "Pause music" : "Play music"}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
        >
          <span className={isPlaying ? "music-icon playing" : "music-icon"}>
            {isPlaying ? "♫" : "♪"}
          </span>

          <span className="music-label">
            {isPlaying ? "MUSIC ON" : "MUSIC OFF"}
          </span>
        </motion.button>
      )}

      <style>{`
        .jubilee-music-toggle {
          position: fixed;
          z-index: 1000;
          right: 18px;
          bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 11px 16px;
          border: 1px solid rgba(238, 215, 184, .8);
          border-radius: 40px;
          background: rgba(49, 39, 47, .82);
          color: #fff8ec;
          box-shadow: 0 4px 20px rgba(0, 0, 0, .2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .music-icon {
          font-size: 22px;
          line-height: 1;
          color: #e8cda7;
        }

        .music-icon.playing {
          animation: musicPulse 1s ease-in-out infinite alternate;
        }

        .music-label {
          font-family: Montserrat, sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.5px;
        }

        @keyframes musicPulse {
          from {
            transform: scale(.85);
          }
          to {
            transform: scale(1.2);
          }
        }

        @media (max-width: 600px) {
          .jubilee-music-toggle {
            right: 14px;
            bottom: 18px;
            padding: 10px 13px;
          }
        }
      `}</style>
    </>
  );
}