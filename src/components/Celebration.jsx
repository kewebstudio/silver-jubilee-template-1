
import { useMemo } from "react";
import { motion } from "framer-motion";
import JubileeData from "../data/jubileeData";

function Celebration() {
  const { couple, event, programme } = JubileeData;

  const events = useMemo(() => {
    const items = programme || [];

    return [
      {
        title: items[0]?.title || "Grand Couple Entry",
        time: items[0]?.time || "6:00 PM",
      },
      {
        title: items[1]?.title || "Cake Cutting",
        time: items[1]?.time || "6:30 PM",
      },
      {
        title: items[2]?.title || "Family Moments",
        time: items[2]?.time || "7:00 PM",
      },
      {
        title: items[3]?.title || "Games & Entertainment",
        time: items[3]?.time || "7:30 PM",
      },
      {
        title: items[4]?.title || "Dinner & Celebration",
        time: items[4]?.time || "8:30 PM",
      },
    ];
  }, [programme]);

  const sparkles = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    left: `${4 + ((i * 37) % 92)}%`,
    top: `${5 + ((i * 29) % 88)}%`,
    delay: `${(i % 8) * 0.35}s`,
    size: `${8 + (i % 4) * 2}px`,
  }));

  const reveal = {
    hidden: { opacity: 0, y: 18 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const rowReveal = {
    hidden: { opacity: 0, y: 18, scale: 0.94 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="jubilee-celebration">

      <div className="celebration-background" />

      {/* Floating sparkles */}
      <div className="celebration-sparkles" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="celebration-sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              animationDelay: sparkle.delay,
              fontSize: sparkle.size,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Celebration burst */}
      <div className="celebration-burst" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <motion.span
            key={i}
            className="burst-star"
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            whileInView={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: Math.cos((i * 360 / 28) * Math.PI / 180) * 115,
              y: Math.sin((i * 360 / 28) * Math.PI / 180) * 115,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1.9,
              delay: 0.8 + (i % 6) * 0.12,
              ease: "easeOut",
            }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Heading inside the white decorative panel */}
      <div className="celebration-heading-area">

        <motion.div
          className="celebration-eyebrow"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          OUR SPECIAL CELEBRATION
        </motion.div>

        <motion.h2
          className="celebration-title"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          A Celebration of Love
        </motion.h2>

        <motion.div
          className="celebration-names"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.65}
        >
          {couple.displayNames}
        </motion.div>

        <motion.div
          className="celebration-anniversary"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.85}
        >
          {couple.years} YEARS OF TOGETHERNESS
        </motion.div>

        <motion.div
          className="celebration-date"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          {event.day}, {event.date}
        </motion.div>

      </div>

      {/* Programme panels */}
      <div className="celebration-programme">

        {events.slice(0, 4).map((item, index) => (
          <motion.div
            key={index}
            className={`celebration-row celebration-row-${index + 1}`}
            variants={rowReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.3 + index * 0.2}
          >
            <div className="celebration-left">
              <span className="row-value">
                {item.title}
              </span>
            </div>

            <div className="celebration-right">
              <span className="row-value row-time">
                {item.time}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Dinner immediately below the gift decoration */}
        <motion.div
          className="celebration-final-event"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1.2}
        >
          <span className="final-event-title">
            {events[4].title}
          </span>

          <span className="final-event-time">
            {events[4].time}
          </span>
        </motion.div>

      </div>

      {/* Bottom message */}
      <motion.div
        className="celebration-bottom"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span>MADE WITH LOVE</span>

        <motion.span
          className="celebration-heart"
          animate={{
            scale: [1, 1.2, 1],
            textShadow: [
              "0 0 3px #fff",
              "0 0 16px #fff",
              "0 0 3px #fff",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          ♡
        </motion.span>
      </motion.div>

      <style>{`
        .jubilee-celebration {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          isolation: isolate;
          background: #b7a9aa;
          font-family: 'Montserrat', sans-serif;
        }

        .celebration-background {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image: url('/images/party.jpg');
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        /* Sparkles */
        .celebration-sparkles {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .celebration-sparkle {
          position: absolute;
          color: #fff9e9;
          text-shadow:
            0 0 5px #fff,
            0 0 12px #f3d7a7;
          animation: celebrationTwinkle 2.6s ease-in-out infinite;
        }

        @keyframes celebrationTwinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.6) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.4) rotate(45deg);
          }
        }

        /* Burst */
        .celebration-burst {
          position: absolute;
          z-index: 1;
          left: 50%;
          top: 51%;
          pointer-events: none;
        }

        .burst-star {
          position: absolute;
          color: #fff;
          font-size: 14px;
          text-shadow:
            0 0 6px #fff,
            0 0 15px #eacb91;
        }

        /* Main heading */
        .celebration-heading-area {
          position: absolute;
          z-index: 2;
          top: 25.5%;
          left: 17%;
          width: 66%;
          height: 15%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          text-align: center;
        }

        .celebration-eyebrow {
          color: #80664d;
          font-size: clamp(8px, 2vw, 10px);
          font-weight: 900;
          letter-spacing: 0.15em;
          line-height: 1.3;
        }

        .celebration-title {
          margin: 5px 0 0;
          color: #493644;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 5.7vw, 29px);
          font-weight: 900;
          line-height: 1.12;
          text-align: center;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
        }

        .celebration-names {
          margin-top: 5px;
          color: #173d68;
          font-family: 'Great Vibes', cursive;
          font-size: clamp(25px, 6.5vw, 34px);
          font-weight: 600;
          line-height: 1.1;
          white-space: nowrap;
          text-align: center;
          text-shadow: 0 1px 3px rgba(255,255,255,0.95);
        }

        .celebration-anniversary {
          margin-top: 4px;
          color: #74583e;
          font-size: clamp(8px, 1.9vw, 10px);
          font-weight: 900;
          letter-spacing: 0.13em;
          line-height: 1.3;
        }

        .celebration-date {
          margin-top: 4px;
          color: #51404a;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(12px, 3.2vw, 16px);
          font-weight: 900;
          line-height: 1.2;
        }

        /* Programme */
        .celebration-programme {
          position: absolute;
          z-index: 3;
          inset: 0;
          pointer-events: none;
        }

        .celebration-row {
          position: absolute;
          left: 16%;
          width: 68%;
          height: 4.2%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 17%;
          text-align: center;
        }

        .celebration-row-1 {
          top: 52.5%;
        }

        .celebration-row-2 {
          top: 58.7%;
        }

        .celebration-row-3 {
          top: 64.9%;
        }

        .celebration-row-4 {
          top: 71.1%;
        }

        .celebration-left,
        .celebration-right {
          min-width: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
        }

        .row-value {
          display: block;
          width: 100%;
          color: #40303c;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(11px, 3vw, 15px);
          font-weight: 900;
          line-height: 1.15;
          text-align: center;
          white-space: normal;
          overflow-wrap: anywhere;
          text-shadow:
            0 1px 1px rgba(255,255,255,0.95),
            0 0 2px rgba(255,255,255,0.5);
        }

        .row-time {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(10px, 2.7vw, 13px);
          font-weight: 900;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        /* Dinner - immediately below the gift decoration */
        .celebration-final-event {
          position: absolute;
          top: 84%;
          left: 15%;
          width: 70%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .final-event-title {
          color: #40303c;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(21px, 5.5vw, 27px);
          font-weight: 900;
          line-height: 1.12;
          text-shadow: 0 1px 3px #fff;
        }

        .final-event-time {
          margin-top: 5px;
          color: #60462f;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(13px, 3.4vw, 16px);
          font-weight: 900;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 3px #fff;
        }

        /* Bottom message */
        .celebration-bottom {
          position: absolute;
          z-index: 4;
          left: 0;
          bottom: 2%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: #70563f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-align: center;
          text-shadow: 0 1px 3px #fff;
        }

        .celebration-heart {
          color: #fff;
          font-size: 23px;
          line-height: 1;
        }

        /* Desktop */
        @media (min-width: 700px) {
          .celebration-heading-area {
            top: 25.5%;
            left: 25%;
            width: 50%;
            height: 15%;
          }

          .celebration-title {
            font-size: 34px;
          }

          .celebration-names {
            font-size: 42px;
          }

          .celebration-row {
            left: 16%;
            width: 68%;
          }

          .row-value {
            font-size: 18px;
          }

          .row-time {
            font-size: 14px;
          }

          .final-event-title {
            font-size: 29px;
          }

          .final-event-time {
            font-size: 17px;
          }
        }

        /* Short mobile screens */
        @media (max-height: 700px) {
          .celebration-heading-area {
            top: 25.5%;
            height: 15%;
          }

          .celebration-title {
            font-size: clamp(18px, 5vw, 25px);
          }

          .celebration-names {
            font-size: clamp(22px, 6vw, 30px);
          }

          .celebration-anniversary,
          .celebration-date {
            margin-top: 3px;
          }

          .celebration-final-event {
            top: 84%;
          }

          .final-event-title {
            font-size: clamp(19px, 5.2vw, 24px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .celebration-sparkle {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Celebration;
