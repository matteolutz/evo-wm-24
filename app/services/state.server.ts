export type GlobalServerState = {
  currentReactionUser: { name: string | undefined; lastUpdated: number };
};

export const globalServerState: GlobalServerState = {
  currentReactionUser: { name: 'Matteo', lastUpdated: Date.now() }
};
