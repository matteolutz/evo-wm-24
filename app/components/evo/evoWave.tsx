import { FC } from 'react';
import { Slider } from '../ui/slider';
import { Volume } from 'lucide-react';

export type EvoWavePatternProps =
  | Record<string, never>
  | {
      volume: number;
      onVolumeChange: (_: number) => void;
    };

const EvoWavePattern: FC<EvoWavePatternProps> = ({
  volume,
  onVolumeChange
}) => {
  console.log(volume);
  return (
    <>
      <img
        className="absolute top-0 left-0 scale-y-[0.4] origin-top-left"
        src="/assets/svg/evo-wave-top.svg"
        alt=""
      />
      <img
        className="absolute bottom-0 right-0 scale-y-[0.4] origin-bottom-left w-full"
        src="/assets/svg/evo-wave-bottom.svg"
        alt=""
      />
      {volume !== undefined && (
        <div className="absolute bottom-0 right-0 w-[12rem] py-8 px-2 flex gap-2 items-center">
          <Volume className="text-white" />
          <Slider
            min={0}
            max={1}
            step={0.001}
            value={[volume]}
            onValueChange={([vol]) => onVolumeChange(vol)}
          />
        </div>
      )}
    </>
  );
};

export default EvoWavePattern;
