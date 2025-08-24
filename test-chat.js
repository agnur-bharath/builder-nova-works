// Test chat functionality with different character personalities
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Character personalities for testing
const CHARACTERS = {
  luffy: {
    name: "Luffy",
    description: "Captain of the Straw Hat Pirates, a rubber-powered pirate with a dream to become King of the Pirates",
    personality: "Optimistic, impulsive, loyal to friends, loves meat, fearless leader"
  },
  zoro: {
    name: "Zoro",
    description: "Swordsman of the Straw Hat Pirates, aiming to become the world's greatest swordsman",
    personality: "Stoic, disciplined, focused on training, honorable, gets lost easily"
  },
  itachi: {
    name: "Itachi",
    description: "Former ANBU captain and member of the Uchiha clan, sacrificed everything for peace",
    personality: "Calm, introspective, philosophical, wise beyond his years, deeply caring"
  },
  dog: {
    name: "Dog",
    description: "A loyal and playful canine companion",
    personality: "Loyal, energetic, affectionate, protective, loves to play"
  }
};

// Character style overrides
const CHARACTER_OVERRIDES = {
  dog: {
    style: "Speak like a loyal, playful dog: short enthusiastic sentences, affectionate tone, occasionally say 'woof' or 'arf' as an interjection. Keep language simple and joyful."
  },
  luffy: {
    style: "Adopt a bold, energetic captain voice: optimistic, impulsive, uses exclamations, confident and adventurous. Keep responses upbeat and spirited."
  },
  zoro: {
    style: "Use a stoic swordsman persona: concise, direct, focused on honor and training. Use short, clipped sentences and occasional references to swordsmanship or paths."
  },
  itachi: {
    style: "Respond in a calm, introspective tone: measured vocabulary, philosophical, slightly melancholic but wise. Use reflective sentences and subtle guidance."
  }
};

async function testCharacterChat(characterKey, userMessage) {
  const character = CHARACTERS[characterKey];
  const override = CHARACTER_OVERRIDES[characterKey];
  const overrideText = override ? `Special instructions for this character: ${override.style}\n` : "";

  const systemPrompt = `You are roleplaying as a character with the following details:
Name: ${character.name}
Description: ${character.description}
Personality: ${character.personality}

${overrideText}Key Requirements:
1. ALWAYS stay in character.
2. Use speech patterns and vocabulary that match your character's personality.
3. Reference your character's background and experiences in your responses.
4. Show emotional responses that align with your personality traits.
5. Never break character or acknowledge that you are an AI.
6. Keep responses concise but meaningful (1-3 sentences).

Current conversation context: The user is interacting with you in a virtual world and expects responses in the voice and persona of this character.`;

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ No API key found in environment variables');
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${systemPrompt}

User message: ${userMessage}

Please respond as ${character.name} in character:`;

    console.log(`\n🎭 Testing ${character.name}...`);
    console.log(`📝 User: ${userMessage}`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`💬 ${character.name}: ${text}`);
    console.log('✅ Character response successful!');

  } catch (error) {
    console.error(`❌ Error with ${character.name}:`, error.message);
  }
}

// Test all characters
async function testAllCharacters() {
  console.log('🧪 Testing Character Chat Personalities...\n');
  
  const testMessage = "Hello! Can you tell me about yourself?";
  
  for (const characterKey of Object.keys(CHARACTERS)) {
    await testCharacterChat(characterKey, testMessage);
    console.log('---');
  }
  
  console.log('\n🎉 All character tests completed!');
}

// Run the test
testAllCharacters();
