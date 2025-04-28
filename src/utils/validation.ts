import { Character, NPC, Event, CoreStat, CharacterType } from '../types/types';

// Constants
const MAX_NOTE_LENGTH = 500;
const MIN_STAT_VALUE = 1;
const MAX_STAT_VALUE = 20; // Example range, adjust as needed

// --- Validation Helper Functions ---

export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  // Removed array check as empty arrays might be valid depending on context
  return true;
};

export const isStringValid = (value: string | undefined | null, minLength = 1, maxLength?: number): boolean => {
  if (typeof value !== 'string') return false; // Allow empty strings if minLength is 0
  if (value.trim().length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
};

export const isNumberInRange = (value: number | undefined | null, min: number, max: number): boolean => {
  if (typeof value !== 'number') return false;
  return value >= min && value <= max;
};

// --- Model Specific Validation Functions ---

export interface ValidationError {
  field: string;
  message: string;
}

export const validateCharacter = (character: Character): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isRequired(character.id)) {
    errors.push({ field: 'id', message: 'ID is required.' });
  }
  if (!isStringValid(character.name)) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }
  if (!isRequired(character.type) || !Object.values(CharacterType).includes(character.type)) {
    errors.push({ field: 'type', message: 'Valid character type is required.' });
  }
  if (!isRequired(character.health) || typeof character.health !== 'number' || character.health < 0) {
    errors.push({ field: 'health', message: 'Health must be a non-negative number.' });
  }

  // Validate stats
  if (!isRequired(character.stats)) {
    errors.push({ field: 'stats', message: 'Stats are required.' });
  } else {
    for (const stat of Object.values(CoreStat)) {
      if (!isRequired(character.stats[stat])) {
        errors.push({ field: `stats.${stat}`, message: `${stat} is required.` });
      } else if (!isNumberInRange(character.stats[stat], MIN_STAT_VALUE, MAX_STAT_VALUE)) {
        errors.push({ field: `stats.${stat}`, message: `${stat} must be between ${MIN_STAT_VALUE} and ${MAX_STAT_VALUE}.` });
      }
    }
  }

  // Validate notes length if present
  if (character.notes !== undefined && character.notes !== null) {
      errors.push(...validateNotes(character.notes));
  }

  // Add more specific checks as needed (skills, abilities, inventory format etc.)

  return errors;
};

export const validateNPC = (npc: NPC): ValidationError[] => {
  // Start with base character validation
  const errors = validateCharacter(npc);

  // Add NPC specific checks if any
  // Example: Check role length if present
  // if (npc.role && !isStringValid(npc.role, 1, 50)) {
  //   errors.push({ field: 'role', message: 'Role must be between 1 and 50 characters.' });
  // }

  return errors;
};

export const validateEvent = (event: Event): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isRequired(event.id)) {
    errors.push({ field: 'id', message: 'ID is required.' });
  }
  if (!isStringValid(event.name)) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }
  if (!isRequired(event.timestamp) || typeof event.timestamp !== 'string') {
      // Basic check, could add ISO date validation later
      errors.push({ field: 'timestamp', message: 'Timestamp is required.' });
  }
  // Add more checks (associatedCharacters format, outcomes etc.)

  return errors;
};

export const validateNotes = (notes: string | undefined | null): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (notes && typeof notes === 'string' && notes.length > MAX_NOTE_LENGTH) {
    errors.push({ field: 'notes', message: `Notes cannot exceed ${MAX_NOTE_LENGTH} characters.` });
  }
  return errors;
}; 