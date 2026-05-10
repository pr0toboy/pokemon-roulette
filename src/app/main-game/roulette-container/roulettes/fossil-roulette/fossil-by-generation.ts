
export const fossilByGeneration: Record<number, number[]> = {
  1: [ 138, 139, 140, 141, 142],
  2: [ 138, 139, 140, 141, 142],
  3: [ 345, 346, 347, 348],
  4: [ 408, 409, 410, 411],
  5: [ 564, 565, 566, 567],
  6: [ 696, 697, 698, 699],
  7: [ 408, 409, 564, 565, 410, 411, 566, 567, 138, 139, 347, 348, 696, 697, 140, 141, 345, 346, 698, 699],
  8: [ 880, 881, 882, 883],
  9: [ 142, 408, 409, 410, 411, 696, 697, 698, 699],
  // Insurgence — Miara Archaeological Site mints all 10 canonical fossils
  // (Helix, Dome, Claw, Root, Skull, Armor, Cover, Plume, Jaw, Sail), so the
  // wheel rolls between every fossil mon from gen 1-6. Old Amber / Aerodactyl
  // is intentionally excluded — it's not part of the Miara dig in Insurgence.
  100: [ 138, 139, 140, 141, 345, 346, 347, 348,
         408, 409, 410, 411, 564, 565, 566, 567,
         696, 697, 698, 699]
}
