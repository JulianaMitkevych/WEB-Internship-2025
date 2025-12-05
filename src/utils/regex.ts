// Email validation regex patterns
export const EMAIL_REGEX = {
  // Basic email format validation
  VALID_EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Check for spaces in email
  NO_SPACES: /\s/,
};

// Code validation regex patterns
export const CODE_REGEX = {
  // 6-digit numeric code validation
  SIX_DIGIT_CODE: /^\d{6}$/,
  // Only digits (for input filtering)
  ONLY_DIGITS: /\D/g,
  // Check if string contains only digits
  IS_DIGITS_ONLY: /^\d+$/,
};

// Name validation regex patterns
export const NAME_REGEX = {
  // Allows letters, spaces, hyphens, apostrophes. 2-50 chars (tweakable)
  VALID_NAME: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/,
};

// Phone validation regex patterns (generic fallback)
export const PHONE_REGEX = {
  // E.164 like: + and digits, 8-15 digits total (country dependent)
  E164_BASIC: /^\+[1-9]\d{7,14}$/,
};
