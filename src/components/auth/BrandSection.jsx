/* src/components/auth/BrandSection.jsx
   Mobile-only brand block that sits above the auth form. The full
   cinematic collage (AuthHero) is hidden on small screens — this is
   the compact equivalent. */

const BrandSection = () => {
  return (
    <div className="lg:hidden mb-10 text-center animate-fade-up">
      <p className="eyebrow text-accent mb-2 flex items-center justify-center gap-2">
        <span aria-hidden="true" className="inline-block w-6 h-px bg-accent/70" />
        한국 드라마 · K-DRAMA
      </p>
      <h1 className="font-display font-bold text-text-primary leading-[0.95] text-5xl tracking-tight">
        Hangug
        <br />
        <span className="bg-gradient-to-r from-accent via-accent-hover to-gold bg-clip-text text-transparent">
          Deulama
        </span>
      </h1>
      <p className="mt-4 text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
        Curated Korean cinema, hand-picked for every mood and every late-night.
      </p>
    </div>
  );
};

export default BrandSection;