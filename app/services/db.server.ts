import loki from 'lokijs';
import { ReactionTimeEntry } from '~/types/db';

export const db = new loki('db.db');
export const dbReactionTimes =
  db.addCollection<ReactionTimeEntry>('reactionTimes');
