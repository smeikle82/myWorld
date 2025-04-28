import { LikelihoodLevel, OracleResultOutcome, LIKELIHOOD_LEVELS } from '../types/types';

// Use the extended likelihood levels from types.ts
const oracleTable: Record<LikelihoodLevel, Array<{ range: [number, number], result: string, isYes: boolean }>> = {
  // Probabilities roughly based on EN World, adjusted for simplicity/coverage
  'Impossible': [
    { range: [1, 100], result: 'No, and...', isYes: false },
  ],
  'No way': [
    { range: [1, 5], result: 'Yes', isYes: true }, // Edge case
    { range: [6, 95], result: 'No', isYes: false },
    { range: [96, 100], result: 'No, and...', isYes: false },
  ],
  'Very unlikely': [
    { range: [1, 15], result: 'Yes', isYes: true },
    { range: [16, 20], result: 'Yes, but...', isYes: true },
    { range: [21, 25], result: 'No, but...', isYes: false },
    { range: [26, 90], result: 'No', isYes: false },
    { range: [91, 100], result: 'No, and...', isYes: false },
  ],
  'Unlikely': [
    { range: [1, 1], result: 'Yes, and...', isYes: true },
    { range: [2, 35], result: 'Yes', isYes: true },
    { range: [36, 40], result: 'Yes, but...', isYes: true },
    { range: [41, 45], result: 'No, but...', isYes: false },
    { range: [46, 95], result: 'No', isYes: false },
    { range: [96, 100], result: 'No, and...', isYes: false },
  ],
  '50/50': [
    { range: [1, 2], result: 'Yes, and...', isYes: true },
    { range: [3, 65], result: 'Yes', isYes: true },
    { range: [66, 70], result: 'Yes, but...', isYes: true },
    { range: [71, 75], result: 'No, but...', isYes: false },
    { range: [76, 98], result: 'No', isYes: false },
    { range: [99, 100], result: 'No, and...', isYes: false },
  ],
  'Likely': [
    { range: [1, 5], result: 'Yes, and...', isYes: true },
    { range: [6, 75], result: 'Yes', isYes: true },
    { range: [76, 80], result: 'Yes, but...', isYes: true },
    { range: [81, 85], result: 'No, but...', isYes: false },
    { range: [86, 99], result: 'No', isYes: false },
    { range: [100, 100], result: 'No, and...', isYes: false },
  ],
  'Very likely': [
    { range: [1, 10], result: 'Yes, and...', isYes: true },
    { range: [11, 85], result: 'Yes', isYes: true },
    { range: [86, 90], result: 'Yes, but...', isYes: true },
    { range: [91, 94], result: 'No, but...', isYes: false },
    { range: [95, 99], result: 'No', isYes: false },
    { range: [100, 100], result: 'No, and...', isYes: false },
  ],
  'Certain': [
    { range: [1, 95], result: 'Yes', isYes: true },
    { range: [96, 100], result: 'Yes, and...', isYes: true },
  ],
  'Yes! (special)': [
     { range: [1, 100], result: 'Yes, and...', isYes: true }, // Always special outcome
  ],
};

// Define the threshold for a simple "Yes" outcome for each likelihood
const yesThresholds: Record<LikelihoodLevel, number> = {
    'Impossible': 0,
    'No way': 5,
    'Very unlikely': 15,
    'Unlikely': 35,
    '50/50': 65,
    'Likely': 75,
    'Very likely': 85,
    'Certain': 95,
    'Yes! (special)': 100,
};

/**
 * Rolls a d100 and returns the detailed oracle result for the given likelihood.
 * @param likelihood - One of the allowed likelihood levels
 * @returns An OracleResultOutcome object containing the roll, result string, boolean result, and threshold.
 */
export function getOracleResult(likelihood: LikelihoodLevel): OracleResultOutcome {
  if (!(likelihood in oracleTable)) {
    // Fallback for potentially invalid likelihood string during development
    console.error('Invalid likelihood passed to getOracleResult:', likelihood);
    likelihood = '50/50'; // Default to 50/50 as a fallback
  }
  const roll = Math.floor(Math.random() * 100) + 1;
  const table = oracleTable[likelihood];
  const yesThreshold = yesThresholds[likelihood]; // Get the threshold

  for (const entry of table) {
    if (roll >= entry.range[0] && roll <= entry.range[1]) {
      return {
        likelihood,
        roll,
        result: entry.result,
        isYes: entry.isYes,
        yesThreshold: yesThreshold // Add threshold to result
      };
    }
  }
  // Should be unreachable if table covers 1-100 for all likelihoods
  console.error(`Oracle table error: No result found for likelihood '${likelihood}' and roll ${roll}`);
   return {
        likelihood,
        roll,
        result: 'Error: Table lookup failed',
        isYes: false,
        yesThreshold: yesThreshold // Include threshold even in error
      }; // Fallback error result
}

// Helper for testing specific rolls (returns full object)
export function getOracleResultForRoll(likelihood: LikelihoodLevel, roll: number): OracleResultOutcome {
   if (!(likelihood in oracleTable)) {
    console.error('Invalid likelihood passed to getOracleResultForRoll:', likelihood);
    likelihood = '50/50';
  }
  const table = oracleTable[likelihood];
  const yesThreshold = yesThresholds[likelihood];
  for (const entry of table) {
    if (roll >= entry.range[0] && roll <= entry.range[1]) {
       return {
            likelihood,
            roll,
            result: entry.result,
            isYes: entry.isYes,
            yesThreshold: yesThreshold // Add threshold
        };
    }
  }
   console.error(`Oracle table error: No result found for likelihood '${likelihood}' and roll ${roll}`);
    return {
        likelihood,
        roll,
        result: 'Error: Table lookup failed',
        isYes: false,
        yesThreshold: yesThreshold // Add threshold
      }; // Fallback error result
} 