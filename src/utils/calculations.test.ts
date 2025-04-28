import { describe, it, expect, vi } from 'vitest';
import {
    calculateStatModifier,
    resolveVs,
    ComparisonOutcome,
    getEncounterStatPairing,
    formatOutcome,
} from './calculations';
import { EncounterType, CoreStat } from '../types/types';
// We might need to mock rollDice if testing functions that use it
// import * as diceUtils from './dice';

describe('calculateStatModifier', () => {
  it('should return the correct modifier for various stat values', () => {
    expect(calculateStatModifier(1)).toBe(-5);
    expect(calculateStatModifier(8)).toBe(-1);
    expect(calculateStatModifier(10)).toBe(0);
    expect(calculateStatModifier(11)).toBe(0);
    expect(calculateStatModifier(12)).toBe(1);
    expect(calculateStatModifier(15)).toBe(2);
    expect(calculateStatModifier(18)).toBe(4);
    expect(calculateStatModifier(20)).toBe(5);
  });

  it('should handle edge cases and invalid inputs gracefully', () => {
    expect(calculateStatModifier(0)).toBe(-5); // Still calculates based on formula
    expect(calculateStatModifier(-5)).toBe(-8);
    expect(calculateStatModifier(10.5)).toBe(0); // Uses floor
    // @ts-expect-error - Testing invalid input type
    expect(calculateStatModifier(null)).toBe(0); // Defaults to 10 -> modifier 0
    // @ts-expect-error - Testing invalid input type
    expect(calculateStatModifier(undefined)).toBe(0);
    // @ts-expect-error - Testing invalid input type
    expect(calculateStatModifier('abc')).toBe(0);
  });
});

// --- NEW: resolveVs Tests ---
describe('resolveVs', () => {
    it('should return Success when value1 > value2', () => {
        expect(resolveVs(15, 10)).toBe(ComparisonOutcome.Success);
        expect(resolveVs(1, 0)).toBe(ComparisonOutcome.Success);
        expect(resolveVs(0, -1)).toBe(ComparisonOutcome.Success);
    });

    it('should return Failure when value1 < value2', () => {
        expect(resolveVs(10, 15)).toBe(ComparisonOutcome.Failure);
        expect(resolveVs(0, 1)).toBe(ComparisonOutcome.Failure);
        expect(resolveVs(-1, 0)).toBe(ComparisonOutcome.Failure);
    });

    it('should return Tie when value1 === value2', () => {
        expect(resolveVs(10, 10)).toBe(ComparisonOutcome.Tie);
        expect(resolveVs(0, 0)).toBe(ComparisonOutcome.Tie);
        expect(resolveVs(-5, -5)).toBe(ComparisonOutcome.Tie);
    });
});

// --- NEW: getEncounterStatPairing Tests ---
describe('getEncounterStatPairing', () => {
    it('should return the correct pairing for Combat', () => {
        const pairing = getEncounterStatPairing(EncounterType.Combat);
        expect(pairing).toBeDefined();
        expect(pairing?.encounterType).toBe(EncounterType.Combat);
        expect(pairing?.primaryStat).toBe(CoreStat.Strength); // Based on current default
        expect(pairing?.secondaryStat).toBe(CoreStat.Dexterity); // Based on current default
    });

    it('should return the correct pairing for Social', () => {
        const pairing = getEncounterStatPairing(EncounterType.Social);
        expect(pairing).toBeDefined();
        expect(pairing?.encounterType).toBe(EncounterType.Social);
        expect(pairing?.primaryStat).toBe(CoreStat.Charisma);
        expect(pairing?.secondaryStat).toBe(CoreStat.Wisdom);
    });

    it('should return the correct pairing for Exploration', () => {
        const pairing = getEncounterStatPairing(EncounterType.Exploration);
        expect(pairing).toBeDefined();
        expect(pairing?.encounterType).toBe(EncounterType.Exploration);
        expect(pairing?.primaryStat).toBe(CoreStat.Wisdom);
        expect(pairing?.secondaryStat).toBeUndefined();
    });

    it('should return undefined for an unknown encounter type', () => {
        // @ts-expect-error - Testing invalid input
        const pairing = getEncounterStatPairing('UnknownType');
        expect(pairing).toBeUndefined();
    });
});

// --- NEW: formatOutcome Tests ---
describe('formatOutcome', () => {
    it('should format basic outcomes correctly', () => {
        expect(formatOutcome(ComparisonOutcome.Success)).toBe('Success.');
        expect(formatOutcome(ComparisonOutcome.Failure)).toBe('Failure.');
        expect(formatOutcome(ComparisonOutcome.Tie)).toBe('Tie.');
        expect(formatOutcome(ComparisonOutcome.CritSuccess)).toBe('Critical Success!');
        expect(formatOutcome(ComparisonOutcome.CritFailure)).toBe('Critical Failure!');
    });

    it('should include roll details when provided', () => {
        const details = { roll: 15, modifier: 2, total: 17, dc: 15 };
        expect(formatOutcome(ComparisonOutcome.Success, details))
            .toBe('Success. (Roll: 15 +2 = 17 vs DC: 15)');
    });

    it('should format negative modifiers correctly', () => {
         const details = { roll: 5, modifier: -1, total: 4, dc: 10 };
        expect(formatOutcome(ComparisonOutcome.Failure, details))
            .toBe('Failure. (Roll: 5 -1 = 4 vs DC: 10)');
    });

    it('should handle missing roll/modifier details gracefully', () => {
        const details = { total: 12, dc: 10 };
        expect(formatOutcome(ComparisonOutcome.Success, details))
            .toBe('Success. (Result: 12 vs DC: 10)');
    });

    it('should handle missing DC detail gracefully', () => {
        const details = { roll: 10, modifier: 1, total: 11 };
        expect(formatOutcome(ComparisonOutcome.Tie, details))
            .toBe('Tie. (Roll: 10 +1 = 11)');
    });

     it('should omit empty parentheses if no details are useful', () => {
        const details = {};
        expect(formatOutcome(ComparisonOutcome.Success, details))
            .toBe('Success.');
    });
});

// Add tests for other calculation functions once their logic is finalized
// Example for simulateAttackRoll (would require mocking rollDice)
/*
describe('simulateAttackRoll', () => {
  vi.mock('./dice', () => ({
    rollDice: vi.fn(),
  }));

  const mockCharacter = {
    id: 'test', name: 'Tester', type: 'Player', health: 10,
    stats: { Str: 14, Dex: 12, Con: 10, Int: 8, Wis: 13, Cha: 15 }
  } as any; // Use partial type for simplicity

  it('should add the correct modifier to the dice roll', () => {
    vi.mocked(diceUtils.rollDice).mockReturnValue(10);
    // Assuming Str (14 -> +2 modifier)
    const result = simulateAttackRoll(mockCharacter, 'Str');
    expect(diceUtils.rollDice).toHaveBeenCalledWith('d20');
    expect(result).toBe(12); // 10 (roll) + 2 (modifier)
  });
});
*/ 