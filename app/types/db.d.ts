export type ReactionTimeEntry = {
  username: string;
  team?: string;
  time: number;
  createdAt: number;
};

export type DbData = {
  reactionTimes: Array<ReactionTimeEntry>;
};
