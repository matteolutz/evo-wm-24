import { json, useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import { dbReactionTimes } from '~/services/db.server';
import { ReactionServerClientMessage } from '~/types/sse';

export const loader = async () => {
  return json(dbReactionTimes.chain().find().simplesort('time').data());
};

const Reaction = () => {
  const data = useLoaderData<typeof loader>();

  const { revalidate } = useRevalidator();

  const serverMessage = useEventSource(
    '/sse/reaction'
  ) as ReactionServerClientMessage | null;

  useEffect(() => {
    if (!serverMessage) return;

    const { type } = JSON.parse(serverMessage);

    switch (type) {
      case 'update-leaderboard':
        revalidate();
        break;
      default:
        console.error('Unknown server message', serverMessage);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverMessage]);

  return (
    <div className="w-screen h-screen">
      <div className="blueprint size-full bg-evo-orange">
        Hello Test {data.length}
      </div>
    </div>
  );
};

export default Reaction;
