import type { MetaFunction } from '@remix-run/node';
import {
  Gamepad,
  Hammer,
  Lightbulb,
  ListVideo,
  Music,
  Rotate3D,
  Timer,
  Video
} from 'lucide-react';
import EvoLink from '~/components/evo/evoLink';
import { Card } from '~/components/ui/card';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { evoGradient } from '~/utils/gradient';

export const meta: MetaFunction = () => {
  return [{ title: 'evolut1on' }];
};

const links: Array<{
  to: string;
  title: string | JSX.Element;
  icon: JSX.Element;
}> = [
  {
    to: '/innovations',
    title: 'Innovations',
    icon: <Lightbulb />
  },
  {
    to: '/manifacturing',
    title: 'Manifacturing Methods',
    icon: <Hammer />
  },
  {
    to: '/video/1',
    title: 'Car Reveal',
    icon: <Video />
  },
  {
    to: '/soundtrack',
    title: 'Evolut1on Soundtrack',
    icon: <Music />
  },
  {
    to: '/car3d',
    title: (
      <>
        <span className="text-primary">evo-APEX</span> Exploration
      </>
    ),
    icon: <Rotate3D />
  },
  {
    to: '/reaction',
    title: 'Reaction Test',
    icon: <Timer />
  },
  {
    to: '/marketing',
    title: 'Marketing Interviews',
    icon: <ListVideo />
  },
  {
    to: '/team',
    title: 'Team',
    icon: <ListVideo />
  },
  {
    to: '/game',
    title: (
      <>
        <span>evoracer</span> Leaderboard
      </>
    ),
    icon: <Gamepad />
  }
];

const Index = () => {
  return (
    <div className="size-full">
      <div
        style={{
          backgroundImage: evoGradient(useNFCReaderId())
        }}
        className="blueprint size-full"
      >
        <div className="absolute top-[10rem] left-20 right-20 bottom-[6rem] z-10 grid grid-cols-3 grid-flow-row items-center justify-center">
          {links.map((l) => (
            <EvoLink
              className="flex justify-center items-center"
              key={l.to}
              to={l.to}
            >
              <Card className="aspect-[5/2.5] h-[10rem] flex justify-center items-center gap-4 p-4">
                {l.icon}
                <h2 className="text-2xl w-min">{l.title}</h2>
              </Card>
            </EvoLink>
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full p-8 flex flex-col gap-2">
          <img
            src="/assets/svg/evolut1on-fullwhite_2.svg"
            className="max-w-[20rem] w-1/4"
            alt=""
          />
          <h1 className="text-white">World Finals Saudi-Arabia 24</h1>
        </div>
      </div>
    </div>
  );
};

export default Index;
