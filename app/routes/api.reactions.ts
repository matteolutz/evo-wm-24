import { json } from '@remix-run/react';
import { dbReactionTimes } from '~/services/db.server';

export const loader = () =>
  json(dbReactionTimes.chain().find().simplesort('time').data());
