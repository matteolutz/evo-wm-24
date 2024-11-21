import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useVolume = (
  ref: HTMLVideoElement | HTMLAudioElement | null,
  initialVolume: number = 0.5
): [number, Dispatch<SetStateAction<number>>] => {
  const [volume, setVolume] = useState<number>(initialVolume);

  useEffect(() => {
    if (!ref) return;
    ref.volume = volume;
  }, [ref]);

  useEffect(() => {
    if (!ref) return;
    ref.volume = volume;
  }, [volume]);

  return [volume, setVolume];
};
