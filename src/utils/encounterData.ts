import { CoreStat, EncounterType, EncounterAction } from '../types/types';

// Define the specific actions available within each encounter type
// Based on PRD.txt examples
export const encounterActions: Record<EncounterType, EncounterAction[]> = {
    [EncounterType.Combat]: [
        { name: 'Melee Attack', primaryStat: CoreStat.Strength, secondaryStat: CoreStat.Agility },
        { name: 'Ranged Attack', primaryStat: CoreStat.Agility, secondaryStat: CoreStat.Agility },
        { name: 'Unarmed Attack', primaryStat: CoreStat.Strength, secondaryStat: CoreStat.Agility },
        // Add Saves?
        { name: 'Strength Save', primaryStat: CoreStat.Strength, isVsDC: true },
        { name: 'Agility Save', primaryStat: CoreStat.Agility, isVsDC: true },
        { name: 'Endurance Save', primaryStat: CoreStat.Endurance, isVsDC: true },
    ],
    [EncounterType.Social]: [
        { name: 'Persuade', primaryStat: CoreStat.Charisma, secondaryStat: CoreStat.Intelligence },
        { name: 'Deceive/Bluff', primaryStat: CoreStat.Charisma, secondaryStat: CoreStat.Perception },
        { name: 'Detect Lie', primaryStat: CoreStat.Perception, secondaryStat: CoreStat.Charisma },
        { name: 'Intimidate', primaryStat: CoreStat.Charisma, secondaryStat: CoreStat.Endurance },
        { name: 'Negotiate/Barter', primaryStat: CoreStat.Charisma, secondaryStat: CoreStat.Intelligence },
        { name: 'Social Media Post', primaryStat: CoreStat.Charisma, secondaryStat: CoreStat.Perception },
    ],
    [EncounterType.Physical]: [
        { name: 'Chase/Evade', primaryStat: CoreStat.Agility, secondaryStat: CoreStat.Agility },
        { name: 'Spot/Observe (Opposed)', primaryStat: CoreStat.Perception, secondaryStat: CoreStat.Agility },
        { name: 'Sneak/Shadow', primaryStat: CoreStat.Agility, secondaryStat: CoreStat.Perception },
        { name: 'Drive/Pilot', primaryStat: CoreStat.Agility, isVsDC: true },
        { name: 'Endure Stress', primaryStat: CoreStat.Endurance, isVsDC: true },
        { name: 'Withstand Fatigue', primaryStat: CoreStat.Endurance, isVsDC: true },
        // Add other physical actions vs DC?
        { name: 'Climb', primaryStat: CoreStat.Strength, isVsDC: true },
        { name: 'Jump', primaryStat: CoreStat.Strength, isVsDC: true },
        { name: 'Swim', primaryStat: CoreStat.Strength, isVsDC: true },
    ],
    [EncounterType.Mental]: [
        { name: 'Hack/Bypass (Opposed)', primaryStat: CoreStat.Intelligence, secondaryStat: CoreStat.Intelligence },
        { name: 'Research/Analyze (Opposed)', primaryStat: CoreStat.Intelligence, secondaryStat: CoreStat.Intelligence },
        { name: 'First Aid/Medical', primaryStat: CoreStat.Intelligence, secondaryStat: CoreStat.Endurance }, // Target is Endurance check? Or is it vs DC?
        { name: 'Hack/Bypass (vs DC)', primaryStat: CoreStat.Intelligence, isVsDC: true },
        { name: 'Research/Analyze (vs DC)', primaryStat: CoreStat.Intelligence, isVsDC: true },
        { name: 'Improvise/Adapt', primaryStat: CoreStat.Intelligence, isVsDC: true },
    ],
    [EncounterType.Exploration]: [
        // General checks, typically vs DC
        { name: 'Perception Check', primaryStat: CoreStat.Perception, isVsDC: true },
        { name: 'Survival Check', primaryStat: CoreStat.Endurance, isVsDC: true }, // Using Endurance as per PRD stat list
        { name: 'Investigation Check', primaryStat: CoreStat.Intelligence, isVsDC: true },
        { name: 'Navigation Check', primaryStat: CoreStat.Intelligence, isVsDC: true },
    ],
    [EncounterType.Other]: [
        { name: 'Luck Test (Opposed)', primaryStat: CoreStat.Luck, secondaryStat: CoreStat.Luck },
        { name: 'Luck Test (vs DC 50%)', primaryStat: CoreStat.Luck, isVsDC: true }, // Example vs DC
    ],
};

// Helper function to get actions for a type
export const getEncounterActions = (type: EncounterType | null): EncounterAction[] => {
    return type ? (encounterActions[type] || []) : [];
}; 