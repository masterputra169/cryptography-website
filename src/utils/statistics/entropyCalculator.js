// src/utils/statistics/entropyCalculator.js

/**
 * Calculate Shannon Entropy untuk mengukur tingkat keacakan
 */

export const calculateEntropy = (text) => {
  const cleanText = text.replace(/\s/g, '');
  if (cleanText.length === 0) return 0;

  const frequency = {};
  
  // Count character frequency
  for (const char of cleanText) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  // Calculate entropy
  let entropy = 0;
  const length = cleanText.length;

  for (const char in frequency) {
    const probability = frequency[char] / length;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
};

// Get entropy score (0-100)
export const getEntropyScore = (text) => {
  const entropy = calculateEntropy(text);
  const maxEntropy = Math.log2(256); // Maximum possible entropy (8 bits per byte)
  const score = (entropy / maxEntropy) * 100;
  
  return {
    entropy: entropy.toFixed(4),
    maxEntropy: maxEntropy.toFixed(4),
    score: Math.min(100, score).toFixed(2),
    rating: getEntropyRating(score),
  };
};

// Rate entropy quality
const getEntropyRating = (score) => {
  if (score >= 90) return { label: 'Excellent', color: 'success' };
  if (score >= 75) return { label: 'Very Good', color: 'success' };
  if (score >= 60) return { label: 'Good', color: 'primary' };
  if (score >= 45) return { label: 'Fair', color: 'warning' };
  if (score >= 30) return { label: 'Poor', color: 'warning' };
  return { label: 'Very Poor', color: 'danger' };
};

// Compare entropy before and after encryption
export const compareEntropy = (plaintext, ciphertext) => {
  const plainEntropy = getEntropyScore(plaintext);
  const cipherEntropy = getEntropyScore(ciphertext);
  
  const improvement = (parseFloat(cipherEntropy.score) - parseFloat(plainEntropy.score)).toFixed(2);

  return {
    plaintext: plainEntropy,
    ciphertext: cipherEntropy,
    improvement,
    improvementPercent: improvement > 0 
      ? `+${improvement}%` 
      : `${improvement}%`,
    analysis: analyzeEntropyChange(improvement),
  };
};

// Analyze entropy change
const analyzeEntropyChange = (improvement) => {
  const value = parseFloat(improvement);
  
  if (value > 20) {
    return 'Excellent encryption! Significantly increased randomness.';
  } else if (value > 10) {
    return 'Good encryption. Noticeably improved randomness.';
  } else if (value > 5) {
    return 'Moderate encryption. Some improvement in randomness.';
  } else if (value > 0) {
    return 'Slight improvement in randomness.';
  } else if (value === 0) {
    return 'No change in entropy level.';
  } else {
    return 'Warning: Entropy decreased. Cipher may have weaknesses.';
  }
};

// Calculate bit strength
export const calculateBitStrength = (text) => {
  const entropy = calculateEntropy(text);
  const bitStrength = entropy * text.length;
  
  return {
    bits: bitStrength.toFixed(2),
    strength: getBitStrengthRating(bitStrength),
  };
};

// Rate bit strength
const getBitStrengthRating = (bits) => {
  if (bits >= 256) return { label: 'Military Grade', color: 'success' };
  if (bits >= 128) return { label: 'Very Strong', color: 'success' };
  if (bits >= 80) return { label: 'Strong', color: 'primary' };
  if (bits >= 56) return { label: 'Moderate', color: 'warning' };
  if (bits >= 40) return { label: 'Weak', color: 'warning' };
  return { label: 'Very Weak', color: 'danger' };
};

// Generate entropy visualization data
export const getEntropyGaugeData = (score) => {
  return {
    value: parseFloat(score),
    max: 100,
    ranges: [
      { min: 0, max: 30, color: '#ef4444' },    // Red
      { min: 30, max: 60, color: '#f59e0b' },   // Orange
      { min: 60, max: 75, color: '#3b82f6' },   // Blue
      { min: 75, max: 90, color: '#22c55e' },   // Green
      { min: 90, max: 100, color: '#16a34a' },  // Dark Green
    ],
  };
};