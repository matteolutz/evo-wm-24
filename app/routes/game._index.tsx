import BackButton from '~/components/evo/backButton';
import EvoLink from '~/components/evo/evoLink';
import { Button } from '~/components/ui/button';
import { ALL_TRACKS } from '~/utils/game';

const Game = () => {
  return (
    <div className="w-screen h-screen">
      <BackButton to="/" />
      <div className="blueprint size-full bg-evo-orange flex flex-col items-center gap-8 p-8"></div>
      <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center flex-col gap-8 p-8">
        {ALL_TRACKS.map((track, idx) => (
          <Button key={idx} variant="link" asChild>
            <EvoLink to={'' + idx}>{track.name}</EvoLink>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Game;
