import { 
    intToRoman, 
    romanToInt, 
    intToRomanLimitless, 
    romanToIntLimitless 
  } from '../src/romanConverter';
  
  describe('Roman numeral conversion (bounded)', () => {
    test('intToRoman converts 1 to I', () => {
      expect(intToRoman(1)).toBe("I");
    });
  
    test('intToRoman converts 3999 to MMMCMXCIX', () => {
      expect(intToRoman(3999)).toBe("MMMCMXCIX");
    });
  
    test('intToRoman throws error for 0', () => {
      expect(() => intToRoman(0)).toThrow("Input must be between 1 and 3999");
    });
  
    test('romanToInt converts I to 1', () => {
      expect(romanToInt("I")).toBe(1);
    });
  
    test('romanToInt converts MMMCMXCIX to 3999', () => {
      expect(romanToInt("MMMCMXCIX")).toBe(3999);
    });
  
    test('romanToInt throws error for invalid numeral', () => {
      expect(() => romanToInt("IIII")).toThrow("Invalid Roman numeral");
    });
  });
  
  describe('Roman numeral conversion (limitless)', () => {
    test('intToRomanLimitless converts 5000 to overlined V', () => {
      const result = intToRomanLimitless(5000);
      // Expected: overlined V is "V\u0305"
      expect(result).toBe("V\u0305");
    });
  
    test('intToRomanLimitless converts 342944 correctly', () => {
      const result = intToRomanLimitless(342944); // _C_C_C_X_LMMCMXLIV
      expect(result).toBe("C\u0305C\u0305C\u0305X\u0305L\u0305MMCMXLIV");
    });
  
    test('romanToIntLimitless converts limitless numeral back to number', () => {
      // For 342944, the expected format is "_C_C_C_X_LMMCMXLIV"
      const manualTest = "_C_C_C_X_LMMCMXLIV";
      expect(romanToIntLimitless(manualTest)).toBe(342944);
    });
  
    test('intToRomanLimitless throws error for number above upper bound', () => {
      expect(() => intToRomanLimitless(4000000)).toThrow();
    });
  });