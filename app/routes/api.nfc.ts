import { ActionFunctionArgs } from '@remix-run/node';
import NFC_LUT from '~/constants/nfcLut';
import { nfcEmitter } from '~/services/emitter.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();

  if (!('id' in data) || !('tag' in data)) {
    return new Response('Invalid request', { status: 400 });
  }

  const { id, tag } = data;

  const page = tag in NFC_LUT ? NFC_LUT[tag] : null;

  if (page) {
    nfcEmitter.emit('message', {
      nfcReaderId: id,
      type: 'navigate-to',
      to: page
    });
  }

  return new Response('OK', { status: 200 });
};
