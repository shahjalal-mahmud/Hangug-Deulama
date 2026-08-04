/* src/components/layout/Footer.jsx
   Static footer (link columns, social icons, "back to top" button,
   copyright). Mostly presentational — the data is hardcoded because the
   footer doesn't reflect any server state and rarely changes.

   @see docs/PROJECT.md#sec-proj-ui-plan */

import { Link } from 'react-router-dom';

const footerColumns = [
  { title: 'Company', links: ['About Us', 'Press Room', 'Careers'] },
  { title: 'Legal', links: ['Privacy Policy', 'Cookie Preferences', 'Terms of Use'] },
  { title: 'Support', links: ['Help Center', 'Account', 'Contact Us'] },
];

const socialLinks = [
  { icon: 'public', label: 'Website' },
  { icon: 'video_library', label: 'Video library' },
  { icon: 'forum', label: 'Community forum' },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-border bg-surface-dim mt-8">
      {/* Gradient hairline — the same rose→gold trace used under active
          nav links, echoed here so header and footer read as one
          system bookending the page. */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r
                   from-transparent via-primary-container/70 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-container-max mx-auto px-5 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-8 pb-12">
          {/* Brand block */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="inline-flex items-center gap-2.5 w-fit group">
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0
                           bg-linear-to-br from-primary via-primary-container to-secondary
                           shadow-lg shadow-primary-container/25
                           transition-transform duration-300 group-hover:scale-105"
              >
                <span className="font-display text-base font-bold text-on-primary">한</span>
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-text-primary">
                Hangug Deulama
              </span>
            </Link>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Swipe your way to your next obsession. Every like, favorite, and
              finished finale quietly shapes a Top 10 made only for you.
            </p>

            <div className="flex gap-2.5 mt-1">
              {socialLinks.map(({ icon, label }) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full
                             bg-surface-container border border-border
                             text-text-secondary
                             hover:text-on-primary hover:border-transparent
                             hover:bg-linear-to-br hover:from-primary hover:via-primary-container hover:to-secondary
                             transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3.5">
                <h5 className="eyebrow text-text-tertiary">{col.title}</h5>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-text-secondary text-sm hover:text-primary
                                   transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="lg:col-span-2 flex flex-col gap-3 lg:items-end lg:text-right">
            <h5 className="eyebrow text-text-tertiary">Get started</h5>
            <p className="text-text-secondary text-sm max-w-47.5">
              New here? Start swiping and build your taste profile in minutes.
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2.5
                         rounded-xl
                         bg-linear-to-br from-primary via-primary-container to-secondary
                         text-on-primary
                         shadow-lg shadow-primary-container/25
                         hover:shadow-xl hover:shadow-primary-container/40
                         hover:scale-[1.05] hover:rotate-1
                         active:scale-[0.98]
                         transition-all duration-300 ease-cinematic
                         font-display text-sm font-bold
                         px-5 py-2.5
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary/60 focus-visible:ring-offset-2
                         focus-visible:ring-offset-surface-dim"
            >
              Start Discovering
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col-reverse md:flex-row justify-between items-center gap-4
                     pt-6 border-t border-border"
        >
          <p className="text-text-tertiary text-xs">
            © {new Date().getFullYear()} Hangug Deulama. The Digital Cinema.
          </p>

          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-border
                         px-3 py-1 text-text-tertiary text-[10px] uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" aria-hidden="true" />
              Made in Seoul
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-border
                         px-3 py-1 text-text-tertiary text-[10px] uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
              Global Streaming
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex items-center justify-center w-8 h-8 rounded-full
                         border border-border-strong text-text-secondary
                         hover:text-primary hover:border-primary/50
                         transition-colors duration-300
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;