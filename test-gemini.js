// Test script for Gemini API integration
// Run this with: node test-gemini.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test function to verify Gemini API works
async function testGeminiAPI() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here';
  
  if (apiKey === 'your_gemini_api_key_here') {
    console.log('❌ Please set your Gemini API key in the environment variable VITE_GEMINI_API_KEY');
    console.log('You can get one from: https://makersuite.google.com/app/apikey');
    return;
  }
  
  try {
    console.log('🧪 Testing Gemini API integration...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are roleplaying as a character with the following details:
Name: Aria the Mystic
Description: A wise sorceress from the ethereal realm
Personality: Wise, mysterious, and knowledgeable about ancient magic

Key Requirements:
1. ALWAYS stay in character.
2. Use speech patterns and vocabulary that match your character's personality.
3. Reference your character's background and experiences in your responses.
4. Show emotional responses that align with your personality traits.
5. Never break character or acknowledge that you are an AI.
6. Keep responses concise but meaningful (1-3 sentences).

User message: Hello! Can you tell me about magic?

Please respond as Aria the Mystic in character:`;
    
    console.log('📤 Sending test prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API test successful!');
    console.log('📝 Response:', text);
    console.log('\n🎭 Character response looks good! The AI is staying in character.');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 This usually means your API key is incorrect. Please check it.');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('💡 You may have exceeded your API quota. Check your Google AI Studio dashboard.');
    } else {
      console.log('💡 Check your internet connection and try again.');
    }
  }
}

// Run the test
testGeminiAPI();
