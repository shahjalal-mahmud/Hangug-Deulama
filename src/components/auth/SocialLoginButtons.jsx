/* src/components/auth/SocialLoginButtons.jsx
   Presentational-only social login row, matching the approved design.
   The API doesn't support OAuth yet, so these are visually complete
   but intentionally disabled — wire real handlers in once a provider
   is set up, then drop the `disabled`/title props.

   @see docs/pages/Login.jsx
   @see docs/pages/Register.jsx
   @see docs/PROJECT.md#sec-proj-api-auth-notes */

// NOTE: both buttons are `disabled` AND have `title="Coming soon"` —
// the title shows the browser's native tooltip on hover so users know
// it's not a regression, and `disabled` makes them unclickable so the
// disabled visual state stays honest.

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.91 3.22-1.92 4.22-1.2 1.2-3.08 2.48-5.92 2.48-4.74 0-8.5-3.84-8.5-8.5s3.76-8.5 8.5-8.5c2.56 0 4.54.98 5.92 2.3l2.3-2.3C18.66 1.94 15.96 1 12.48 1 6.54 1 1.6 5.94 1.6 11.88s4.94 10.88 10.88 10.88c3.2 0 5.62-1.06 7.54-3.06 2-2 2.62-4.8 2.62-7.14 0-.46-.04-.9-.12-1.34h-10.04z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.19 1.61-1.12 0-1.5-.68-2.81-.68-1.33 0-1.78.66-2.81.68-1.16.02-2.12-.6-3.16-1.58-2.12-2.02-3.72-5.71-3.72-8.91 0-3.15 1.63-4.81 3.21-4.81 1.05 0 1.93.68 2.64.68.68 0 1.6-.71 2.82-.71 1.05 0 2.21.5 2.94 1.54-2.58 1.48-2.15 4.93.44 6.22-.64 1.53-1.42 2.96-2.36 3.96zm-2.02-15.69c.89-1.08.89-2.04.89-3.09-1.04.1-1.99.71-2.59 1.43-.63.74-.83 1.76-.83 2.76 1.09-.04 1.84-.52 2.53-1.1z" />
  </svg>
);

const baseButtonClasses =
  'flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl ' +
  'bg-bg-elevated-2 border border-outline-variant ' +
  'text-text-primary text-sm font-semibold ' +
  'opacity-70 cursor-not-allowed select-none';

const SocialLoginButtons = () => (
  <div className="grid grid-cols-2 gap-4">
    <button type="button" title="Coming soon" disabled className={baseButtonClasses}>
      <GoogleIcon />
      Google
    </button>
    <button type="button" title="Coming soon" disabled className={baseButtonClasses}>
      <AppleIcon />
      Apple
    </button>
  </div>
);

export default SocialLoginButtons;