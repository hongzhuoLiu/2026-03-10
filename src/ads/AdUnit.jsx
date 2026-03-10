// src/AdUnit.jsx
import React, { useEffect, useRef, useState } from "react";

export default function AdUnit({
  adSlot = "1234567890",      // replace with your ad unit id (use real only in prod)
  minHeight = 60,
  style = {},
  className = ""
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const isDev = process.env.NODE_ENV !== "production";
  const showPlaceholderInDev = false;

  // IntersectionObserver to lazy load ads
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    if (visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  // Trigger adsbygoogle when visible — wait for loader readiness flag if present
  useEffect(() => {
    if (!visible) return;
    let stopped = false;
    const doPush = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // ignore
      }
    };
    if (window.__adsbygoogleLoaded === true) {
      doPush();
    } else if (window.__adsbygoogleLoaded === false) {
      doPush();
    } else {
      const interval = setInterval(() => {
        if (stopped) return;
        if (window.__adsbygoogleLoaded === true) {
          clearInterval(interval);
          doPush();
        }
      }, 200);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        doPush();
      }, 3000);

      return () => {
        stopped = true;
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
    return () => { stopped = true; };
  }, [visible]);

   // DEV: placeholder
  if (isDev && showPlaceholderInDev) {
    return (
      <div ref={containerRef} style={{ width: "100%", textAlign: "center", margin: "20px 0", ...style }} className={className}>
        <div style={{
          border: "2px dashed #bbb",
          padding: 12,
          borderRadius: 6,
          display: "inline-block",
          minWidth: 320,
          minHeight,
        }}>
          DEV AD — placeholder (no network request)
        </div>
      </div>
    );
  }

  // Static ad client for now
  const STATIC_AD_CLIENT = "ca-pub-3621252051008466";

  return (
    <div ref={containerRef} style={{ width: "100%", textAlign: "center", margin: "20px 0", ...style }} className={className}>
      {visible ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={STATIC_AD_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        // Small placeholder space so layout doesn't jump too much
        <div style={{ minHeight }} />
      )}
    </div>
  );
}
