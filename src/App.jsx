
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

    if (!showInvitation) {
      app.scrollTop = 0;
      app.style.overflowY = "hidden";
      app.style.scrollBehavior = "auto";
      return;
    }

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

      if (dateScene.classList.contains("date-revealed")) return;

      const appRect = app.getBoundingClientRect();
      const dateRect = dateScene.getBoundingClientRect();
      const distanceFromTop = dateRect.top - appRect.top;

      if (distanceFromTop <= 1) {
        app.scrollTop += distanceFromTop;
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

      if (event.target.closest?.(".scratch-canvas")) return;

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

      mutationObserver = new MutationObserver(checkReveal);

      mutationObserver.observe(dateSceneRef.current, {
        attributes: true,
        attributeFilter: ["class"],
      });

      app.addEventListener("scroll", checkDatePosition, {
        passive: true,
      });

      window.addEventListener("wheel", preventWheel, {
        passive: false,
        capture: true,
      });

      window.addEventListener("touchmove", preventTouchScroll, {
        passive: false,
        capture: true,
      });

      window.addEventListener("keydown", preventKeyboardScroll, true);

      checkDatePosition();
    };

    animationFrame = requestAnimationFrame(initialize);

    return () => {
      cancelAnimationFrame(animationFrame);
      mutationObserver?.disconnect();

      app.removeEventListener("scroll", checkDatePosition);
      window.removeEventListener("wheel", preventWheel, true);
      window.removeEventListener("touchmove", preventTouchScroll, true);
      window.removeEventListener("keydown", preventKeyboardScroll, true);

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
          <Welcome />
          <LoveStory />
          <DateScene />
          <Celebration />
          <Venue />
          <RSVP />
        </div>
      )}

      <MusicToggle />

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          min-width: 0;
          height: 100%;
          min-height: 100%;
          margin: 0;
          padding: 0;
        }

        html {
          overflow: hidden;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        body {
          overflow: hidden;
          overscroll-behavior: none;
        }

        img,
        video,
        canvas,
        svg {
          max-width: 100%;
        }

        img,
        video {
          height: auto;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
          max-width: 100%;
        }

        .jubilee-app {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          min-height: 0;
          margin: 0;
          padding: 0;
          overflow-x: clip;
          overflow-y: hidden;
          background: #302932;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
          isolation: isolate;
        }

        /* ENTRANCE SCREEN */

        .jubilee-app.entrance-active {
          width: 100%;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
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
          isolation: isolate;
        }

        .jubilee-entrance-wrapper .jubilee-entrance {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0 !important;
          max-height: 100%;
          overflow: hidden;
        }

        /* INVITATION SCENES */

        .jubilee-app.invitation-active {
          width: 100%;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          overflow-x: clip;
          overflow-y: auto;
          overscroll-behavior-y: contain;
          touch-action: pan-y;
          scroll-behavior: smooth;
        }

        .jubilee-invitation {
          position: relative;
          display: block;
          width: 100%;
          min-width: 0;
          min-height: 100%;
          margin: 0;
          padding: 0;
          overflow: visible;
        }

        .jubilee-invitation > section {
          position: relative;
          width: 100%;
          min-width: 0;
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
        }

        /* MOBILE WIDTHS */

        @media (max-width: 600px) {
          .jubilee-app {
            width: 100%;
            max-width: 100vw;
            max-width: 100dvw;
          }

          .jubilee-app.entrance-active {
            width: 100%;
            height: 100vh;
            height: 100svh;
            height: 100dvh;
            overflow: hidden !important;
          }

          .jubilee-entrance-wrapper {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .jubilee-entrance-wrapper .jubilee-entrance {
            width: 100%;
            height: 100%;
            min-height: 0 !important;
            overflow: hidden;
          }

          .jubilee-app.invitation-active {
            width: 100%;
            height: 100vh;
            height: 100svh;
            height: 100dvh;
            overflow-x: clip;
            overflow-y: auto;
          }

          .jubilee-invitation,
          .jubilee-invitation > section {
            width: 100%;
            min-width: 0;
          }
        }

        /* SMALL PHONES */

        @media (max-width: 360px) {
          .jubilee-app {
            font-size: 14px;
          }

          .jubilee-invitation > section {
            max-width: 100%;
          }
        }

        /* TABLETS */

        @media (min-width: 601px) and (max-width: 1024px) {
          .jubilee-app {
            width: 100%;
          }

          .jubilee-invitation > section {
            width: 100%;
          }
        }

        /* SAFE AREA SUPPORT */

        @supports (padding: env(safe-area-inset-top)) {
          .jubilee-app {
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
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
