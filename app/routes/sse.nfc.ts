import { LoaderFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';
import { nfcEmitter } from '~/services/emitter.server';
import { NFCEmitterMessage } from '~/types/emitter';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, (send) => {
    const handleReactionMessage = (message: NFCEmitterMessage) => {
      send({
        event: '' + message.nfcReaderId,
        data: JSON.stringify({ message: message, timestamp: Date.now() })
      });
    };

    nfcEmitter.on('message', handleReactionMessage);

    return () => {
      nfcEmitter.off('message', handleReactionMessage);
    };
  });
};
