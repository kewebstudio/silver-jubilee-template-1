
import { useMemo } from "react";
import { motion } from "framer-motion";
import JubileeData from "../data/jubileeData";

function Venue() {
  const { event } = JubileeData;

  const sparkles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 37) % 92)}%`,
        top: `${5 + ((i * 29) % 88)}%`,
        delay: `${(i % 8) * 0.35}s`,
      })),
    []
  );

  const reveal = {
    hidden: { opacity: 0, y: 15 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="jubilee-venue">
      <div className="venue-background" />

      <div className="venue-sparkles" aria-hidden="true">
        {sparkles.map((item) => (
          <span
            key={item.id}
            className="venue-sparkle"
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Venue details inside the decorative white plaque */}
      <div className="venue-plaque-content">
        <motion.div
          className="venue-eyebrow"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          OUR SPECIAL VENUE
        </motion.div>

        <motion.h2
          className="venue-heading"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          The Celebration Venue
        </motion.h2>

        <motion.div
          className="venue-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          <span />
          ✦
          <span />
        </motion.div>

        <motion.div
          className="venue-name"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.65}
        >
          {event.venue}
        </motion.div>

        <motion.div
          className="venue-address"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.8}
        >
          {event.address}
        </motion.div>
      </div>

      {/* Save the Date box - positioned lower below the location pin */}
      <motion.div
        className="venue-event-card"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
      >
        <div className="venue-event-label">SAVE THE DATE</div>

        <div className="venue-event-date">
          {event.day}, {event.date}
        </div>

        <div className="venue-event-time">
          {event.time}
        </div>

        {event.googleMapsLink && (
          <a
            className="venue-map-link"
            href={event.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            GET DIRECTIONS ↗
          </a>
        )}
      </motion.div>

      <motion.div
        className="venue-footer"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 1.3 }}
      >
        WE LOOK FORWARD TO CELEBRATING WITH YOU
      </motion.div>

      <style>{`
        .jubilee-venue {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          isolation: isolate;
          background: #b7a9aa;
          font-family: 'Montserrat', sans-serif;
        }

        .venue-background {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image: url('/images/venue.jpg');
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        .venue-sparkles {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .venue-sparkle {
          position: absolute;
          color: #fffaf0;
          font-size: 11px;
          text-shadow: 0 0 8px #fff, 0 0 14px #eacb91;
          animation: venueTwinkle 2.6s ease-in-out infinite;
        }

        @keyframes venueTwinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.65) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.35) rotate(45deg);
          }
        }

        .venue-plaque-content {
          position: absolute;
          z-index: 3;
          top: 30.5%;
          left: 20%;
          width: 60%;
          height: 16%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5px 10px;
          text-align: center;
        }

        .venue-eyebrow {
          color: #80664d;
          font-size: clamp(8px, 2vw, 10px);
          font-weight: 900;
          letter-spacing: 0.15em;
          line-height: 1.2;
        }

        .venue-heading {
          margin: 4px 0 0;
          color: #493644;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 5vw, 25px);
          font-weight: 900;
          line-height: 1.08;
          text-shadow: 0 1px 2px #fff;
        }

        .venue-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 4px 0;
          color: #b68c55;
          font-size: 11px;
        }

        .venue-divider span {
          width: 28px;
          height: 1px;
          background: #bd9a6b;
        }

        .venue-name {
          color: #173d68;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 5.5vw, 28px);
          font-weight: 900;
          line-height: 1.05;
          text-shadow: 0 1px 2px #fff;
        }

        .venue-address {
          margin-top: 3px;
          color: #493644;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(12px, 3.3vw, 16px);
          font-weight: 800;
          line-height: 1.1;
        }

        /* Save the Date - moved noticeably further down */
        .venue-event-card {
          position: absolute;
          z-index: 3;
          top: 66%;
          left: 22%;
          width: 56%;
          min-height: 9%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 7px 9px;
          text-align: center;
          background: rgba(255, 248, 238, 0.92);
          border: 1px solid rgba(191, 151, 102, 0.7);
          border-radius: 14px;
          box-shadow:
            0 2px 12px rgba(91, 63, 50, 0.12),
            inset 0 0 8px rgba(255,255,255,0.8);
        }

        .venue-event-label {
          color: #8b6a49;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .venue-event-date {
          margin-top: 4px;
          color: #493644;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(14px, 3.8vw, 18px);
          font-weight: 900;
          line-height: 1.2;
        }

        .venue-event-time {
          margin-top: 3px;
          color: #173d68;
          font-size: clamp(10px, 2.8vw, 12px);
          font-weight: 900;
        }

        .venue-map-link {
          margin-top: 5px;
          color: #173d68;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-decoration: none;
        }

        .venue-footer {
          position: absolute;
          z-index: 3;
          bottom: 3%;
          left: 5%;
          width: 90%;
          color: #70563f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-align: center;
          text-shadow: 0 1px 3px #fff;
        }

        @media (min-width: 700px) {
          .venue-plaque-content {
            top: 30.5%;
            left: 27%;
            width: 46%;
            height: 16%;
          }

          .venue-heading {
            font-size: 32px;
          }

          .venue-name {
            font-size: 35px;
          }

          .venue-address {
            font-size: 19px;
          }

          .venue-event-card {
            top: 66%;
            left: 35%;
            width: 30%;
          }
        }

        @media (max-height: 700px) {
          .venue-plaque-content {
            top: 30.5%;
            height: 16%;
            padding: 4px 8px;
          }

          .venue-heading {
            font-size: clamp(17px, 4.8vw, 23px);
          }

          .venue-name {
            font-size: clamp(19px, 5.2vw, 25px);
          }

          .venue-divider {
            margin: 3px 0;
          }

          .venue-event-card {
            top: 78%;
            min-height: 9%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .venue-sparkle {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Venue;
