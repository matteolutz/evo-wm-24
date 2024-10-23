export type ReactionServerClientMessage =
  | 'update-leaderboard'
  | 'reaction-ready'
  | 'reaction-failed-busy'
  | 'reaction-failed-username-already-taken';
