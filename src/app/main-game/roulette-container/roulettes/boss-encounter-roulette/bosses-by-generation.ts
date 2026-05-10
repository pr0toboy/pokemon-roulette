/**
 * Post-league legendary bosses per generation. After the Champion is defeated,
 * one of these is rolled automatically before the postgame hub opens.
 *
 * Curated to the iconic mascot legendaries of each region. For Insurgence
 * (Gen 100) the bosses are the Primal forms reachable only via mega-stone,
 * so beating the league gives the player the catalyst encounter to obtain them.
 */
export const bossByGeneration: Record<number, number[]> = {
  1:   [150, 151],                // Mewtwo, Mew
  2:   [249, 250],                // Lugia, Ho-Oh
  3:   [382, 383, 384],           // Kyogre, Groudon, Rayquaza
  4:   [483, 484, 487],           // Dialga, Palkia, Giratina
  5:   [643, 644, 646],           // Reshiram, Zekrom, Kyurem
  6:   [716, 717, 718],           // Xerneas, Yveltal, Zygarde
  7:   [791, 792, 800],           // Solgaleo, Lunala, Necrozma
  8:   [888, 889, 890],           // Zacian, Zamazenta, Eternatus
  9:   [1007, 1008],               // Koraidon, Miraidon
  100: [31487, 31493, 31486],     // Primal Giratina, Primal Arceus, Primal Regigigas
};
