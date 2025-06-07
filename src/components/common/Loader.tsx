import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader = ({ size = 'md', text }: LoaderProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && <p className="mt-4 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;