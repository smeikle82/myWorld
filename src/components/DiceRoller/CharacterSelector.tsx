import React from 'react';
import { Character } from '../../types/types';

interface CharacterSelectorProps {
    characters: Character[]; // List of available characters
    selectedCharacterId: string | null;
    onSelectCharacter: (id: string) => void;
    label?: string;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
    characters,
    selectedCharacterId,
    onSelectCharacter,
    label = "Select Character",
}) => {

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectCharacter(event.target.value);
    };

    return (
        <div>
            <label htmlFor="character-selector">{label}: </label>
            <select
                id="character-selector"
                value={selectedCharacterId || ''} // Handle null/undefined case for initial state
                onChange={handleSelectChange}
                required // Basic validation
            >
                <option value="" disabled>-- Select --</option>
                {characters.length > 0 ? (
                    characters.map(char => (
                        <option key={char.id} value={char.id}>
                            {char.name} ({char.type})
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No characters available</option>
                )}
            </select>
            {/* TODO: Add validation message display if needed */}
        </div>
    );
};

export default CharacterSelector; 