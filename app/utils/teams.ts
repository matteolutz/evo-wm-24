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
    name: 'Array',
    cssColor: '#17266f',
    country: 'Germany'
  },
  {
    name: 'ADUA',
    country: 'Vietnam',
    cssColor: '#b20405'
  },
  {
    name: 'Aegan Racing',
    country: 'Greece',
    cssColor: '#0c68b1'
  },
  {
    name: 'Aeolian',
    country: 'United Arab Emirates',
    cssColor: '#04c9fe'
  },
  {
    name: 'Aeros Racing',
    country: 'USA',
    cssColor: '#b91419'
  },
  {
    name: 'AGILAS',
    country: 'Philippines',
    cssColor: '#a22021'
  },
  {
    name: 'Alpha Scuderia',
    country: 'Brazil',
    cssColor: '#ff00e4'
  },
  {
    name: 'Aenmos Racing',
    country: 'Cyprus',
    cssColor: '#65cae7'
  },
  {
    name: 'Apex Racing',
    country: 'India',
    cssColor: '#ed1a30'
  },
  {
    name: 'CLAD RACING',
    country: 'Saudi Arabia',
    cssColor: '#61cbd1'
  },
  {
    name: 'Deiva Force',
    country: 'Mexico',
    cssColor: '#780aa0'
  },
  {
    name: 'Ecolyte',
    country: 'United Arab Emirates',
    cssColor: '#f3ba08'
  },
  {
    name: 'Energeteen',
    country: 'Malaysia',
    cssColor: '#ff6e00'
  },
  {
    name: 'Essential Racing',
    country: 'Republic of Korea',
    cssColor: '#07e5ee'
  },
  {
    name: 'Gama Racing',
    country: 'Portugal',
    cssColor: '#e74dfe'
  },
  {
    name: 'Girls Tonaltech 2',
    country: 'Mexico',
    cssColor: '#ff00cd'
  },
  {
    name: 'Hermes Racing',
    country: 'United Arab Emirates',
    cssColor: '#010101'
  },
  {
    name: 'Hypernova',
    country: 'Wales',
    cssColor: '#ee3e23'
  },
  {
    name: 'Infinite Green Force',
    country: 'Greece',
    cssColor: '#7b2c7d'
  },
  {
    name: 'Infinity Racing',
    country: 'India',
    cssColor: '#21eefa'
  },
  {
    name: 'KILAU LUMBA',
    country: 'Malaysia',
    cssColor: '#f8e457'
  },
  {
    name: 'Lasder Panteras',
    country: 'Mexico',
    cssColor: '#d8e4e0'
  },
  {
    name: 'LEAF1',
    country: 'UK',
    cssColor: '#0a7833'
  },
  {
    name: 'Lingnan Nova',
    country: 'Hong Kong',
    cssColor: '#176e52'
  },
  {
    name: 'Lunar',
    country: 'Australia',
    cssColor: '#439eba'
  },
  {
    name: 'LX',
    country: 'Australia',
    cssColor: '#f37429'
  },
  {
    name: 'Ninth Gear Racing',
    country: 'Qatar',
    cssColor: '#fd0239'
  },
  {
    name: 'Oryx',
    country: 'Saudi Arabia',
    cssColor: '#224d93'
  },
  {
    name: 'Pangea Racing Team',
    country: 'Brazil & Meixco',
    cssColor: '#000000'
  },
  {
    name: 'Phayu Racing',
    country: 'Thailand',
    cssColor: '#447ac3'
  },
  {
    name: 'Photon Racing',
    country: 'India',
    cssColor: '#562869'
  },
  {
    name: 'PiForce',
    country: 'Greece',
    cssColor: '#038d7a'
  },
  {
    name: 'POCADORES RACING TEAM',
    country: 'Brazil',
    cssColor: '#ff3701'
  },
  {
    name: 'PRISM',
    country: 'Hong Kong',
    cssColor: '#ffe131'
  },
  {
    name: 'Propex Racing',
    country: 'Irland',
    cssColor: '#6200ac'
  },
  {
    name: 'Resiliath',
    country: 'Irland',
    cssColor: '#00c888'
  },
  {
    name: 'SEVENSPEED',
    country: 'Brazil',
    cssColor: '#ff0000'
  },
  {
    name: 'Shaheen',
    country: 'Saudi Arabia',
    cssColor: '#05612a'
  },
  {
    name: 'Shera Intanin Racing',
    country: 'Thailand',
    cssColor: '#05a557'
  },
  {
    name: 'SPARK Racing',
    country: 'Hong Kong',
    cssColor: '#000000'
  },
  {
    name: 'SPYKAR',
    country: 'China',
    cssColor: '#ffa400'
  },
  {
    name: 'Surge',
    country: 'Australia',
    cssColor: '#e300b5'
  },
  {
    name: 'Tachyon Racing',
    country: 'France',
    cssColor: '#f69102'
  },
  {
    name: 'TRITON',
    country: 'Portugal',
    cssColor: '#012f6c'
  },
  {
    name: 'Unity Racing',
    country: 'England',
    cssColor: '#03bf61'
  },
  {
    name: 'Valour Special Project',
    country: 'Malaysia',
    cssColor: '#ff850f'
  },
  {
    name: 'VEGA',
    country: 'Thailand',
    cssColor: '#15055a'
  },
  {
    name: 'Velotech',
    country: 'Spain',
    cssColor: '#a89762'
  },
  {
    name: 'Venture',
    country: 'Saudi Arabia',
    cssColor: '#3e0a4f'
  },
  {
    name: 'Viper Racing',
    country: 'Greece',
    cssColor: '#000000'
  },
  {
    name: 'WINGS Racing',
    country: 'China',
    cssColor: '#fc6c0f'
  },
  {
    name: 'X.Limit',
    country: 'Hong Kong',
    cssColor: '#6f9ae2'
  },
  {
    name: 'XISPA',
    country: 'Spain',
    cssColor: '#fd02a1'
  }
] as const;

export const getTeamByName = (name: string): Team | undefined =>
  ALL_TEAMS.find((team) => team.name === name);
