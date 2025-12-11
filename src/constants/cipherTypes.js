// src/constants/cipherTypes.js

/**
 * Cipher Type Constants
 * Definisi lengkap untuk semua jenis cipher yang tersedia
 */

// Cipher Categories
export const CIPHER_CATEGORIES = {
  SUBSTITUTION: 'substitution',
  POLYGRAM: 'polygram',
  TRANSPOSITION: 'transposition',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Security Levels
export const SECURITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Substitution Ciphers
export const SUBSTITUTION_CIPHERS = {
  CAESAR: {
    id: 'caesar',
    name: 'Caesar Cipher',
    shortName: 'Caesar',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/caesar',
    difficulty: DIFFICULTY_LEVELS.EASY,
    security: SECURITY_LEVELS.LOW,
    description: 'Simple shift cipher - one of the earliest known encryption techniques',
    longDescription: 'The Caesar cipher is a substitution cipher where each letter is shifted by a fixed number of positions in the alphabet. Named after Julius Caesar who used it for military communications.',
    keyType: 'number',
    keyRange: { min: 0, max: 25 },
    features: [
      'Simple alphabet shifting',
      'Easy to understand',
      'Quick encryption/decryption',
      'Visual alphabet mapping',
    ],
    useCases: [
      'Educational purposes',
      'Simple message obfuscation',
      'Historical demonstrations',
    ],
    strengths: [
      'Very fast processing',
      'No complex key management',
      'Easy to implement',
    ],
    weaknesses: [
      'Only 25 possible keys',
      'Vulnerable to brute force',
      'Frequency analysis attack',
      'Pattern preservation',
    ],
    historicalInfo: 'Used by Julius Caesar around 58 BC for military messages',
    icon: 'RotateCw',
  },
  
  VIGENERE: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    shortName: 'Vigenère',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/vigenere',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Polyalphabetic cipher using a keyword for repeated shifts',
    longDescription: 'The Vigenère cipher uses a keyword to perform multiple Caesar cipher shifts. Each letter of the keyword determines the shift for corresponding plaintext letters.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Polyalphabetic substitution',
      'Keyword-based encryption',
      'Tabula recta visualization',
      'Repeating key pattern',
    ],
    useCases: [
      'Moderate security messages',
      'Multi-layer encryption',
      'Historical cryptography study',
    ],
    strengths: [
      'Multiple shift values',
      'More secure than Caesar',
      'Key length flexibility',
    ],
    weaknesses: [
      'Vulnerable to Kasiski examination',
      'Frequency analysis on long texts',
      'Key repetition pattern',
    ],
    historicalInfo: 'Described by Giovan Battista Bellaso in 1553, misattributed to Blaise de Vigenère',
    icon: 'Grid3x3',
  },
  
  BEAUFORT: {
    id: 'beaufort',
    name: 'Beaufort Cipher',
    shortName: 'Beaufort',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/beaufort',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Reciprocal cipher - variant of Vigenère with reversed operation',
    longDescription: 'The Beaufort cipher is similar to Vigenère but uses subtraction instead of addition, making it a reciprocal cipher where encryption and decryption use the same process.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Reciprocal encryption',
      'Keyword-based like Vigenère',
      'Self-inverse operation',
      'Symmetric process',
    ],
    useCases: [
      'Alternative to Vigenère',
      'Reciprocal encryption needs',
      'Historical cipher study',
    ],
    strengths: [
      'Same process for encrypt/decrypt',
      'No separate decryption algorithm',
      'Similar strength to Vigenère',
    ],
    weaknesses: [
      'Similar weaknesses to Vigenère',
      'Pattern analysis vulnerability',
      'Key length dependency',
    ],
    historicalInfo: 'Named after Sir Francis Beaufort (1805)',
    icon: 'RefreshCcw',
  },
  
  AUTOKEY: {
    id: 'autokey',
    name: 'Autokey Cipher',
    shortName: 'Autokey',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/autokey',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Vigenère variant with self-extending key using plaintext',
    longDescription: 'The Autokey cipher improves upon Vigenère by using the plaintext itself to extend the key, eliminating the repeating key weakness.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Self-extending key',
      'No key repetition',
      'Plaintext-dependent encryption',
      'Improved over Vigenère',
    ],
    useCases: [
      'Enhanced polyalphabetic encryption',
      'Non-repeating key requirements',
      'Intermediate security needs',
    ],
    strengths: [
      'No repeating key pattern',
      'Resistant to Kasiski examination',
      'Longer effective key length',
    ],
    weaknesses: [
      'Error propagation',
      'Still vulnerable to modern attacks',
      'Known plaintext attacks',
    ],
    historicalInfo: 'Invented by Blaise de Vigenère in 1586',
    icon: 'Link',
  },
};

// Polygram Ciphers
export const POLYGRAM_CIPHERS = {
  PLAYFAIR: {
    id: 'playfair',
    name: 'Playfair Cipher',
    shortName: 'Playfair',
    category: CIPHER_CATEGORIES.POLYGRAM,
    path: '/playfair',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: '5×5 grid cipher encrypting letter pairs (digraphs)',
    longDescription: 'The Playfair cipher encrypts pairs of letters using a 5×5 grid of letters. It was the first practical digraph substitution cipher.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      '5×5 letter grid',
      'Digraph encryption',
      'Three transformation rules',
      'I/J combination',
    ],
    useCases: [
      'Digraph-level encryption',
      'Historical military use',
      'Pattern obfuscation',
    ],
    strengths: [
      'Breaks frequency analysis',
      'Digraph-based security',
      'Manual encryption possible',
    ],
    weaknesses: [
      'Vulnerable to digraph analysis',
      'Known plaintext attacks',
      'Grid limitations',
    ],
    historicalInfo: 'Created by Charles Wheatstone in 1854, named after Lord Playfair',
    icon: 'Grid3x3',
  },
  
  HILL: {
    id: 'hill',
    name: 'Hill Cipher',
    shortName: 'Hill',
    category: CIPHER_CATEGORIES.POLYGRAM,
    path: '/hill',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Matrix-based polygram cipher using linear algebra',
    longDescription: 'The Hill cipher uses matrix multiplication with a key matrix to encrypt blocks of letters. It was the first polygraph cipher that was practical to operate.',
    keyType: 'matrix',
    matrixSize: { rows: 2, cols: 2 },
    features: [
      'Matrix multiplication',
      'Block cipher operation',
      'Linear algebra based',
      'Invertible key matrix',
    ],
    useCases: [
      'High-security classical encryption',
      'Block cipher study',
      'Mathematical cryptography',
    ],
    strengths: [
      'Completely hides frequency',
      'Resistant to frequency analysis',
      'Mathematical foundation',
    ],
    weaknesses: [
      'Known plaintext attacks',
      'Key matrix validation needed',
      'Complex key generation',
    ],
    historicalInfo: 'Developed by Lester S. Hill in 1929',
    icon: 'Hash',
  },
};

// Transposition Ciphers
export const TRANSPOSITION_CIPHERS = {
  RAIL_FENCE: {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    shortName: 'Rail Fence',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/railfence',
    difficulty: DIFFICULTY_LEVELS.EASY,
    security: SECURITY_LEVELS.LOW,
    description: 'Zigzag pattern transposition across multiple rails',
    longDescription: 'The Rail Fence cipher writes the plaintext in a zigzag pattern across a number of "rails" and reads off the rows to create the ciphertext.',
    keyType: 'number',
    keyRange: { min: 2, max: 10 },
    features: [
      'Zigzag writing pattern',
      'Configurable rail count',
      'Visual grid layout',
      'Simple transposition',
    ],
    useCases: [
      'Basic message scrambling',
      'Educational demonstrations',
      'Simple obfuscation',
    ],
    strengths: [
      'Easy to implement',
      'Fast processing',
      'Adjustable difficulty',
    ],
    weaknesses: [
      'Pattern visible in output',
      'Limited key space',
      'Anagram attacks',
    ],
    historicalInfo: 'Ancient transposition method, exact origin unknown',
    icon: 'TrendingDown',
  },
  
  COLUMNAR: {
    id: 'columnar',
    name: 'Columnar Transposition',
    shortName: 'Columnar',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/columnar',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Column rearrangement based on keyword order',
    longDescription: 'Columnar transposition writes the plaintext in rows and reads it in columns according to a keyword-determined order.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Keyword-based ordering',
      'Column permutation',
      'Grid visualization',
      'Alphabetical sorting',
    ],
    useCases: [
      'Message scrambling',
      'Multi-layer encryption',
      'Intermediate security',
    ],
    strengths: [
      'Variable column count',
      'Flexible key length',
      'Good obfuscation',
    ],
    weaknesses: [
      'Anagram properties',
      'Frequency preserved',
      'Pattern analysis',
    ],
    historicalInfo: 'Used extensively in World War I',
    icon: 'Columns',
  },
  
  MYSZKOWSKI: {
    id: 'myszkowski',
    name: 'Myszkowski Transposition',
    shortName: 'Myszkowski',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/myszkowski',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Columnar variant handling duplicate keyword letters',
    longDescription: 'The Myszkowski transposition is a variant of columnar transposition that handles duplicate letters in the keyword by grouping them together.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Duplicate letter handling',
      'Column grouping',
      'Enhanced columnar method',
      'Irregular patterns',
    ],
    useCases: [
      'Enhanced transposition',
      'Alternative to columnar',
      'Pattern disruption',
    ],
    strengths: [
      'Handles duplicates well',
      'Irregular output pattern',
      'Flexible keyword choice',
    ],
    weaknesses: [
      'Similar to columnar weaknesses',
      'Anagram vulnerability',
      'Frequency preservation',
    ],
    historicalInfo: 'Named after Émile Victor Théodore Myszkowski',
    icon: 'Layers',
  },
  
  DOUBLE_TRANSPOSITION: {
    id: 'double',
    name: 'Double Transposition',
    shortName: 'Double',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/double',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Two-pass columnar transposition for enhanced security',
    longDescription: 'Double transposition applies columnar transposition twice, potentially with different keys, significantly increasing security over single transposition.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    requiresSecondKey: true,
    features: [
      'Two-pass encryption',
      'Dual keyword support',
      'Compound security',
      'Layered transposition',
    ],
    useCases: [
      'High-security transposition',
      'Military communications',
      'Multi-layer encryption',
    ],
    strengths: [
      'Very strong transposition',
      'Two independent keys',
      'Compound complexity',
    ],
    weaknesses: [
      'Still anagram-based',
      'Computationally intensive',
      'Complex key management',
    ],
    historicalInfo: 'Used by German military in WWII',
    icon: 'Repeat',
  },
};

// All Ciphers Combined
export const ALL_CIPHERS = {
  ...SUBSTITUTION_CIPHERS,
  ...POLYGRAM_CIPHERS,
  ...TRANSPOSITION_CIPHERS,
};

// Get cipher by ID
export const getCipherById = (id) => {
  return ALL_CIPHERS[id.toUpperCase()] || null;
};

// Get ciphers by category
export const getCiphersByCategory = (category) => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.category === category
  );
};

// Get ciphers by difficulty
export const getCiphersByDifficulty = (difficulty) => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.difficulty === difficulty
  );
};

// Get ciphers by security level
export const getCiphersBySecurity = (security) => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.security === security
  );
};

// Cipher metadata for UI
export const CIPHER_METADATA = {
  totalCount: Object.keys(ALL_CIPHERS).length,
  categories: {
    [CIPHER_CATEGORIES.SUBSTITUTION]: {
      name: 'Substitution Ciphers',
      description: 'Replace each character with another character',
      count: Object.keys(SUBSTITUTION_CIPHERS).length,
      icon: 'Lock',
      color: 'blue',
    },
    [CIPHER_CATEGORIES.POLYGRAM]: {
      name: 'Polygram Ciphers',
      description: 'Encrypt multiple characters as a block',
      count: Object.keys(POLYGRAM_CIPHERS).length,
      icon: 'Grid3x3',
      color: 'purple',
    },
    [CIPHER_CATEGORIES.TRANSPOSITION]: {
      name: 'Transposition Ciphers',
      description: 'Rearrange character positions',
      count: Object.keys(TRANSPOSITION_CIPHERS).length,
      icon: 'Shuffle',
      color: 'green',
    },
  },
};

// Export default
export default {
  CIPHER_CATEGORIES,
  DIFFICULTY_LEVELS,
  SECURITY_LEVELS,
  SUBSTITUTION_CIPHERS,
  POLYGRAM_CIPHERS,
  TRANSPOSITION_CIPHERS,
  ALL_CIPHERS,
  CIPHER_METADATA,
  getCipherById,
  getCiphersByCategory,
  getCiphersByDifficulty,
  getCiphersBySecurity,
};