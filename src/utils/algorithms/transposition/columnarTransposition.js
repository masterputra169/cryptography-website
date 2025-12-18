// src/utils/algorithms/transposition/columnarTransposition.js

/**
 * Columnar Transposition Cipher
 * Pesan ditulis dalam baris, lalu dibaca per kolom berdasarkan urutan abjad kata kunci
 */

const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

const prepareKey = (key) => {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

// Get column order based on alphabetical key
const getColumnOrder = (key) => {
  const keyArray = key.split('').map((char, index) => ({ char, index }));
  keyArray.sort((a, b) => a.char.localeCompare(b.char));
  return keyArray.map(item => item.index);
};

export const columnarEncrypt = (plaintext, key) => {
  const text = prepareText(plaintext);
  const keyword = prepareKey(key);
  
  if (!keyword) return plaintext;
  
  const numCols = keyword.length;
  const numRows = Math.ceil(text.length / numCols);
  
  // Pad with X if necessary
  let paddedText = text;
  while (paddedText.length < numRows * numCols) {
    paddedText += 'X';
  }
  
  // Create grid
  const grid = [];
  for (let r = 0; r < numRows; r++) {
    grid.push(paddedText.slice(r * numCols, (r + 1) * numCols).split(''));
  }
  
  // Read columns in order
  const columnOrder = getColumnOrder(keyword);
  let result = '';
  
  for (const colIndex of columnOrder) {
    for (let r = 0; r < numRows; r++) {
      result += grid[r][colIndex];
    }
  }
  
  return result;
};

export const columnarDecrypt = (ciphertext, key) => {
  const text = prepareText(ciphertext);
  const keyword = prepareKey(key);
  
  if (!keyword) return ciphertext;
  
  const numCols = keyword.length;
  const numRows = Math.ceil(text.length / numCols);
  
  // Create empty grid
  const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
  
  // Get column order
  const columnOrder = getColumnOrder(keyword);
  
  // Fill grid column by column in order
  let index = 0;
  for (const colIndex of columnOrder) {
    for (let r = 0; r < numRows; r++) {
      grid[r][colIndex] = text[index] || 'X';
      index++;
    }
  }
  
  // Read row by row
  let result = '';
  for (let r = 0; r < numRows; r++) {
    result += grid[r].join('');
  }
  
  // Remove padding X at the end
  return result.replace(/X+$/, '');
};

// Visualisasi untuk GUI
export const getColumnarVisualization = (plaintext, key) => {
  const text = prepareText(plaintext);
  const keyword = prepareKey(key);
  
  if (!keyword) return null;
  
  const numCols = keyword.length;
  const numRows = Math.ceil(text.length / numCols);
  
  // Pad text
  let paddedText = text;
  while (paddedText.length < numRows * numCols) {
    paddedText += 'X';
  }
  
  // Create grid
  const grid = [];
  for (let r = 0; r < numRows; r++) {
    grid.push(paddedText.slice(r * numCols, (r + 1) * numCols).split(''));
  }
  
  // Get column order with details
  const columnOrder = getColumnOrder(keyword);
  const orderedColumns = columnOrder.map((colIndex, order) => ({
    originalIndex: colIndex,
    character: keyword[colIndex],
    order: order + 1,
    content: grid.map(row => row[colIndex])
  }));
  
  return {
    keyword,
    grid,
    columnOrder,
    orderedColumns,
    numRows,
    numCols,
    encrypted: columnarEncrypt(plaintext, key)
  };
};