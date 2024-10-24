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
      <div className="blueprint size-full bg-evo-orange flex flex-col items-center gap-8 p-8"></div>
      <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center flex-col gap-8 p-8">
        <h1>Reaction Times</h1>
        <div className="relative w-full max-h-full overflow-x-hidden">
          <table className="w-full bg-white/70 text-black rounded-lg border-collapse table-fixed">
            <thead className="border-b-2 border-black/25">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-6 border-r border-black/25 w-min"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-6 border-r border-black/25 w-[75%]"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-6 border-l border-black/25 w-[15%]"
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {reactions.map((r, idx) => (
                <tr className="border-y border-black/10" key={idx}>
                  <td className="px-6 py-4 flex justify-center items-center border-r border-black/10">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-x border-black/10">
                    {r.username}
                  </td>
                  <td className="px-6 py-4 border-l border-black/10">
                    {(r.time * 1000).toFixed(2)}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reaction;
