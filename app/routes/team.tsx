import { FC } from 'react';
import BackButton from '~/components/evo/backButton';
import EvoLink from '~/components/evo/evoLink';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { evoGradient } from '~/utils/gradient';
import { TEAM } from '../constants/team';

const TeamPage: FC = () => {
  return (
    <div className="size-full">
      <div
        className="blueprint size-full"
        style={{ backgroundImage: evoGradient(useNFCReaderId()) }}
      />
      <div className="absolute top-0 left-0 z-10 size-full flex justify-center items-center gap-8">
        {TEAM.map(({ name, videoId }) => (
          <EvoLink
            className="h-1/2 hover:scale-105 transition-transform"
            key={name}
            to={`/video/${videoId}`}
          >
            <img
              className="rounded h-full bg-white shadow-lg"
              src={`/assets/svg/team/${name}.svg`}
              alt=""
            />
          </EvoLink>
        ))}
      </div>

      <BackButton />
    </div>
  );
};

export default TeamPage;
