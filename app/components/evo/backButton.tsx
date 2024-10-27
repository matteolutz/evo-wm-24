import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '~/lib/utils';

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ className, to, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        className={cn(className, 'fixed', 'top-4', 'left-4', 'z-20')}
        variant="outline"
        size="icon"
        asChild
      >
        <Link to={to}>
          <ChevronLeft />
        </Link>
      </Button>
    );
  }
);
BackButton.displayName = 'BackButton';

export default BackButton;
