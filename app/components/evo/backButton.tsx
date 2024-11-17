import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '~/lib/utils';
import EvoLink from './evoLink';

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
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
        <EvoLink to={to}>
          <ChevronLeft />
        </EvoLink>
      </Button>
    );
  }
);
BackButton.displayName = 'BackButton';

export default BackButton;
