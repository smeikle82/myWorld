import React from 'react';
import { ComparisonOutcome, CheckVsDCResult, OpposedCheckResult, formatOutcome } from '../../utils/calculations'; // Import result types and formatter
import { Box, Text, Loader } from '@mantine/core'; // Use Mantine components

interface RollResultDisplayProps {
    // Accept the detailed result object
    rollResult: CheckVsDCResult | OpposedCheckResult | null;
    isLoading: boolean;
}

const RollResultDisplay: React.FC<RollResultDisplayProps> = ({
    rollResult,
    isLoading
}) => {

    if (isLoading) {
        return (
            <Box mt="lg" p="md" style={{ display: 'flex', justifyContent: 'center' }}>
                 <Loader />
            </Box>
        );
    }

    if (!rollResult) {
        return null; // Don't display anything if no result yet
    }

    // Use the formatOutcome function to get the display string
    const formattedString = formatOutcome(rollResult);

    // Basic styling based on outcome
    const getResultStyle = () => {
         if (!rollResult) return {};
        switch (rollResult.outcome) {
            case ComparisonOutcome.CritSuccess:
                return { color: 'var(--mantine-color-green-6)', fontWeight: 'bold' };
            case ComparisonOutcome.Success:
                return { color: 'var(--mantine-color-green-7)' };
            case ComparisonOutcome.Tie:
                return { color: 'var(--mantine-color-orange-7)' };
            case ComparisonOutcome.Failure:
                return { color: 'var(--mantine-color-red-7)' };
            case ComparisonOutcome.CritFailure:
                return { color: 'var(--mantine-color-red-6)', fontWeight: 'bold' };
            default:
                return {};
        }
    };

    return (
        // Use Mantine Box and Text, applying styles and preserving whitespace
        <Box mt="lg" p="md" style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 'var(--mantine-radius-sm)' }}>
            <Text component="h4" mb="xs" fw={500}>Result:</Text>
            <Text style={{ ...getResultStyle(), whiteSpace: 'pre-wrap' }}>
                {formattedString}
            </Text>
        </Box>
    );
};

export default RollResultDisplay; 