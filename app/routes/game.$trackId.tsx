import { LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData, useRevalidator } from '@remix-run/react';
import { Award, Medal } from 'lucide-react';
import BackButton from '~/components/evo/backButton';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';
import useNFCReaderId from '~/hooks/useNFCReaderId';
import { cn } from '~/lib/utils';
import { trackLeaderboardCache } from '~/services/cache.server';
import { ALL_TRACKS, GameTrack, GameTrackLeaderboardEntry } from '~/utils/game';
import { evoGradient } from '~/utils/gradient';

type LoaderReturn = {
  leaderboard:
    | {
        tag: 'api';
        leaderboard: GameTrackLeaderboardEntry[];
      }
    | {
        tag: 'cached';
        leaderboard: GameTrackLeaderboardEntry[];
        lastUpdated: number;
      };
  track: GameTrack;
};

export const loader = async ({
  params
}: LoaderFunctionArgs): Promise<LoaderReturn> => {
  const { trackId: trackIdStr } = params as { trackId: string };
  const trackId = parseInt(trackIdStr, 10);

  if (isNaN(trackId) || trackId < 0 || trackId >= ALL_TRACKS.length) {
    throw new Error('Invalid trackId');
  }

  const track = ALL_TRACKS[trackId];

  const LEADERBOARD_URL = `https://lcv2-server.danqzq.games/get?publicKey=${track.leaderboardPublicKey}`;

  let leaderboard;
  try {
    leaderboard = await fetch(LEADERBOARD_URL).then((res) => res.json());
  } catch {
    const cache = trackLeaderboardCache.getWithTimestamp(trackId);

    return json({
      leaderboard: {
        tag: 'cached',
        leaderboard: cache?.val ?? [],
        lastUpdated: cache?.lastUpdated ?? 0
      },
      track
    });
  }

  trackLeaderboardCache.set(trackId, leaderboard);

  return json({
    leaderboard: {
      tag: 'api',
      leaderboard: leaderboard as GameTrackLeaderboardEntry[]
    },
    track
  });
};

const GameTrackLeaderboard = () => {
  const { leaderboard, track } = useLoaderData<typeof loader>();

  const { revalidate, state: revalidationState } = useRevalidator();

  return (
    <div className="w-screen h-screen">
      <BackButton to="/game" />
      <div
        className="blueprint size-full flex flex-col items-center gap-8 p-8"
        style={{ backgroundImage: evoGradient(useNFCReaderId()) }}
      />
      <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center flex-col gap-8 p-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              Leaderboard for Track{' '}
              <span className="text-primary">{track.name}</span>
            </CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <span
                className={cn(
                  'size-[0.5rem] rounded-full block',
                  leaderboard.tag === 'api'
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-evo-orange'
                )}
              />

              <p>
                {leaderboard.tag === 'api'
                  ? 'Live data'
                  : `Cached (${new Date(
                      leaderboard.lastUpdated
                    ).toLocaleDateString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })})`}
              </p>

              <Button
                variant="link"
                disabled={revalidationState === 'loading'}
                onClick={revalidate.bind(this)}
              >
                Refresh
              </Button>
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="relative w-full max-h-full overflow-x-hidden bg-background rounded-lg shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4rem] text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[4rem] text-center">At</TableHead>
                <TableHead className="w-[4rem] text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.leaderboard
                .sort((a, b) => b.Rank - a.Rank)
                .map((entry, idx) => (
                  <TableRow
                    key={idx}
                    className={cn(
                      idx < 3 && 'h-[6rem] font-bold',
                      idx === 0 && 'bg-evo-orange/50',
                      idx === 1 && 'bg-evo-orange/25',
                      idx === 2 && 'bg-evo-orange/10'
                    )}
                  >
                    <TableCell className="text-center">
                      {idx === 0 ? <Medal /> : idx < 3 ? <Award /> : idx + 1}
                    </TableCell>
                    <TableCell className="text-lg w-full">
                      {entry.Username}
                    </TableCell>
                    <TableCell className="text-center font-normal">
                      {new Date(entry.Date).toLocaleDateString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-center">{entry.Score}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GameTrackLeaderboard;
