/* src/components/layout/FloatingDownloadButton.jsx */
import { useEffect, useState } from 'react';

/* Google Drive direct-download URL for the hosted APK.
   Converting ?usp=sharing → ?export=download&id=... makes Drive
   stream the binary instead of opening the preview viewer.
   We fall back to the preview URL if the user needs to manually
   trigger the download from the warning page (large files). */
const APK_FILE_ID = '19tcXLQlzCa7eBQ_a24uhqXSLI0mg0fS0';
const APK_DIRECT_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${APK_FILE_ID}`;
const APK_FALLBACK_URL = `https://drive.google.com/file/d/${APK_FILE_ID}/view?usp=sharing`;

const FloatingDownloadButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  /* Fade in after the page settles so the button doesn't compete
     with above-the-fold content during first paint. */
  useEffect(() => {
    const revealTimer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(revealTimer);
  }, []);

  /* Compress to icon-only on phones so it doesn't crowd the
     bottom-nav dock. Breakpoints mirror the rest of the app. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handleChange = () => setShowLabel(!mq.matches);
    handleChange();
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();

    /* Anchor with `download` attribute is a hint to the browser;
       Drive serves the binary with content-disposition so this works.
       Opening in a new tab keeps the SPA alive on mobile while the
       download kicks off in the background. */
    const link = document.createElement('a');
    link.href = APK_DIRECT_DOWNLOAD_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = 'Hangug-Deulama.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* Belt-and-braces: if the direct URL was blocked by Drive's
       virus-scan interstitial (which can happen for large files),
       also pop the preview page after a short delay so the user
       has a manual fallback. */
    setTimeout(() => {
      window.open(APK_FALLBACK_URL, '_blank', 'noopener,noreferrer');
    }, 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Download the Hangug Deulama Android app (APK)"
      /* Above the bottom-nav on mobile (which is roughly h-16 + safe area),
         and generously spaced on desktop so it never collides with footer. */
      className={`fixed z-40 group
                  right-4 sm:right-6 md:right-8
                  bottom-24 sm:bottom-28 md:bottom-8
                  inline-flex items-center
                  bg-linear-to-br from-primary via-primary-container to-secondary
                  text-on-primary
                  rounded-full
                  shadow-xl shadow-primary-container/40
                  hover:shadow-2xl hover:shadow-primary-container/60
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-primary/60 focus-visible:ring-offset-2
                  focus-visible:ring-offset-bg-base
                  transition-all duration-500 ease-cinematic
                  active:scale-95
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <span
        className="flex items-center justify-center
                   w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14
                   rounded-full
                   shrink-0"
        aria-hidden="true"
      >
        <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
          android
        </span>
      </span>

      {/* Label slot — animated width so it doesn't reflow content
          when we collapse it on small screens. */}
      <span
        className={`overflow-hidden whitespace-nowrap
                    pr-4 sm:pr-5
                    font-display text-sm sm:text-base font-bold
                    transition-[max-width,opacity,padding] duration-500 ease-cinematic
                    ${showLabel ? 'max-w-55 opacity-100' : 'max-w-0 opacity-0 pr-0'}`}
      >
        <span className="block">Download App</span>
        <span className="block text-[10px] font-medium tracking-wider opacity-80 -mt-0.5">
          ANDROID · APK
        </span>
      </span>

      {/* Subtle attention-grabbing ping behind the icon.
          aria-hidden because it's purely decorative. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full
                   bg-primary/30
                   animate-ping
                   opacity-60
                   pointer-events-none"
        style={{ animationDuration: '2.4s' }}
      />
    </button>
  );
};

export default FloatingDownloadButton;
