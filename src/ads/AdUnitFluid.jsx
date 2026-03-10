// src/AdUnitFluid.jsx
import React, { useEffect, useRef, useState } from "react";

export default function AdUnitFluid({
  adSlot = "3856189727",         // in-feed ad slot
  layoutKey = "-fb+5w+4e-db+86", // in-feed layout key
  fallbackSlot = "4514551300",   // display ad slot (fallback)
  useFallback = true,            // enable fallback to display ads
  minHeight = 80,
  style = {},
  showPlaceholderInDev = true    // or rely on env var
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [adFormat, setAdFormat] = useState("fluid"); // "fluid" or "auto"

  const isDev = process.env.NODE_ENV !== "production";
  const showPlaceholder = showPlaceholderInDev;

  // lazy load via IntersectionObserver
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: "200px" });

    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  // trigger adsbygoogle when visible or when format changes — wait for loader readiness flag if needed
  useEffect(() => {
    if (!visible) return;

    let stopped = false;
    const doPush = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // ignore (script not loaded or adblock)
      }
    };

    // If the loader set a ready flag, wait for it; otherwise attempt immediately (script may queue)
    if (window.__adsbygoogleLoaded === true) {
      doPush();
    } else if (window.__adsbygoogleLoaded === false) {
      // script failed to load previously; still attempt push once
      doPush();
    } else {
      // unknown state -> poll briefly for readiness then push
      const interval = setInterval(() => {
        if (stopped) return;
        if (window.__adsbygoogleLoaded === true) {
          clearInterval(interval);
          doPush();
        }
      }, 200);
      // fallback: attempt push after 3s in case no flag is set (script may have been injected elsewhere)
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
  }, [visible, adFormat]); // Re-run when format changes

  // detect whether Google actually filled the ad (not just created an iframe)
  const [adLoaded, setAdLoaded] = useState(null);
  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    const el = ref.current;

    const checkAd = () => {
      try {
        const ins = el ? el.querySelector('ins.adsbygoogle') : null;
        if (!ins) {
          if (mounted) setAdLoaded(false);
          return;
        }

        // Check Google's status attribute - most reliable indicator
        const status = ins.getAttribute('data-adsbygoogle-status');
        
        // Check if iframe exists and has content
        const iframe = ins.querySelector('iframe');
        
        if (status === 'filled' || status === 'done') {
          // Ad was filled by Google
          if (mounted) setAdLoaded(true);
        } else if (status === 'unfilled' || (!iframe && status)) {
          // Explicitly unfilled or no iframe after processing
          if (mounted) setAdLoaded(false);
        } else if (iframe) {
          // Iframe exists - check if it has actual dimensions (not 0x0)
          const hasRealDimensions = iframe.offsetHeight > 0 && iframe.offsetWidth > 0;
          if (mounted) setAdLoaded(hasRealDimensions);
        }
      } catch (e) {
        if (mounted) setAdLoaded(false);
      }
    };

    // Initial check
    checkAd();
    
    // Watch for changes
    const mo = new MutationObserver(checkAd);
    if (el) mo.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-adsbygoogle-status'] });
    
    // Delayed checks to catch late fills
    const timer1 = setTimeout(checkAd, 1500);
    const timer2 = setTimeout(checkAd, 3000);

    return () => {
      mounted = false;
      mo.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [visible]);

  // Fallback to display ads if in-feed ads don't fill
  useEffect(() => {
    if (!useFallback) return;
    if (adLoaded !== false) return; // Only fallback when explicitly unfilled
    if (adFormat !== "fluid") return; // Already tried fallback

    // Wait a bit before switching to ensure in-feed had a chance
    const fallbackTimer = setTimeout(() => {
      console.log('[AdUnitFluid] In-feed ad unfilled, switching to display ad format');
      setAdFormat("auto");
      setAdLoaded(null); // Reset to try again
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, [adLoaded, adFormat, useFallback]);

  // Dev placeholder (no network calls)
  if (isDev && showPlaceholder) {
    return (
      <div ref={ref} style={{ width: "100%", textAlign: "center", margin: "20px 0", ...style }}>
        <div style={{
          border: "2px dashed #bbb",
          padding: 12,
          borderRadius: 6,
          display: "inline-block",
          minWidth: 300,
          minHeight,
        }}>
          DEV AD — placeholder (no network request)
        </div>
      </div>
    );
  }

  // Always render an element with the ref so IntersectionObserver can observe it.
  // Completely hide when ad explicitly failed (and no fallback available)
  const shouldHide = adLoaded === false && (!useFallback || adFormat === "auto");
  
  const containerStyle = {
    width: "100%",
    textAlign: "center",
    // Completely remove spacing when ad failed to load
    margin: shouldHide ? 0 : "20px 0",
    padding: shouldHide ? 0 : undefined,
    // Hide completely when ad failed
    display: shouldHide ? "none" : undefined,
    ...style
  };

  // Determine which ad configuration to use
  const currentSlot = adFormat === "auto" ? fallbackSlot : adSlot;
  const isFluidFormat = adFormat === "fluid";

  return (
    <div ref={ref} style={containerStyle}>
      {visible && adLoaded !== false ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format={isFluidFormat ? "fluid" : "auto"}
          data-ad-layout-key={isFluidFormat ? layoutKey : undefined}
          data-ad-client="ca-pub-3621252051008466"
          data-ad-slot={currentSlot}
          data-full-width-responsive="true"
          data-adtest={isDev ? "on" : undefined}
        />
      ) : (
        // minimal sentinel so IntersectionObserver still works but no visible gap
        <div style={{ width: "100%", height: 1, lineHeight: 0, overflow: "hidden" }} />
      )}
    </div>
  );
}
