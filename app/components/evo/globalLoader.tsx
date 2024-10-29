import { useNavigation } from '@remix-run/react';
import { FC, useEffect, useState } from 'react';
import { cn } from '~/lib/utils';
import carSide from 'public/assets/png/car-side.png';

const GlobalLoader: FC = () => {
  const navigation = useNavigation();

  const isLoading = navigation.state !== 'idle';
  const [shouldDisplay, setShouldDisplay] = useState(isLoading);

  const active = shouldDisplay && isLoading;

  useEffect(() => {
    if (!isLoading) {
      setShouldDisplay(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldDisplay(true);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return (
    <>
      <div
        className={cn(
          'absolute top-0 left-0 size-full transition-opacity duration-500 opacity-0 -z-50',
          active && 'opacity-1',
          active && 'z-40'
        )}
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
        }}
      ></div>

      <div
        role="progressbar"
        aria-valuetext={active ? 'Loading' : undefined}
        aria-hidden={!active}
        className={cn(
          'pointer-events-none fixed left-0 bottom-0 z-50 p-4 transition-all duration-500 ease-out w-full',
          active ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="w-full bottom-0 relative p-2 h-[2rem] border rounded bg-background shadow-lg street overflow-x-clip">
          <img
            className={cn(
              'absolute -translate-y-1/2 top-0 h-[5rem] transition-opacity'
            )}
            style={{
              animation: active
                ? 'driveLeftToRightLoading 3s infinite cubic-bezier(0.87, 0, 0.13, 1)'
                : 'none',
              opacity: active ? 1 : 0
            }}
            src={carSide}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default GlobalLoader;
