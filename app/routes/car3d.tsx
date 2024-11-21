import { FC, useState } from 'react';
import BackButton from '~/components/evo/backButton';
import EvoWavePattern from '~/components/evo/evoWave';

const IMAGES = [
  '/api/media/car3d/auto1.png',
  '/api/media/car3d/auto2.png',
  '/api/media/car3d/auto3.png',
  '/api/media/car3d/auto4.png',
  '/api/media/car3d/auto5.png',
  '/api/media/car3d/auto6.png',
  '/api/media/car3d/auto7.png',
  '/api/media/car3d/auto8.png',
  '/api/media/car3d/auto9.png',
  '/api/media/car3d/auto10.png',
  '/api/media/car3d/auto11.png',
  '/api/media/car3d/auto12.png',
  '/api/media/car3d/auto13.png',
  '/api/media/car3d/auto14.png',
  '/api/media/car3d/auto15.png',
  '/api/media/car3d/auto16.png',
  '/api/media/car3d/auto17.png',
  '/api/media/car3d/auto18.png',
  '/api/media/car3d/auto19.png',
  '/api/media/car3d/auto20.png',
  '/api/media/car3d/auto21.png',
  '/api/media/car3d/auto22.png',
  '/api/media/car3d/auto23.png',
  '/api/media/car3d/auto24.png'
];
const NUM_IMAGES = IMAGES.length;

export const links = () =>
  IMAGES.map((i) => ({ rel: 'preload', href: i, as: 'image' }));

const Car3DPage: FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const [mouseDownState, setMouseDownState] = useState<
    { x: number; y: number; mouseDownImage: number } | undefined
  >();

  const onMouseMove = (x: number, _y: number) => {
    if (!mouseDownState) return;

    const dx = -(x - mouseDownState.x);
    const numImages = Math.floor(dx / 80);

    let next = mouseDownState.mouseDownImage + numImages;
    while (next < 0) {
      next += NUM_IMAGES;
    }

    setCurrentImage(next % NUM_IMAGES);
  };

  return (
    <div className="size-full flex justify-center items-center relative">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        className="size-full object-contain cursor-pointer"
        src={IMAGES[currentImage]}
        alt=""
        draggable={false}
        onMouseDown={(e) => {
          setMouseDownState({
            x: e.clientX,
            y: e.clientY,
            mouseDownImage: currentImage
          });
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          setMouseDownState({
            x: touch.clientX,
            y: touch.clientY,
            mouseDownImage: currentImage
          });
        }}
        onMouseUp={setMouseDownState.bind(this, undefined)}
        onTouchEnd={setMouseDownState.bind(this, undefined)}
        onMouseMove={(e) => onMouseMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          onMouseMove(touch.clientX, touch.clientY);
        }}
      />
      <EvoWavePattern />
      <BackButton />
    </div>
  );
};

export default Car3DPage;
