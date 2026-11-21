
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

    const scroller = document.querySelector(".jubilee-app");
    const section = document.querySelector(".jubilee-date-scene");

    if (!scroller || !section) return;

    const dateIsLockedInPlace = () => {
      const rect = section.getBoundingClientRect();

      return (
        rect.top <= 2 &&
        rect.bottom >= window.innerHeight - 2
      );
    };

    const preventWheel = (event) => {
      if (dateIsLockedInPlace()) {
        event.preventDefault();
      }
    };

    const preventTouchMove = (event) => {
      if (dateIsLockedInPlace()) {
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

      if (keys.includes(event.key)) {
        event.preventDefault();
      }
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

  // DRAW THE SILVER GLITTER HEART SCRATCH SURFACE
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

    // Heart outline
    ctx.strokeStyle = "rgba(255,255,255,0.98)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 9;
    ctx.stroke(heartPath);

    // Save original alpha pixel positions
    const image = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const pixels = [];

    for (let i = 3; i < image.data.length; i += 4) {
      if (image.data[i] > 0) {
        pixels.push(i);
      }
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

    // Erase silver coating
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Calculate erased coating
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

      if (image.data[originalPixels[i]] < 30) {
        erased++;
      }
    }

    const progress = checked > 0 ? erased / checked : 0;

    // Reveal after 42% scratching
    if (progress >= 0.42) {
      finishReveal();
    }
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
    if (scratchingRef.current) {
      scratchAt(event);
    }
  };

  const handlePointerUp = () => {
    scratchingRef.current = false;
  };

  // COUNTDOWN STARTS AFTER HEART REVEAL
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

    const timer = window.setInterval(
      updateCountdown,
      1000
    );

    return () => window.clearInterval(timer);
  }, [revealed, countdown.enabled, targetDate]);

  // BUILD CALENDAR FROM EVENT DATE
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

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

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

      <div
        className="date-background-sparkles"
        aria-hidden="true"
      >
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

      {/* REAL SILVER GLITTER SCRATCH HEART */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="scratch-card-position"
            initial={{
              opacity: 0,
              scale: 0.65,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
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
                <span className="heart-glitter">
                  ✧ ✦ ✧
                </span>

                <span className="heart-title">
                  Our Special
                </span>

                <span className="heart-date">
                  DAY
                </span>

                <span className="heart-scratch-line" />

                <span className="heart-tap">
                  SCRATCH TO REVEAL
                </span>
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
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              SCRATCH THE HEART TO REVEAL
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CELEBRATION BURST */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="date-fireworks"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
              delay: 1.8,
              duration: 0.8,
            }}
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

      {/* CALENDAR - ONLY AFTER SCRATCHING */}
      <AnimatePresence>
        {revealed && (
          <div className="calendar-position">
            <motion.div
              className="revealed-calendar"
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 1.1,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="calendar-month"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
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
                        initial={{
                          scale: 0,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          delay: 1.4,
                          duration: 0.5,
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAVE THE DATE INSIDE THE RIBBON */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="date-reveal-details"
            initial={{
              opacity: 0,
              scale: 0.75,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
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
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
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
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.5,
            duration: 1,
          }}
        >
          {[
            { value: timeLeft.days, label: "DAYS" },
            { value: timeLeft.hours, label: "HOURS" },
            { value: timeLeft.minutes, label: "MINUTES" },
            { value: timeLeft.seconds, label: "SECONDS" },
          ].map((item) => (
            <div
              className="countdown-item"
              key={item.label}
            >
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
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 2,
              duration: 1,
            }}
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
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 2.3,
              duration: 0.9,
            }}
          >
            <span>CONTINUE THE CELEBRATION</span>

            <motion.span
              className="date-scroll-arrow"
              animate={{
                y: [0, 7, 0],
              }}
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
          height: 100svh;
          min-height: 600px;
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

        .scratch-card-position {
          position: absolute;
          z-index: 5;
          top: 19%;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .scratch-heart {
          position: relative;
          width: 260px;
          height: 230px;
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
          font-size: 19px;
          letter-spacing: 5px;
          text-shadow: 0 0 8px #fff, 0 0 14px #fff;
        }

        .heart-title {
          margin-top: 5px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        .heart-date {
          font-size: 21px;
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
          font-size: 9px;
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
          margin-top: 3px;
          color: #123b8a;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.95),
            0 0 7px rgba(255,255,255,0.8);
        }

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
          width: 36%;
          max-width: 132px;
          padding: 2px 3px;
          color: #62515a;
          text-align: center;
        }

        .calendar-month {
          margin-bottom: 3px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(11px, 3vw, 14px);
          line-height: 1.03;
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
          margin-bottom: 2px;
          color: #78616a;
          font-size: 6.5px;
          line-height: 1;
          font-weight: 900;
          text-align: center;
        }

        .calendar-days {
          grid-auto-rows: 12px;
          row-gap: 0;
        }

        .calendar-day {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 11px;
          height: 11px;
          color: #574a50;
          font-size: 7px;
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

        .date-reveal-details {
          position: absolute;
          z-index: 4;
          top: 50.7%;
          left: 13%;
          width: 74%;
          height: 9.5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #4e3e4a;
          text-shadow: 0 1px 2px rgba(255,255,255,0.95);
        }

        .date-small-heading {
          font-size: clamp(8px, 2.2vw, 11px);
          font-weight: 900;
          letter-spacing: 0.22em;
          line-height: 1.1;
          color: #766071;
          text-align: center;
        }

        .date-main-text {
          width: 100%;
          margin-top: 2px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(21px, 5.7vw, 33px);
          font-weight: 900;
          line-height: 1.1;
          color: #493747;
          text-align: center;
          white-space: nowrap;
        }

        .date-event-time {
          margin-top: 2px;
          font-size: clamp(8px, 2.2vw, 11px);
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1.1;
          color: #685365;
          text-align: center;
        }

        .date-event-time span {
          padding: 0 4px;
          color: #a58a65;
        }

        .date-countdown {
          position: absolute;
          z-index: 4;
          top: 62.2%;
          left: 15%;
          width: 70%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 4%;
          align-items: center;
          text-align: center;
        }

        .countdown-item {
          min-width: 0;
          height: 55px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 9px 1px 0;
          gap: 4px;
        }

        .countdown-value {
          display: block;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(13px, 3.7vw, 19px);
          line-height: 1;
          font-weight: 900;
          color: #51414f;
          text-align: center;
          text-shadow: 0 1px 3px #fff;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .countdown-label {
          display: block;
          width: 100%;
          font-size: clamp(6px, 1.55vw, 8px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.03em;
          color: #6c5866;
          text-align: center;
          text-shadow: 0 1px 2px #fff;
          white-space: nowrap;
        }

        .date-bottom-message {
          position: absolute;
          z-index: 4;
          top: 72%;
          left: 10%;
          width: 80%;
          text-align: center;
          color: #685366;
          font-size: clamp(10px, 2.6vw, 13px);
          font-weight: 900;
          letter-spacing: 0.2em;
          text-shadow: 0 1px 3px #fff;
        }

        .date-bottom-heart {
          display: block;
          margin-top: 3px;
          font-size: 21px;
          color: #fff;
          text-shadow: 0 0 8px #fff, 0 0 14px #b99bb3;
        }

        .date-scroll-prompt {
          position: absolute;
          z-index: 6;
          left: 0;
          bottom: 2%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: #554451;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-shadow: 0 1px 3px #fff;
          text-align: center;
        }

        .date-scroll-arrow {
          font-size: 23px;
          line-height: 1;
        }

        @media (min-width: 700px) {
          .scratch-card-position {
            top: 17%;
          }

          .scratch-heart {
            width: 240px;
            height: 220px;
          }

          .revealed-calendar {
            width: 132px;
          }

          .date-countdown {
            left: 20%;
            width: 60%;
            gap: 6%;
          }

          .countdown-item {
            height: 60px;
            padding-top: 10px;
          }

          .countdown-value {
            font-size: 22px;
          }

          .countdown-label {
            font-size: 9px;
          }

          .date-main-text {
            font-size: 36px;
          }
        }

        @media (max-height: 700px) {
          .scratch-card-position {
            top: 16%;
          }

          .calendar-position {
            top: 27.3%;
          }

          .date-reveal-details {
            top: 49%;
          }

          .date-countdown {
            top: 60.5%;
          }

          .date-bottom-message {
            top: 74%;
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
