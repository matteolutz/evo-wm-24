import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useRevalidator
} from '@remix-run/react';
import { AlertCircle, Award, Medal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { ReactionEmitterMessage } from '~/types/emitter';
import { ALL_TEAMS, getTeamByName } from '~/utils/teams';
import groupBy from '~/utils/group';
import { ActionFunctionArgs, TypedResponse } from '@remix-run/node';
import { globalServerState } from '~/services/state.server';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { serial } from '~/entry.server';
import { SerialPacketType } from '~/services/serial.server';
import { REACTION_TEST_QUEUE_TIMEOUT_SECONDS } from '~/utils/constants';
import StopWatch from '~/components/evo/stopWatch';
import ConfettiExplosion from 'react-confetti-explosion';

export const loader = async () => {
  return json({
    reactions: dbReactionTimes.chain().find().simplesort('time').data(),
    sseUrl: '/sse/reaction'
  });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<
  TypedResponse<
    | {
        tag: 'error';
        error: 'test-in-use' | 'invalid-form-data' | 'test-queued';
      }
    | { tag: 'success'; user: { name: string; teamName: string | undefined } }
  >
> => {
  if (globalServerState.currentReactionTest.user) {
    const delta =
      Date.now() - globalServerState.currentReactionTest.lastUpdated;
    if (delta < REACTION_TEST_QUEUE_TIMEOUT_SECONDS * 1_000) {
      return json({ tag: 'error', error: 'test-queued' });
    }
  }

  if (serial && serial.currentReactionTestState.state === 'running')
    return json({ tag: 'error', error: 'test-in-use' });

  const formData = await request.formData();
  const teamName = formData.get('teamName') as string;
  const userName = formData.get('username') as string;

  if (
    teamName === null ||
    userName === null ||
    teamName === 'none' ||
    userName === ''
  ) {
    return json({ tag: 'error', error: 'invalid-form-data' });
  }

  const team = teamName === 'none' ? undefined : getTeamByName(teamName);

  globalServerState.currentReactionTest = {
    user: { name: userName, teamName: team?.name },
    lastUpdated: Date.now()
  };
  serial?.sendBasicSerialPacket(SerialPacketType.TestQueued, 0x0);

  return json({
    tag: 'success',
    user: { name: userName, teamName: team?.name }
  });
};

const Reaction = () => {
  const { reactions, sseUrl } = useLoaderData<typeof loader>();
  const [reactionTestState, setReactionTestState] = useState<
    | { state: 'running'; busy: true }
    | {
        state: 'user-running';
        user: { name: string; teamName: string | undefined };
        busy: true;
      }
    | {
        state: 'lights-out';
        user: { name: string; teamName: string | undefined };
        startTime: number;
        busy: true;
      }
    | { state: 'idle'; busy: false }
    | {
        state: 'user-finished';
        user: { name: string; teamName: string | undefined };
        time: number;
        busy: false;
      }
    | {
        state: 'failed';
        busy: false;
      }
  >({ state: 'idle', busy: false });

  const { revalidate } = useRevalidator();

  const [dialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
        setReactionTestState({
          state: 'user-finished',
          user: {
            name: message.timeEntry.username,
            teamName: message.timeEntry.team
          },
          time: message.timeEntry.time,
          busy: false
        });
        console.log(
          `${message.timeEntry.username} finished in ${message.timeEntry.time}s`
        );
        // TODO: show popup
        // revalidate();

        formRef.current?.reset();
        reactions.push(message.timeEntry);
        break;
      // eslint-disable-next-line no-fallthrough
      case 'reaction-test-finished-standalone':
        setReactionTestState({ state: 'idle', busy: false });
        break;
      case 'reaction-test-started':
        setReactionTestState({
          state: 'user-running',
          user: message.user,
          busy: true
        });
        break;
      case 'reaction-test-started-standalone':
        setReactionTestState({
          state: 'running',
          busy: true
        });
        break;
      // This message will only be sent, if the test is started not standalone
      case 'reaction-test-lights-out':
        setReactionTestState({
          state: 'lights-out',
          user: message.user,
          startTime: Date.now(),
          busy: true
        });
        break;
      case 'reaction-test-failed':
        setReactionTestState({ state: 'failed', busy: false });
        break;
      default:
        setReactionTestState({ state: 'idle', busy: false });
        console.error('Unknown server message', serverMessage);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverMessage]);

  useEffect(() => {
    if (dialogOpen) return;

    formRef.current?.reset();
    revalidate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

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
                  reactionTestState.state === 'running'
                    ? 'bg-evo-orange animate-pulse'
                    : 'bg-green-500'
                )}
              />
              {reactionTestState.busy ? (
                reactionTestState.state === 'user-running' ? (
                  <p>
                    <span className="font-bold">
                      {reactionTestState.user.name}
                    </span>{' '}
                    is testing his reaction.
                  </p>
                ) : (
                  <p>Test in use...</p>
                )
              ) : (
                <p>Reaction test is ready.</p>
              )}
              <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    setReactionTestState({ state: 'idle', busy: false });
                  }

                  setDialogOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button disabled={reactionTestState.busy} variant="link">
                    Test your reaction!
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Form method="post" ref={formRef}>
                    <DialogHeader>
                      <DialogTitle>Reaction Test</DialogTitle>
                      {reactionTestState.state !== 'user-running' &&
                        reactionTestState.state !== 'lights-out' &&
                        reactionTestState.state !== 'user-finished' &&
                        reactionTestState.state !== 'failed' && (
                          <DialogDescription>
                            You can use the{' '}
                            <span className="font-bold">Reaction Test</span>{' '}
                            right next to you to find out how good your reaction
                            is.
                            <br />
                            If you want, you can enter you name (and team) right
                            here, so that your result will be displayed on the
                            leaderboard.
                          </DialogDescription>
                        )}
                    </DialogHeader>
                    {reactionTestState.state === 'user-running' &&
                    reactionTestState.user ? (
                      <div className="py-16 flex justify-center items-center text-lg font-bold">
                        Wait for lights out!
                      </div>
                    ) : reactionTestState.state === 'lights-out' ? (
                      <div className="py-16 flex justify-center items-center flex-col gap-2 text-4xl font-bold">
                        <StopWatch startTime={reactionTestState.startTime} />
                      </div>
                    ) : reactionTestState.state === 'user-finished' ? (
                      <div className="py-16 flex justify-center items-center flex-col gap-2">
                        <p>Great, you finished with</p>
                        <p className="text-4xl font-bold">
                          {(reactionTestState.time * 1_000).toFixed(2)}ms
                        </p>
                        <Button
                          variant="link"
                          type="button"
                          onClick={setDialogOpen.bind(this, false)}
                        >
                          See your time on the leaderboard
                        </Button>
                        <ConfettiExplosion
                          zIndex={100000}
                          force={1.2}
                          duration={6000}
                          particleCount={500}
                          width={window.innerWidth}
                        />
                      </div>
                    ) : reactionTestState.state === 'failed' ? (
                      <div className="py-16 flex justify-center items-center flex-col gap-2">
                        <p>Mmmh, that was a bit too slow.</p>
                        <p className="text-4xl font-bold">Test failed.</p>
                      </div>
                    ) : (
                      <>
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
                        {actionData && actionData.tag === 'success' ? (
                          <Alert className="my-4 border-2" variant="success">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Reaction test started!</AlertTitle>
                            <AlertDescription>
                              The reaction test next to you{' '}
                              <span className="font-bold">starts now</span>. The
                              next test will be displayed on the leaderboard
                              with the name {actionData.user.name}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <div className="py-8 flex flex-col gap-4">
                            <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="username">Name</Label>
                              <Input
                                type="text"
                                id="username"
                                placeholder="Name"
                                name="username"
                                required
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
                                    groupBy(
                                      ALL_TEAMS,
                                      (t) => t.country
                                    ).entries()
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
                        )}
                      </>
                    )}
                    <DialogFooter>
                      {!(actionData && actionData.tag === 'success') && (
                        <Button type="submit">Start Test</Button>
                      )}
                    </DialogFooter>
                  </Form>
                </DialogContent>
              </Dialog>
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
                <TableHead className="w-[4rem] text-center">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reactions
                .sort((a, b) => a.time - b.time)
                .map((r, idx) => (
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
                    <TableCell className="text-center font-normal">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
