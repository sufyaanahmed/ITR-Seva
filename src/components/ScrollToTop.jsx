import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const isItrTransition = pathname.startsWith('/itr/') && prevPathname.current.startsWith('/itr/');
    
    if (!isItrTransition) {
      window.scrollTo(0, 0);
    }
    
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}
