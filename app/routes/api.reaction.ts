import { json } from '@remix-run/node';
import { db } from '~/services/db.server';

export const loader = async () =>
  json({ reactions: db.data.reactionTimes }, 200);
