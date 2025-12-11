// src/utils/algorithms/transposition/railFenceCipher.js

/**
 * Rail Fence Cipher Algorithm
 * Menulis pesan secara zig-zag pada sejumlah rail tertentu
 */

const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

export const railFenceEncrypt = (plaintext, rails) => {
  if (rails < 2) throw new Error('Rails must be at least 2');
  
  const text = prepareText(plaintext);
  if (text.length === 0) return '';
  if (rails >= text.length) return text;
  
  // Create rail arrays
  const fence = Array(rails).fill(null).map(() => []);
  let rail = 0;
  let direction = 1; // 1 for down, -1 for up
  
  // Place characters on rails
  for (let i = 0; i < text.length; i++) {
    fence[rail].push(text[i]);
    
    // Change direction at boundaries
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  // Read fence row by row
  return fence.map(row => row.join('')).join('');
};

export const railFenceDecrypt = (ciphertext, rails) => {
  if (rails < 2) throw new Error('Rails must be at least 2');
  
  const text = prepareText(ciphertext);
  if (text.length === 0) return '';
  if (rails >= text.length) return text;
  
  // Calculate characters per rail
  const fence = Array(rails).fill(null).map(() => []);
  let rail = 0;
  let direction = 1;
  
  // Mark positions
  for (let i = 0; i < text.length; i++) {
    fence[rail].push('*');
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  // Fill fence with actual characters
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < fence[r].length; c++) {
      fence[r][c] = text[index++];
    }
  }
  
  // Read fence in zigzag pattern
  let result = '';
  rail = 0;
  direction = 1;
  
  for (let i = 0; i < text.length; i++) {
    result += fence[rail].shift();
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  return result;
};

// Visualisasi untuk GUI
export const getRailFenceVisualization = (plaintext, rails) => {
  const text = prepareText(plaintext);
  
  if (rails < 2 || text.length === 0) return null;
  
  // Create visualization grid
  const grid = Array(rails).fill(null).map(() => Array(text.length).fill(''));
  let rail = 0;
  let direction = 1;
  
  const pattern = [];
  
  for (let i = 0; i < text.length; i++) {
    grid[rail][i] = text[i];
    pattern.push({ position: i, rail, char: text[i] });
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  // Get reading order
  const readingOrder = [];
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < text.length; c++) {
      if (grid[r][c] !== '') {
        readingOrder.push({
          rail: r,
          position: c,
          char: grid[r][c]
        });
      }
    }
  }
  
  return {
    grid,
    pattern,
    readingOrder,
    rails,
    encrypted: railFenceEncrypt(plaintext, rails)
  };
};