

import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateGameEvent(day: number, survivors: number, hostiles: number, recentEvents: string[]): Promise<string> {
  const prompt = `
You are a terse, atmospheric game master for a post-apocalyptic anime survival simulation called "Project: Manusha".
The world is bleak, mysterious, and dangerous.
Your task is to generate a single, short, impactful event description based on the current game state.
Do not use greetings or pleasantries. Be direct.

Current State:
- Day: ${day}
- Survivors: ${survivors}
- Hostile Entities: ${hostiles}
- Recent Events: ${recentEvents.join(', ') || 'None'}

Generate a new event. It should be one sentence. Focus on atmosphere, mystery, or a hint of action.

Examples:
- A strange, rhythmic humming emanates from a collapsed skyscraper.
- The wind carries the scent of ozone and decay from the east.
- One of the survivors finds a barely-legible note clutched in a skeletal hand.
- A blood-red moon hangs ominously in the night sky.
- A sudden tremor shakes the ground, unsettling the nearby ruins.
- A distant distress flare paints the clouds crimson for a fleeting moment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
        topP: 0.95,
      }
    });

    const text = response.text.trim();
    if (!text) {
        return "The air grows heavy with an unspoken dread...";
    }
    return text;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Return a fallback event in case of an API error
    return "A chilling silence falls over the wasteland.";
  }
}