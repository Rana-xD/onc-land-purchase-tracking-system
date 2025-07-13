/**
 * Utility functions for handling Khmer and English number conversions
 */

// Mapping between Khmer digits and English digits
const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Converts a string containing Khmer digits to English digits
 * @param {string} text - The text containing Khmer digits
 * @returns {string} - The text with Khmer digits converted to English digits
 */
export const khmerToEnglish = (text) => {
  if (!text) return '';
  let result = text.toString();
  
  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(khmerDigits[i], 'g');
    result = result.replace(regex, englishDigits[i]);
  }
  
  return result;
};

/**
 * Converts a string containing English digits to Khmer digits
 * @param {string} text - The text containing English digits
 * @returns {string} - The text with English digits converted to Khmer digits
 */
export const englishToKhmer = (text) => {
  if (!text) return '';
  let result = text.toString();
  
  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(englishDigits[i], 'g');
    result = result.replace(regex, khmerDigits[i]);
  }
  
  return result;
};

/**
 * Normalizes a string for searching by converting all digits to English
 * @param {string} text - The text to normalize
 * @returns {string} - The normalized text with all digits in English format
 */
export const normalizeForSearch = (text) => {
  if (!text) return '';
  return khmerToEnglish(text.toString().toLowerCase());
};
