import { saveItem, getItem, removeItem, clearAllItems } from './storage';

describe('storage utilities', () => {
  // Simple in-memory localStorage mock
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeAll(() => {
    // @ts-ignore
    global.localStorage = localStorageMock;
  });
  afterAll(() => {
    // @ts-ignore
    delete global.localStorage;
  });
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('saves and retrieves an item', () => {
    saveItem('foo', { bar: 123 });
    expect(getItem<{ bar: number }>('foo')).toEqual({ bar: 123 });
  });

  it('returns null for missing key', () => {
    expect(getItem('missing')).toBeNull();
  });

  it('removes an item', () => {
    saveItem('foo', 'bar');
    removeItem('foo');
    expect(getItem('foo')).toBeNull();
  });

  it('clears all items', () => {
    saveItem('a', 1);
    saveItem('b', 2);
    clearAllItems();
    expect(getItem('a')).toBeNull();
    expect(getItem('b')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    localStorage.setItem('bad', '{not json');
    expect(getItem('bad')).toBeNull();
  });
}); 