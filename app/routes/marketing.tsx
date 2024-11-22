import { FC } from 'react';
import BackButton from '~/components/evo/backButton';
import EvoLink from '~/components/evo/evoLink';
import { Card } from '~/components/ui/card';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { evoGradient } from '~/utils/gradient';

const MARKETING_INTERVIEWS: Array<{
  company: string;
  logo: string;
  videoId: number;
}> = [
  {
    company: 'DoubleSlash',
    logo: '/assets/png/marketing/doubleslash.png',
    videoId: 20
  },
  {
    company: 'ifm',
    logo: '/assets/png/marketing/ifm.png',
    videoId: 21
  },
  {
    company: 'Rolls Royce PS',
    logo: '/assets/png/marketing/rrps.png',
    videoId: 22
  },
  {
    company: 'Raditek',
    logo: '/assets/png/marketing/raditek.png',
    videoId: 23
  }
];

const MarketingPage: FC = () => {
  return (
    <div className="w-screen h-screen">
      <BackButton to="/" />
      <div
        className="blueprint size-full flex flex-col items-center gap-8 p-8"
        style={{ backgroundImage: evoGradient(useNFCReaderId()) }}
      />
      <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center gap-8 p-8">
        {MARKETING_INTERVIEWS.map((interview, idx) => (
          <EvoLink
            className="w-[20rem] transition-transform hover:scale-105"
            key={idx}
            to={`/video/${interview.videoId}`}
          >
            <Card className="size-full overflow-hidden flex flex-col">
              <div className="w-full h-full p-4 flex gap-2 justify-center items-center">
                <img className="h-8" src={interview.logo} alt="" />
                <h2 className="text-2xl">{interview.company}</h2>
              </div>
            </Card>
          </EvoLink>
        ))}
      </div>
    </div>
  );
};

export default MarketingPage;
