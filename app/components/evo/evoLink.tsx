import { Link, useSearchParams } from '@remix-run/react';
import { RemixLinkProps } from '@remix-run/react/dist/components';
import { ElementRef, forwardRef } from 'react';

const EvoLink = forwardRef<
  ElementRef<typeof Link>,
  Omit<RemixLinkProps, 'to'> & { to: string }
>(({ to, ...props }, ref) => {
  const [searchParams] = useSearchParams();
  searchParams;
  return (
    <Link
      ref={ref}
      {...props}
      to={{ pathname: to, search: searchParams.toString() }}
    />
  );
});

EvoLink.displayName = 'EvoLink';

export default EvoLink;
