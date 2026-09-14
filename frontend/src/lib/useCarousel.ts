import { useCallback, useEffect, useRef, useState } from 'react';

/** State and controls for a horizontally scrolling track: whether it's at either end, and scrolling by one item. */
export function useCarousel<T extends HTMLElement = HTMLUListElement>() {
  const trackRef = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    update();
    track?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollByItem = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    const item = track?.firstElementChild;
    if (!track || !item) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (item.getBoundingClientRect().width + gap), behavior: 'smooth' });
  }, []);

  return { trackRef, atStart, atEnd, scrollByItem };
}
