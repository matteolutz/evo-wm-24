import { useParams } from '@remix-run/react';
import { Play } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import BackButton from '~/components/evo/backButton';
import EvoWavePattern from '~/components/evo/evoWave';
import { Button } from '~/components/ui/button';
import { useVolume } from '~/hooks/volume';

const VideoPage: FC = () => {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [backgroundVideoRef, setBackgroundVideoRef] =
    useState<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setVideoPlaying] = useState(false);

  const [videoVolume, setVideoVolume] = useVolume(videoRef);

  const { id } = useParams();

  useEffect(() => {
    if (!videoRef) return;

    const onPlay = setVideoPlaying.bind(this, true);

    videoRef.addEventListener('play', onPlay);

    return () => videoRef.removeEventListener('play', onPlay);
  }, [videoRef]);

  useEffect(() => {
    if (!backgroundVideoRef || !videoRef) return;
    backgroundVideoRef.currentTime = videoRef.currentTime;

    if (isVideoPlaying) {
      backgroundVideoRef.play();
      return;
    }

    backgroundVideoRef.pause();
  }, [isVideoPlaying]);

  return (
    <div className="size-full relative overflow-hidden bg-black">
      <div className="h-full relative">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */};
        <video
          ref={setBackgroundVideoRef}
          className="absolute top-0 left-0 size-full object-cover object-center blur-lg"
          loop
          muted
        >
          <source src={`/api/media/video/${id}.mp4`} type="video/mp4" />
          <source src={`/api/media/video/${id}.mov`} type="video/mp4" />
        </video>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */};
        <video
          ref={setVideoRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full object-contain shadow-2xl"
          loop
          autoPlay
        >
          <source src={`/api/media/video/${id}.mp4`} type="video/mp4" />
          <source src={`/api/media/video/${id}.mov`} type="video/mp4" />
        </video>
        {!isVideoPlaying && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <Button onClick={() => videoRef?.play()} size="icon">
              <Play />
            </Button>
          </div>
        )}
      </div>
      <BackButton />
      <EvoWavePattern
        volume={videoVolume}
        onVolumeChange={setVideoVolume.bind(this)}
      />
    </div>
  );
};

export default VideoPage;
