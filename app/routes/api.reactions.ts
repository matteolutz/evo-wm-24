import { json } from '@remix-run/react';
import { db } from '~/services/db.server';

export const loader = () =>
  json(db.data.reactionTimes.sort((a, b) => a.time - b.time));
