// Define the current version for our stored data
const CURRENT_DATA_VERSION = 1;

// Interface for the versioned data structure
interface VersionedData<T> {
    version: number;
    data: T;
}

/**
 * Saves data to localStorage under the given key, wrapped in a versioned structure.
 * @param key - The storage key
 * @param data - The data to store (will be JSON-stringified)
 */
export function saveItem<T = any>(key: string, data: T): void {
    const versionedData: VersionedData<T> = {
        version: CURRENT_DATA_VERSION,
        data: data,
    };
    localStorage.setItem(key, JSON.stringify(versionedData));
}

/**
 * Retrieves data from localStorage by key, expecting a versioned structure.
 * Handles unversioned data or version mismatches.
 * @param key - The storage key
 * @returns The parsed data if version matches, or null otherwise.
 */
export function getItem<T = any>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value === null) return null;

    try {
        const parsedData = JSON.parse(value);

        // Check if it's our versioned structure
        if (parsedData && typeof parsedData === 'object' && 'version' in parsedData && 'data' in parsedData) {
            const versionedData = parsedData as VersionedData<T>;
            if (versionedData.version === CURRENT_DATA_VERSION) {
                return versionedData.data;
            } else {
                // Version mismatch - handle migration or ignore
                console.warn(`Data version mismatch for key "${key}". Found ${versionedData.version}, expected ${CURRENT_DATA_VERSION}. Discarding old data.`);
                // TODO: Implement migration logic if needed in the future
                return null;
            }
        } else {
            // Data is not in the expected versioned format (e.g., old data)
            console.warn(`Unversioned or invalid data format found for key "${key}". Discarding.`);
            return null; // Treat unversioned data as invalid for now
        }
    } catch (error) {
        console.error(`Error parsing localStorage item for key "${key}":`, error);
        return null;
    }
}

/**
 * Removes an item from localStorage by key.
 * @param key - The storage key
 */
export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clears all app data from localStorage.
 * Use with caution!
 */
export function clearAllItems(): void {
  localStorage.clear();
} 