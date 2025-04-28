import React from 'react';
import { LikelihoodLevel, OracleResultOutcome } from '../../types/types';
import { Box, Text, Loader } from '@mantine/core';

interface OracleResultDisplayProps {
    resultData: OracleResultOutcome | null;
    isLoading: boolean;
}

const OracleResultDisplay: React.FC<OracleResultDisplayProps> = ({
    resultData,
    isLoading
}) => {

    if (isLoading) {
        return (
            <Box mt="lg" p="md" style={{ display: 'flex', justifyContent: 'center' }}>
                 <Loader />
            </Box>
        );
    }

    if (!resultData) {
        return null;
    }

    // Determine Pass/Fail based on isYes
    const passFailText = resultData.isYes ? 'PASS' : 'FAIL';

    // Format the detailed result string
    const detailedResult = `(${passFailText}): You rolled ${resultData.roll} vs <= ${resultData.yesThreshold} needed for Yes on ${resultData.likelihood}`;

    // Basic styling based on boolean result
    const getResultStyle = () => {
        return resultData.isYes ?
            { color: 'var(--mantine-color-green-7)' } :
            { color: 'var(--mantine-color-red-7)' };
    };

    return (
        <Box mt="lg" p="md" style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 'var(--mantine-radius-sm)' }}>
            <Text component="h4" mb="xs" fw={500}>Oracle Answer:</Text>
            {/* Display the main result (Yes, No, but...) */}
            <Text size="lg" fw={500} style={getResultStyle()}>
                 {resultData.result}
            </Text>
            {/* Display the detailed roll information */}
            <Text size="sm" c="dimmed" mt={4}>
                 {detailedResult}
            </Text>
        </Box>
    );
};

export default OracleResultDisplay; 