import { Link, useNavigate, useSearchParams } from '@remix-run/react';
import { RemixLinkProps } from '@remix-run/react/dist/components';
import { ElementRef, forwardRef } from 'react';

const EvoLink = forwardRef<
  ElementRef<typeof Link>,
  Omit<RemixLinkProps, 'to'> & { to?: string }
>(({ to, ...props }, ref) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return to ? (
    <Link
      ref={ref}
      {...props}
      to={{ pathname: to, search: searchParams.toString() }}
    />
  ) : (
    <Link
      ref={ref}
      {...props}
      to="javascript:void(0)"
      onClick={navigate.bind(this, -1)}
    />
  );
});

EvoLink.displayName = 'EvoLink';

export default EvoLink;
