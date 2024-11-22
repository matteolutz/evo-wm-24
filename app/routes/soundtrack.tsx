import { FC, useState } from 'react';
import BackButton from '~/components/evo/backButton';
import EvoWavePattern from '~/components/evo/evoWave';
import { useVolume } from '~/hooks/volume';

const SoundtrackPage: FC = () => {
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [audioVolume, setAudioVolume] = useVolume(audioRef);

  return (
    <div className="size-full relative overflow-hidden">
      <BackButton />
      <EvoWavePattern
        volume={audioVolume}
        onVolumeChange={setAudioVolume.bind(this)}
      />
      <div className="size-full overflow-y-scroll py-20">
        <img className="w-full" src={`/api/media/content/0.png`} alt="" />
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        className="hidden"
        src={'/api/media/audio/theme.wav'}
        loop
        autoPlay
        ref={setAudioRef}
      />
    </div>
  );
};

export default SoundtrackPage;
