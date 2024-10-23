import { LoaderFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';
import { ReactionServerClientMessage } from '~/types/sse';
import { reactionEmitter } from '~/services/emitter.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, (send) => {
    const handleReactionMessage = (message: ReactionServerClientMessage) => {
      send({ data: JSON.stringify({ type: message, timestamp: Date.now() }) });
    };

    reactionEmitter.on('message', handleReactionMessage);

    return () => {
      reactionEmitter.off('message', handleReactionMessage);
    };
  });
};
