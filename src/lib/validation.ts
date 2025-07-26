/**
 * Input validation utilities for security
 */

export const validateInput = {
  /**
   * Sanitize string input by removing potentially harmful characters
   */
  sanitizeString: (input: string): string => {
    return input.replace(/[<>'"&]/g, '');
  },

  /**
   * Validate keyboard key names
   */
  isValidKeyName: (key: string): boolean => {
    const validKeyPattern = /^[a-zA-Z0-9\-_\s]+$/;
    return validKeyPattern.test(key) && key.length <= 50;
  },

  /**
   * Validate hotkey configuration names
   */
  isValidConfigName: (name: string): boolean => {
    const validNamePattern = /^[a-zA-Z0-9\-_\s]+$/;
    return validNamePattern.test(name) && name.length <= 100;
  }
};

/**
 * Safe JSON parsing with error handling
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
};