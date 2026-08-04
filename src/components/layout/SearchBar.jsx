/* src/components/layout/SearchBar.jsx
   Collapsible search field that lives in the navbar. Click the magnifier
   to expand the input, click outside or press Escape to collapse it.
   The auto-focus + click-outside together give a quick "type and go"
   flow without ever needing the keyboard to manage focus by hand.

   @see docs/components/layout/Navbar.jsx
   @see docs/utils/dramaHelpers.js (filterBySearch) */

import { useState, useRef, useEffect } from 'react';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // NOTE: auto-focusing the input on open is the difference between
  // "click the icon, then click the input again to start typing" and
  // "click the icon and start typing immediately". The optional
  // chaining (?.) handles the case where the ref hasn't been attached
  // yet — the effect runs after render, so the ref is normally set,
  // but this guards against an edge timing case in StrictMode.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // NOTE: the listeners are attached to `document` rather than the input
  // because click-outside and global Escape keys need to work even when
  // the user clicks anywhere else on the page. We return a cleanup
  // function so the listeners get removed on unmount — otherwise
  // they'd leak across page navigations and fire on pages that no
  // longer have a SearchBar.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center">
      <div
        className={`overflow-hidden transition-all duration-400 ease-cinematic ${
          isOpen ? 'w-40 sm:w-56 opacity-100 mr-2' : 'w-0 opacity-0'
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search dramas, genres..."
          aria-label="Search dramas"
          className="w-full bg-surface-container border border-border-strong rounded-full
                     px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary
                     focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50
                     transition-colors duration-300"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close search' : 'Open search'}
        aria-expanded={isOpen}
        className="flex items-center justify-center w-9 h-9 rounded-full
                   text-text-secondary hover:text-text-primary hover:bg-surface-container
                   transition-colors duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isOpen ? 'close' : 'search'}
        </span>
      </button>
    </div>
  );
};

export default SearchBar;