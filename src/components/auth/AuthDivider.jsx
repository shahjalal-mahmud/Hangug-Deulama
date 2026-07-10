/* src/components/auth/AuthDivider.jsx
   "Or continue with email" separator between social login and the form. */

const AuthDivider = ({ label = 'Or continue with email' }) => (
  <div className="relative flex items-center" role="separator">
    <div className="flex-grow border-t border-border" />
    <span className="mx-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
      {label}
    </span>
    <div className="flex-grow border-t border-border" />
  </div>
);

export default AuthDivider;