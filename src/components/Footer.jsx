/* src/components/Footer.jsx */
const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content hidden sm:flex">
      <div>
        <p className="font-bold text-lg">🇰🇷 Hangug Deulama</p>
        <p>Your K-Drama Discovery Platform</p>
        <p>Software Development II - Academic Project</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover">About</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Privacy</a>
          <a className="link link-hover">Terms</a>
        </div>
      </div>
      <div>
        <p>© 2026 Hangug Deulama. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;