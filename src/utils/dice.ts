/**
 * Parses and rolls dice notation (e.g., 'd20', '3d6+2'). Supports d20, d100, and standard dice notation.
 * @param {string} notation - Dice notation string (e.g., 'd20', '2d6+1')
 * @returns {number} The result of the dice roll
 */
export function rollDice(notation: string): number {
  const diceRegex = /^(\d*)d(\d+)([+-]\d+)?$/i;
  const match = notation.replace(/\s+/g, '').match(diceRegex);
  if (!match) {
    throw new Error('Invalid dice notation');
  }
  const numDice = parseInt(match[1] || '1', 10);
  const numSides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  if (![20, 100, 6, 4, 8, 10, 12].includes(numSides)) {
    throw new Error('Only d20, d100, and standard dice supported');
  }
  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * numSides) + 1;
  }
  return total + modifier;
}

/**
 * Rolls multiple dice with the same notation and returns all results.
 * @param {string} notation - Dice notation string (e.g., 'd20', '2d6+1')
 * @param {number} count - Number of times to roll
 * @returns {number[]} Array of roll results
 */
export function rollMultiple(notation: string, count: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDice(notation));
  }
  return results;
} 