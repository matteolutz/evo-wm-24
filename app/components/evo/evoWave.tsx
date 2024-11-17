import { FC } from 'react';

const EvoWavePattern: FC = () => {
  return (
    <>
      <img
        className="absolute top-0 left-0 scale-y-[0.4] origin-top-left"
        src="/assets/svg/evo-wave-top.svg"
        alt=""
      />
      <img
        className="absolute bottom-0 right-0 scale-y-[0.4] origin-bottom-left"
        src="/assets/svg/evo-wave-bottom.svg"
        alt=""
      />
    </>
  );
};

export default EvoWavePattern;
