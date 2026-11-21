
import { motion } from "framer-motion";
import JubileeData from "../data/jubileeData";

function LoveStory() {
  const { couple } = JubileeData;

  const textReveal = {
    hidden: { opacity: 0, y: 18 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Original image paths preserved
  const weddingPhoto = "/images/couple-then.jpg";
  const presentPhoto = "/images/couple-2.jpg";

  return (
    <section className="jubilee-love-story">
      {/* Original background artwork */}
      <div className="story-artwork" />

      {/* THEN - Wedding photograph */}
      <motion.div
        className="story-photo story-photo-then"
        initial={{ opacity: 0, x: -25, y: 15, rotate: -5, scale: 0.94 }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: -8, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <img
          src={weddingPhoto}
          alt={`${couple.displayNames} wedding photograph`}
          loading="eager"
          onError={(e) => {
            console.error("THEN image failed:", weddingPhoto);
            e.currentTarget.parentElement.classList.add("photo-error");
          }}
        />
        <span className="photo-error-message">Image not found</span>
      </motion.div>

      {/* NOW - Present-day photograph */}
      <motion.div
        className="story-photo story-photo-now"
        initial={{ opacity: 0, x: 25, y: 15, rotate: 5, scale: 0.94 }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 8, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.5,
          delay: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <img
          src={presentPhoto}
          alt={`${couple.displayNames} present photograph`}
          loading="eager"
          onError={(e) => {
            console.error("NOW image failed:", presentPhoto);
            e.currentTarget.parentElement.classList.add("photo-error");
          }}
        />
        <span className="photo-error-message">Image not found</span>
      </motion.div>

      {/* Story content - kept within the clear centre area */}
      <div className="story-content">
        <motion.span
          className="story-eyebrow"
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          A JOURNEY OF LOVE
        </motion.span>

        <motion.h2
          className="story-heading"
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          Every Love Story
          <br />
          Is Beautiful
        </motion.h2>

        <motion.div
          className="story-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <span>✧</span>
        </motion.div>

        <motion.p
          className="story-description"
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.8}
        >
          From the first beautiful promise to a lifetime
          of shared dreams, laughter and memories,
          their love has only grown stronger with time.
        </motion.p>

        <motion.div
          className="story-couple-names"
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          {couple.displayNames}
        </motion.div>

        <motion.div
          className="story-years"
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1.2}
        >
          {couple.years} YEARS OF LOVE
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="story-scroll"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.9 }}
      >
        <span>CONTINUE THE CELEBRATION</span>

        <motion.span
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
        .jubilee-love-story {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          isolation: isolate;
          background: #302932;
          font-family: 'Montserrat', sans-serif;
        }

        /* Original background artwork - unchanged */
        .story-artwork {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url('/images/story.jpg');
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Photographs - original paths and positions preserved */
        .story-photo {
          position: absolute;
          z-index: 2;
          overflow: hidden;
          background: #e8d9d0;
          border: 1px solid rgba(255, 244, 225, 0.85);
          box-shadow:
            0 3px 10px rgba(50, 30, 20, 0.16),
            inset 0 0 5px rgba(255,255,255,0.25);
          transform-origin: center center;
        }

        .story-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
        }

        .photo-error-message {
          display: none;
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          padding: 8px;
          color: #842b2b;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          background: #f5e9e3;
        }

        .story-photo.photo-error .photo-error-message {
          display: flex;
        }

        .story-photo.photo-error img {
          display: none;
        }

        .story-photo-then {
          top: 23.5%;
          left: 12.5%;
          width: 37%;
          height: 19%;
          border-radius: 3px;
        }

        .story-photo-now {
          top: 25.3%;
          left: 52%;
          width: 35%;
          height: 19%;
          border-radius: 3px;
        }

        /* Compact text layout in the open centre of the artwork */
        .story-content {
          position: absolute;
          top: 48%;
          left: 12%;
          width: 76%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 3;
        }

        .story-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(8px, 2.1vw, 10px);
          font-weight: 800;
          letter-spacing: 0.2em;
          line-height: 1.3;
          color: #775b43;
          text-align: center;
        }

        .story-heading {
          margin: 9px 0 0;
          font-family: 'Great Vibes', cursive;
          font-size: clamp(31px, 7.8vw, 41px);
          font-weight: 400;
          line-height: 1.08;
          color: #513b37;
          text-align: center;
          text-shadow: 0 1px 2px rgba(255,255,255,0.65);
        }

        .story-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 42%;
          margin: 8px auto;
          color: #b28a50;
          font-size: 16px;
          line-height: 1;
        }

        .story-divider::before,
        .story-divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: linear-gradient(
            to right,
            transparent,
            #b28a50,
            transparent
          );
        }

        .story-description {
          width: 100%;
          max-width: 265px;
          margin: 0 auto;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(14px, 3.8vw, 17px);
          font-weight: 600;
          line-height: 1.38;
          color: #51403a;
          text-align: center;
          text-shadow: 0 1px 2px rgba(255,255,255,0.7);
        }

        .story-couple-names {
          margin-top: 13px;
          width: 100%;
          font-family: 'Great Vibes', cursive;
          font-size: clamp(27px, 7vw, 35px);
          font-weight: 400;
          line-height: 1.15;
          color: #17385f;
          text-align: center;
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        }

        .story-years {
          margin-top: 5px;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(8px, 2.1vw, 10px);
          font-weight: 800;
          letter-spacing: 0.17em;
          line-height: 1.4;
          color: #75583e;
          text-align: center;
        }

        /* Scroll prompt */
        .story-scroll {
          position: absolute;
          bottom: 2%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          z-index: 4;
          color: #68513e;
          font-family: 'Montserrat', sans-serif;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
          text-align: center;
        }

        .story-scroll span:last-child {
          font-size: 20px;
          line-height: 1;
        }

        /* Desktop */
        @media (min-width: 700px) {
          .story-photo-then {
            top: 23%;
            left: 28%;
            width: 20%;
            height: 20%;
          }

          .story-photo-now {
            top: 25%;
            left: 52%;
            width: 20%;
            height: 20%;
          }

          .story-content {
            top: 48%;
            left: 25%;
            width: 50%;
          }

          .story-heading {
            font-size: 52px;
          }

          .story-description {
            max-width: 390px;
            font-size: 20px;
          }

          .story-couple-names {
            font-size: 39px;
          }
        }

        /* Short mobile screens */
        @media (max-height: 700px) {
          .story-content {
            top: 47%;
          }

          .story-heading {
            margin-top: 7px;
            font-size: clamp(29px, 7.2vw, 37px);
          }

          .story-divider {
            margin: 6px auto;
          }

          .story-description {
            font-size: 14px;
            line-height: 1.32;
          }

          .story-couple-names {
            margin-top: 9px;
          }

          .story-years {
            margin-top: 3px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .story-scroll {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default LoveStory;
