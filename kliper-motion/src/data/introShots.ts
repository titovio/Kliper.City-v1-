export type IntroShot = {
  file: string;
  label: string;
  fromScale: number;
  toScale: number;
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
};

export const introShots: IntroShot[] = [
  {
    file: 'keyframes/01-clouds-over-tyumen.png',
    label: 'Clouds over Tyumen',
    fromScale: 1.08,
    toScale: 1.2,
    fromX: 0,
    toX: -18,
    fromY: 0,
    toY: 18,
  },
  {
    file: 'keyframes/02-descend-to-city.png',
    label: 'Descend to city and river',
    fromScale: 1.04,
    toScale: 1.18,
    fromX: 12,
    toX: -12,
    fromY: -8,
    toY: 12,
  },
  {
    file: 'keyframes/03-district-level.png',
    label: 'District level',
    fromScale: 1.06,
    toScale: 1.2,
    fromX: 10,
    toX: -20,
    fromY: -4,
    toY: 10,
  },
  {
    file: 'keyframes/04-district-nodes.png',
    label: 'District nodes',
    fromScale: 1.05,
    toScale: 1.16,
    fromX: -8,
    toX: 14,
    fromY: -4,
    toY: 8,
  },
  {
    file: 'keyframes/05-property-cards.png',
    label: 'Property cards forming',
    fromScale: 1.02,
    toScale: 1.14,
    fromX: 0,
    toX: -8,
    fromY: 0,
    toY: 4,
  },
  {
    file: 'keyframes/06-interface-portal.png',
    label: 'Interface portal',
    fromScale: 1,
    toScale: 1.22,
    fromX: 0,
    toX: 0,
    fromY: 0,
    toY: 0,
  },
];
