import { ReactionTimeEntry } from './db';

export type ReactionEmitterMessage =
  | {
      type: 'update-leaderboard';
    }
  | {
      type: 'reaction-test-started-standalone';
    }
  | {
      type: 'reaction-test-started';
      username: string;
    }
  | {
      type: 'reaction-test-finished';
      timeEntry: ReactionTimeEntry;
    }
  | {
      type: 'reaction-test-finished-standalone';
    }
  | {
      type: 'reaction-test-failed';
    };