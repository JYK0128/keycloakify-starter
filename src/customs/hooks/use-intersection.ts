import { useEffect, useRef, useState } from 'react';

/**
 * intersection observer hook
 * @description 영역 간 교차점 파악
 * @param options intersection observer options
 * @param callback isIntersecting callback
 */
export function useIntersection<T extends Element>(
  options: IntersectionObserverInit = {},
  callback?: () => void,
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && callback) callback();
      },
      options,
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [callback, options]);

  return { targetRef, isIntersecting };
}
