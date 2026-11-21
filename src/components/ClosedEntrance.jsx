
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backgroundGlitters = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: `${(i * 47 + 13) % 100}%`,
  top: `${(i * 31 + 7) % 100}%`,
  delay: `${(i % 9) * 0.35}s`,
  duration: `${1.8 + (i % 5) * 0.5}s`,
  size: 2 + (i % 3),
}));

const trailSparkles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 15 + ((i * 37) % 110),
  y: -30 + ((i * 23) % 110),
  delay: `${i * 0.13}s`,
  size: 6 + (i % 3) * 3,
}));

export default function ClosedEntrance({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [gifError, setGifError] = useState(false);

  // Start background music when the visitor taps the invitation button.
  const handleOpen = () => {
    window.dispatchEvent(new Event("jubilee-start-music"));
    setIsOpening(true);
  };

  useEffect(() => {
    if (!isOpening) return;

    // Show Welcome screen before curtains finish opening.
    const timer = setTimeout(() => {
      onOpen?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpening, onOpen]);

  return (
    <main className="jubilee-entrance">
      <style>{`
        .jubilee-entrance {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background: #17151b;
          font-family: 'Montserrat', sans-serif;
        }

        .entrance-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* CLOSED CURTAINS */
        .curtain-panel {
          position: absolute;
          z-index: 5;
          top: 0;
          width: 50%;
          height: 100%;
          background-image: url('/images/closed-curtains.jpg');
          background-repeat: no-repeat;
          background-size: 200% 100%;
          will-change: transform;
        }

        .curtain-left {
          left: 0;
          background-position: left center;
        }

        .curtain-right {
          right: 0;
          background-position: right center;
        }

        /* CURTAIN GLITTER */
        .glitter-layer {
          position: absolute;
          z-index: 7;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .background-glitter {
          position: absolute;
          border-radius: 50%;
          background: #fff9eb;
          box-shadow:
            0 0 5px 2px rgba(255,255,255,.8),
            0 0 13px 4px rgba(232,205,157,.65);
          animation: backgroundTwinkle ease-in-out infinite alternate;
        }

        @keyframes backgroundTwinkle {
          0% {
            opacity: .12;
            transform: scale(.4);
          }
          50% {
            opacity: .65;
          }
          100% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        /* BUTTERFLY */
        .butterfly-flight-layer {
          position: absolute;
          z-index: 9;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .butterfly-flight {
          position: absolute;
          left: 0;
          top: 0;
          width: 195px;
          height: 195px;
          will-change: transform;
        }

        .butterfly-gif {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          filter:
            drop-shadow(0 0 9px rgba(255,255,255,.8))
            drop-shadow(0 0 21px rgba(235,210,174,.65));
        }

        /* SPARKLE TRAIL */
        .sparkle-trail {
          position: absolute;
          inset: -35px;
          pointer-events: none;
        }

        .trail-star {
          position: absolute;
          color: #fff8e8;
          line-height: 1;
          text-shadow:
            0 0 5px #fff,
            0 0 12px #f2dfbd,
            0 0 22px rgba(255,255,255,.9);
          animation: trailStarGlow 1.8s ease-in-out infinite alternate;
        }

        .trail-star.gold {
          color: #e9c78e;
          text-shadow:
            0 0 6px #f9e2b9,
            0 0 15px rgba(234,197,137,.9);
        }

        @keyframes trailStarGlow {
          0% {
            opacity: .15;
            transform: scale(.4) rotate(0deg);
          }
          55% {
            opacity: 1;
            transform: scale(1.3) rotate(45deg);
          }
          100% {
            opacity: .35;
            transform: scale(.7) rotate(80deg);
          }
        }

        /* MAGICAL SPARKLE BURSTS */
        .sparkle-burst {
          position: absolute;
          inset: -20px;
          pointer-events: none;
        }

        .burst-star {
          position: absolute;
          left: 50%;
          top: 50%;
          color: #fff9ed;
          font-size: 17px;
          text-shadow:
            0 0 5px #fff,
            0 0 12px #f0d8ad,
            0 0 22px rgba(255,255,255,.8);
          animation: burstTwinkle 2s ease-in-out infinite;
        }

        @keyframes burstTwinkle {
          0%, 100% {
            opacity: .1;
            transform: translate(0,0) scale(.2);
          }
          45% {
            opacity: 1;
            transform:
              translate(var(--move-x), var(--move-y))
              scale(1.35)
              rotate(90deg);
          }
        }

        /* FOUR-POINT LIGHT FLASHES */
        .magic-flash {
          position: absolute;
          width: 15px;
          height: 15px;
          background: #fff9e9;
          clip-path: polygon(
            50% 0%,
            60% 40%,
            100% 50%,
            60% 60%,
            50% 100%,
            40% 60%,
            0% 50%,
            40% 40%
          );
          filter: drop-shadow(0 0 7px white);
          animation: flashPulse 1.8s ease-in-out infinite;
        }

        @keyframes flashPulse {
          0%, 100% {
            opacity: .15;
            transform: scale(.35) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(45deg);
          }
        }

        /* LOVE GIF */
        .love-gif-reveal {
          position: absolute;
          z-index: 3;
          left: 30%;
          bottom: max(5%, env(safe-area-inset-bottom));
          width: clamp(100px, 19vw, 180px);
          height: auto;
          max-height: 23vh;
          object-fit: contain;
          transform: translateX(-50%);
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          filter:
            drop-shadow(0 0 10px rgba(255,255,255,.8))
            drop-shadow(0 0 22px rgba(232,205,157,.65));
        }

        /* OPEN BUTTON */
        .open-button-position {
          position: absolute;
          z-index: 12;
          left: 0;
          right: 0;
          bottom: max(42px, env(safe-area-inset-bottom));
          display: flex;
          justify-content: center;
          padding: 0 18px;
          pointer-events: none;
        }

        .open-button {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-width: 240px;
          padding: 16px 25px;
          border: 1px solid rgba(244,224,190,.85);
          border-radius: 50px;
          background: rgba(48,40,47,.65);
          color: #fffaf2;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .19em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow:
            0 0 15px rgba(255,255,255,.12),
            0 5px 25px rgba(0,0,0,.2);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: background .3s ease, box-shadow .3s ease;
        }

        .open-button:hover {
          background: rgba(255,255,255,.2);
          box-shadow: 0 0 30px rgba(238,215,180,.4);
        }

        .button-star {
          color: #f1d5a4;
          font-size: 16px;
        }

        /* REVEAL GLOW */
        .opening-flash {
          position: absolute;
          z-index: 11;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(255,255,255,.95),
            rgba(245,225,198,.35) 38%,
            transparent 75%
          );
        }

        @media (max-width: 600px) {
          .love-gif-reveal {
            width: 125px;
            max-height: 18vh;
            bottom: max(6%, env(safe-area-inset-bottom));
          }

          .butterfly-flight {
            width: 155px;
            height: 155px;
          }

          .open-button {
            min-width: 230px;
            padding: 16px 20px;
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .background-glitter,
          .trail-star,
          .burst-star,
          .magic-flash {
            animation-duration: 3s;
          }
        }
      `}</style>

      {/* OPEN SCENE UNDERNEATH */}
      <img
        src="/images/open-curtains.jpg"
        className="entrance-background"
        alt=""
      />

      {/* LOVE GIF */}
      <AnimatePresence>
        {isOpening && (
          <motion.img
            src="/images/love2.gif"
            alt=""
            className="love-gif-reveal"
            initial={{ opacity: 0, scale: 0.65, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: 1.2,
              ease: "easeOut",
            }}
            draggable="false"
          />
        )}
      </AnimatePresence>

      {/* CURTAIN GLITTER */}
      {!isOpening && (
        <div className="glitter-layer">
          {backgroundGlitters.map((particle) => (
            <span
              key={particle.id}
              className="background-glitter"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* BUTTERFLY */}
      {!isOpening && !gifError && (
        <div className="butterfly-flight-layer">
          <motion.div
            className="butterfly-flight"
            initial={{
              x: "calc(100vw - 195px)",
              y: "calc(100svh - 235px)",
              rotate: 15,
            }}
            animate={{
              x: [
                "calc(100vw - 195px)",
                "78vw",
                "57vw",
                "35vw",
                "12vw",
                "-195px",
              ],
              y: [
                "calc(100svh - 235px)",
                "65vh",
                "48vh",
                "32vh",
                "13vh",
                "-195px",
              ],
              rotate: [15, 5, -5, 4, -8, -15],
            }}
            transition={{
              duration: 8,
              times: [0, 0.18, 0.38, 0.58, 0.82, 1],
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          >
            <img
              src="/images/butterfly.gif"
              alt=""
              className="butterfly-gif"
              draggable="false"
              onError={() => {
                setGifError(true);
                console.error("Could not load /images/butterfly.gif");
              }}
            />

            {/* SPARKLE TRAIL */}
            <div className="sparkle-trail">
              {trailSparkles.map((sparkle) => (
                <span
                  key={sparkle.id}
                  className={`trail-star ${
                    sparkle.id % 3 === 0 ? "gold" : ""
                  }`}
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    fontSize: `${sparkle.size}px`,
                    animationDelay: sparkle.delay,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>

            {/* SPARKLE BURSTS */}
            <div className="sparkle-burst">
              {[
                [-25, -30],
                [25, -15],
                [5, 30],
                [-35, 15],
                [35, 35],
              ].map(([x, y], index) => (
                <span
                  key={index}
                  className="burst-star"
                  style={{
                    "--move-x": `${x}px`,
                    "--move-y": `${y}px`,
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  ✧
                </span>
              ))}
            </div>

            {/* MAGICAL FLASHES */}
            <span
              className="magic-flash"
              style={{ left: "5%", top: "10%" }}
            />

            <span
              className="magic-flash"
              style={{
                left: "90%",
                top: "65%",
                animationDelay: ".6s",
              }}
            />

            <span
              className="magic-flash"
              style={{
                left: "15%",
                top: "85%",
                animationDelay: "1.1s",
              }}
            />
          </motion.div>
        </div>
      )}

      {/* BOTTOM-CENTRE BUTTON */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            className="open-button-position"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.7 }}
          >
            <button
              type="button"
              className="open-button"
              onClick={handleOpen}
            >
              <span className="button-star">✧</span>
              Tap to Open Invitation
              <span className="button-star">✧</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT CURTAIN OPENS */}
      <motion.div
        className="curtain-panel curtain-left"
        animate={isOpening ? { x: "-105%" } : { x: "0%" }}
        transition={{
          duration: 5,
          ease: [0.65, 0, 0.35, 1],
        }}
      />

      {/* RIGHT CURTAIN OPENS */}
      <motion.div
        className="curtain-panel curtain-right"
        animate={isOpening ? { x: "105%" } : { x: "0%" }}
        transition={{
          duration: 5,
          ease: [0.65, 0, 0.35, 1],
        }}
      />

      {/* MAGICAL REVEAL LIGHT */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="opening-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.3 }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
