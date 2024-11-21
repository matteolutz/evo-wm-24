import { ReactionTimeEntry } from '~/types/db';
import { JSONFileSyncPreset } from 'lowdb/node';
import * as path from 'path';

const DB_HOME = process.env.DB_HOME || '.';

export const db = JSONFileSyncPreset<{
  reactionTimes: Array<ReactionTimeEntry>;
}>(path.join(DB_HOME, 'db.json'), { reactionTimes: [] });
