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
      user: { name: string; teamName: string | undefined };
    }
  | {
      type: 'reaction-test-lights-out';
      user: { name: string; teamName: string | undefined };
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

export type NFCEmitterMessage = {
  type: 'navigate-to';
  to: string;
} & { nfcReaderId: number };
