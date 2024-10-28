export type ReactionTimeEntry = {
  username: string;
  team?: string;
  time: number;
};

export type DbData = {
  reactionTimes: Array<ReactionTimeEntry>;
};
