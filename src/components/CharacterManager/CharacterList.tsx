import React, { useState, useMemo } from 'react';
import { Character, CharacterType, CoreStat } from '../../types/types';
import CharacterForm from './CharacterForm'; // Import the form component
import { useCharacters } from '../../context/CharacterContext'; // Import context hook
import { Table, Button, TextInput, Select, Group, Text, Modal } from '@mantine/core';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications'; // Import notifications

// Placeholder for CharacterCard component (can be moved to its own file later)
const CharacterCard: React.FC<{ character: Character; onDelete: (id: string) => void; onEdit: (character: Character) => void }> = ({ character, onDelete, onEdit }) => {
    return (
        <div style={{ border: '1px solid grey', margin: '10px', padding: '10px' }}>
            <h3>{character.name} ({character.type})</h3>
            <p>Health: {character.health}</p>
            {/* Display stats - simplified */}
            <div>
                {Object.entries(character.stats).map(([stat, value]) => (
                    <span key={stat} style={{ marginRight: '10px' }}>{stat}: {value}</span>
                ))}
            </div>
            <p>Notes: {character.notes?.substring(0, 50)}...</p>
            {/* Add more details as needed */}
            <button onClick={() => onEdit(character)} style={{ marginRight: '5px' }}>Edit</button>
            <button onClick={() => onDelete(character.id)}>Delete</button>
        </div>
    );
};

const CharacterList: React.FC = () => {
    const { characters, saveCharacter, deleteCharacter } = useCharacters();
    // const [localCharacters, setLocalCharacters] = useState<Character[]>([]); // Managed by context now
    const [filter, setFilter] = useState<CharacterType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

    // Remove useEffect for loading, context handles it

    const handleSaveCharacter = (character: Character) => {
        saveCharacter(character);
        setEditingCharacter(null); // Reset editing state
        closeModal(); // Close modal after saving
        notifications.show({
            title: 'Character Saved',
            message: `Character '${character.name}' has been successfully saved.`,
            color: 'green',
        });
    };

    const handleDeleteCharacter = (id: string) => {
        const characterToDelete = characters.find(c => c.id === id);
        if (characterToDelete && window.confirm(`Are you sure you want to delete ${characterToDelete.name}?`)) {
            deleteCharacter(id);
            notifications.show({
                title: 'Character Deleted',
                message: `Character '${characterToDelete.name}' has been successfully deleted.`,
                color: 'red',
            });
        }
    };

    const handleEditCharacter = (character: Character) => {
        setEditingCharacter(character);
        openModal();
    };

    const handleAddNewCharacter = () => {
        setEditingCharacter(null); // Ensure we are creating new, not editing
        openModal();
    };

    // Filter and sort characters based on context data
    const filteredAndSortedCharacters = useMemo(() => {
        return characters
            .filter(char => filter === 'all' || char.type === filter)
            .filter(char => char.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [characters, filter, searchTerm]);

    // JSX remains largely the same, just using filteredAndSortedCharacters from context
    // ... (rest of the component, including table rendering)
    // ...

    return (
        <div>
            <h2>Character Manager</h2>

            <Group justify="space-between" mb="md">
                <Group>
                    <TextInput
                        placeholder="Search by name..."
                        leftSection={<IconSearch size={14} />}
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.currentTarget.value)}
                    />
                    <Select
                        placeholder="Filter by type"
                        value={filter}
                        onChange={(value) => setFilter(value as CharacterType | 'all' || 'all')}
                        data={[
                            { value: 'all', label: 'All Types' },
                            ...Object.values(CharacterType).map(type => ({ value: type, label: type }))
                        ]}
                    />
                </Group>
                <Button leftSection={<IconPlus size={14} />} onClick={handleAddNewCharacter}>
                    Add New Character/NPC/Enemy
                </Button>
            </Group>

            <Modal
                opened={isModalOpen}
                onClose={closeModal}
                title={editingCharacter ? 'Edit Character' : 'Create New Character'}
                size="lg"
            >
                <CharacterForm
                    onSave={handleSaveCharacter}
                    onCancel={closeModal}
                    initialCharacter={editingCharacter}
                />
            </Modal>

            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Health</Table.Th>
                        {Object.values(CoreStat).map(stat => <Table.Th key={stat}>{stat}</Table.Th>)}
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {filteredAndSortedCharacters.length > 0 ? (
                        filteredAndSortedCharacters.map(char => (
                            <Table.Tr key={char.id}>
                                <Table.Td>{char.name}</Table.Td>
                                <Table.Td>{char.type}</Table.Td>
                                <Table.Td>{char.health ?? 'N/A'}</Table.Td>
                                {Object.values(CoreStat).map(stat => (
                                    <Table.Td key={stat}>{char.stats?.[stat] ?? '-'}</Table.Td>
                                ))}
                                <Table.Td>
                                    <Group gap="xs">
                                        <Button size="xs" variant="outline" onClick={() => handleEditCharacter(char)} leftSection={<IconEdit size={14} />}>
                                            Edit
                                        </Button>
                                        <Button size="xs" variant="filled" color="red" onClick={() => handleDeleteCharacter(char.id)} leftSection={<IconTrash size={14} />}>
                                            Delete
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={3 + Object.values(CoreStat).length + 1}>No characters found.</Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default CharacterList; 