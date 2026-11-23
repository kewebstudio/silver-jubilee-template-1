import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import JubileeData from "../data/jubileeData";

function RSVP() {
  const [showPopup, setShowPopup] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [wish, setWish] = useState("");

  const { greetings } = JubileeData;

  const textReveal = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const familyReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        delay: 0.25,
        ease: "easeOut",
      },
    },
  };

  const downloadInvitation = () => {
    const link = document.createElement("a");
    link.href = "/images/invitation.png";
    link.download = "Silver-Jubilee-Invitation.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendWish = () => {
    if (!wish.trim()) {
      return;
    }

    const number = greetings.whatsappNumber?.replace(/\D/g, "");

    if (number) {
      const message =
        `A special wish for K. Rajesh & Lakshmi:\n\n${wish}`;

      window.open(
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    setWish("");
    setShowThankYou(true);
  };

  return (
    <section className="rsvp-scene">
      <div className="rsvp-background" />

      {/* HEADING AND WISHES TEXTAREA */}
      <div className="rsvp-greeting-box">
        <motion.h2
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {greetings.heading}
        </motion.h2>

        <motion.textarea
          variants={textReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="Write your lovely wishes here..."
          aria-label="Write your wishes"
        />
      </div>

      {/* SEND WISHES BUTTON */}
      <motion.button
        className="rsvp-send-button"
        variants={textReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={sendWish}
        type="button"
      >
        SEND WISHES
      </motion.button>

      {/* FAMILY MESSAGE */}
      <motion.div
        className="rsvp-family-box"
        variants={familyReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h3>With Love</h3>
        <p>The Konda Family</p>
      </motion.div>

      {/* VIEW INVITATION BUTTON */}
      <motion.button
        className="rsvp-view-button"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowPopup(true)}
        type="button"
      >
        <span>✦</span>
        VIEW INVITATION CARD
      </motion.button>

      {/* THANK YOU POPUP WITH FIREWORKS */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            className="thankyou-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setShowThankYou(false)}
          >
            <motion.div
              className="thankyou-popup"
              initial={{ opacity: 0, scale: 0.65, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 16,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* FIREWORK BURSTS */}
              <div className="thankyou-fireworks fireworks-one">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={`one-${i}`}
                    style={{ "--i": i }}
                  />
                ))}
              </div>

              <div className="thankyou-fireworks fireworks-two">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={`two-${i}`}
                    style={{ "--i": i }}
                  />
                ))}
              </div>

              {/* POPUP CONTENT */}
              <motion.div
                className="thankyou-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
              >
                <div className="thankyou-star">✦</div>

                <h2>Thank You!</h2>

                <p className="thankyou-main">
                  Thank You for Your Wishes
                </p>

                <div className="thankyou-divider">
                  <span>✧</span>
                </div>

                <p className="thankyou-message">
                  Your love and blessings make our Silver Jubilee
                  celebration even more special.
                </p>

                <div className="thankyou-heart">♡</div>

                <p className="thankyou-family">
                  With Love, The Konda Family
                </p>

                <button
                  className="thankyou-close"
                  type="button"
                  onClick={() => setShowThankYou(false)}
                >
                  CLOSE
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INVITATION CARD POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="rsvp-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="rsvp-popup"
              initial={{ opacity: 0, scale: 0.82, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rsvp-popup-close"
                onClick={() => setShowPopup(false)}
                type="button"
                aria-label="Close invitation"
              >
                ×
              </button>

              {/* SPARKLE BURSTS */}
              <div className="rsvp-image-frame">
                <div className="rsvp-burst burst-left">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={`left-${i}`} style={{ "--i": i }} />
                  ))}
                </div>

                <div className="rsvp-burst burst-right">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={`right-${i}`} style={{ "--i": i }} />
                  ))}
                </div>

                <motion.img
                  src="/images/invitation.png"
                  alt="Silver Jubilee Invitation"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                />
              </div>

              {/* DOWNLOAD INVITATION */}
              <motion.button
                className="rsvp-popup-download"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadInvitation}
                type="button"
              >
                ↓ DOWNLOAD INVITATION
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .rsvp-scene {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 620px;
          overflow: hidden;
          isolation: isolate;
          background: #e9d9d2;
          font-family: "Cormorant Garamond", serif;
        }

        .rsvp-background {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url("/images/rsvp.jpg");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        /* GREETING PANEL — MOVED SLIGHTLY DOWN */
        .rsvp-greeting-box {
          position: absolute;
          top: 41%;
          left: 19%;
          width: 62%;
          height: 17%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 0;
          text-align: center;
        }

        .rsvp-greeting-box h2 {
          margin: 0 0 7px;
          color: #755b55;
          font-family: "Great Vibes", cursive;
          font-size: clamp(25px, 6vw, 35px);
          font-weight: 400;
          line-height: 1.2;
        }

        /* TRANSPARENT WISHES TEXTAREA */
        .rsvp-greeting-box textarea {
          display: block;
          width: 100%;
          height: 70%;
          min-height: 45px;
          padding: 5px;
          resize: none;
          outline: none;
          border: none;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          color: #66504b;
          text-align: center;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(14px, 3.5vw, 18px);
          font-weight: 600;
          line-height: 1.5;
        }

        .rsvp-greeting-box textarea::placeholder {
          color: #9b8179;
          opacity: 1;
        }

        /* SEND WISHES BUTTON */
        .rsvp-send-button {
          position: absolute;
          top: 59%;
          left: 29%;
          width: 42%;
          height: 5.1%;
          min-height: 34px;
          padding: 0 8px;
          border: none;
          border-radius: 35px;
          background: transparent;
          color: #fffaf5;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(13px, 3.4vw, 19px);
          font-weight: 700;
          letter-spacing: 1.2px;
          text-shadow: 0 1px 4px rgba(64, 44, 40, 0.65);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        /* FAMILY PANEL */
        .rsvp-family-box {
          position: absolute;
          top: 79%;
          left: 25%;
          width: 50%;
          height: 9.5%;
          transform: translateY(5px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 9px;
          text-align: center;
        }

        .rsvp-family-box h3 {
          margin: 0 0 4px;
          color: #755e58;
          font-family: "Great Vibes", cursive;
          font-size: clamp(23px, 5.5vw, 31px);
          font-weight: 400;
          line-height: 1.1;
        }

        .rsvp-family-box p {
          margin: 0;
          color: #755b55;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(15px, 3.8vw, 21px);
          font-weight: 700;
        }

        /* VIEW INVITATION BUTTON */
        .rsvp-view-button {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1.5%;
          width: max-content;
          max-width: 90%;
          margin-left: auto;
          margin-right: auto;
          z-index: 5;
          padding: 10px 21px;
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 30px;
          background: rgba(91, 72, 70, 0.88);
          color: #fff;
          font-family: "Cormorant Garamond", serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.6px;
          white-space: nowrap;
          box-shadow: 0 3px 14px rgba(54, 36, 34, 0.22);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .rsvp-view-button span {
          margin-right: 7px;
          color: #f5dfbd;
        }

        /* THANK YOU POPUP */

        .thankyou-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(35, 27, 29, 0.84);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
        }

        .thankyou-popup {
          position: relative;
          width: min(100%, 370px);
          padding: 42px 25px 30px;
          overflow: hidden;
          border: 1px solid rgba(216, 189, 145, 0.95);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(255,255,255,0.95),
              transparent 55%
            ),
            linear-gradient(145deg, #fffaf5, #eadbd6);
          text-align: center;
          box-shadow:
            0 15px 60px rgba(0, 0, 0, 0.35),
            inset 0 0 25px rgba(255,255,255,0.5);
        }

        .thankyou-content {
          position: relative;
          z-index: 2;
        }

        .thankyou-star {
          color: #c19b60;
          font-size: 32px;
          margin-bottom: 5px;
          text-shadow: 0 0 12px rgba(219, 183, 116, 0.65);
        }

        .thankyou-popup h2 {
          margin: 0;
          color: #86665d;
          font-family: "Great Vibes", cursive;
          font-size: 52px;
          font-weight: 400;
          line-height: 1.2;
        }

        .thankyou-main {
          margin: 12px 0 10px;
          color: #755b55;
          font-family: "Cormorant Garamond", serif;
          font-size: 21px;
          font-weight: 700;
        }

        .thankyou-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 12px auto;
          color: #bd9870;
          font-size: 20px;
        }

        .thankyou-divider::before,
        .thankyou-divider::after {
          content: "";
          display: block;
          width: 55px;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            #c5a477
          );
        }

        .thankyou-divider::after {
          transform: rotate(180deg);
        }

        .thankyou-message {
          margin: 0 auto;
          max-width: 275px;
          color: #806d66;
          font-family: "Cormorant Garamond", serif;
          font-size: 18px;
          line-height: 1.5;
        }

        .thankyou-heart {
          margin: 13px 0 5px;
          color: #bd9870;
          font-size: 32px;
          line-height: 1;
        }

        .thankyou-family {
          margin: 5px 0 20px;
          color: #806d66;
          font-family: "Great Vibes", cursive;
          font-size: 25px;
        }

        .thankyou-close {
          padding: 10px 34px;
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 30px;
          background: linear-gradient(110deg, #8f7772, #b69a8c);
          color: white;
          font-family: "Cormorant Garamond", serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 4px 13px rgba(91, 72, 70, 0.2);
        }

        /* FIREWORK BURSTS */
        .thankyou-fireworks {
          position: absolute;
          width: 1px;
          height: 1px;
          z-index: 1;
          pointer-events: none;
        }

        .fireworks-one {
          top: 25%;
          left: 8%;
        }

        .fireworks-two {
          top: 68%;
          right: 8%;
        }

        .thankyou-fireworks span {
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 19px;
          border-radius: 5px;
          background: linear-gradient(
            to top,
            transparent,
            #fff8dc,
            #d9ad68
          );
          box-shadow:
            0 0 8px #ffe8b2,
            0 0 15px #e9bd71;
          transform-origin: 50% 0;
          animation: thankyouBlast 1.5s ease-out infinite;
          animation-delay: calc(var(--i) * 0.045s);
        }

        @keyframes thankyouBlast {
          0% {
            opacity: 0;
            transform:
              rotate(calc(var(--i) * 20deg))
              translateY(0)
              scaleY(0);
          }

          35% {
            opacity: 1;
            transform:
              rotate(calc(var(--i) * 20deg))
              translateY(-38px)
              scaleY(1);
          }

          100% {
            opacity: 0;
            transform:
              rotate(calc(var(--i) * 20deg))
              translateY(-75px)
              scaleY(0.2);
          }
        }

        /* INVITATION CARD POPUP */

        .rsvp-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          overflow-y: auto;
          background: rgba(35, 27, 29, 0.88);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .rsvp-popup {
          position: relative;
          width: min(100%, 390px);
          max-height: 96vh;
          overflow-y: auto;
          padding: 14px;
          border: 1px solid rgba(224, 197, 177, 0.9);
          border-radius: 18px;
          background: linear-gradient(145deg, #fffaf5, #eadbd6);
          text-align: center;
          box-shadow: 0 15px 55px rgba(0,0,0,0.3);
        }

        .rsvp-popup-close {
          position: absolute;
          top: 7px;
          right: 8px;
          z-index: 10;
          width: 31px;
          height: 31px;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 250, 245, 0.92);
          color: #765d57;
          font-size: 25px;
          line-height: 1;
          cursor: pointer;
        }

        /* INVITATION IMAGE */
        .rsvp-image-frame {
          position: relative;
          width: 100%;
          max-width: 350px;
          margin: 0 auto 13px;
          padding: 4px;
          border: 1px solid #c9a77e;
          border-radius: 8px;
          background: #fffaf5;
          box-shadow: 0 5px 20px rgba(80, 55, 48, 0.2);
        }

        .rsvp-image-frame img {
          display: block;
          width: 100%;
          max-height: 72vh;
          height: auto;
          object-fit: contain;
          border-radius: 4px;
        }

        /* INVITATION IMAGE FIREWORK SPARKLES */
        .rsvp-burst {
          position: absolute;
          z-index: 3;
          width: 1px;
          height: 1px;
          pointer-events: none;
        }

        .burst-left {
          top: 25%;
          left: 0;
        }

        .burst-right {
          top: 65%;
          right: 0;
        }

        .rsvp-burst span {
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 17px;
          border-radius: 5px;
          background: linear-gradient(
            to top,
            transparent,
            #fff8dc,
            #e7bd70
          );
          box-shadow: 0 0 8px #ffe8b2, 0 0 15px #e9bd71;
          transform-origin: 50% 0;
          transform: rotate(calc(var(--i) * 30deg)) scaleY(0);
          animation: rsvpBurst 0.9s ease-out forwards;
        }

        @keyframes rsvpBurst {
          0% {
            opacity: 0;
            transform: rotate(calc(var(--i) * 30deg)) scaleY(0);
          }

          35% {
            opacity: 1;
            transform: rotate(calc(var(--i) * 30deg)) scaleY(1);
          }

          100% {
            opacity: 0;
            transform: rotate(calc(var(--i) * 30deg)) scaleY(0.2);
          }
        }

        /* DOWNLOAD BUTTON */
        .rsvp-popup-download {
          display: block;
          width: 100%;
          padding: 12px 16px;
          border: 0;
          border-radius: 30px;
          background: linear-gradient(110deg, #8f7772, #b69a8c);
          color: white;
          font-family: "Cormorant Garamond", serif;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
        }

        /* DESKTOP */
        @media (min-width: 700px) {
          .rsvp-greeting-box {
            left: 25%;
            width: 50%;
          }

          .rsvp-family-box {
            left: 32%;
            width: 36%;
          }

          .rsvp-send-button {
            left: 35%;
            width: 30%;
          }
        }

        /* SHORT SCREENS */
        @media (max-height: 700px) {
          .rsvp-greeting-box {
            top: 41%;
            height: 19%;
          }

          .rsvp-family-box {
            top: 80%;
            height: 10%;
          }

          .rsvp-view-button {
            bottom: 1%;
            padding: 7px 16px;
          }

          .rsvp-image-frame img {
            max-height: 65vh;
          }

          .thankyou-popup {
            padding: 28px 22px 22px;
          }

          .thankyou-popup h2 {
            font-size: 44px;
          }

          .thankyou-message {
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .thankyou-fireworks span {
            animation-duration: 2.5s;
          }
        }
      `}</style>
    </section>
  );
}

export default RSVP;