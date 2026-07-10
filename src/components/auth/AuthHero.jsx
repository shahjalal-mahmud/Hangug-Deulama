/* Full-bleed cinematic backdrop with a slow Ken Burns drift, layered
   scrims for legibility, and a floating "preview card" that mirrors
   the recommendation UI users will see once logged in — the one
   signature flourish on this screen. */

import ImageWithSkeleton from '../ui/ImageWithSkeleton';

const backdrop = {
  src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLWRn1tQE75FJwAfvRtKoUiAnJOMBK9YKW9L02ich4g&s=10',
  alt: 'Neon-lit Seoul street at night, still from a Korean drama',
};

const previewCard = {
  src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQE8qpzTtIZBQkcp9wvi9U_HUH0EfyqFrgQ2dFS4Igbw&s=10',
  alt: 'Moody portrait still from a Korean drama',
  title: 'Crash Course in Romance',
  match: 97,
};

const AuthHero = () => {
  return (
    <aside
      className="relative hidden lg:block overflow-hidden bg-background"
      aria-label="Welcome to Hangug Deulama"
    >
      {/* Backdrop */}
      <div className="absolute inset-0">
        <ImageWithSkeleton
          src={backdrop.src}
          alt={backdrop.alt}
          className="w-full h-full object-cover animate-ken-burns"
        />
      </div>

      {/* Scrims — keep the bottom-left content legible regardless of
          what the backdrop image contains */}
      <div
        className="absolute inset-0 bg-linear-to-t from-background via-background/55 to-background/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-r from-background/92 via-background/25 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-0 film-grain pointer-events-none" aria-hidden="true" />

      {/* Top brand mark — grounds the screen as part of the product,
          not a marketing splash */}
      <div className="relative z-10 flex items-center gap-2.5 p-10 xl:p-12">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-white">
          H
        </span>
        <span className="font-display text-sm font-semibold tracking-[0.14em] text-text-primary uppercase">
          Hangug Deulama
        </span>
      </div>

      {/* Headline + floating preview card */}
      <div className="relative z-10 flex h-[calc(100%-6rem)] flex-col justify-end p-10 xl:p-12">
        <p className="eyebrow text-accent mb-3 flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-8 h-px bg-accent/70" />
          한국 드라마 · K-DRAMA
        </p>
        <h1 className="font-display font-bold text-text-primary leading-[0.95] text-5xl xl:text-6xl tracking-tight max-w-md">
          Every story
          <br />
          worth staying up for.
        </h1>
        <p className="mt-4 max-w-sm text-text-secondary text-sm xl:text-base leading-relaxed">
          Swipe through curated K-dramas matched to your taste — from
          slow-burn romances to late-night thrillers.
        </p>

        <div
          className="mt-10 flex w-fit items-center gap-3 rounded-2xl
                     surface-card-elevated border border-border-strong
                     p-3 pr-5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]
                     animate-float"
        >
          <ImageWithSkeleton
            src={previewCard.src}
            alt={previewCard.alt}
            className="h-16 w-12 rounded-lg object-cover shrink-0"
          />
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-text-tertiary mb-1">
              Picked for you
            </p>
            <p className="font-display text-sm font-semibold text-text-primary">
              {previewCard.title}
            </p>
            <p className="text-xs font-semibold mt-0.5 text-gold">
              {previewCard.match}% Match
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AuthHero;