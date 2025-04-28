import React from 'react';
// Import the shared type and constant
import { LikelihoodLevel, LIKELIHOOD_LEVELS } from '../../types/types';

// Define the possible likelihood levels (could be moved to types.ts if used elsewhere)
// MOVED TO types.ts
// export const LIKELIHOOD_LEVELS = [...];
// export type LikelihoodLevel = typeof LIKELIHOOD_LEVELS[number];

interface LikelihoodSelectorProps {
    selectedLikelihood: LikelihoodLevel | null;
    onSelectLikelihood: (likelihood: LikelihoodLevel) => void;
}

const LikelihoodSelector: React.FC<LikelihoodSelectorProps> = ({
    selectedLikelihood,
    onSelectLikelihood,
}) => {

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectLikelihood(event.target.value as LikelihoodLevel);
    };

    return (
        <div>
            <label htmlFor="likelihood-selector">Likelihood: </label>
            <select
                id="likelihood-selector"
                value={selectedLikelihood || ''} // Handle null for initial state
                onChange={handleSelectChange}
                required
            >
                <option value="" disabled>-- Select Likelihood --</option>
                {LIKELIHOOD_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                ))}
            </select>
             {/* TODO: Add validation message display */}
        </div>
    );
};

export default LikelihoodSelector; 