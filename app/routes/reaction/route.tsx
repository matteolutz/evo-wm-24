import { json, useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import { dbReactionTimes } from '~/services/db.server';
import { ReactionTimeEntry } from '~/types/db';
import { ReactionServerClientMessage } from '~/types/sse';

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

  const { revalidate } = useRevalidator();

  const serverMessage = useEventSource(
    sseUrl
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
        Hello Test {reactions.length}
      </div>
    </div>
  );
};

export default Reaction;
