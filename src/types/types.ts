// Enums for character types and core stats
export enum CharacterType {
  Player = 'Player',
  NPC = 'NPC',
  Enemy = 'Enemy',
  Event = 'Event'
}

export enum CoreStat {
  Strength = 'Strength',
  Perception = 'Perception',
  Endurance = 'Endurance',
  Charisma = 'Charisma',
  Intelligence = 'Intelligence',
  Agility = 'Agility',
  Luck = 'Luck',
}

// Interface for Character
export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  description?: string;
  stats: Record<CoreStat, number>;
  health?: number;
  mana?: number;
  skills?: string[];
  abilities?: string[];
  inventory?: string[];
  notes?: string;
  role?: string;
  affiliation?: string;
}

// Interface for Event
export interface Event {
  id: string;
  name: string;
  description?: string;
  timestamp: string; // ISO string or game-time reference
  associatedCharacters?: string[]; // Character/NPC IDs
  outcomes?: string[];
}

// Interface for dice roll results
export interface DiceRollResult {
  notation: string; // e.g., 'd20', '3d6+2'
  rolls: number[];
  total: number;
}

// Interface for oracle results
export interface OracleResult {
  likelihood: string;
  roll: number;
  result: boolean;
}

// Encounter types and stat pairings
export enum EncounterType {
  Combat = 'Combat',
  Social = 'Social',
  Physical = 'Physical',
  Mental = 'Mental',
  Other = 'Other',
  Exploration = 'Exploration',
}

export interface EncounterStatPairing {
  encounterType: EncounterType;
  primaryStat: CoreStat;
  secondaryStat?: CoreStat;
}

// --- NEW: Oracle Types ---

// Define the possible likelihood levels
export const LIKELIHOOD_LEVELS = [
    'Impossible',       // 0%
    'No way',           // 5%
    'Very unlikely',    // 15%
    'Unlikely',         // 35%
    '50/50',            // 65%
    'Likely',           // 75%
    'Very likely',      // 85%
    'Certain',          // 95%
    'Yes! (special)'    // 100%
] as const;

export type LikelihoodLevel = typeof LIKELIHOOD_LEVELS[number];

// Interface for the structure returned by the oracle utility
export interface OracleResultOutcome {
    likelihood: LikelihoodLevel;
    roll: number;
    result: string; // e.g., 'Yes', 'No, but...'
    isYes: boolean; // Simple boolean representation
    yesThreshold: number; // Added: Threshold for a simple 'Yes'
}

// --- NEW: Specific Encounter Action Structure ---
export interface EncounterAction {
    name: string;
    primaryStat: CoreStat;
    secondaryStat?: CoreStat; // Undefined or isVsDC=true means vs DC
    isVsDC?: boolean;
}

// --- NEW: Detailed Calculation Result Types ---

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
 * Enum for comparison outcomes.
 */
export enum ComparisonOutcome {
    CritSuccess = 'Critical Success',
    Success = 'Success',
    Tie = 'Tie',
    Failure = 'Failure',
    CritFailure = 'Critical Failure'
}

/**
 * Represents the result of a check against a Difficulty Class (DC).
 */
export interface CheckVsDCResult {
    outcome: ComparisonOutcome;
    rollDetails: RollDetails;
    dc: number;
}

/**
 * Represents the result of an opposed check between two characters.
 */
export interface OpposedCheckResult {
    outcome: ComparisonOutcome; // From char1's perspective
    char1Name: string; // Added
    char1Details: RollDetails;
    char2Name: string; // Added
    char2Details: RollDetails;
    encounterAction: EncounterAction;
} 