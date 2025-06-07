import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  bordered = false,
}) => {
  const hoverClass = hoverable
    ? 'transition-shadow duration-300 hover:shadow-card-hover'
    : '';
  
  const borderClass = bordered ? 'border border-gray-200' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-card p-6 ${hoverClass} ${borderClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;