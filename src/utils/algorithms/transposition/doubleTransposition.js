// src/utils/algorithms/transposition/doubleTransposition.js

/**
 * Double Transposition Cipher
 * Melakukan transposisi kolum dua kali untuk keamanan ganda
 */

import { columnarEncrypt, columnarDecrypt } from './columnarTransposition.js';

const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

const prepareKey = (key) => {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

export const doubleTranspositionEncrypt = (plaintext, key1, key2 = null) => {
  const text = prepareText(plaintext);
  const keyword1 = prepareKey(key1);
  const keyword2 = key2 ? prepareKey(key2) : keyword1;
  
  if (!keyword1) return plaintext;
  
  // First transposition
  const firstPass = columnarEncrypt(text, keyword1);
  
  // Second transposition
  const secondPass = columnarEncrypt(firstPass, keyword2);
  
  return secondPass;
};

export const doubleTranspositionDecrypt = (ciphertext, key1, key2 = null) => {
  const text = prepareText(ciphertext);
  const keyword1 = prepareKey(key1);
  const keyword2 = key2 ? prepareKey(key2) : keyword1;
  
  if (!keyword1) return ciphertext;
  
  // Decrypt in reverse order
  const firstPass = columnarDecrypt(text, keyword2);
  const secondPass = columnarDecrypt(firstPass, keyword1);
  
  return secondPass;
};

// Visualisasi untuk GUI
export const getDoubleTranspositionVisualization = (plaintext, key1, key2 = null) => {
  const text = prepareText(plaintext);
  const keyword1 = prepareKey(key1);
  const keyword2 = key2 ? prepareKey(key2) : keyword1;
  
  if (!keyword1) return null;
  
  // First pass
  const firstPass = columnarEncrypt(text, keyword1);
  
  // Get first pass grid
  const numCols1 = keyword1.length;
  const numRows1 = Math.ceil(text.length / numCols1);
  let paddedText1 = text;
  while (paddedText1.length < numRows1 * numCols1) {
    paddedText1 += 'X';
  }
  
  const grid1 = [];
  for (let r = 0; r < numRows1; r++) {
    grid1.push(paddedText1.slice(r * numCols1, (r + 1) * numCols1).split(''));
  }
  
  // Second pass
  const secondPass = columnarEncrypt(firstPass, keyword2);
  
  // Get second pass grid
  const numCols2 = keyword2.length;
  const numRows2 = Math.ceil(firstPass.length / numCols2);
  let paddedText2 = firstPass;
  while (paddedText2.length < numRows2 * numCols2) {
    paddedText2 += 'X';
  }
  
  const grid2 = [];
  for (let r = 0; r < numRows2; r++) {
    grid2.push(paddedText2.slice(r * numCols2, (r + 1) * numCols2).split(''));
  }
  
  return {
    originalText: text,
    firstPass: {
      key: keyword1,
      grid: grid1,
      result: firstPass
    },
    secondPass: {
      key: keyword2,
      grid: grid2,
      result: secondPass
    },
    finalEncrypted: secondPass,
    usingDifferentKeys: key2 !== null && key1 !== key2
  };
};