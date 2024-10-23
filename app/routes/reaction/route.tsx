import { useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import { db } from '~/services/db.server';
import { ReactionServerClientMessage } from '~/types/sse';

export const loader = async () => {
  return db.data.reactionTimes.sort((a, b) => a.time - b.time);
};

const Reaction = () => {
  const data = useLoaderData<typeof loader>();

  // const revalidator = useRevalidator();
  /*const serverMessage = useEventSource(
    '/sse/reaction'
  ) as ReactionServerClientMessage | null;*/

  /*useEffect(() => {
    if (!serverMessage) return;

    switch (serverMessage) {
      case 'update-leaderboard':
        // revalidator.revalidate();
        break;
      default:
        console.error('Unknown server message', serverMessage);
        break;
    }
    }, [serverMessage]);*/

  return (
    <div className="w-screen h-screen">
      <div className="blueprint size-full bg-evo-orange">
        Hello Test {data.length}
      </div>
    </div>
  );
};

export default Reaction;
