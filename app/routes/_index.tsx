import type { MetaFunction } from '@remix-run/node';
import EvoLink from '~/components/evo/evoLink';

export const meta: MetaFunction = () => {
  return [{ title: 'evolut1on' }];
};

const Index = () => {
  return (
    <div className="w-screen h-screen">
      <div className="blueprint size-full bg-evo-orange">
        <div className="absolute top-0 left-0 w-full p-8 flex flex-col gap-2">
          <img
            src="/assets/svg/evolut1on-fullwhite_2.svg"
            className="max-w-[20rem] w-1/4"
            alt=""
          />
          <h1>World Finals Saudi-Arabia 24</h1>
        </div>
        <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center flex-col gap-2">
          <EvoLink to="/reaction">Reaction</EvoLink>
          <EvoLink to="/game">Mobile Game Leaderboard</EvoLink>
          <EvoLink to="/content/1">Content Test</EvoLink>
          <EvoLink to="/video/1">Video Test</EvoLink>
        </div>
      </div>
    </div>
  );
};

export default Index;
