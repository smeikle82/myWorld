import React, { useState, useEffect } from 'react';
import { EncounterType, EncounterAction } from '../../types/types';
import { DifficultyClasses } from '../../utils/calculations';
import { getEncounterActions } from '../../utils/encounterData'; // Import actions data
import { Select, NumberInput, Box, Group } from '@mantine/core'; // Use Mantine components

interface EncounterSelectorProps {
    selectedEncounterType: EncounterType | null;
    onSelectEncounterType: (type: EncounterType | null) => void;
    selectedActionName: string | null; // New: Store selected action name
    onSelectActionName: (actionName: string | null) => void; // New: Handler for action selection
    customDC: number | '';
    onCustomDCChange: (dc: number | '') => void;
    // We can now derive if DC input is needed from the selected action
}

const EncounterSelector: React.FC<EncounterSelectorProps> = ({
    selectedEncounterType,
    onSelectEncounterType,
    selectedActionName,
    onSelectActionName,
    customDC,
    onCustomDCChange,
}) => {
    const [availableActions, setAvailableActions] = useState<EncounterAction[]>([]);
    const [selectedAction, setSelectedAction] = useState<EncounterAction | null>(null);

    // Update available actions when encounter type changes
    useEffect(() => {
        const actions = getEncounterActions(selectedEncounterType);
        setAvailableActions(actions);
        // Reset action selection if type changes
        onSelectActionName(null);
        setSelectedAction(null);
        // Reset DC if the type doesn't immediately imply a DC action
        if (actions.length > 0 && !actions.some(a => a.isVsDC)) {
             onCustomDCChange('');
        }
    }, [selectedEncounterType, onSelectActionName, onCustomDCChange]);

    // Update selected action object when name changes
    useEffect(() => {
        const action = availableActions.find(a => a.name === selectedActionName) || null;
        setSelectedAction(action);
        // If the selected action is not vs DC, clear custom DC
        if (action && !action.isVsDC) {
             onCustomDCChange('');
        }
        // If the selected action IS vs DC, maybe set a default?
        // Let's keep customDC as is, user might have set it.
    }, [selectedActionName, availableActions, onCustomDCChange]);

    const handleTypeChange = (value: string | null) => {
        onSelectEncounterType(value as EncounterType | null);
    };

    const handleActionChange = (value: string | null) => {
        onSelectActionName(value);
    };

    // Adjust handleDCChange to accept string | number
    const handleDCChange = (value: string | number) => {
        // Convert string input to number or empty string
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        // Ensure NaN becomes empty string, otherwise pass number or empty string
        const finalValue = (typeof numericValue === 'number' && isNaN(numericValue)) ? '' : numericValue;
        onCustomDCChange(finalValue as number | '');
    };

    // Determine if the DC input should be visible based on selected action
    const showDCInput = selectedAction?.isVsDC === true;
    // Determine if the Opponent selector should be visible (handled in parent based on selectedAction.secondaryStat)

    return (
        // Use Mantine Group for better layout
        <Group grow align="flex-start">
            {/* Encounter Type Selection */}
            <Select
                label="Encounter Type"
                placeholder="-- Select Type --"
                value={selectedEncounterType}
                onChange={handleTypeChange}
                data={Object.values(EncounterType).map(type => ({ value: type, label: type }))}
                clearable
                required
            />

            {/* Specific Action Selection (Conditional) */}
            {selectedEncounterType && availableActions.length > 0 && (
                <Select
                    label="Specific Action"
                    placeholder="-- Select Action --"
                    value={selectedActionName}
                    onChange={handleActionChange}
                    data={availableActions.map(action => ({ value: action.name, label: action.name }))}
                    clearable
                    required
                />
            )}

            {/* Difficulty Class Input (Conditional) */}
            {showDCInput && (
                <NumberInput
                    label="Difficulty Class (DC)"
                    placeholder={`e.g., ${DifficultyClasses.Medium}`}
                    value={customDC}
                    onChange={handleDCChange}
                    min={1}
                    required
                />
            )}
        </Group>
    );
};

export default EncounterSelector; 