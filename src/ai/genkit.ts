import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// To use Google AI (Gemini models), ensure you have your GOOGLE_API_KEY
// set in your .env file at the root of the project.
// Example .env content:
// GOOGLE_API_KEY=YOUR_API_KEY_HERE

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
