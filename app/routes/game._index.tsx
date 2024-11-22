import BackButton from '~/components/evo/backButton';
import EvoLink from '~/components/evo/evoLink';
import { Card } from '~/components/ui/card';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { ALL_TRACKS } from '~/utils/game';
import { evoGradient } from '~/utils/gradient';

const Game = () => {
  return (
    <div className="w-screen h-screen">
      <BackButton to="/" />
      <div
        className="blueprint size-full flex flex-col items-center gap-8 p-8"
        style={{ backgroundImage: evoGradient(useNFCReaderId()) }}
      />
      <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center gap-8 p-8">
        {ALL_TRACKS.map((track, idx) => (
          <EvoLink
            className="w-[20rem] transition-transform hover:scale-105"
            key={idx}
            to={'' + idx}
          >
            <Card className="size-full overflow-hidden flex flex-col border-none">
              <img src={track.image} alt={track.name} />
              <div className="w-full h-full p-4">
                <h2 className="text-2xl">{track.name}</h2>
              </div>
            </Card>
          </EvoLink>
        ))}
      </div>
    </div>
  );
};

export default Game;
