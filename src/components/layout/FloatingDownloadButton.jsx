/* src/components/layout/FloatingDownloadButton.jsx */
import { useEffect, useState } from 'react';

/* Google Drive file ID for the hosted APK. Swap this for your own
   domain URL later once your host whitelists .apk serving - just
   change this one constant, nothing else in the component changes.
   NOTE: Drive shows a "can't scan for viruses" interstitial page for
   files over ~100MB, regardless of how the link is triggered. If your
   APK is under that size this downloads directly with a single click
   and stays on the same tab. */
const APK_FILE_ID = '19tcXLQlzCa7eBQ_a24uhqXSLI0mg0fS0';
const APK_DIRECT_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${APK_FILE_ID}`;

const FloatingDownloadButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(revealTimer);
  }, []);

  const handleClick = () => {
    setDownloading(true);

    /* Same-tab, no popup: the download attribute tells the browser to
       save the response instead of navigating. No target="_blank",
       no window.open fallback. */
    const link = document.createElement('a');
    link.href = APK_DIRECT_DOWNLOAD_URL;
    link.download = 'Hangug-Deulama.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Download the Hangug Deulama Android app"
      title="Download Android app"
      className={`fixed z-40 group
                  right-5 sm:right-7 md:right-8
                  bottom-24 sm:bottom-28 md:bottom-8
                  w-14 h-14
                  rounded-full
                  flex items-center justify-center
                  bg-surface-container-high
                  border border-border
                  shadow-lg shadow-black/20
                  hover:shadow-xl hover:shadow-primary-container/30
                  hover:border-primary-container/60
                  hover:-translate-y-0.5
                  active:scale-95 active:translate-y-0
                  transition-all duration-300 ease-cinematic
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-primary/60 focus-visible:ring-offset-2
                  focus-visible:ring-offset-bg-base
                  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full
                   bg-linear-to-br from-primary via-primary-container to-secondary
                   opacity-0 group-hover:opacity-15
                   transition-opacity duration-300"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-2 border-transparent
                   group-hover:border-primary-container/40
                   scale-100 group-hover:scale-110
                   transition-all duration-300 ease-cinematic"
      />

      <span className="relative flex items-center justify-center w-full h-full">
        {downloading ? (
          <span
            className="w-5 h-5 rounded-full border-2 border-text-secondary/30 border-t-primary
                       animate-spin"
          />
        ) : (
          <span className="material-symbols-outlined text-[22px] text-text-secondary group-hover:text-primary transition-colors duration-300">
            android
          </span>
        )}
      </span>
    </button>
  );
};

export default FloatingDownloadButton;