import { useEffect } from "react";

export default function AdSenseLoader() {
  useEffect(() => {
    // We explicitly load script in dev for test ads; in prod you can switch to server env behavior
    const already = document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    if (already) return;

    const clientId = "ca-pub-3621252051008466"; // static client id
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    s.crossOrigin = "anonymous";
    // Set a global flag when the script has loaded so ad components can wait for readiness
    s.onload = () => {
      try {
        window.__adsbygoogleLoaded = true;
      } catch (e) {
        // ignore
      }
    };
    s.onerror = () => {
      try {
        window.__adsbygoogleLoaded = false;
      } catch (e) {}
    };
    document.head.appendChild(s);
  }, []);
  return null;
}