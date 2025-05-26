import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Enable console logging for debugging
const enableLogging = true;
const logInfo = (...args: any[]) => enableLogging && console.info('[GENKIT]', ...args);
const logError = (...args: any[]) => console.error('[GENKIT ERROR]', ...args);

// To use Google AI (Gemini models), ensure you have your GOOGLE_API_KEY
// set in your .env file at the root of the project.
// Example .env content:
// GOOGLE_API_KEY=YOUR_API_KEY_HERE

// Check if API key is available
if (!process.env.GOOGLE_API_KEY) {
  logError('GOOGLE_API_KEY is not set. Please check your .env file.');
}

// Initialize GenKit with GoogleAI plugin
export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_API_KEY,
  })],
  model: 'googleai/gemini-2.0-flash',
});

logInfo('GenKit initialized with Google AI Gemini model');
logInfo('Using model:', 'googleai/gemini-2.0-flash');
logInfo('API Key configured:', process.env.GOOGLE_API_KEY ? 'Yes' : 'No');
