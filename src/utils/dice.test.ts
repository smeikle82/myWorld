import { rollDice, rollMultiple } from './dice';

describe('rollDice', () => {
  it('rolls a d20 and returns a value between 1 and 20', () => {
    for (let i = 0; i < 10; i++) {
      const result = rollDice('d20');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(20);
    }
  });

  it('rolls a d100 and returns a value between 1 and 100', () => {
    for (let i = 0; i < 10; i++) {
      const result = rollDice('d100');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(100);
    }
  });

  it('applies modifiers correctly', () => {
    for (let i = 0; i < 10; i++) {
      const result = rollDice('1d20+5');
      expect(result).toBeGreaterThanOrEqual(6);
      expect(result).toBeLessThanOrEqual(25);
    }
  });

  it('throws on invalid notation', () => {
    expect(() => rollDice('foo')).toThrow('Invalid dice notation');
    expect(() => rollDice('2d3')).toThrow('Only d20, d100, and standard dice supported');
  });
});

describe('rollMultiple', () => {
  it('rolls multiple dice and returns an array of results', () => {
    const results = rollMultiple('d20', 5);
    expect(results).toHaveLength(5);
    results.forEach(result => {
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(20);
    });
  });
}); 