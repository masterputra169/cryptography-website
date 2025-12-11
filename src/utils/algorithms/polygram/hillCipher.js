// src/utils/algorithms/polygram/hillCipher.js

/**
 * Hill Cipher Algorithm
 * Menggunakan perkalian matriks dengan kunci matriks m×m
 */

const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

// Modular arithmetic helpers
const mod = (n, m) => {
  return ((n % m) + m) % m;
};

// Calculate determinant for 2x2 matrix
const determinant2x2 = (matrix) => {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

// Calculate modular multiplicative inverse
const modInverse = (a, m) => {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  return null;
};

// Get inverse matrix for 2x2
const inverseMatrix2x2 = (matrix, modulo = 26) => {
  const det = determinant2x2(matrix);
  const detInv = modInverse(mod(det, modulo), modulo);
  
  if (detInv === null) {
    return null; // Matrix not invertible
  }
  
  return [
    [mod(matrix[1][1] * detInv, modulo), mod(-matrix[0][1] * detInv, modulo)],
    [mod(-matrix[1][0] * detInv, modulo), mod(matrix[0][0] * detInv, modulo)]
  ];
};

// Matrix multiplication
const multiplyMatrixVector = (matrix, vector, modulo = 26) => {
  const result = [];
  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result.push(mod(sum, modulo));
  }
  return result;
};

// Validate key matrix
export const validateHillKey = (keyMatrix) => {
  if (!keyMatrix || keyMatrix.length !== 2 || keyMatrix[0].length !== 2) {
    return { valid: false, message: 'Matrix must be 2x2' };
  }
  
  const det = determinant2x2(keyMatrix);
  const detMod = mod(det, 26);
  const detInv = modInverse(detMod, 26);
  
  if (detInv === null) {
    return { 
      valid: false, 
      message: `Determinant (${det}) has no inverse mod 26. Try different values.`,
      determinant: det
    };
  }
  
  return { 
    valid: true, 
    message: 'Matrix is valid',
    determinant: det,
    determinantMod26: detMod,
    inverse: detInv
  };
};

export const hillEncrypt = (plaintext, keyMatrix) => {
  const validation = validateHillKey(keyMatrix);
  if (!validation.valid) {
    throw new Error(validation.message);
  }
  
  const text = prepareText(plaintext);
  const blockSize = keyMatrix.length;
  let result = '';
  
  // Pad if necessary
  let paddedText = text;
  while (paddedText.length % blockSize !== 0) {
    paddedText += 'X';
  }
  
  // Process each block
  for (let i = 0; i < paddedText.length; i += blockSize) {
    const block = paddedText.slice(i, i + blockSize);
    const vector = block.split('').map(c => c.charCodeAt(0) - 65);
    const encrypted = multiplyMatrixVector(keyMatrix, vector);
    result += encrypted.map(n => String.fromCharCode(n + 65)).join('');
  }
  
  return result;
};

export const hillDecrypt = (ciphertext, keyMatrix) => {
  const validation = validateHillKey(keyMatrix);
  if (!validation.valid) {
    throw new Error(validation.message);
  }
  
  const inverseKey = inverseMatrix2x2(keyMatrix);
  if (!inverseKey) {
    throw new Error('Cannot decrypt: matrix is not invertible');
  }
  
  const text = prepareText(ciphertext);
  const blockSize = keyMatrix.length;
  let result = '';
  
  // Process each block
  for (let i = 0; i < text.length; i += blockSize) {
    const block = text.slice(i, i + blockSize);
    const vector = block.split('').map(c => c.charCodeAt(0) - 65);
    const decrypted = multiplyMatrixVector(inverseKey, vector);
    result += decrypted.map(n => String.fromCharCode(n + 65)).join('');
  }
  
  return result;
};

// Visualisasi untuk GUI
export const getHillVisualization = (plaintext, keyMatrix) => {
  const text = prepareText(plaintext);
  const blockSize = keyMatrix.length;
  const validation = validateHillKey(keyMatrix);
  
  let paddedText = text;
  while (paddedText.length % blockSize !== 0) {
    paddedText += 'X';
  }
  
  const steps = [];
  
  for (let i = 0; i < paddedText.length; i += blockSize) {
    const block = paddedText.slice(i, i + blockSize);
    const vector = block.split('').map(c => c.charCodeAt(0) - 65);
    const encrypted = multiplyMatrixVector(keyMatrix, vector);
    const encryptedChars = encrypted.map(n => String.fromCharCode(n + 65));
    
    steps.push({
      blockNumber: i / blockSize,
      plainBlock: block,
      plainVector: vector,
      keyMatrix: keyMatrix,
      encryptedVector: encrypted,
      encryptedBlock: encryptedChars.join(''),
      calculation: `[${keyMatrix[0].join(', ')}] × [${vector[0]}] = [${encrypted[0]}]\n[${keyMatrix[1].join(', ')}]   [${vector[1]}]   [${encrypted[1]}]`
    });
  }
  
  const inverseKey = inverseMatrix2x2(keyMatrix);
  
  return {
    keyMatrix,
    inverseMatrix: inverseKey,
    validation,
    paddedText,
    steps
  };
};