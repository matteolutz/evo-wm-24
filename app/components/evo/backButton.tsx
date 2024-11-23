import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import EvoLink from './evoLink';

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ className, to, ...props }, ref) => {
    return (
      <div className="fixed top-4 left-4 flex gap-2 z-20">
        <Button
          {...props}
          ref={ref}
          className={className}
          variant="outline"
          size="icon"
          asChild
        >
          <EvoLink to={to}>
            <ChevronLeft />
          </EvoLink>
        </Button>

        <Button
          {...props}
          ref={ref}
          className={className}
          variant="outline"
          size="icon"
          asChild
        >
          <EvoLink to="/">
            <Home />
          </EvoLink>
        </Button>
      </div>
    );
  }
);
BackButton.displayName = 'BackButton';

export default BackButton;
