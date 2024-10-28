import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useRevalidator
} from '@remix-run/react';
import { AlertCircle, Award, Medal } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
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
import { ALL_TEAMS, getTeamByName } from '~/utils/teams';
import groupBy from '~/utils/group';
import { ActionFunctionArgs, TypedResponse } from '@remix-run/node';
import { globalServerState } from '~/services/state.server';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

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

export const action = async ({
  request
}: ActionFunctionArgs): Promise<
  TypedResponse<{ tag: 'error'; error: 'test-in-use' } | { tag: 'success' }>
> => {
  if (globalServerState.currentReactionTest.user) {
    const delta =
      Date.now() - globalServerState.currentReactionTest.lastUpdated;
    if (delta < 20_000) {
      return json({ tag: 'error', error: 'test-in-use' });
    }
  }

  const formData = await request.formData();
  const teamName = formData.get('teamName') as string;
  const userName = formData.get('username') as string;

  const team = teamName === 'none' ? undefined : getTeamByName(teamName);

  globalServerState.currentReactionTest = {
    user: { name: userName, teamName: team?.name },
    lastUpdated: Date.now()
  };

  return json({ tag: 'success' });
};

const Reaction = () => {
  const { reactions, sseUrl } = useLoaderData<typeof loader>();
  const [reactionTestRunning, setReactionTestRunning] = useState<
    boolean | string
  >(false);

  const { revalidate } = useRevalidator();

  const serverMessage = useEventSource(sseUrl);

  const actionData = useActionData<typeof action>();

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link">Test your reaction!</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <Form method="post">
                        <DialogHeader>
                          <DialogTitle>Reaction Test</DialogTitle>
                          <DialogDescription>
                            You can use the{' '}
                            <span className="font-bold">Reaction Test</span>{' '}
                            right next to you to find out how good your reaction
                            is. Optionally you can enter you name and team right
                            here, so that your result will be saved in the
                            leaderboard.
                          </DialogDescription>
                        </DialogHeader>
                        {actionData && actionData.tag === 'error' && (
                          <Alert
                            className="my-4 border-2"
                            variant="destructive"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Reaction test start failed</AlertTitle>
                            <AlertDescription>
                              {actionData.error}
                            </AlertDescription>
                          </Alert>
                        )}
                        {actionData && actionData.tag === 'success' && (
                          <Alert className="my-4 border-2" variant="success">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Reaction test initiated</AlertTitle>
                            <AlertDescription>
                              Please start the reaction test right next to you.
                              The result will be saved in the leaderboard.
                            </AlertDescription>
                          </Alert>
                        )}
                        <div className="py-8 flex flex-col gap-4">
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="username">Name</Label>
                            <Input
                              type="text"
                              id="username"
                              placeholder="Name"
                              name="username"
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="teamSelect">Team</Label>
                            <Select name="teamName" defaultValue="none">
                              <SelectTrigger id="teamSelect">
                                <SelectValue placeholder="Team" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectSeparator />
                                {Array.from(
                                  groupBy(ALL_TEAMS, (t) => t.country).entries()
                                ).map(([country, teams]) => (
                                  <SelectGroup key={country}>
                                    <SelectLabel>{country}</SelectLabel>
                                    {teams.map((t) => (
                                      <SelectItem key={t.name} value={t.name}>
                                        {t.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Start Test</Button>
                        </DialogFooter>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

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
                  <TableCell className="text-lg w-full">
                    {r.username}{' '}
                    {r.team && (
                      <span
                        className="ml-2 py-1 px-2 bg-background rounded text-sm border-2"
                        style={{ color: getTeamByName(r.team)!.cssColor }}
                      >
                        {getTeamByName(r.team)!.name}
                      </span>
                    )}
                  </TableCell>
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
