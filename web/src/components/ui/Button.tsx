import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const baseStyles =
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles: Record<string, string> = {
  primary: 'bg-primary text-black hover:shadow-glow active:scale-[0.98]',
  ghost: 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base'
};

const Button = ({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) => {
  return <button className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props} />;
};

export default Button;
