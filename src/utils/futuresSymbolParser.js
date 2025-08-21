/**
 * A simplified futures symbol parser.
 * NOTE: This is a basic implementation. Real-world futures expiration dates
 * are complex and vary by contract. This parser uses a simplified rule
 * (last day of the contract month) for demonstration purposes.
 * For a production application, this data should come from an exchange API
 * or a dedicated financial data provider.
 */

const contractRoots = {
  'BRN': 'Crude Oil Brent',
  'CL': 'Crude Oil WTI',
  'DX': 'US dollar index futures',
  'ES': 'E-mini S&P 500',
  'GC': 'Gold',
  'HG': 'High Grade Copper',
  'HO': 'Heating Oil',
  'KC': 'Coffee',
  'NG': 'Natural Gas',
  'NQ': 'E-mini Nasdaq 100',
  'PL': 'Platinum',
  'RB': 'RBOB Gasoline',
  'RTY': 'E-mini Russell 2000',
  'SB': 'Sugar',
  'SI': 'Silver',
  'YM': 'E-mini DOW',
  'ZB': '30-Year T-Bond',
  'ZC': 'Corn',
  'ZN': '10-Year T-Note',
  'ZS': 'Soybeans',
  'ZW': 'Wheat',
};

const monthCodes = {
  'F': 0, // January
  'G': 1, // February
  'H': 2, // March
  'J': 3, // April
  'K': 4, // May
  'M': 5, // June
  'N': 6, // July
  'Q': 7, // August
  'U': 8, // September
  'V': 9, // October
  'X': 10, // November
  'Z': 11, // December
};

function getFullYear(yearCode) {
  const code = parseInt(yearCode, 10);
  const currentYear = new Date().getFullYear();

  if (yearCode.length === 2) {
    return 2000 + code;
  }

  // Handle single-digit years, e.g., '5' for 2025
  const currentYearLastDigit = currentYear % 10;
  let year = Math.floor(currentYear / 10) * 10 + code;
  if (code < currentYearLastDigit) {
      year += 10;
  }
  return year;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseSymbol(symbol) {
  if (!symbol || typeof symbol !== 'string' || symbol.length < 3) {
    return null;
  }

  // Regex to capture: 1. root (letters), 2. month code, 3. year code (digits)
  const match = symbol.toUpperCase().match(/^([A-Z]+)([FGHJKMNQUVXZ])(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const [, root, monthCode, yearCode] = match;

  const contract = contractRoots[root];
  const month = monthCodes[monthCode];

  if (!contract || typeof month === 'undefined') {
    return null;
  }

  const year = getFullYear(yearCode);
  const expirationDateObj = new Date(year, month + 1, 0);

  // Calculate the stop trading date: 22nd of the month previous to expiration
  const stopTradingDateObj = new Date(expirationDateObj.getFullYear(), expirationDateObj.getMonth() - 1, 22);

  return {
    contract,
    expirationDate: formatDate(expirationDateObj),
    timeToStopTrading: formatDate(stopTradingDateObj),
  };
}
