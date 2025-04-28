import { describe, it, expect } from 'vitest';
import {
  validateCharacter,
  validateNPC,
  validateEvent,
  validateNotes,
  ValidationError,
} from './validation';
import { Character, NPC, Event, CharacterType, CoreStat } from '../types/types';

// Helper to create valid stats
const createValidStats = (): Record<CoreStat, number> => ({
  [CoreStat.Strength]: 10,
  [CoreStat.Dexterity]: 10,
  [CoreStat.Constitution]: 10,
  [CoreStat.Intelligence]: 10,
  [CoreStat.Wisdom]: 10,
  [CoreStat.Charisma]: 10,
});

// --- Character Validation Tests ---
describe('validateCharacter', () => {
  const validCharacter: Character = {
    id: 'char1',
    name: 'Valid Hero',
    type: CharacterType.Player,
    stats: createValidStats(),
    health: 100,
  };

  it('should return no errors for a valid character', () => {
    expect(validateCharacter(validCharacter)).toEqual([]);
  });

  it('should return errors for missing required fields', () => {
    const invalid = { ...validCharacter, name: ' ' } as Character;
    const errors = validateCharacter(invalid);
    expect(errors).toContainEqual({ field: 'name', message: 'Name is required.' });
  });

  it('should return errors for invalid stats', () => {
    const invalid = {
      ...validCharacter,
      stats: { ...createValidStats(), [CoreStat.Strength]: 25 },
    };
    const errors = validateCharacter(invalid);
    expect(errors).toContainEqual({
      field: 'stats.Strength',
      message: 'Strength must be between 1 and 20.',
    });
  });

   it('should return error for invalid notes', () => {
        const longNote = 'a'.repeat(501);
        const invalid = { ...validCharacter, notes: longNote };
        const errors = validateCharacter(invalid);
        expect(errors).toContainEqual({
            field: 'notes',
            message: 'Notes cannot exceed 500 characters.',
        });
    });
});

// --- NPC Validation Tests ---
describe('validateNPC', () => {
  const validNPC: NPC = {
    id: 'npc1',
    name: 'Valid NPC',
    type: CharacterType.NPC,
    stats: createValidStats(),
    health: 50,
  };

  it('should return no errors for a valid NPC', () => {
    expect(validateNPC(validNPC)).toEqual([]);
  });

   it('should inherit character validation errors', () => {
        const invalid = { ...validNPC, health: -10 };
        const errors = validateNPC(invalid);
        expect(errors).toContainEqual({ field: 'health', message: 'Health must be a non-negative number.' });
    });

  // Add NPC-specific tests if needed
});

// --- Event Validation Tests ---
describe('validateEvent', () => {
  const validEvent: Event = {
    id: 'event1',
    name: 'Valid Event',
    timestamp: new Date().toISOString(),
  };

  it('should return no errors for a valid event', () => {
    expect(validateEvent(validEvent)).toEqual([]);
  });

   it('should return errors for missing required fields', () => {
        const invalid = { ...validEvent, name: '' };
        const errors = validateEvent(invalid);
        expect(errors).toContainEqual({ field: 'name', message: 'Name is required.' });
    });
});

// --- Notes Validation Tests ---
describe('validateNotes', () => {
  it('should return no error for valid notes', () => {
    expect(validateNotes('These are valid notes.')).toEqual([]);
    expect(validateNotes('a'.repeat(500))).toEqual([]);
    expect(validateNotes('')).toEqual([]);
    expect(validateNotes(undefined)).toEqual([]);
    expect(validateNotes(null)).toEqual([]);
  });

  it('should return error for notes exceeding max length', () => {
    const longNote = 'a'.repeat(501);
    const errors = validateNotes(longNote);
    expect(errors).toEqual([{
      field: 'notes',
      message: 'Notes cannot exceed 500 characters.',
    }]);
  });
}); 