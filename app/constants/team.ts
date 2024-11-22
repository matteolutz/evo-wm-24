export const TEAM: Array<{ name: string; videoId: number }> = [
  { name: 'benaja', videoId: 1 },
  { name: 'owen', videoId: 2 },
  { name: 'sebastian', videoId: 3 },
  { name: 'timo', videoId: 4 }
];

// make a map from the team names to the video ids
export const TEAM_MAP: Record<string, number> = TEAM.reduce(
  (acc, { name, videoId }) => {
    acc[name] = videoId;
    return acc;
  },
  {} as Record<string, number>
);
