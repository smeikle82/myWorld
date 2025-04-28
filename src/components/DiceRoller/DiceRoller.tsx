import React, { useState, useEffect } from 'react';
import CharacterSelector from './CharacterSelector';
import EncounterSelector from './EncounterSelector';
import RollResultDisplay from './RollResultDisplay';
import { Character, EncounterType, CoreStat, EncounterAction, CharacterType } from '../../types/types';
import {
    ComparisonOutcome,
    skillCheckVsDC,
    resolveOpposedCheck,
    formatOutcome,
    DifficultyClasses,
    CheckVsDCResult,
    OpposedCheckResult
} from '../../utils/calculations';
import { getEncounterActions } from '../../utils/encounterData';
import { useCharacters } from '../../context/CharacterContext';
import { Box, Button, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const DiceRoller: React.FC = () => {
    const { characters, getCharacterById } = useCharacters();

    const [char1Id, setChar1Id] = useState<string | null>(null);
    const [char2Id, setChar2Id] = useState<string | null>(null);
    const [encounterType, setEncounterType] = useState<EncounterType | null>(null);
    const [selectedActionName, setSelectedActionName] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<EncounterAction | null>(null);
    const [customDC, setCustomDC] = useState<number | ''>(DifficultyClasses.Medium);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rollResult, setRollResult] = useState<CheckVsDCResult | OpposedCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (encounterType && selectedActionName) {
            const actions = getEncounterActions(encounterType);
            const action = actions.find((a: EncounterAction) => a.name === selectedActionName) || null;
            setSelectedAction(action);

            if (action && !action.secondaryStat) {
                setChar2Id(null);
            }
            if (action && !action.isVsDC) {
                setCustomDC('');
            } else if (action?.isVsDC && customDC === '') {
                setCustomDC(DifficultyClasses.Medium);
            }
        } else {
            setSelectedAction(null);
            setChar2Id(null);
            setCustomDC('');
        }
    }, [encounterType, selectedActionName, customDC]);

    const isOpposedRoll = !!selectedAction?.secondaryStat;
    const isVsDCRoll = !!selectedAction?.isVsDC;

    const handleRoll = () => {
        setIsLoading(true);
        setRollResult(null);
        setError(null);

        const char1 = getCharacterById(char1Id || '');
        if (!char1) {
            setError('Initiating character not selected.');
            setIsLoading(false);
            return;
        }
        if (!selectedAction) {
            setError('Specific action not selected.');
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            try {
                let result: CheckVsDCResult | OpposedCheckResult;

                if (isOpposedRoll) {
                    const char2 = getCharacterById(char2Id || '');
                    if (!char2) {
                        setError('Opposing character not selected for opposed roll.');
                        setIsLoading(false);
                        return;
                    }
                    result = resolveOpposedCheck(char1, char2, selectedAction);
                } else if (isVsDCRoll) {
                    const dcToUse = Number(customDC) || DifficultyClasses.Medium;
                    result = skillCheckVsDC(char1, selectedAction.primaryStat, dcToUse);
                } else {
                    setError('Invalid roll configuration: Selected action is neither opposed nor vs DC.');
                    setIsLoading(false);
                    return;
                }
                setRollResult(result);
            } catch (e: any) {
                console.error("Error during roll:", e);
                setError(e.message || 'An error occurred during the roll.');
            } finally {
                setIsLoading(false);
            }
        }, 300);
    };

    const canRoll = char1Id !== null &&
                    selectedAction !== null &&
                    (!isOpposedRoll || char2Id !== null) &&
                    (!isVsDCRoll || customDC !== '');

    return (
        <Box style={{ maxWidth: 600, margin: 'auto' }}>
            <h2>Dice Roller</h2>

            {error && (
                <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" withCloseButton onClose={() => setError(null)} mb="md">
                    {error}
                </Alert>
            )}

            <CharacterSelector
                characters={characters}
                selectedCharacterId={char1Id}
                onSelectCharacter={setChar1Id}
                label="Initiating Character"
            />

            <Box mt="md">
                <EncounterSelector
                    selectedEncounterType={encounterType}
                    onSelectEncounterType={setEncounterType}
                    selectedActionName={selectedActionName}
                    onSelectActionName={setSelectedActionName}
                    customDC={customDC}
                    onCustomDCChange={setCustomDC}
                />
            </Box>

            {isOpposedRoll && (
                <Box mt="md">
                    <CharacterSelector
                        characters={characters.filter(c => c.id !== char1Id && c.type !== CharacterType.Event)}
                        selectedCharacterId={char2Id}
                        onSelectCharacter={setChar2Id}
                        label="Opposing Character"
                    />
                </Box>
            )}

            <Button
                onClick={handleRoll}
                disabled={!canRoll || isLoading}
                loading={isLoading}
                mt="xl"
                size="md"
                fullWidth
            >
                Roll!
            </Button>

            <RollResultDisplay
                rollResult={rollResult}
                isLoading={isLoading}
            />
        </Box>
    );
};

export default DiceRoller; 