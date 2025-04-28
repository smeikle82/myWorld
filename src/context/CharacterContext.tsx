import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Character } from '../types/types';
import { saveItem, getItem } from '../utils/storage';

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}

interface CharacterContextType {
    characters: Character[];
    saveCharacter: (character: Character) => void;
    deleteCharacter: (id: string) => void;
    getCharacterById: (id: string) => Character | undefined;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const STORAGE_KEY = 'characters';
const SAVE_DEBOUNCE_WAIT = 500; // ms to wait before saving to localStorage

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [characters, setCharacters] = useState<Character[]>([]);

    // Load characters from localStorage on initial mount
    useEffect(() => {
        const storedCharacters = getItem<Character[]>(STORAGE_KEY) || [];
        // Ensure it's always an array, even if storage returns null/invalid
        setCharacters(Array.isArray(storedCharacters) ? storedCharacters : []);
    }, []);

    // Debounced save function
    const debouncedSave = useCallback(
        debounce((dataToSave: Character[]) => {
            console.log('Debounced save triggered'); // For debugging
            saveItem(STORAGE_KEY, dataToSave);
        }, SAVE_DEBOUNCE_WAIT),
        [] // No dependencies, the function itself doesn't change
    );

    // Persist characters to localStorage whenever they change, using debounce
    useEffect(() => {
        // Don't save the initial empty array before loading from storage
        if (characters.length > 0 || getItem(STORAGE_KEY) !== null) {
             debouncedSave(characters);
        }
    }, [characters, debouncedSave]);

    const saveCharacter = (character: Character) => {
        setCharacters(prev => {
            const existingIndex = prev.findIndex(c => c.id === character.id);
            if (existingIndex > -1) {
                // Update existing
                const updated = [...prev];
                updated[existingIndex] = character;
                return updated;
            } else {
                // Add new
                return [...prev, character];
            }
        });
    };

    const deleteCharacter = (id: string) => {
        setCharacters(prev => prev.filter(c => c.id !== id));
    };

     const getCharacterById = (id: string): Character | undefined => {
        return characters.find(c => c.id === id);
    };

    const value = {
        characters,
        saveCharacter,
        deleteCharacter,
        getCharacterById,
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};

// Custom hook to use the CharacterContext
export const useCharacters = (): CharacterContextType => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacters must be used within a CharacterProvider');
    }
    return context;
}; 