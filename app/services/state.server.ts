export type GlobalServerState = {
  currentReactionTest: {
    user: { name: string; teamName: string | undefined } | undefined;
    lastUpdated: number;
  };
};

export const globalServerState: GlobalServerState = {
  currentReactionTest: {
    user: undefined,
    lastUpdated: Date.now()
  }
};
