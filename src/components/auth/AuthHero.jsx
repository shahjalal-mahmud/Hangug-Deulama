/* src/components/auth/AuthHero.jsx
   Cinematic left half of the auth screens: a rotated, staggered
   2x2 poster collage under a maroon glass-overlay gradient, matching
   the approved design reference. Purely presentational — swap the
   URLs for the platform's own CDN-hosted artwork when available.

   @see docs/pages/Login.jsx
   @see docs/pages/Register.jsx
   @see docs/PROJECT.md#sec-proj-ui-plan */

// NOTE: the four external image URLs are placeholders pointing at
// public GStatic thumbnails — they're allowed because they're hosted
// by Google directly (no CORS issues, no broken image fallbacks).
// Swap them for your own CDN-hosted artwork before going to production.
import ImageWithSkeleton from '../ui/ImageWithSkeleton';

const collageImages = [
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj22lTtvmEFNKw7q8jral89qFY8hL0re3URl3RKNF6xg&s=10',
    alt: 'Cinematic portrait of a K-drama lead under neon rain in Seoul',
    height: 'h-[380px] xl:h-[420px]',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT6EJQ570ov9ObDASjZv55D3ECM_W1vPxMQOecIK6HKA&s=10',
    alt: 'Minimalist Seoul penthouse interior at twilight',
    height: 'h-[280px] xl:h-[320px]',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCFlcdPV8mrVfhJdapHbkGYKOlF4hTvWFgU-I5BbhKjw&s=10',
    alt: 'Close-up of a classic film camera and reels on a dark table',
    height: 'h-[280px] xl:h-[320px]',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTau7K8ztgAoESymTJ4wUvnQCcZsRMa2MxQTtol7cwc6w&s=10',
    alt: 'Traditional palace courtyard lit by paper lanterns at night',
    height: 'h-[380px] xl:h-[420px]',
  },
];

const AuthHero = () => {
  return (
    <aside
      className="relative hidden lg:flex items-center justify-center
                 overflow-hidden bg-background border-r border-border"
      aria-label="Welcome to Hangug Deulama"
    >
      {/* Rotated, staggered 2x2 poster collage */}
      <div
        className="absolute -top-10 -left-10 grid grid-cols-2 gap-3 w-full h-[120%]"
        style={{ transform: 'rotate(-5deg) scale(1.1)' }}
        aria-hidden="true"
      >
        <div className="space-y-3 pt-12">
          {[collageImages[0], collageImages[1]].map((img, i) => (
            <div
              key={img.alt}
              className={`${img.height} rounded-xl overflow-hidden shadow-2xl
                         transition-transform duration-700 hover:scale-105
                         animate-collage-in`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <ImageWithSkeleton src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[collageImages[2], collageImages[3]].map((img, i) => (
            <div
              key={img.alt}
              className={`${img.height} rounded-xl overflow-hidden shadow-2xl
                         transition-transform duration-700 hover:scale-105
                         animate-collage-in`}
              style={{ animationDelay: `${(i + 2) * 90}ms` }}
            >
              <ImageWithSkeleton src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Maroon glass overlay + branding */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center p-10 xl:p-12 glass-overlay">
        <div className="max-w-md animate-float">
          <h1 className="font-display font-bold text-primary text-6xl xl:text-7xl leading-[1.05] mb-4">
            Hangug
            <br />
            Deulama
          </h1>
          <p className="text-on-surface-variant text-sm xl:text-base max-w-sm leading-relaxed opacity-90">
            Experience the most compelling stories from Korea in stunning
            cinematic quality. Your journey into the heart of Seoul&apos;s
            finest dramas begins here.
          </p>
        </div>
      </div>

      <div className="absolute inset-0 film-grain pointer-events-none z-10" aria-hidden="true" />
    </aside>
  );
};

export default AuthHero;