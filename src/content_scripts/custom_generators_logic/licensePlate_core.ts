/**
 * Generates a vehicle license plate number.
 * @param country - Country code for license plate format (default: 'pl')
 * @returns License plate number in the specified country format
 *
 * Supported countries:
 * - 'pl' - Poland: Format 'XX NNNNN' or 'XXX NNNNN' where X=letter, N=digit
 * - 'de' - Germany: Format 'XX XX NNN' where X=letter, N=digit
 * - 'uk' - United Kingdom: Format 'XX NN XXX' where X=letter, N=digit
 * - 'us' - United States: Format 'XXX NNNN' (varies by state, simplified format)
 * - 'ro' - Romania: Format 'XX NN XXX' where X=letter, N=digit
 */
export function generateLicensePlate(country: string = 'pl'): string {
  // Polish prefixes for license plates
  const POLISH_PREFIXES = [
    'WA',
    'WB',
    'WD',
    'WE',
    'WF',
    'WG',
    'WH',
    'WI',
    'WJ',
    'WK',
    'WN',
    'WT',
    'WU',
    'WW',
    'WX',
    'WY',
    'WZ',
    'BI',
    'BS',
    'BL',
    'BA',
    'BI',
    'BM',
    'BP',
    'BK',
    'BY',
    'CT',
    'CW',
    'CA',
    'CE',
    'CB',
    'CG',
    'CI',
    'CL',
    'CM',
    'CN',
    'CS',
    'CT',
    'DJ',
    'DL',
    'DB',
    'DW',
    'DG',
    'DZ',
    'EP',
    'ES',
    'EL',
    'EZ',
    'FG',
    'FZ',
    'FY',
    'FB',
    'FS',
    'FB',
    'FL',
    'FM',
    'GD',
    'GA',
    'GS',
    'GP',
    'GK',
    'GN',
    'GY',
    'KR',
    'KN',
    'KT',
    'KA',
    'KI',
    'KH',
    'KZ',
    'KS',
    'LU',
    'LB',
    'LC',
    'LD',
    'LE',
    'LG',
    'LI',
    'LJ',
    'LL',
    'LM',
    'LO',
    'LP',
    'LR',
    'LS',
    'LT',
    'LW',
    'LZ',
    'MP',
    'MG',
    'MK',
    'MI',
    'MN',
    'MS',
    'MZ',
    'NO',
    'NE',
    'NL',
    'NM',
    'NS',
    'NT',
    'OP',
    'OB',
    'OD',
    'OG',
    'OK',
    'OL',
    'ON',
    'OO',
    'OP',
    'OR',
    'OS',
    'OT',
    'OY',
    'PO',
    'PY',
    'PK',
    'PN',
    'PT',
    'PL',
    'PS',
    'PP',
    'PZ',
    'RA',
    'RK',
    'RP',
    'RD',
    'RS',
    'RI',
    'RJ',
    'RM',
    'RN',
    'RT',
    'RW',
    'RZ',
    'SC',
    'SD',
    'SE',
    'SF',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SP',
    'SR',
    'ST',
    'SU',
    'SW',
    'SZ',
    'TK',
    'TA',
    'TB',
    'TC',
    'TG',
    'TL',
    'TM',
    'TO',
    'TP',
    'TR',
    'TS',
    'TT',
    'TY',
    'WL',
    'WA',
    'WB',
    'WF',
    'WE',
    'WH',
    'WJ',
    'WK',
    'WM',
    'WN',
    'WO',
    'WP',
    'WR',
    'WS',
    'WT',
    'WU',
    'WV',
    'WY',
    'WZ',
    'ZK',
    'ZA',
    'ZB',
    'ZC',
    'ZD',
    'ZE',
    'ZF',
    'ZG',
    'ZH',
    'ZI',
    'ZJ',
    'ZL',
    'ZM',
    'ZN',
    'ZO',
    'ZP',
    'ZR',
    'ZS',
    'ZT',
    'ZU',
    'ZW',
    'ZZ'
  ]

  // German city codes
  const GERMAN_PREFIXES = [
    'B',
    'M',
    'K',
    'S',
    'HH',
    'D',
    'F',
    'N',
    'SB',
    'HB',
    'H',
    'DD',
    'L',
    'MA',
    'BO',
    'BN',
    'AC',
    'PF',
    'KA',
    'HD',
    'MZ',
    'WI',
    'A',
    'UL',
    'HN',
    'HO',
    'FR',
    'KL',
    'MO',
    'NU'
  ]

  // UK prefix letters (excluding I, O, Q, Z which are not used)
  const UK_PREFIXES = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y'
  ]

  // Romanian county codes
  const ROMANIAN_PREFIXES = [
    'B',
    'AB',
    'AG',
    'AR',
    'BC',
    'BH',
    'BN',
    'BR',
    'BT',
    'BV',
    'BZ',
    'CJ',
    'CL',
    'CS',
    'CT',
    'CV',
    'DB',
    'DJ',
    'GJ',
    'GL',
    'GR',
    'HD',
    'HR',
    'IF',
    'IL',
    'IS',
    'MH',
    'MM',
    'MS',
    'NT',
    'OT',
    'PH',
    'SB',
    'SJ',
    'SM',
    'SV',
    'TL',
    'TM',
    'TR',
    'VL',
    'VN',
    'VS'
  ]

  /**
   * Generate random digits string of specified length
   */
  const getRandomDigits = (count: number): string => {
    let result = ''
    for (let i = 0; i < count; i++) {
      result += Math.floor(Math.random() * 10)
    }
    return result
  }

  /**
   * Generate random letters string of specified length
   * Excludes I and Q which can be confused with numbers
   */
  const getRandomLetters = (count: number): string => {
    const letters = 'ABCDEFGHJKLMNOPRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < count; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    return result
  }

  let licensePlate = ''

  switch (country.toLowerCase()) {
    case 'pl':
      // Polish format: XY NNNNN or XYZ NNNNN
      const useThreeLetterPrefix = Math.random() > 0.7 // 30% chance for 3-letter prefix
      const plPrefix = POLISH_PREFIXES[Math.floor(Math.random() * POLISH_PREFIXES.length)]
      const plSuffix = getRandomDigits(5)
      licensePlate = `${plPrefix} ${plSuffix}`
      break

    case 'de':
      // German format: XX XX NNN
      const dePrefix = GERMAN_PREFIXES[Math.floor(Math.random() * GERMAN_PREFIXES.length)]
      const deMiddle = getRandomLetters(2)
      const deSuffix = getRandomDigits(3)
      licensePlate = `${dePrefix} ${deMiddle} ${deSuffix}`
      break

    case 'uk':
      // UK format: XX NN XXX
      const ukPrefix =
        UK_PREFIXES[Math.floor(Math.random() * UK_PREFIXES.length)] +
        UK_PREFIXES[Math.floor(Math.random() * UK_PREFIXES.length)]
      const ukMiddle = getRandomDigits(2)
      const ukSuffix = getRandomLetters(3)
      licensePlate = `${ukPrefix} ${ukMiddle} ${ukSuffix}`
      break

    case 'us':
      // US format: XXX NNNN (simplified)
      const usPrefix = getRandomLetters(3)
      const usSuffix = getRandomDigits(4)
      licensePlate = `${usPrefix} ${usSuffix}`
      break

    case 'ro':
      // Romanian format: XX NN XXX
      const roPrefix =
        ROMANIAN_PREFIXES[Math.floor(Math.random() * ROMANIAN_PREFIXES.length)]
      const roMiddle = getRandomDigits(2)
      const roSuffix = getRandomLetters(3)
      licensePlate = `${roPrefix} ${roMiddle} ${roSuffix}`
      break

    default:
      // Default to Polish format
      const defaultPrefix =
        POLISH_PREFIXES[Math.floor(Math.random() * POLISH_PREFIXES.length)]
      const defaultSuffix = getRandomDigits(5)
      licensePlate = `${defaultPrefix} ${defaultSuffix}`
  }

  return licensePlate
}
