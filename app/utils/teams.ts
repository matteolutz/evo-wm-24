export interface Team {
  name: string;
  cssColor: string;
  country: string;
}

export const ALL_TEAMS: Array<Team> = [
  {
    name: 'evolut1on',
    cssColor: '#ff8b00',
    country: 'Germany'
  }
] as const;
