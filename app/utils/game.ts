export type GameTrackLeaderboardEntry = {
  Username: string;
  Extra: string;
  Rank: number;
  Score: number;
  Date: number;
};

export type GameTrack = {
  name: string;
  image: string;
  leaderboardPublicKey: string;
};

export const ALL_TRACKS: Array<GameTrack> = [
  {
    name: 'Vulcan',
    image: '',
    leaderboardPublicKey:
      'a808bf21e48ab677ea7140fac091f2a3e6190126278825e1ae8c5cb3970c8e54'
  },
  {
    name: 'Desert',
    image: '',
    leaderboardPublicKey:
      '3b1146cf5b4b22d80cd6cb9c6327369294b1c80d95f712c7386cf766113423eb'
  },
  {
    name: 'Mountains',
    image: '',
    leaderboardPublicKey:
      '2828f4a1d319fc7d001460423be3caaf9550fbc174c1b479446b9b4625bd2553'
  }
];
