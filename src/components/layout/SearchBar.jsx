/* src/components/SearchBar.jsx */
import { useState, useRef, useEffect } from 'react';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

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
          className="w-full bg-surface-elevated border border-border-strong rounded-full
                     px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary
                     focus:outline-none focus:ring-1 focus:ring-accent/50
                     transition-colors duration-300"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close search' : 'Open search'}
        aria-expanded={isOpen}
        className="text-text-secondary hover:text-text-primary transition-colors duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                   rounded-full p-1"
      >
        <span className="material-symbols-outlined text-[22px]">
          {isOpen ? 'close' : 'search'}
        </span>
      </button>
    </div>
  );
};

export default SearchBar;