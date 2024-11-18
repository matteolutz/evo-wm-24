import BackButton from '~/components/evo/backButton';
import EvoLink from '~/components/evo/evoLink';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { ALL_TRACKS } from '~/utils/game';

const Game = () => {
  return (
    <div className="w-screen h-screen">
      <BackButton to="/" />
      <div className="blueprint size-full bg-evo-orange flex flex-col items-center gap-8 p-8"></div>
      <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center gap-8 p-8">
        {ALL_TRACKS.map((track, idx) => (
          <EvoLink
            className="w-[20rem] transition-transform hover:scale-105"
            key={idx}
            to={'' + idx}
          >
            <Card className="size-full overflow-hidden flex flex-col">
              <img src={track.image} alt={track.name} />
              <div className="w-full h-full p-4">
                <h2 className="text-xl">{track.name}</h2>
              </div>
            </Card>
          </EvoLink>
        ))}
      </div>
    </div>
  );
};

export default Game;
