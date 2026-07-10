/* src/components/auth/AuthHero.jsx
   Cinematic left half of the auth screens: a rotated, staggered
   2x2 poster collage under a maroon glass-overlay gradient, matching
   the approved design reference. Purely presentational — swap the
   URLs for the platform's own CDN-hosted artwork when available. */

import ImageWithSkeleton from '../ui/ImageWithSkeleton';

const collageImages = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu1HEhU2jYrnULGZ8eLW1ZiFxlFDiCl1FAICjr0r0FPMw6oJYOgcwhizXnHeVjlpV8sWEYL2G4_ptNpL5eVy43vJUnYm44Jgx7AdkE8o7_9eni59cPZAcwh8THlAANm44xpgVV7yGk9vdQKSrLnAORwZxeXZtdzMnS-Rg0p1pD_ILQvyBLtRFXPcnzcInCx_h0rsoVDR_MtwLlRdtQGE5jRO0OZCtlHBO-wpC7cvS8HZA67vBOvOHj_rnxwXNND3dBBpep9ehQ7fo',
    alt: 'Cinematic portrait of a K-drama lead under neon rain in Seoul',
    height: 'h-[380px] xl:h-[420px]',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHz7eA6HgCGvAQ9FjZ3eGNP2FkXM2rVpvgA-U1_5iL7YJJO4rPlHXihUdaoaHIT47cfGGUAVKXN82kgfPlWfJq2G_dSelIkhUkz7ZnaoOkhNjeDsDYBjKB4Nnpq8-HI9AquoE2jPK4tiUZi8lybuyViUfqAyia5H1u1HMTr04cuYMWcmRzixD2Ob6zyuWqb7cJQ_lv0bNt-_8TkcolZlzvi_Gk8qcJuqLH9FbsCDGkeDcMIHtN-F63o0MdCsjjyqhC29Pw4mSCL9E',
    alt: 'Minimalist Seoul penthouse interior at twilight',
    height: 'h-[280px] xl:h-[320px]',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_G3O64a0JI2DjXA8X_XprxO0-ZQ8PMWwzXghvacvHLsyawW_x34mjI58t9nxDzaF3kzo2f0rPKSqueQ5oOp0w6R31WE4WAJNxsFybt9vywjBbC4zuUhxZRCVEsLTr2xmQit16QnNE6zsrDgLQADbMzp-eSPn2J8xBW7U88-NBY6Ld2N90b84DK71T51y8UTbqyT1Ewxq16U-XOa5ZkN60Isj18YksGyxqy_G6OYkRSUrWNZQPxEMOSYQJQL4f5-yVnjKWHSxSskU',
    alt: 'Close-up of a classic film camera and reels on a dark table',
    height: 'h-[280px] xl:h-[320px]',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFOnyI32qDdggvh2nUS0oEvpV2t_I4rBjywXexA7J5ldPmqMoVM4XqPHXnwRDtoG0ewZniwptGWyBnoxS1e1b2_1ST5bMNu9nEJY-USMG0h-C7RV90rG6xNFT2LC2Eon9TWQog_i7kZtsK8bY8fS8_JCBjsxqiw2YpGcdk3Wx_sYPfdg50sS2kA_uW7ag35Ua4JKeMPGn3F-WHlzbmWs-SXsqy7t8CJGUDo17xoMYGoZfjIdFqQX4eB03qY_Wr9bFPRSMb-OL-d60',
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
      <div
        className="absolute inset-0 z-10 flex flex-col justify-end p-10 xl:p-12"
        style={{
          background:
            'linear-gradient(135deg, rgba(91,0,23,0.82) 0%, rgba(28,16,17,0.96) 100%)',
        }}
      >
        <div className="max-w-md animate-float">
          <h1 className="font-display font-bold text-accent text-6xl xl:text-7xl leading-[1.05] mb-4">
            Hangug
            <br />
            Deulama
          </h1>
          <p className="text-text-secondary text-sm xl:text-base max-w-sm leading-relaxed opacity-90">
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