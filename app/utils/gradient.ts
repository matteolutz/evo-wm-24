export const evoGradient = (nfcId: number): string =>
  `linear-gradient(${nfcId % 2 != 0 ? 90 : 270}deg, hsl(var(--primary)), #ff4800)`;
