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
import { Card, CardHeader } from '~/components/ui/card';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { evoGradient } from '~/utils/gradient';

export const meta: MetaFunction = () => {
  return [{ title: 'evolut1on' }];
};

const links: Array<{
  to: string;
  title: string | JSX.Element;
  icon: JSX.Element;
  image?: string;
}> = [
  {
    to: '/team',
    title: 'Team',
    icon: <ListVideo />,
    image: '/assets/png/cards/team.png'
  },
  {
    to: '/innovations',
    title: 'Innovations',
    icon: <Lightbulb />,
    image: '/assets/png/cards/innovations.png'
  },
  {
    to: '/video/31',
    title: 'Car Reveal',
    icon: <Video />
  },
  {
    to: '/manifacturing',
    title: 'Manifacturing Methods',
    icon: <Hammer />,
    image: '/assets/png/cards/manifacturing.png'
  },
  {
    to: '/reaction',
    title: 'Reaction Test',
    icon: <Timer />,
    image: '/assets/png/cards/reaction.png'
  },
  {
    to: '/game',
    title: (
      <>
        <span>evoracer</span> Leaderboard
      </>
    ),
    icon: <Gamepad />,
    image: '/assets/png/cards/game.png'
  },
  {
    to: '/soundtrack',
    title: 'Evolut1on Soundtrack',
    icon: <Music />,
    image: '/assets/png/cards/soundtrack.png'
  },
  {
    to: '/car3d',
    title: (
      <>
        <span className="text-primary">evo-APEX</span> Exploration
      </>
    ),
    icon: <Rotate3D />,
    image: '/assets/png/cards/car3d.png'
  },
  {
    to: '/marketing',
    title: 'Marketing Interviews',
    icon: <ListVideo />,
    image: '/assets/png/cards/marketing.png'
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
        <div className="absolute top-[10rem] left-20 right-20 bottom-[4rem] z-10 grid grid-cols-3 grid-flow-row items-center justify-center">
          {links.map((l) => (
            <EvoLink
              className="flex justify-center items-center"
              key={l.to}
              to={l.to}
            >
              <Card className="aspect-[5/2.5] h-[10rem] transition-transform hover:scale-105 overflow-hidden border-none">
                <CardHeader className="w-full h-full relative space-y-0 tracking-normal">
                  <div className="absolute z-[1] top-0 left-0 p-6 flex flex-col gap-4">
                    {l.icon}{' '}
                    <h2 className="font-highrise text-4xl w-min">{l.title}</h2>{' '}
                  </div>
                  <div className="absolute z right-0 top-0 w-[60%] h-full">
                    <div
                      style={{
                        backgroundImage:
                          'linear-gradient(270deg, rgba(0, 0, 0, 0), 40%, rgba(255, 255, 255, 255))'
                      }}
                      className="absolute block w-full h-full"
                    />
                    <img
                      src={l.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
              </Card>
            </EvoLink>
          ))}
        </div>
        <div className="absolute z-[5] top-0 left-0 w-full p-8 flex flex-col gap-2">
          <img
            src="/assets/svg/evolut1on-fullwhite_2.svg"
            className="max-w-[20rem] w-1/4"
            alt=""
          />
          <div className="flex gap-2 items-center">
            <img
              className="h-[1.75rem] bg-[#1581db] border-white border p-2 rounded"
              src="/assets/svg/aramco.svg"
              alt=""
            />
            <img
              className="h-[1.75rem] bg-white p-2 rounded"
              src="/assets/svg/f1-schools.svg"
              alt=""
            />
            <h1 className="text-white ml-1 font-f1 text-sm italic">
              World Finals
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
