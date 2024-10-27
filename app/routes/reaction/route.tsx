import { json, useLoaderData, useRevalidator } from '@remix-run/react';
import { Award, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
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
import { cn } from '~/lib/utils';
import { dbReactionTimes } from '~/services/db.server';
import { ReactionTimeEntry } from '~/types/db';
import { ReactionEmitterMessage } from '~/types/emitter';

export const loader = async () => {
  if (process.env.EVO_MASTER_HOST) {
    const data = await fetch(
      `http://${process.env.EVO_MASTER_HOST}/api/reaction`
    ).then((r) => r.json());

    return json({
      reactions: data as Array<ReactionTimeEntry>,
      sseUrl: `http://${process.env.EVO_MASTER_HOST}/sse/reaction`
    });
  }

  return json({
    reactions: dbReactionTimes.chain().find().simplesort('time').data(),
    sseUrl: '/sse/reaction'
  });
};

const Reaction = () => {
  const { reactions, sseUrl } = useLoaderData<typeof loader>();
  const [reactionTestRunning, setReactionTestRunning] = useState<
    boolean | string
  >(false);

  const { revalidate } = useRevalidator();

  const serverMessage = useEventSource(sseUrl);

  useEffect(() => {
    if (!serverMessage) return;

    const { message } = JSON.parse(serverMessage) as {
      message: ReactionEmitterMessage;
    };

    switch (message.type) {
      case 'update-leaderboard':
        revalidate();
        break;
      case 'reaction-test-finished':
        setReactionTestRunning(false);
        console.log(
          `${message.timeEntry.username} finished in ${message.timeEntry.time}s`
        );
        // TODO: show popup
        revalidate();
      // eslint-disable-next-line no-fallthrough
      case 'reaction-test-finished-standalone':
        setReactionTestRunning(false);
        break;
      case 'reaction-test-started':
        setReactionTestRunning(message.username);
        break;
      case 'reaction-test-started-standalone':
        setReactionTestRunning(true);
        break;
      default:
        setReactionTestRunning(false);
        console.error('Unknown server message', serverMessage);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverMessage]);

  return (
    <div className="w-screen h-screen">
      <BackButton to="/" />
      <div className="blueprint size-full bg-evo-orange flex flex-col items-center gap-8 p-8"></div>
      <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center flex-col gap-8 p-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reaction Time Leaderboad</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span
                className={cn(
                  'size-[0.5rem] rounded-full block',
                  reactionTestRunning
                    ? 'bg-evo-orange animate-pulse'
                    : 'bg-green-500'
                )}
              />
              {reactionTestRunning ? (
                typeof reactionTestRunning === 'string' ? (
                  <p>
                    <span className="font-bold">{reactionTestRunning}</span> is
                    testing his reaction.
                  </p>
                ) : (
                  <p>Test is in use.</p>
                )
              ) : (
                <>
                  <p>Reaction test is ready.</p>{' '}
                  <Button variant="link">Test your reaction!</Button>
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
        {/*reactionTestRunning &&
          (typeof reactionTestRunning === 'string' ? (
            <p>{reactionTestRunning} is doing a test...</p>
          ) : (
            <p>Test running...</p>
            ))*/}
        <div className="relative w-full max-h-full overflow-x-hidden bg-background rounded-lg shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4rem] text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[4rem] text-center">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reactions.map((r, idx) => (
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
                  <TableCell className="text-lg">{r.username}</TableCell>
                  <TableCell className="text-center">
                    {(r.time * 1000).toFixed(2)}ms
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Reaction;
