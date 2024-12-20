import { FC, useEffect, useRef, useState } from 'react';
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

const DebugPage: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<Array<HTMLImageElement | null>>(
    new Array(IMAGES.length).fill(null)
  );

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
      next += IMAGES.length;
    }

    const newCurrent = next % IMAGES.length;

    if (newCurrent != currentImage) {
      setCurrentImage(newCurrent);
    }
  };

  useEffect(() => {
    IMAGES.forEach((src, idx) => {
      const image = new Image();
      image.addEventListener('load', () => {
        setImages((images) => {
          const newImages = [...images];
          newImages[idx] = image;
          return newImages;
        });
      });
      image.src = src;
    });
  }, []);

  const drawImage = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    canvasWidth: number
  ) => {
    const imageWidth = canvasWidth;
    const imageHeight = (image.height / image.width) * imageWidth;
    ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
  };

  useEffect(() => {
    if (!canvasRef.current || images.some((i) => i === null)) return;

    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    drawImage(ctx, images[currentImage]!, canvasWidth);
  }, [canvasRef, images, currentImage]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="size-full flex justify-center items-center relative"
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
    >
      <canvas className="size-full" ref={canvasRef} />
      <EvoWavePattern />
      <BackButton />
    </div>
  );
};

export default DebugPage;
