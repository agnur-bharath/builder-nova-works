// Test import paths
console.log('Testing import paths...');

try {
  // Test if we can import from the lib directory
  const { AI_CONFIG } = await import('./client/lib/ai.ts');
  console.log('✅ AI config import successful!');
  console.log('API Key:', AI_CONFIG.GEMINI_API_KEY ? 'Set' : 'Not set');
  console.log('Model:', AI_CONFIG.GEMINI_MODEL);
} catch (error) {
  console.error('❌ Import failed:', error.message);
}
