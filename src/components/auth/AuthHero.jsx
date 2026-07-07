/* src/components/auth/AuthHero.jsx
   Cinematic left half of the auth screens.

   - 2-column staggered poster collage with rounded corners, shadows,
     subtle rotations, and hover scale.
   - Dark crimson gradient overlay so the branding always reads on top.
   - Floating brand block (slow, premium, reduced-motion safe).
   - Pure presentational; everything is data-driven from a local
     `cinematicImages` array so swapping posters is a one-line change. */

import ImageWithSkeleton from '../ui/ImageWithSkeleton';

/* Staggered poster data — replace these URLs with the platform's own
   CDN-hosted artwork whenever it's available. The layout never depends
   on the specific URLs. */
const cinematicImages = [
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLWRn1tQE75FJwAfvRtKoUiAnJOMBK9YKW9L02ich4g&s=10',
    alt: 'Neon-lit city street at night',
    height: 'h-[420px] md:h-[520px]',
    rotate: '-rotate-3',
    offset: 'mt-0',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQE8qpzTtIZBQkcp9wvi9U_HUH0EfyqFrgQ2dFS4Igbw&s=10',
    alt: 'Moody portrait under warm light',
    height: 'h-[340px] md:h-[420px]',
    rotate: 'rotate-2',
    offset: 'mt-16 md:mt-28',
  },
];

const AuthHero = () => {
  return (
    <aside
      className="relative hidden lg:flex flex-col justify-end overflow-hidden
                 bg-background"
      aria-label="Welcome to Hangug Deulama"
    >
      {/* Staggered poster collage */}
      <div
        className="absolute inset-0 grid grid-cols-2 gap-4 md:gap-6
                   p-8 xl:p-12 opacity-90"
        aria-hidden="true"
      >
        {/* Column 1 - First image */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className={`${cinematicImages[0].offset} ${cinematicImages[0].rotate} transition-transform duration-700 ease-cinematic hover:scale-[1.02]`}>
            <ImageWithSkeleton
              src={cinematicImages[0].src}
              alt={cinematicImages[0].alt}
              className={`${cinematicImages[0].height} w-full rounded-3xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] border border-border`}
            />
          </div>
        </div>
        {/* Column 2 - Second image */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className={`${cinematicImages[1].offset} ${cinematicImages[1].rotate} transition-transform duration-700 ease-cinematic hover:scale-[1.02]`}>
            <ImageWithSkeleton
              src={cinematicImages[1].src}
              alt={cinematicImages[1].alt}
              className={`${cinematicImages[1].height} w-full rounded-3xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] border border-border`}
            />
          </div>
        </div>
      </div>

      {/* Dark crimson gradient — keeps the bottom-left brand block
          legible no matter what the posters contain. */}
      <div
        className="absolute inset-0 pointer-events-none
                   bg-linear-to-br from-background/85 via-background/60 to-accent-muted/70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none
                   bg-linear-to-t from-background via-background/70 to-transparent"
        aria-hidden="true"
      />

      {/* Film-grain texture reused from the existing utility. */}
      <div className="absolute inset-0 film-grain pointer-events-none" aria-hidden="true" />

      {/* Floating brand block */}
      <div className="relative z-10 p-10 xl:p-14 pb-14 xl:pb-20 animate-float">
        <p className="eyebrow text-accent mb-3 flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-8 h-px bg-accent/70" />
          한국 드라마 · K-DRAMA
        </p>
        <h1 className="font-display font-bold text-text-primary leading-[0.95]
                       text-6xl xl:text-7xl tracking-tight">
          Hangug
          <br />
          <span className="bg-linear-to-r from-accent via-accent-hover to-gold bg-clip-text text-transparent">
            Deulama
          </span>
        </h1>
        <p className="mt-5 max-w-md text-text-secondary text-sm md:text-base leading-relaxed">
          Step into a curated world of Korean cinema — intimate character studies,
          sweeping historical sagas, and quiet late-night stories, picked for you.
        </p>
      </div>
    </aside>
  );
};

export default AuthHero;