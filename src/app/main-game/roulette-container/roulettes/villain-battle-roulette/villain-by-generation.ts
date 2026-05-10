import { GymLeader } from '../../../../interfaces/gym-leader';

/**
 * Postgame Battle Tower floor-5 antagonists — the marquee villain of each
 * generation. The shape mirrors GymLeader (name / sprite / quotes) so the
 * villain-battle component can reuse the same trainer-card pattern.
 */
export const villainByGeneration: Record<number, GymLeader> = {
  1: {
    name: 'villain.giovanni.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/FireRed_LeafGreen_Giovanni.png',
    quotes: ['villain.giovanni.quote1'],
  },
  2: {
    name: 'villain.archer.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_HGSS_Archer.png',
    quotes: ['villain.archer.quote1'],
  },
  3: {
    name: 'villain.maxie-archie.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Omega_Ruby_Alpha_Sapphire_Maxie.png',
    quotes: ['villain.maxie-archie.quote1'],
  },
  4: {
    name: 'villain.cyrus.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Diamond_Pearl_Cyrus.png',
    quotes: ['villain.cyrus.quote1'],
  },
  5: {
    name: 'villain.ghetsis.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Black_White_Ghetsis.png',
    quotes: ['villain.ghetsis.quote1'],
  },
  6: {
    name: 'villain.lysandre.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/XY_Lysandre.png',
    quotes: ['villain.lysandre.quote1'],
  },
  7: {
    name: 'villain.lusamine.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sun_Moon_Lusamine.png',
    quotes: ['villain.lusamine.quote1'],
  },
  8: {
    name: 'villain.rose.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Chairman_Rose.png',
    quotes: ['villain.rose.quote1'],
  },
  9: {
    name: 'villain.ai-turo-sada.name',
    sprite: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/VSAIProfessor.png',
    quotes: ['villain.ai-turo-sada.quote1'],
  },
  // Insurgence — Jaern, Augur of Light turned Cult of Darkrai leader, the
  // main antagonist of the Torren story.
  100: {
    name: 'villain.jaern.name',
    sprite: 'https://wiki.p-insurgence.com/images/5/5e/Jaern.png',
    quotes: ['villain.jaern.quote1'],
  },
};
