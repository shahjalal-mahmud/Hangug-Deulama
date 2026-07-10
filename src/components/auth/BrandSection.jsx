/* src/components/auth/BrandSection.jsx
   Mobile-only brand mark that sits above the auth form. The full
   cinematic collage (AuthHero) is hidden on small screens. */

const BrandSection = () => (
  <div className="lg:hidden mb-10 text-center animate-fade-up">
    <h1 className="font-display text-4xl font-bold text-primary">
      Hangug Deulama
    </h1>
  </div>
);

export default BrandSection;