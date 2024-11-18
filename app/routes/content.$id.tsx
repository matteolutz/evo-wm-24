import { useParams } from '@remix-run/react';
import BackButton from '~/components/evo/backButton';
import EvoWavePattern from '~/components/evo/evoWave';

const ContentPage = () => {
  const { id } = useParams();

  return (
    <div className="size-full relative overflow-hidden">
      <BackButton />
      <EvoWavePattern />
      <div className="size-full overflow-y-scroll py-20">
        <img className="w-full" src={`/api/media/content/${id}.png`} alt="" />
      </div>
    </div>
  );
};

export default ContentPage;
