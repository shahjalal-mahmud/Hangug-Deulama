import clsx from 'clsx';
import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  ghost: 'bg-white/5 text-text-primary hover:bg-white/10',
  outline: 'border border-border-strong text-text-primary hover:bg-white/5',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = ({ as, to, variant = 'primary', size = 'md', className = '', children, ...rest }) => {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium',
    'uppercase tracking-wide transition-all duration-300 ease-cinematic',
    'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const Tag = as || 'button';
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
};

export default Button;