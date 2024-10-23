export type ReactionTimeEntry = {
  username: string;
  time: number;
};

export type DbData = {
  reactionTimes: Array<ReactionTimeEntry>;
};
