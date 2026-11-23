
import { motion } from "framer-motion";
import JubileeData from "../data/jubileeData";

function Welcome() {
  const { couple } = JubileeData;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="jubilee-welcome">
      <div className="welcome-artwork" />

      {/* COUPLE PHOTO */}
      <div className="welcome-photo-position">
        <motion.div
          className="welcome-photo"
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.8,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            src="/images/couple-now.jpg"
            alt={couple.displayNames}
          />
        </motion.div>
      </div>

      {/* COUPLE NAMES RIBBON */}
      <motion.div
        className="welcome-ribbon"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <svg
          viewBox="0 0 350 90"
          preserveAspectRatio="none"
          className="ribbon-svg"
          role="img"
          aria-label={couple.displayNames}
        >
          <defs>
            <path
              id="jubilee-ribbon-curve"
              d="M 48 52 Q 175 27 302 52"
            />
          </defs>

          <text className="ribbon-name">
            <textPath
              href="#jubilee-ribbon-curve"
              startOffset="50%"
              textAnchor="middle"
            >
              {couple.displayNames}
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* ANNIVERSARY PODIUM */}
      <div className="welcome-podium">
        <motion.div
          className="podium-number-wrap"
          variants={fadeUp}
          custom={1.6}
          initial="hidden"
          animate="visible"
        >
          <span className="podium-number">
            {couple.years}
          </span>
        </motion.div>

        <motion.span
          className="podium-title"
          variants={fadeUp}
          custom={1.9}
          initial="hidden"
          animate="visible"
        >
          {couple.anniversary}
        </motion.span>

        <motion.span
          className="podium-tagline"
          variants={fadeUp}
          custom={2.2}
          initial="hidden"
          animate="visible"
        >
          {couple.title}
        </motion.span>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        className="welcome-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1.2 }}
      >
        <span>SCROLL TO EXPLORE</span>

        <motion.span
          className="scroll-arrow"
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ⌄
        </motion.span>
      </motion.div>

      <style>{`
        .jubilee-welcome {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          min-height: 0;
          overflow: hidden;
          isolation: isolate;
          background: #302932;
          font-family: 'Montserrat', sans-serif;
          contain: layout paint;
          box-sizing: border-box;
        }

        .jubilee-welcome *,
        .jubilee-welcome *::before,
        .jubilee-welcome *::after {
          box-sizing: border-box;
        }

        /* BACKGROUND */

        .welcome-artwork {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url('/images/welcome.jpg');
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* VERTICAL OVAL COUPLE PHOTO */

        .welcome-photo-position {
          position: absolute;
          top: 31%;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 2;
          pointer-events: none;
        }

        .welcome-photo {
          width: clamp(138px, min(61vw, 32vh), 290px);
          aspect-ratio: 0.86 / 1;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 50%;
          background: transparent;
          box-shadow:
            0 0 0 1px rgba(246, 220, 178, 0.55),
            0 5px 20px rgba(0, 0, 0, 0.12);
        }

        .welcome-photo img {
          display: block;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: center 36%;
          border-radius: 50%;
        }

        /* NAMES RIBBON - MOVED UP */

        .welcome-ribbon {
          position: absolute;
          top: 63.5%;
          left: 0;
          width: 100%;
          height: clamp(55px, 9.5vh, 90px);
          z-index: 5;
          pointer-events: none;
        }

        .ribbon-svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .ribbon-name {
          fill: #102b55;
          font-family: 'Great Vibes', cursive;
          font-size: clamp(21px, 7.2vw, 35px);
          font-weight: 700;
          paint-order: stroke;
          stroke: rgba(255, 255, 255, 0.95);
          stroke-width: 0.8px;
          stroke-linejoin: round;
        }

        /* ANNIVERSARY PODIUM - MOVED UP */

        .welcome-podium {
          position: absolute;
          top: 72%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 3;
          pointer-events: none;
          padding-inline: 12px;
        }

        .podium-number-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .podium-number {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(43px, min(17vw, 12vh), 84px);
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: -3px;
          color: #17385f;
          text-shadow:
            0 1px 0 #fff9ed,
            0 2px 3px rgba(255,255,255,0.85),
            0 4px 8px rgba(45,30,20,0.18);
        }

        .podium-title {
          margin-top: clamp(3px, 0.8vh, 6px);
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(11px, 4.2vw, 20px);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #142541;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
          max-width: 100%;
          overflow-wrap: anywhere;
          line-height: 1.15;
        }

        .podium-tagline {
          margin-top: 4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 20px);
          font-weight: 700;
          color: #263957;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
          max-width: 100%;
          overflow-wrap: anywhere;
          line-height: 1.2;
        }

        /* SCROLL INDICATOR */

        .welcome-scroll {
          position: absolute;
          bottom: max(0.8%, env(safe-area-inset-bottom));
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          z-index: 6;
          color: #142541;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(6px, 1.8vw, 8px);
          font-weight: 800;
          letter-spacing: 0.14em;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
          pointer-events: none;
          text-align: center;
          padding-inline: 8px;
        }

        .scroll-arrow {
          display: block;
          font-size: clamp(17px, 5vw, 22px);
          line-height: 1;
          color: #142541;
        }

        /* SHORT SCREENS */

        @media (max-height: 650px) {
          .welcome-photo {
            width: clamp(115px, min(54vw, 27vh), 220px);
          }

          .welcome-ribbon {
            top: 62%;
            height: 55px;
          }

          .welcome-podium {
            top: 73%;
          }

          .podium-number {
            font-size: clamp(40px, min(15vw, 10vh), 65px);
          }

          .welcome-scroll {
            bottom: max(0.5%, env(safe-area-inset-bottom));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .welcome-scroll,
          .scroll-arrow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Welcome;
