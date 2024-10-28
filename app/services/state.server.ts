export type GlobalServerState = {
  currentReactionTest: {
    user: { name: string; teamName: string | undefined } | undefined;
    lastUpdated: number;
  };
};

export const globalServerState: GlobalServerState = {
  currentReactionTest: {
    user: { name: 'Matteo', teamName: 'evolut1on' },
    lastUpdated: Date.now()
  }
};
