import { JSONFilePreset } from 'lowdb/node';
import { DbData } from '~/types/db';

export const db = await JSONFilePreset<DbData>('db.json', {
  reactionTimes: []
});
