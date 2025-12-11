// src/utils/algorithms/index.js

/**
 * Central Export File untuk semua algoritma kriptografi
 * Organized by module (A, B, C)
 */

// ============= MODULE A: SUBSTITUTION CIPHERS =============
export {
  caesarEncrypt,
  caesarDecrypt,
  rot13,
  getCaesarVisualization
} from './substitution/caesarCipher.js';

export {
  vigenereEncrypt,
  vigenereDecrypt,
  getVigenereVisualization
} from './substitution/vigenereCipher.js';

export {
  beaufortEncrypt,
  beaufortDecrypt,
  getBeaufortVisualization
} from './substitution/beaufortCipher.js';

export {
  autokeyEncrypt,
  autokeyDecrypt,
  getAutokeyVisualization
} from './substitution/autokeyCipher.js';

// ============= MODULE B: POLYGRAM CIPHERS =============
export {
  playfairEncrypt,
  playfairDecrypt,
  generatePlayfairMatrix,
  getPlayfairVisualization
} from './polygram/playfairCipher.js';

export {
  hillEncrypt,
  hillDecrypt,
  validateHillKey,
  getHillVisualization
} from './polygram/hillCipher.js';

// ============= MODULE C: TRANSPOSITION CIPHERS =============
export {
  railFenceEncrypt,
  railFenceDecrypt,
  getRailFenceVisualization
} from './transposition/railFenceCipher.js';

export {
  columnarEncrypt,
  columnarDecrypt,
  getColumnarVisualization
} from './transposition/columnarTransposition.js';

export {
  myszkowskiEncrypt,
  myszkowskiDecrypt,
  getMyszkowskiVisualization
} from './transposition/myszkowskiTransposition.js';

export {
  doubleTranspositionEncrypt,
  doubleTranspositionDecrypt,
  getDoubleTranspositionVisualization
} from './transposition/doubleTransposition.js';