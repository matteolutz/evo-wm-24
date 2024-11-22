import BackButton from '~/components/evo/backButton';
import EvoLink from '~/components/evo/evoLink';
import { Card } from '~/components/ui/card';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { evoGradient } from '~/utils/gradient';

const MANIFACTURING_METHODS: Array<{
  name: string;
  contentId: number;
}> = [
  {
    name: 'FDM',
    contentId: 1
  },
  {
    name: 'SLA',
    contentId: 2
  },
  {
    name: 'MJF',
    contentId: 3
  }
];

const ManifacturingPage = () => {
  return (
    <div className="size-full">
      <BackButton to="/" />
      <div
        className="blueprint size-full flex flex-col items-center gap-8 p-8"
        style={{ backgroundImage: evoGradient(useNFCReaderId()) }}
      />
      <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center gap-8 p-8">
        {MANIFACTURING_METHODS.map((interview, idx) => (
          <EvoLink
            className="w-[20rem] transition-transform hover:scale-105"
            key={idx}
            to={`/content/${interview.contentId}`}
          >
            <Card className="size-full overflow-hidden flex flex-col">
              <div className="w-full h-full p-4 flex gap-2 justify-center items-center">
                <h2 className="text-xl">{interview.name}</h2>
              </div>
            </Card>
          </EvoLink>
        ))}
      </div>
    </div>
  );
};

export default ManifacturingPage;
