import React from 'react';

const footerColumns = [
  { title: 'Company', links: ['About Us', 'Press Room', 'Careers'] },
  { title: 'Legal', links: ['Privacy Policy', 'Cookie Preferences', 'Terms of Use'] },
  { title: 'Support', links: ['Help Center', 'Account', 'Contact Us'] },
];

const Footer = () => (
  <footer className="border-t border-border bg-surface mt-8">
    <div className="max-w-7xl mx-auto px-5 md:px-16 py-14">
      <p className="font-display text-2xl font-bold text-accent uppercase tracking-tight mb-10">
        Hangug Deulama
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {footerColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h5 className="text-text-primary text-sm font-semibold">{col.title}</h5>
            {col.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-text-secondary text-xs hover:text-accent transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h5 className="text-text-primary text-sm font-semibold">Connect</h5>
          <div className="flex gap-4">
            {['public', 'video_library', 'forum'].map((icon) => (
              <a
                key={icon}
                href="#"
                aria-label={icon.replace('_', ' ')}
                className="text-text-secondary hover:text-accent transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 border-t border-border">
        <p className="text-text-tertiary text-xs">
          © {new Date().getFullYear()} Hangug Deulama. The Digital Cinema.
        </p>
        <div className="flex gap-4">
          <span className="text-text-tertiary text-[10px] uppercase tracking-widest">Made in Seoul</span>
          <span className="text-text-tertiary text-[10px] uppercase tracking-widest">Global Streaming</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;