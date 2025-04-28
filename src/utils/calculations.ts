import { CoreStat, Character, EncounterType, EncounterStatPairing, EncounterAction } from '../types/types';
import { rollDice } from './dice'; // Assuming dice.ts exists and has rollDice

/**
 * Type definition for detailed roll results.
 */
export interface RollDetails {
    stat: CoreStat;
    statValue: number;
    modifier: number;
    d20Roll: number;
    total: number;
}

/**
 * Calculates the D&D 5e style modifier for a given stat value.
 * Modifier = floor((Stat - 10) / 2)
 * @param statValue The raw stat value (e.g., 14).
 * @returns The calculated modifier (e.g., +2).
 */
export const calculateStatModifier = (statValue: number): number => {
  // Ensure input is a number, default to 10 (modifier 0) if invalid
  const value = typeof statValue === 'number' ? statValue : 10;
  return Math.floor((value - 10) / 2);
};

/**
 * Calculates total stat value.
 * @param character The character object.
 * @param stat The core stat to calculate.
 * @returns The total stat value.
 */
export const calculateTotalStat = (character: Character, stat: CoreStat): number => {
  // Return base stat, default to 10 if missing (e.g., for Events)
  return character.stats?.[stat] || 10;
};

/**
 * Simulates a d20 roll plus modifier for a given stat.
 * @param character The character performing the roll.
 * @param relevantStat The stat used for the roll.
 * @returns Detailed roll results including stat, modifier, d20 roll, and total.
 */
export const simulateCheck = (character: Character, relevantStat: CoreStat): RollDetails => {
  const d20Roll = rollDice('d20');
  const statValue = calculateTotalStat(character, relevantStat);
  const modifier = calculateStatModifier(statValue);
  const total = d20Roll + modifier;
  return {
    stat: relevantStat,
    statValue,
    modifier,
    d20Roll,
    total,
  };
};

/**
 * Simulates a generic skill check (uses simulateCheck).
 * @param character The character performing the skill check.
 * @param relevantStat The stat associated with the skill.
 * @returns The detailed result of the d20 roll plus the stat modifier.
 */
export const simulateSkillCheck = (character: Character, relevantStat: CoreStat): RollDetails => {
  return simulateCheck(character, relevantStat);
};

// --- Comparison Logic ---

export enum ComparisonOutcome {
    CritSuccess = 'Critical Success', // Nat 20
    Success = 'Success',
    Tie = 'Tie',
    Failure = 'Failure',
    CritFailure = 'Critical Failure' // Nat 1
}

/**
 * Determines the outcome of a roll against a target.
 * @param rollDetails The details of the roll being checked.
 * @param targetValue The target value (DC or opponent's roll total).
 * @returns ComparisonOutcome enum value.
 */
export const determineOutcome = (rollDetails: RollDetails, targetValue: number): ComparisonOutcome => {
    if (rollDetails.d20Roll === 20) return ComparisonOutcome.CritSuccess;
    if (rollDetails.d20Roll === 1) return ComparisonOutcome.CritFailure;
    if (rollDetails.total > targetValue) return ComparisonOutcome.Success;
    if (rollDetails.total < targetValue) return ComparisonOutcome.Failure;
    return ComparisonOutcome.Tie;
};

/**
 * Represents the result of a check against a Difficulty Class (DC).
 */
export interface CheckVsDCResult {
    outcome: ComparisonOutcome;
    rollDetails: RollDetails;
    dc: number;
}

/**
 * Performs a skill check against a fixed Difficulty Class (DC).
 * @param character The character making the check.
 * @param relevantStat The stat used for the check.
 * @param dc The Difficulty Class to beat.
 * @returns CheckVsDCResult containing the outcome, roll details, and DC.
 */
export const skillCheckVsDC = (character: Character, relevantStat: CoreStat, dc: number): CheckVsDCResult => {
    const rollDetails = simulateSkillCheck(character, relevantStat);
    const outcome = determineOutcome(rollDetails, dc);
    return { outcome, rollDetails, dc };
};

// --- Encounter Resolution Logic ---

// Standard Difficulty Classes (adjust values as needed for game balance)
export const DifficultyClasses = {
    VeryEasy: 5,
    Easy: 10,
    Medium: 15,
    Hard: 20,
    VeryHard: 25,
    NearlyImpossible: 30,
};

// This function might be deprecated or adapted if using EncounterAction directly
export const getEncounterStatPairing = (type: EncounterType): EncounterStatPairing | undefined => {
    // Define pairings based on NEW CoreStats and EncounterTypes from PRD
    const pairings: Partial<Record<EncounterType, EncounterStatPairing>> = {
        [EncounterType.Combat]: { encounterType: EncounterType.Combat, primaryStat: CoreStat.Strength, secondaryStat: CoreStat.Agility },
        [EncounterType.Social]: { encounterType: EncounterType.Social, primaryStat: CoreStat.Charisma, secondaryStat: CoreStat.Intelligence }, // Example: Persuade
        [EncounterType.Physical]: { encounterType: EncounterType.Physical, primaryStat: CoreStat.Agility, secondaryStat: CoreStat.Agility }, // Example: Chase
        [EncounterType.Mental]: { encounterType: EncounterType.Mental, primaryStat: CoreStat.Intelligence, secondaryStat: CoreStat.Intelligence }, // Example: Hack
        [EncounterType.Other]: { encounterType: EncounterType.Other, primaryStat: CoreStat.Luck, secondaryStat: CoreStat.Luck }, // Example: Luck Test
        [EncounterType.Exploration]: { encounterType: EncounterType.Exploration, primaryStat: CoreStat.Perception }, // Vs DC assumed
    };
    return pairings[type];
};

/**
 * Represents the result of an opposed check between two characters.
 */
export interface OpposedCheckResult {
    outcome: ComparisonOutcome;
    char1Name: string;
    char1Details: RollDetails;
    char2Name: string;
    char2Details: RollDetails;
    encounterAction: EncounterAction;
}


/**
 * Resolves an opposed encounter between two characters based on a specific action.
 * @param char1 The initiating character.
 * @param char2 The opposing character.
 * @param action The specific EncounterAction being performed.
 * @returns OpposedCheckResult containing the outcome and details for both rolls.
 */
export const resolveOpposedCheck = (
    char1: Character,
    char2: Character,
    action: EncounterAction
): OpposedCheckResult => {
    if (!action.secondaryStat) {
        throw new Error(`Action "${action.name}" is not configured for opposed checks.`);
    }

    const char1Details = simulateCheck(char1, action.primaryStat);
    const char2Details = simulateCheck(char2, action.secondaryStat);
    const outcome = determineOutcome(char1Details, char2Details.total);

    return {
        outcome,
        char1Name: char1.name,
        char1Details,
        char2Name: char2.name,
        char2Details,
        encounterAction: action,
    };
};

// --- Result Formatting ---

/**
 * Formats roll details into a readable string component.
 * Example: "Roll: 15 (d20) + 2 (Str Mod) = 17"
 */
const formatRollDetailString = (details: RollDetails): string => {
    // Use full stat name now
    return `Roll: ${details.d20Roll} (d20) ${details.modifier >= 0 ? '+' : '-'} ${Math.abs(details.modifier)} (${details.stat} Mod) = ${details.total}`;
};


/**
 * Formats a comparison outcome and its details into a user-readable string.
 * Handles both CheckVsDCResult and OpposedCheckResult.
 * @param result The result object (either CheckVsDCResult or OpposedCheckResult).
 * @returns A formatted string describing the outcome and rolls.
 */
export const formatOutcome = (
    result: CheckVsDCResult | OpposedCheckResult | null
): string => {
    if (!result) return '';

    let outcomeString: string;
    let detailsString = '';

    switch (result.outcome) {
        case ComparisonOutcome.CritSuccess: outcomeString = "Critical Success!"; break;
        case ComparisonOutcome.Success: outcomeString = "Success."; break;
        case ComparisonOutcome.Tie: outcomeString = "Tie."; break;
        case ComparisonOutcome.Failure: outcomeString = "Failure."; break;
        case ComparisonOutcome.CritFailure: outcomeString = "Critical Failure!"; break;
        default: outcomeString = "Unknown Outcome.";
    }

    if ('char1Details' in result) { // OpposedCheckResult
        // Use character names from the result object
        detailsString = ` (${result.encounterAction.name})
  ${result.char1Name} (${result.char1Details.stat}): ${formatRollDetailString(result.char1Details)}
  ${result.char2Name} (${result.char2Details.stat}): ${formatRollDetailString(result.char2Details)}`;
    }
    else if ('rollDetails' in result) { // CheckVsDCResult
         // Add action name for DC checks too if available (might need to pass action to skillCheckVsDC?)
         // For now, keep DC checks simpler.
         detailsString = ` (vs DC ${result.dc})
  ${formatRollDetailString(result.rollDetails)}`;
    }

    return `${outcomeString}${detailsString}`;
};


/**
 * Placeholder function for handling custom roll types (Example: Luck Check).
 */
export const handleCustomRoll = (
    rollType: string, // e.g., "Luck Test"
    character: Character,
    context?: any
): string => {
    console.warn(`Custom roll type '${rollType}' requested. Context:`, context);
    if (rollType === 'Luck Test') {
        // PRD suggests Luck vs Luck or potentially vs DC?
        // Let's assume a simple percentage check based on Luck stat for now.
        const roll = rollDice('d100');
        const target = calculateTotalStat(character, CoreStat.Luck); // Simple target = Luck score
        const success = roll <= target;
        return `Luck Check: Rolled ${roll} vs Target ${target} -> ${success ? 'Lucky!' : 'Unlucky'}`;
    }

    return `Outcome for custom roll '${rollType}' not determined.`;
};

// Add other calculation functions as needed 