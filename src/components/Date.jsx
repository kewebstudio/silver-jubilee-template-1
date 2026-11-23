
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JubileeData from "../data/jubileeData";

function DateScene() {
  const { event, countdown } = JubileeData;

  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const canvasRef = useRef(null);
  const scratchingRef = useRef(false);
  const originalPixelsRef = useRef([]);
  const revealStartedRef = useRef(false);

  const targetDate = useMemo(
    () => new window.Date(countdown.targetDate),
    [countdown.targetDate]
  );

  // LOCK SCROLLING UNTIL THE SCRATCH CARD IS REVEALED
  useEffect(() => {
    if (revealed) return;

    const section = document.querySelector(".jubilee-date-scene");
    if (!section) return;

    const dateIsLockedInPlace = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight =
        document.querySelector(".jubilee-app")?.clientHeight ||
        window.innerHeight;

      return rect.top <= 2 && rect.bottom >= viewportHeight - 2;
    };

    const preventWheel = (event) => {
      if (dateIsLockedInPlace()) event.preventDefault();
    };

    const preventTouchMove = (event) => {
      if (dateIsLockedInPlace()) {
        if (event.target.closest?.(".scratch-canvas")) return;
        event.preventDefault();
      }
    };

    const preventKeyboardScroll = (event) => {
      if (!dateIsLockedInPlace()) return;

      const keys = [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        " ",
        "Home",
        "End",
      ];

      if (keys.includes(event.key)) event.preventDefault();
    };

    window.addEventListener("wheel", preventWheel, {
      passive: false,
      capture: true,
    });

    window.addEventListener("touchmove", preventTouchMove, {
      passive: false,
      capture: true,
    });

    window.addEventListener("keydown", preventKeyboardScroll, true);

    return () => {
      window.removeEventListener("wheel", preventWheel, true);
      window.removeEventListener("touchmove", preventTouchMove, true);
      window.removeEventListener("keydown", preventKeyboardScroll, true);
    };
  }, [revealed]);

  // DRAW SILVER GLITTER HEART
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 240;
    const height = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const heartPath = new Path2D();

    heartPath.moveTo(120, 207);
    heartPath.bezierCurveTo(105, 195, 15, 137, 12, 76);
    heartPath.bezierCurveTo(9, 22, 65, 4, 94, 34);
    heartPath.bezierCurveTo(105, 44, 114, 54, 120, 62);
    heartPath.bezierCurveTo(126, 54, 135, 44, 146, 34);
    heartPath.bezierCurveTo(175, 4, 231, 22, 228, 76);
    heartPath.bezierCurveTo(225, 137, 135, 195, 120, 207);
    heartPath.closePath();

    ctx.save();
    ctx.clip(heartPath);

    const silver = ctx.createLinearGradient(15, 10, 225, 210);

    silver.addColorStop(0, "#ffffff");
    silver.addColorStop(0.14, "#bfc2cc");
    silver.addColorStop(0.28, "#f9f8ff");
    silver.addColorStop(0.45, "#858b9a");
    silver.addColorStop(0.59, "#f5f3f9");
    silver.addColorStop(0.76, "#a7aab7");
    silver.addColorStop(0.9, "#ffffff");
    silver.addColorStop(1, "#898e9c");

    ctx.fillStyle = silver;
    ctx.fillRect(0, 0, width, height);

    // Fine glitter
    for (let i = 0; i < 650; i++) {
      const x = (i * 73) % width;
      const y = (i * 47) % height;
      const radius = 0.5 + (i % 4) * 0.35;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      ctx.fillStyle =
        i % 3 === 0
          ? "rgba(255,255,255,0.98)"
          : "rgba(225,225,239,0.85)";

      ctx.fill();
    }

    // Larger glitter stars
    for (let i = 0; i < 40; i++) {
      const x = (i * 61 + 17) % width;
      const y = (i * 83 + 13) % height;

      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = "rgba(255,255,255,0.98)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.moveTo(0, -4);
      ctx.lineTo(0, 4);
      ctx.stroke();

      ctx.restore();
    }

    const shine = ctx.createLinearGradient(20, 0, 220, 180);

    shine.addColorStop(0, "rgba(255,255,255,0.4)");
    shine.addColorStop(0.5, "rgba(255,255,255,0)");
    shine.addColorStop(1, "rgba(255,255,255,0.25)");

    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.98)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 9;
    ctx.stroke(heartPath);

    const image = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const pixels = [];

    for (let i = 3; i < image.data.length; i += 4) {
      if (image.data[i] > 0) pixels.push(i);
    }

    originalPixelsRef.current = pixels;
  }, []);

  // FINISH SCRATCH REVEAL
  const finishReveal = () => {
    if (revealStartedRef.current) return;

    revealStartedRef.current = true;
    scratchingRef.current = false;
    setRevealed(true);
  };

  // SCRATCH CALCULATION
  const scratchAt = (event) => {
    const canvas = canvasRef.current;

    if (
      !canvas ||
      !scratchingRef.current ||
      revealStartedRef.current
    ) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 240;
    const y = ((event.clientY - rect.top) / rect.height) * 220;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const image = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const originalPixels = originalPixelsRef.current;

    let erased = 0;
    let checked = 0;

    for (let i = 0; i < originalPixels.length; i += 8) {
      checked++;

      if (image.data[originalPixels[i]] < 30) erased++;
    }

    const progress = checked > 0 ? erased / checked : 0;

    if (progress >= 0.42) finishReveal();
  };

  const handlePointerDown = (event) => {
    if (revealed || revealStartedRef.current) return;

    scratchingRef.current = true;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional
    }

    scratchAt(event);
  };

  const handlePointerMove = (event) => {
    if (scratchingRef.current) scratchAt(event);
  };

  const handlePointerUp = () => {
    scratchingRef.current = false;
  };

  // COUNTDOWN
  useEffect(() => {
    if (!revealed || !countdown.enabled) return;

    const updateCountdown = () => {
      const difference =
        targetDate.getTime() - window.Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: "000",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      setTimeLeft({
        days: String(
          Math.floor(difference / 86400000)
        ).padStart(3, "0"),

        hours: String(
          Math.floor((difference / 3600000) % 24)
        ).padStart(2, "0"),

        minutes: String(
          Math.floor((difference / 60000) % 60)
        ).padStart(2, "0"),

        seconds: String(
          Math.floor((difference / 1000) % 60)
        ).padStart(2, "0"),
      });
    };

    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [revealed, countdown.enabled, targetDate]);

  // CALENDAR DATA
  const calendarData = useMemo(() => {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const date = targetDate.getDate();

    const firstDay = new window.Date(year, month, 1).getDay();

    const daysInMonth = new window.Date(
      year,
      month + 1,
      0
    ).getDate();

    const offset = (firstDay + 6) % 7;

    const cells = [
      ...Array(offset).fill(null),
      ...Array.from(
        { length: daysInMonth },
        (_, i) => i + 1
      ),
    ];

    while (cells.length % 7 !== 0) cells.push(null);

    return {
      year,
      date,
      monthName: targetDate.toLocaleString("en-US", {
        month: "long",
      }),
      cells,
    };
  }, [targetDate]);

  const particles = Array.from(
    { length: 48 },
    (_, index) => ({
      id: index,
      angle: (index * 360) / 48,
      distance: 75 + (index % 5) * 20,
      delay: (index % 8) * 0.035,
      size: 3 + (index % 4) * 1.5,
    })
  );

  return (
    <section
      className={`jubilee-date-scene ${
        revealed ? "date-revealed" : "date-locked"
      }`}
    >
      <div className="date-artwork" />

      <div className="date-background-sparkles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="background-sparkle"
            style={{
              left: `${5 + ((i * 17) % 90)}%`,
              top: `${8 + ((i * 23) % 82)}%`,
              animationDelay: `${(i % 6) * 0.4}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* SCRATCH HEART */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="scratch-card-position"
            initial={{ opacity: 0, scale: 0.65, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 1.5,
              rotate: 15,
              filter: "blur(10px)",
              transition: { duration: 0.75 },
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="scratch-heart">
              <div className="heart-inner">
                <span className="heart-glitter">✧ ✦ ✧</span>
                <span className="heart-title">Our Special</span>
                <span className="heart-date">DAY</span>
                <span className="heart-scratch-line" />
                <span className="heart-tap">SCRATCH TO REVEAL</span>
              </div>

              <canvas
                ref={canvasRef}
                className="scratch-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onLostPointerCapture={handlePointerUp}
                aria-label="Scratch the silver glitter heart to reveal the date"
              />
            </div>

            <motion.div
              className="scratch-instruction"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SCRATCH THE HEART TO REVEAL
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIREWORKS */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="date-fireworks"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            aria-hidden="true"
          >
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="firework-particle"
                style={{
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x:
                    Math.cos(
                      (particle.angle * Math.PI) / 180
                    ) * particle.distance,
                  y:
                    Math.sin(
                      (particle.angle * Math.PI) / 180
                    ) * particle.distance,
                  scale: [0, 1.4, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.3,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CALENDAR */}
      <AnimatePresence>
        {revealed && (
          <div className="calendar-position">
            <motion.div
              className="revealed-calendar"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.1,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="calendar-month"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {calendarData.monthName} {calendarData.year}
              </motion.div>

              <div className="calendar-weekdays">
                {["M", "T", "W", "T", "F", "S", "S"].map(
                  (day, index) => (
                    <span key={index}>{day}</span>
                  )
                )}
              </div>

              <div className="calendar-days">
                {calendarData.cells.map((day, index) => (
                  <span
                    key={index}
                    className={
                      day === calendarData.date
                        ? "calendar-day selected-day"
                        : "calendar-day"
                    }
                  >
                    {day || ""}

                    {day === calendarData.date && (
                      <motion.span
                        className="selected-day-glow"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAVE THE DATE */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="date-reveal-details"
            initial={{ opacity: 0, scale: 0.75, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="date-small-heading">
              SAVE THE DATE
            </span>

            <motion.div
              className="date-main-text"
              animate={{
                textShadow: [
                  "0 0 3px rgba(255,255,255,0.4)",
                  "0 0 14px rgba(255,255,255,0.95)",
                  "0 0 3px rgba(255,255,255,0.4)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {event.date}
            </motion.div>

            <div className="date-event-time">
              {event.day} <span>✧</span> {event.time}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COUNTDOWN */}
      {revealed && countdown.enabled && (
        <motion.div
          className="date-countdown"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {[
            { value: timeLeft.days, label: "DAYS" },
            { value: timeLeft.hours, label: "HOURS" },
            { value: timeLeft.minutes, label: "MINUTES" },
            { value: timeLeft.seconds, label: "SECONDS" },
          ].map((item) => (
            <div className="countdown-item" key={item.label}>
              <span className="countdown-value">
                {item.value}
              </span>
              <span className="countdown-label">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* ANNIVERSARY MESSAGE */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="date-bottom-message"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <span>25 YEARS OF LOVE</span>
            <span className="date-bottom-heart">♡</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCROLL PROMPT */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="date-scroll-prompt"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.9 }}
          >
            <span>CONTINUE THE CELEBRATION</span>

            <motion.span
              className="date-scroll-arrow"
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ⌄
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .jubilee-date-scene {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          min-height: 0;
          overflow: hidden;
          isolation: isolate;
          background: #a9a0a4;
          font-family: 'Montserrat', sans-serif;
        }

        .date-artwork {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: url('/images/date.jpg');
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        .date-background-sparkles {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .background-sparkle {
          position: absolute;
          color: #fff8e8;
          font-size: 13px;
          text-shadow: 0 0 8px #fff, 0 0 16px #e6c8a0;
          animation: sparkleTwinkle 2.4s ease-in-out infinite;
        }

        @keyframes sparkleTwinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.35) rotate(45deg);
          }
        }

        /* SCRATCH HEART */

        .scratch-card-position {
          position: absolute;
          z-index: 5;
          top: 28%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .scratch-heart {
          position: relative;
          width: min(260px, 68vw, 34svh);
          aspect-ratio: 240 / 220;
          height: auto;
          flex-shrink: 0;
          filter: drop-shadow(0 7px 13px rgba(54, 44, 58, 0.4));
        }

        .heart-inner {
          position: absolute;
          inset: 23% 8% 20%;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #343d4d;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
          pointer-events: none;
        }

        .heart-glitter {
          color: #fff;
          font-size: clamp(15px, 5vw, 19px);
          letter-spacing: 5px;
          text-shadow: 0 0 8px #fff, 0 0 14px #fff;
        }

        .heart-title {
          margin-top: 5px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(16px, 5vw, 20px);
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        .heart-date {
          font-size: clamp(17px, 5.2vw, 21px);
          font-weight: 900;
          letter-spacing: 0.22em;
        }

        .heart-scratch-line {
          width: 68px;
          height: 1px;
          margin: 6px 0;
          background: #6c7280;
        }

        .heart-tap {
          color: #123b8a;
          font-size: clamp(7px, 2.3vw, 9px);
          font-weight: 900;
          letter-spacing: 0.13em;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.98),
            0 0 5px rgba(255,255,255,0.85);
        }

        .scratch-canvas {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: block;
          width: 100%;
          height: 100%;
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .scratch-canvas:active {
          cursor: grabbing;
        }

        .scratch-instruction {
          margin-top: 8px;
          color: #123b8a;
          font-size: clamp(8px, 2.5vw, 10px);
          font-weight: 900;
          letter-spacing: 0.16em;
          text-align: center;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.95),
            0 0 7px rgba(255,255,255,0.8);
        }

        /* FIREWORKS */

        .date-fireworks {
          position: absolute;
          z-index: 8;
          top: 32%;
          left: 50%;
          width: 1px;
          height: 1px;
          pointer-events: none;
        }

        .firework-particle {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px #fff, 0 0 13px #f7d9a5, 0 0 20px #fff;
        }

        /* CALENDAR */

        .calendar-position {
          position: absolute;
          z-index: 3;
          top: 29%;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        .revealed-calendar {
          width: clamp(112px, 36vw, 145px);
          max-width: 90%;
          padding: 2px 3px;
          color: #62515a;
          text-align: center;
        }

        .calendar-month {
          margin-bottom: 4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(12px, 3.4vw, 16px);
          line-height: 1.1;
          font-weight: 900;
          color: #55404b;
          text-align: center;
          text-shadow: 0 1px 2px #fff;
        }

        .calendar-weekdays,
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          align-items: center;
          justify-items: center;
          width: 100%;
        }

        .calendar-weekdays {
          margin-bottom: 3px;
          color: #78616a;
          font-size: clamp(7px, 1.8vw, 9px);
          line-height: 1;
          font-weight: 900;
          text-align: center;
        }

        .calendar-days {
          grid-auto-rows: clamp(15px, 3.8vw, 19px);
          row-gap: 0;
        }

        .calendar-day {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(13px, 3.5vw, 17px);
          height: clamp(13px, 3.5vw, 17px);
          color: #574a50;
          font-size: clamp(8px, 2vw, 10px);
          line-height: 1;
          font-weight: 800;
          border-radius: 50%;
          text-align: center;
          text-shadow: 0 1px 2px #fff;
        }

        .selected-day {
          z-index: 1;
          color: #fff !important;
          background: linear-gradient(145deg, #8c7188, #4c4057);
          box-shadow: 0 0 0 1px #fff, 0 0 7px rgba(255,255,255,0.95);
          text-shadow: 0 1px 2px #403044;
        }

        .selected-day-glow {
          position: absolute;
          inset: -3px;
          z-index: -1;
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 50%;
          box-shadow: 0 0 8px #fff;
          pointer-events: none;
        }

        /* SAVE THE DATE */

        .date-reveal-details {
          position: absolute;
          z-index: 4;
          top: 53.5%;
          left: 8%;
          width: 84%;
          min-height: 9.5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #4e3e4a;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
        }

        .date-small-heading {
          font-size: clamp(8px, 2.5vw, 11px);
          font-weight: 900;
          letter-spacing: 0.22em;
          line-height: 1.2;
          color: #766071;
          text-align: center;
        }

        .date-main-text {
          width: 100%;
          margin-top: 3px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(19px, 5.7vw, 33px);
          font-weight: 900;
          line-height: 1.15;
          color: #493747;
          text-align: center;
          white-space: normal;
          overflow-wrap: anywhere;
        }

        .date-event-time {
          margin-top: 3px;
          font-size: clamp(8px, 2.5vw, 11px);
          font-weight: 900;
          letter-spacing: 0.06em;
          line-height: 1.3;
          color: #685365;
          text-align: center;
        }

        .date-event-time span {
          padding: 0 4px;
          color: #a58a65;
        }

        /* COUNTDOWN - RESPONSIVE BOX ALIGNMENT */

        .date-countdown {
          position: absolute;
          z-index: 4;
          top: 65%;
          left: 15%;
          width: 69%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(2px, 0.8vw, 7px);
          align-items: center;
          text-align: center;
          box-sizing: border-box;
        }

        .countdown-item {
          box-sizing: border-box;
          min-width: 0;
          width: 100%;
          height: clamp(42px, 11svh, 60px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5px 2px 0 7px;
          gap: 4px;
          overflow: hidden;
        }

        .countdown-value {
          display: block;
          width: 100%;
          min-width: 0;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(11px, 3.4vw, 19px);
          line-height: 1;
          font-weight: 900;
          color: #51414f;
          text-align: center;
          text-shadow: 0 1px 3px #fff;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          letter-spacing: -0.035em;
        }

        .countdown-label {
          display: block;
          width: 100%;
          min-width: 0;
          font-size: clamp(5px, 1.55vw, 8px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0;
          color: #6c5866;
          text-align: center;
          text-shadow: 0 1px 2px #fff;
          white-space: nowrap;
        }

        /* 25 YEARS OF LOVE */

        .date-bottom-message {
          position: absolute;
          z-index: 4;
          top: 77%;
          left: 8%;
          width: 84%;
          text-align: center;
          color: #685366;
          font-size: clamp(9px, 2.8vw, 13px);
          font-weight: 900;
          letter-spacing: 0.15em;
          text-shadow: 0 1px 3px #fff;
        }

        .date-bottom-heart {
          display: block;
          margin-top: 3px;
          font-size: 21px;
          color: #fff;
          text-shadow: 0 0 8px #fff, 0 0 14px #b99bb3;
        }

        /* SCROLL PROMPT */

        .date-scroll-prompt {
          position: absolute;
          z-index: 6;
          left: 0;
          bottom: max(1.5%, env(safe-area-inset-bottom));
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #554451;
          font-size: clamp(5px, 1.6vw, 7px);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-shadow: 0 1px 3px #fff;
          text-align: center;
          padding-inline: 8px;
        }

        .date-scroll-arrow {
          font-size: 18px;
          line-height: 1;
        }

        /* TABLETS AND DESKTOP */

        @media (min-width: 700px) {
          .scratch-card-position {
            top: 24%;
          }

          .scratch-heart {
            width: min(240px, 30svh);
          }

          .revealed-calendar {
            width: 145px;
          }

          .date-reveal-details {
            top: 53.5%;
          }

          .date-countdown {
            top: 65%;
            left: 20%;
            width: 60%;
            gap: 5px;
          }

          .countdown-item {
            height: 60px;
            padding: 5px 3px 0 7px;
          }

          .countdown-value {
            font-size: clamp(13px, 1.8vw, 20px);
          }

          .countdown-label {
            font-size: clamp(6px, 0.8vw, 9px);
          }

          .date-main-text {
            font-size: 34px;
          }

          .date-bottom-message {
            top: 79%;
          }

          .date-scroll-prompt {
            font-size: 7px;
          }
        }

        /* SHORT MOBILE SCREENS */

        @media (max-height: 700px) and (max-width: 699px) {
          .scratch-card-position {
            top: 25%;
          }

          .scratch-heart {
            width: min(220px, 29svh, 65vw);
          }

          .calendar-position {
            top: 27%;
          }

          .date-reveal-details {
            top: 50%;
          }

          .date-countdown {
            top: 61%;
          }

          .date-bottom-message {
            top: 76%;
          }

          .date-scroll-prompt {
            bottom: max(1%, env(safe-area-inset-bottom));
            font-size: 5px;
          }

          .date-scroll-arrow {
            font-size: 16px;
          }
        }

        /* VERY NARROW PHONES */

        @media (max-width: 350px) {
          .scratch-card-position {
            top: 28%;
          }

          .scratch-heart {
            width: min(210px, 65vw, 32svh);
          }

          .date-reveal-details {
            top: 53%;
          }

          .date-countdown {
            top: 64%;
            left: 7%;
            width: 86%;
            gap: 2px;
          }

          .countdown-item {
            padding: 4px 1px 0 5px;
          }

          .countdown-value {
            font-size: clamp(10px, 3.2vw, 13px);
            letter-spacing: -0.045em;
          }

          .countdown-label {
            font-size: clamp(4.5px, 1.45vw, 6px);
            letter-spacing: 0;
          }

          .date-main-text {
            font-size: clamp(17px, 5.5vw, 23px);
          }

          .date-bottom-message {
            top: 81%;
          }

          .date-scroll-prompt {
            font-size: 5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .background-sparkle {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default DateScene;
