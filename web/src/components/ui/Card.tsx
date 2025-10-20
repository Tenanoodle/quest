import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => (
  <div className={clsx('glass-card rounded-3xl border border-white/5 p-6 shadow-lg shadow-black/40', className)}>
    {children}
  </div>
);

export default Card;
