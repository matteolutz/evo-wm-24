export type Team = {
  name: string;
  cssColor: string;
  country: string;
};

export const ALL_TEAMS: Array<Team> = [
  {
    name: 'evolut1on',
    cssColor: '#ff8b00',
    country: 'Germany'
  },
  {
    name: 'Recoil Racing',
    cssColor: '#008332',
    country: 'Germany'
  }
] as const;

export const getTeamByName = (name: string): Team | undefined =>
  ALL_TEAMS.find((team) => team.name === name);
