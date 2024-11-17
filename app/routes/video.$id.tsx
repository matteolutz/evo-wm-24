import { FC } from 'react';
import BackButton from '~/components/evo/backButton';
import EvoWavePattern from '~/components/evo/evoWave';

const VideoPage: FC = () => {
  return (
    <div className="size-full relative overflow-hidden bg-black">
      <BackButton />
      <EvoWavePattern />
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="w-full h-full object-contain bg-rose-500"
        autoPlay
        loop
        controls
        src="/assets/videos/sebi.mp4"
      />
    </div>
  );
};

export default VideoPage;
