import Button from '../ui/Button';

const HeroSection = ({ name = 'there' }) => {
  const greeting = new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <section className="px-5 md:px-16 mb-12">
      <p className="text-text-tertiary text-xs uppercase tracking-widest mb-2">
        {greeting}, {name}
      </p>
      <h1 className="font-display text-4xl md:text-6xl font-bold text-text-primary leading-tight max-w-2xl">
        The stage is set for tonight&rsquo;s viewing
      </h1>
      <p className="text-text-secondary text-base md:text-lg max-w-xl mt-4">
        Your curated collection of cinematic dramas, picked for the way you watch.
      </p>
      <div className="mt-6">
        <Button to="/discover" size="lg">Start Watching</Button>
      </div>
    </section>
  );
};

export default HeroSection;