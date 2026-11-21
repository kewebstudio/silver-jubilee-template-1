
import { useEffect, useRef, useState } from "react";

import ClosedEntrance from "./components/ClosedEntrance";
import Welcome from "./components/Welcome";
import LoveStory from "./components/LoveStory";
import DateScene from "./components/Date";
import Celebration from "./components/Celebration";
import Venue from "./components/Venue";
import RSVP from "./components/RSVP";
import MusicToggle from "./components/MusicToggle";

function App() {
  const [showInvitation, setShowInvitation] = useState(false);

  const appRef = useRef(null);
  const lockedRef = useRef(false);
  const dateSceneRef = useRef(null);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    // Keep the entrance screen fixed with no scrolling.
    if (!showInvitation) {
      app.scrollTop = 0;
      app.style.overflowY = "hidden";
      app.style.scrollBehavior = "auto";
      return;
    }

    // Enable scrolling after entering the invitation.
    app.style.overflowY = "auto";
    app.style.scrollBehavior = "smooth";

    let mutationObserver;
    let animationFrame;

    const lockScrolling = () => {
      if (lockedRef.current) return;

      lockedRef.current = true;

      app.style.overflowY = "hidden";
      app.style.scrollBehavior = "auto";
    };

    const unlockScrolling = () => {
      if (!lockedRef.current) return;

      lockedRef.current = false;

      app.style.overflowY = "auto";
      app.style.scrollBehavior = "smooth";
    };

    const checkDatePosition = () => {
      if (lockedRef.current) return;

      const dateScene = dateSceneRef.current;
      if (!dateScene) return;

      // Do not lock if the date has already been revealed.
      if (dateScene.classList.contains("date-revealed")) {
        return;
      }

      const appRect = app.getBoundingClientRect();
      const dateRect = dateScene.getBoundingClientRect();

      // Detect when the Date scene reaches the top
      // of the actual scrolling container.
      const distanceFromTop = dateRect.top - appRect.top;

      if (distanceFromTop <= 1) {
        // Align the Date scene exactly at the top.
        app.scrollTop += distanceFromTop;

        // Stop all further page scrolling.
        lockScrolling();
      }
    };

    const preventWheel = (event) => {
      if (lockedRef.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const preventTouchScroll = (event) => {
      if (!lockedRef.current) return;

      // Keep the scratch canvas interaction available.
      if (event.target.closest?.(".scratch-canvas")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    const preventKeyboardScroll = (event) => {
      if (!lockedRef.current) return;

      const scrollKeys = [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ];

      if (scrollKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    const checkReveal = () => {
      const dateScene = dateSceneRef.current;
      if (!dateScene) return;

      if (dateScene.classList.contains("date-revealed")) {
        unlockScrolling();
      }
    };

    const initialize = () => {
      dateSceneRef.current = app.querySelector(
        ".jubilee-date-scene"
      );

      if (!dateSceneRef.current) return;

      // Watch the Date scene for the scratch reveal.
      mutationObserver = new MutationObserver(checkReveal);

      mutationObserver.observe(dateSceneRef.current, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Detect when the Date scene reaches the top.
      app.addEventListener("scroll", checkDatePosition, {
        passive: true,
      });

      // Block mouse, touch and keyboard scrolling while locked.
      window.addEventListener("wheel", preventWheel, {
        passive: false,
        capture: true,
      });

      window.addEventListener("touchmove", preventTouchScroll, {
        passive: false,
        capture: true,
      });

      window.addEventListener(
        "keydown",
        preventKeyboardScroll,
        true
      );

      // Also check the initial position.
      checkDatePosition();
    };

    animationFrame = requestAnimationFrame(initialize);

    return () => {
      cancelAnimationFrame(animationFrame);

      mutationObserver?.disconnect();

      app.removeEventListener("scroll", checkDatePosition);

      window.removeEventListener("wheel", preventWheel, true);

      window.removeEventListener(
        "touchmove",
        preventTouchScroll,
        true
      );

      window.removeEventListener(
        "keydown",
        preventKeyboardScroll,
        true
      );

      app.style.overflowY = "auto";
      app.style.scrollBehavior = "";

      lockedRef.current = false;
    };
  }, [showInvitation]);

  return (
    <main
      className={`jubilee-app ${
        showInvitation ? "invitation-active" : "entrance-active"
      }`}
      ref={appRef}
    >
      {!showInvitation ? (
        <div className="jubilee-entrance-wrapper">
          <ClosedEntrance
            onOpen={() => setShowInvitation(true)}
          />
        </div>
      ) : (
        <div className="jubilee-invitation">

          {/* Scene 1 - Welcome */}
          <Welcome />

          {/* Scene 2 - Their Love Story */}
          <LoveStory />

          {/* Scene 3 - Interactive Date Scratch Reveal */}
          <DateScene />

          {/* Scene 4 - Silver Jubilee Celebration */}
          <Celebration />

          {/* Scene 5 - Venue Details */}
          <Venue />

          {/* Scene 6 - RSVP and Download Invitation */}
          <RSVP />

        </div>
      )}

      {/* Background music stays mounted across all scenes */}
      <MusicToggle />

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          min-height: 100%;
          margin: 0;
          padding: 0;
        }

        body {
          overflow: hidden;
        }

        .jubilee-app {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 0;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: #302932;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
        }

        /* CLOSED AND OPENING CURTAIN SCREEN */
        .jubilee-app.entrance-active {
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 0;
          overflow: hidden !important;
          overscroll-behavior: none;
          touch-action: manipulation;
        }

        .jubilee-entrance-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .jubilee-entrance-wrapper .jubilee-entrance {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          max-height: 100%;
          overflow: hidden;
        }

        /* INVITATION SCENES */
        .jubilee-app.invitation-active {
          width: 100%;
          height: 100vh;
          height: 100svh;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior-y: contain;
          touch-action: pan-y;
          scroll-behavior: smooth;
        }

        .jubilee-invitation {
          position: relative;
          width: 100%;
          min-height: 100%;
          margin: 0;
          padding: 0;
          overflow: visible;
        }

        .jubilee-invitation > section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
        }

        @media (max-width: 600px) {
          .jubilee-app.entrance-active {
            width: 100%;
            height: 100svh;
            overflow: hidden !important;
          }

          .jubilee-entrance-wrapper {
            width: 100%;
            height: 100svh;
            overflow: hidden;
          }

          .jubilee-entrance-wrapper .jubilee-entrance {
            width: 100%;
            height: 100svh;
            min-height: 0;
            overflow: hidden;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jubilee-app.invitation-active {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </main>
  );
}

export default App;
