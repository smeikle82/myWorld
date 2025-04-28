import React, { useState } from 'react';
import { Character, CharacterType, CoreStat } from '../../types/types';
import { validateCharacter, ValidationError } from '../../utils/validation';
import { v4 as uuidv4 } from 'uuid';
// Import Mantine components for better styling
import { TextInput, Select, NumberInput, Textarea, Button, Group, Stack, Fieldset, Title, SimpleGrid } from '@mantine/core';
import FormError from '../common/FormError'; // Import the reusable error component

interface CharacterFormProps {
    onSave: (character: Character) => void;
    onCancel: () => void;
    initialCharacter?: Character | null;
}

// Define a type for the form state, allowing undefined for numbers during editing
type CharacterFormData = Omit<Partial<Character>, 'stats' | 'health'> & {
    health?: number | ''; // Allow empty string for health input
    stats?: Partial<Record<CoreStat, number | ''>>; // Allow empty strings for stat inputs
};

// Helper to initialize stats ensuring they are numbers or empty string for the form
const initializeFormStats = (initialStats?: Record<CoreStat, number>): Partial<Record<CoreStat, number | ''>> => {
    // Use the updated CoreStat enum from types.ts
    const defaultStats = Object.values(CoreStat).reduce((acc, stat) => {
        acc[stat] = 10;
        return acc;
    }, {} as Record<CoreStat, number | ''>);
    // Ensure initialStats keys are valid CoreStats if provided (optional safety check)
    const validInitialStats = initialStats ? Object.entries(initialStats)
        .filter(([key]) => Object.values(CoreStat).includes(key as CoreStat))
        .reduce((acc, [key, value]) => {
            acc[key as CoreStat] = value;
            return acc;
        }, {} as Record<CoreStat, number>) : {};
    return initialStats ? { ...defaultStats, ...validInitialStats } : defaultStats;
};

const CharacterForm: React.FC<CharacterFormProps> = ({ onSave, onCancel, initialCharacter }) => {
    const [characterData, setCharacterData] = useState<CharacterFormData>(() => {
        const defaultValues = {
            type: CharacterType.Player,
            health: '' as number | '', // Initialize health explicitly
            stats: initializeFormStats(),
            notes: '',
            name: '',
        };
        if (initialCharacter) {
            // Ensure stats are initialized correctly even if missing from initialCharacter
            const initialStats = initializeFormStats(initialCharacter.stats);
            return { ...defaultValues, ...initialCharacter, stats: initialStats, health: initialCharacter.health ?? '' };
        }
        return defaultValues;
    });

    const [errors, setErrors] = useState<ValidationError[]>([]);

    // Update handlers to work with Mantine's onChange (which often just passes the value)
    const handleMantineChange = (name: keyof CharacterFormData, value: string | number | CharacterType) => {
        setCharacterData(prev => ({ ...prev, [name]: value }));
    };

    // Update handleStatChange to accept string | number from NumberInput
    const handleStatChange = (stat: CoreStat, value: string | number) => {
        // Convert empty string or non-numeric string to empty string for state,
        // otherwise keep the number.
        const stateValue = typeof value === 'string' ? (value === '' ? '' : parseInt(value, 10)) : value;
        // Ensure NaN from parseInt becomes empty string
        const finalValue = (typeof stateValue === 'number' && isNaN(stateValue)) ? '' : stateValue;

        setCharacterData(prev => ({
            ...prev,
            stats: { ...(prev.stats || {}), [stat]: finalValue as number | '' },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert form data to Character type for validation/saving
        const statsForValidation: Record<CoreStat, number> = { ...initializeFormStats() } as Record<CoreStat, number>; // Start with defaults
        // Ensure all CoreStats are present
        for (const coreStat of Object.values(CoreStat)) {
            const statValue = characterData.stats?.[coreStat];
            statsForValidation[coreStat] = (typeof statValue === 'number' && !isNaN(statValue)) ? statValue : 10;
        }

        const charToValidate: Omit<Character, 'id'> & { id?: string } = {
            name: characterData.name || '',
            type: characterData.type || CharacterType.Player,
            health: (typeof characterData.health === 'number' && !isNaN(characterData.health)) ? characterData.health : undefined, // Keep health optional
            stats: statsForValidation,
            notes: characterData.notes || '',
            id: characterData.id,
            // Ensure other optional fields are handled
            skills: characterData.skills || [],
            abilities: characterData.abilities || [],
            inventory: characterData.inventory || [],
            description: characterData.description || '',
            role: characterData.role || '',
            affiliation: characterData.affiliation || '',
        };

        // Assign ID if creating new
        if (!charToValidate.id) {
            charToValidate.id = uuidv4();
        }

        const validationErrors = validateCharacter(charToValidate as Character);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
            onSave(charToValidate as Character);
        }
    };

    const getError = (field: string): string | undefined => {
        return errors.find(err => err.field === field)?.message;
    };

    return (
        // Replace basic form elements with Mantine components
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <Title order={3}>{initialCharacter ? 'Edit Character' : 'Create New Character'}</Title>

                <TextInput
                    label="Name"
                    name="name" // Still useful for potential non-Mantine handling
                    value={characterData.name || ''}
                    onChange={(event) => handleMantineChange('name', event.currentTarget.value)}
                    error={getError('name')}
                    required
                />

                <Select
                    label="Type"
                    name="type"
                    value={characterData.type || CharacterType.Player}
                    onChange={(value) => handleMantineChange('type', value as CharacterType)}
                    // Filter out Event type from form selection?
                    data={Object.values(CharacterType).filter(t => t !== CharacterType.Event).map(type => ({ value: type, label: type }))}
                    error={getError('type')}
                    required
                 />

                <NumberInput
                    label="Health"
                    name="health"
                    value={characterData.health}
                    onChange={(value) => handleMantineChange('health', value)}
                    error={getError('health')}
                    min={0}
                    // Health is now optional in type, but maybe required by form?
                    // Keep required for Player/NPC/Enemy?
                    // Let's keep it required for now, validation should handle type differences if needed.
                    required
                />

                <Fieldset legend="Stats">
                    <SimpleGrid cols={3} spacing="md" verticalSpacing="sm">
                        {Object.values(CoreStat).map(stat => (
                             <NumberInput
                                key={stat}
                                label={stat}
                                value={characterData.stats?.[stat]}
                                onChange={(value) => handleStatChange(stat, value)}
                                error={getError(`stats.${stat}`)}
                                min={1}
                                max={20}
                                required
                            />
                        ))}
                    </SimpleGrid>
                 </Fieldset>

                <Textarea
                    label="Notes"
                    name="notes"
                    value={characterData.notes || ''}
                    onChange={(event) => handleMantineChange('notes', event.currentTarget.value)}
                    error={getError('notes')}
                    rows={4}
                    autosize
                    minRows={3}
                    maxLength={500}
                    description={`${characterData.notes?.length || 0} / 500 characters`}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">{initialCharacter ? 'Save Changes' : 'Create Character'}</Button>
                </Group>
            </Stack>
        </form>
    );
};

export default CharacterForm;