// int-> Roman numeral
export function intToRoman(num: number): string {
  if (num <= 0 || num >= 4000) {
    throw new Error("Input must be between 1 and 3999");
  }
  const romanNumerals: { [key: number]: string } = {
    1000: "M", 900: "CM", 500: "D", 400: "CD",
    100: "C", 90: "XC", 50: "L", 40: "XL",
    10: "X", 9: "IX", 5: "V", 4: "IV", 1: "I"
  };
  let result = '';
  for (const value of Object.keys(romanNumerals)
                               .map(Number)
                               .sort((a, b) => b - a)) {
    while (num >= value) { // classic Integer to Roman
      result += romanNumerals[value];
      num -= value;
    }
  }
  return result;
}

// Roman numeral-> int
export function romanToInt(roman: string): number {
  // Regex to validate Roman numerals from 1 to 3999.
  const validRomanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  
  if (!validRomanRegex.test(roman)) {
    throw new Error("Invalid Roman numeral");
  }

  const romanMap: { [key: string]: number } = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanMap[roman[i]];
    const next = romanMap[roman[i + 1]];
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
}

const LIMITLESS_UPPER_BOUND = 3999999;

/**
 * int-> Roman numeral, using vinculum notation
 * - For numbers < 4000, uses the standard conversion.
 * - For numbers 4000 - 9999, converts the thousands part exactly.
 * - For numbers >= 10,000, attempts to round the thousands part down to the nearest multiple of 10,
 *   but only if doing so yields a remainder (num - (rounded_thousands * 1000)) that is less than 4000.
 *   Otherwise, uses the raw thousands part.
 *
 * Ex:
 * - intToRomanLimitless(5000):
 *     raw thousands = 5 (since 5000 < 10000) -> _V
 *
 * - intToRomanLimitless(342944):
 *     raw thousands = Math.floor(342944/1000) = 342.
 *     rounded thousands = 342 - (342 % 10) = 340.
 *     remainder if rounded = 342944 - (340*1000) = 2944 (< 4000), so use 340.
 *     intToRoman(340) -> "CCCXL", overlined becomes "_C_C_C_X_L".
 *     intToRoman(2944) -> "MMCMXLIV".
 *     Final result: _(CCCXL)MMCMXLIV.
 *
 * - intToRomanLimitless(3999999):
 *     raw thousands = Math.floor(3999999/1000) = 3999.
 *     rounded thousands = 3999 - 9 = 3990.
 *     remainder if rounded = 3999999 - (3990*1000) = 9999 (> 4000), so use raw thousands.
 *     remainder raw thousands = 3999999-(3999*1000) = 3999999 % 1000 = 999.
 *     intToRoman(3999) -> "MMMCMXCIX", overlined becomes "_M_M_M_C_M_X_C_I_X".
 *     intToRoman(999) -> "CMXCIX".
 *     Final result: _(MMMCMXCIX)CMXCIX.
 */
export function intToRomanLimitless(num: number): string {
  if (num <= 0 || num > LIMITLESS_UPPER_BOUND) {
    const LIMITLESS_UPPER_BOUND_STR = LIMITLESS_UPPER_BOUND.toLocaleString("en-US");
    throw new Error(`Input must be between 1 and ${LIMITLESS_UPPER_BOUND_STR}`);
  }
  if (num < 4000) {
    return intToRoman(num);
  }
  // For numbers between 4000 and 9999, use the raw thousands part.
  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandsRoman = intToRoman(thousands);
    const formattedThousands = thousandsRoman.split('').map(ch => ch + "\u0305").join('');
    const remainderRoman = remainder > 0 ? intToRoman(remainder) : "";
    return formattedThousands + remainderRoman;
  } else {
    // For numbers > 10,000, first compute the raw thousands value.
    const rawThousands = Math.floor(num / 1000);
    const roundedThousands = rawThousands - (rawThousands % 10);
    const remainderIfRounded = num - (roundedThousands * 1000);
    let thousandsToUse: number;
    let remainder: number;
    if (remainderIfRounded < 4000) {
      thousandsToUse = roundedThousands;
      remainder = remainderIfRounded;
    } else {
      thousandsToUse = rawThousands;
      remainder = num % 1000;
    }
    const thousandsRoman = intToRoman(thousandsToUse);
    const formattedThousands = thousandsRoman.split('').map(ch => ch + "\u0305").join('');
    const remainderRoman = remainder > 0 ? intToRoman(remainder) : "";
    return formattedThousands + remainderRoman;
  }
}

/**
 * Roman numeral-> int
 * - reads Roman numeral input vinculum if present
 */
export function romanToIntLimitless(roman: string): number {
  const normalized = roman.normalize('NFD').replace(/\u0305/g, '_');
  const regex = /^((?:_[IVXLCDM])*)([IVXLCDM]*)$/;
  const match = normalized.match(regex);
  if (!match) {
    throw new Error("Invalid Roman numeral format");
  }
  const vinculumPart = match[1]; // ex. "_C_X_X" for overlined "CXX"
  const normalPart = match[2];

  let total = 0;
  if (vinculumPart) {
    const vinculumRoman = vinculumPart.replace(/_/g, '');
    const standardRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    if (!standardRegex.test(vinculumRoman)) {
      throw new Error("Invalid vinculum Roman numeral part");
    }
    const vinculumValue = romanToInt(vinculumRoman);
    total += vinculumValue * 1000;
  }
  if (normalPart) {
    const standardRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    if (!standardRegex.test(normalPart)) {
      throw new Error("Invalid normal Roman numeral part");
    }
    total += romanToInt(normalPart);
  }
  if (total <= 0 || total > LIMITLESS_UPPER_BOUND) {
    const LIMITLESS_UPPER_BOUND_STR = LIMITLESS_UPPER_BOUND.toLocaleString("en-US");
    throw new Error(`Resulting number must be between 1 and ${LIMITLESS_UPPER_BOUND_STR}`);
  }
  return total;
}