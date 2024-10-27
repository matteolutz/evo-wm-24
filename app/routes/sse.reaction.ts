import { LoaderFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';
import { reactionEmitter } from '~/services/emitter.server';
import { ReactionEmitterMessage } from '~/types/emitter';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, (send) => {
    const handleReactionMessage = (message: ReactionEmitterMessage) => {
      send({
        data: JSON.stringify({ message: message, timestamp: Date.now() })
      });
    };

    reactionEmitter.on('message', handleReactionMessage);

    return () => {
      reactionEmitter.off('message', handleReactionMessage);
    };
  });
};
