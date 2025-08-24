# Gemini AI Setup for NFT Character Chat

This guide will help you set up Google's Gemini AI model to power the chat responses for your NFT characters.

## Prerequisites

1. A Google account
2. Access to Google AI Studio (https://makersuite.google.com/app/apikey)

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the generated API key (it will look like: `AIzaSyC...`)

## Step 2: Configure Environment Variables

1. In your project root directory, create a `.env` file (if it doesn't exist)
2. Add your Gemini API key:

```bash
# .env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with the actual API key you copied from Google AI Studio.

## Step 3: Restart Your Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
# or
pnpm dev
```

## Step 4: Test the Chat

1. Navigate to a character's chat page
2. Send a message
3. The character should now respond using Gemini AI instead of showing "AI response error"

## Troubleshooting

### "Missing Gemini API Key" Error
- Ensure you've created a `.env` file in the project root
- Check that the API key is correctly copied (no extra spaces or characters)
- Verify the environment variable name is exactly `VITE_GEMINI_API_KEY`

### "Invalid API Key" Error
- Double-check your API key from Google AI Studio
- Ensure you're using the correct API key (not a different Google service key)

### "API Quota Exceeded" Error
- Check your Google AI Studio usage limits
- Consider upgrading your plan if needed

### "Content Blocked by Safety Filters" Error
- Rephrase your message to avoid triggering content filters
- Keep messages appropriate and non-harmful

## API Usage and Costs

- Gemini API has generous free tier limits
- Check [Google AI Studio pricing](https://ai.google.dev/pricing) for current rates
- Monitor your usage in the Google AI Studio dashboard

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your API key private and secure

## Character Personalities

The AI will automatically adapt responses based on each character's:
- Name
- Description  
- Personality traits
- Special character overrides (for curated characters like Luffy, Zoro, etc.)

Each character will maintain their unique voice and personality in all responses!
