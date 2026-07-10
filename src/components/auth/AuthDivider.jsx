/* src/components/auth/AuthDivider.jsx
   "Or continue with email" separator between social login and the form. */

const AuthDivider = ({ label = 'OR CONTINUE WITH EMAIL' }) => (
  <div className="relative flex items-center" role="separator">
    <div className="grow border-t border-outline-variant" />
    <span className="mx-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
      {label}
    </span>
    <div className="grow border-t border-outline-variant" />
  </div>
);

export default AuthDivider;