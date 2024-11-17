import BackButton from '~/components/evo/backButton';
import EvoWavePattern from '~/components/evo/evoWave';

const ContentPage = () => {
  return (
    <div className="size-full relative overflow-hidden">
      <BackButton />
      <EvoWavePattern />
      <div className="size-full overflow-y-scroll py-20">
        <img className="w-full" src="/assets/content/test.png" alt="" />
      </div>
    </div>
  );
};

export default ContentPage;
