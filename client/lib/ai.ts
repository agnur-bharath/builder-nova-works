// AI Configuration for Gemini
export const AI_CONFIG = {
  // Gemini API Configuration
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here',
  GEMINI_MODEL: 'gemini-1.5-flash',
  
  // Character Response Settings
  MAX_RESPONSE_LENGTH: 200,
  TEMPERATURE: 0.9,
  
  // Error Messages
  ERRORS: {
    MISSING_API_KEY: '[AI configuration error: Missing Gemini API Key. Please set VITE_GEMINI_API_KEY in your .env file]',
    INVALID_API_KEY: '[AI Error: Invalid API key. Please check your Gemini API key.]',
    QUOTA_EXCEEDED: '[AI Error: API quota exceeded. Please try again later.]',
    SAFETY_FILTER: '[AI Error: Content blocked by safety filters. Please rephrase your message.]',
    GENERIC_ERROR: '[AI response error: Please try again or check your API configuration.]',
    EMPTY_RESPONSE: '[AI response was empty]',
    CHARACTER_NOT_FOUND: '[Character not found]'
  }
};

// Environment variable validation
export const validateEnvironment = () => {
  const missingVars = [];
  
  if (!AI_CONFIG.GEMINI_API_KEY || AI_CONFIG.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    missingVars.push('VITE_GEMINI_API_KEY');
  }
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars.join(', '));
    console.warn('Please create a .env file with the required variables. See .env.example for reference.');
    return false;
  }
  
  return true;
};
