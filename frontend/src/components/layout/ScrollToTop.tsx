import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top on page changes, or to the element named in the URL hash. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a tick so the target section has rendered.
    const timer = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
