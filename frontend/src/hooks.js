import { useEffect } from 'react';

// Adds the `in-view` class to every `.pop` element as it scrolls into view,
// so the CSS pop-in animation plays once per element.
// Pass values that change when new `.pop` elements appear (for example the
// loaded listings) so newly rendered elements get observed too.
export function usePopIn(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.pop');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in-view'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
