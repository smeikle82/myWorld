import { getOracleResultForRoll, OracleLikelihood } from './oracle';

describe('getOracleResultForRoll', () => {
  const cases: Array<[
    OracleLikelihood,
    number,
    string
  ]> = [
    // Very Likely
    ['Very Likely', 1, 'Yes, and...'],
    ['Very Likely', 10, 'Yes, and...'],
    ['Very Likely', 11, 'Yes'],
    ['Very Likely', 85, 'Yes'],
    ['Very Likely', 86, 'Yes, but...'],
    ['Very Likely', 90, 'Yes, but...'],
    ['Very Likely', 91, 'No, but...'],
    ['Very Likely', 94, 'No, but...'],
    ['Very Likely', 95, 'No'],
    ['Very Likely', 99, 'No'],
    ['Very Likely', 100, 'No, and...'],
    // Likely
    ['Likely', 1, 'Yes, and...'],
    ['Likely', 5, 'Yes, and...'],
    ['Likely', 6, 'Yes'],
    ['Likely', 75, 'Yes'],
    ['Likely', 76, 'Yes, but...'],
    ['Likely', 80, 'Yes, but...'],
    ['Likely', 81, 'No, but...'],
    ['Likely', 85, 'No, but...'],
    ['Likely', 86, 'No'],
    ['Likely', 99, 'No'],
    ['Likely', 100, 'No, and...'],
    // 50/50
    ['50/50', 1, 'Yes, and...'],
    ['50/50', 2, 'Yes, and...'],
    ['50/50', 3, 'Yes'],
    ['50/50', 65, 'Yes'],
    ['50/50', 66, 'Yes, but...'],
    ['50/50', 70, 'Yes, but...'],
    ['50/50', 71, 'No, but...'],
    ['50/50', 75, 'No, but...'],
    ['50/50', 76, 'No'],
    ['50/50', 98, 'No'],
    ['50/50', 99, 'No, and...'],
    ['50/50', 100, 'No, and...'],
    // Unlikely
    ['Unlikely', 1, 'Yes, and...'],
    ['Unlikely', 2, 'Yes'],
    ['Unlikely', 35, 'Yes'],
    ['Unlikely', 36, 'Yes, but...'],
    ['Unlikely', 40, 'Yes, but...'],
    ['Unlikely', 41, 'No, but...'],
    ['Unlikely', 45, 'No, but...'],
    ['Unlikely', 46, 'No'],
    ['Unlikely', 95, 'No'],
    ['Unlikely', 96, 'No, and...'],
    ['Unlikely', 100, 'No, and...'],
    // Very Unlikely
    ['Very Unlikely', 1, 'Yes'],
    ['Very Unlikely', 15, 'Yes'],
    ['Very Unlikely', 16, 'Yes, but...'],
    ['Very Unlikely', 20, 'Yes, but...'],
    ['Very Unlikely', 21, 'No, but...'],
    ['Very Unlikely', 25, 'No, but...'],
    ['Very Unlikely', 26, 'No'],
    ['Very Unlikely', 90, 'No'],
    ['Very Unlikely', 91, 'No, and...'],
    ['Very Unlikely', 100, 'No, and...'],
  ];

  it.each(cases)('%s, roll %i => %s', (likelihood, roll, expected) => {
    expect(getOracleResultForRoll(likelihood, roll)).toBe(expected);
  });

  it('throws on invalid likelihood', () => {
    // @ts-expect-error
    expect(() => getOracleResultForRoll('Impossible', 50)).toThrow('Invalid likelihood');
  });

  it('throws on out-of-range roll', () => {
    expect(() => getOracleResultForRoll('Likely', 0)).toThrow('No result found for roll');
    expect(() => getOracleResultForRoll('Likely', 101)).toThrow('No result found for roll');
  });
}); 