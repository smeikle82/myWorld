import React, { useState } from 'react';
import LikelihoodSelector from './LikelihoodSelector';
import OracleResultDisplay from './OracleResultDisplay';
import { getOracleResult } from '../../utils/oracle';
import { LikelihoodLevel, OracleResultOutcome } from '../../types/types';

const OracleSystem: React.FC = () => {
    const [selectedLikelihood, setSelectedLikelihood] = useState<LikelihoodLevel | null>(null);
    const [resultData, setResultData] = useState<OracleResultOutcome | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAskOracle = () => {
        if (!selectedLikelihood) {
            // Optionally show an error message
            console.error("Please select a likelihood first.");
            return;
        }

        setIsLoading(true);
        setResultData(null);

        // Simulate delay
        setTimeout(() => {
            try {
                const outcome = getOracleResult(selectedLikelihood);
                setResultData(outcome);
            } catch (error) {
                console.error("Error getting oracle result:", error);
                // Handle error display if needed
            } finally {
                setIsLoading(false);
            }
        }, 300); // Shorter delay for oracle
    };

    return (
        <div style={{ padding: '20px', border: '1px solid orange' }}>
            <h2>Oracle System</h2>

            <LikelihoodSelector
                selectedLikelihood={selectedLikelihood}
                onSelectLikelihood={setSelectedLikelihood}
            />

            <button
                onClick={handleAskOracle}
                disabled={!selectedLikelihood || isLoading}
                style={{ marginTop: '15px', padding: '10px 15px' }}
            >
                {isLoading ? 'Consulting...' : 'Ask the Oracle'}
            </button>

            <OracleResultDisplay
                resultData={resultData}
                isLoading={isLoading}
            />

            {/* Optional: Display Probability Table */}
            {/* <OracleProbabilityTableDisplay /> */}
        </div>
    );
};

export default OracleSystem; 