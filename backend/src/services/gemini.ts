import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiClient() {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Missing GEMINI_API_KEY inside backend environmental parameters.",
    );
  }

   return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const genAI = getGeminiClient();

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  travelTime?: string;
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  duration: number;
  highlights: string[];
  days: ItineraryDay[];
  bestTimeToVisit: string;
}

export const generateItinerary = async (
  days: number,
  interests: string[],
  groupSize: number = 2,
  budget: string = "mid-range",
): Promise<GeneratedItinerary> => {
  // Ordered fallback models to bypass temporary 503 high-demand errors
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
  ];

 const prompt = `You are an expert luxury travel consultant for Sri Lanka with deep local knowledge.

Create a detailed ${days}-day Sri Lanka travel itinerary for the following:
- Group size: ${groupSize} people
- Interests: ${interests.join(", ")}
- Experience level: ${budget}

IMPORTANT RULES:
- Do NOT include any prices, costs, or budget estimates anywhere in the response
- Focus on experiences, not money
- Make it feel exclusive and curated

Return ONLY a valid JSON object (no markdown, no explanation) matching this exact structure:
{
  "title": "evocative itinerary title",
  "summary": "2-3 sentence compelling overview",
  "duration": ${days},
  "highlights": ["top highlight 1", "top highlight 2", "top highlight 3"],
  "days": [
    {
      "day": 1,
      "title": "day title",
      "location": "main location",
      "description": "2-3 sentence narrative for this day",
      "activities": ["activity 1", "activity 2", "activity 3"],
      "accommodation": "recommended accommodation type or area",
      "meals": ["breakfast suggestion", "lunch suggestion", "dinner suggestion"],
      "travelTime": "travel time from previous location if applicable"
    }
  ],
  "bestTimeToVisit": "month range recommendation"
}

Focus on authentic, off-the-beaten-path experiences alongside iconic landmarks.
Include cultural insights and practical tips. Make it feel premium and exclusive.`;

  let lastError: any = null;

  // Dynamically iterate through candidate models if one encounters a spike
  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting generation with model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw new Error("Empty payload returned.");
      }

      // Clean the response — sometimes Gemini wraps JSON in markdown backticks
      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const itinerary = JSON.parse(cleaned) as GeneratedItinerary;
      return itinerary;
    } catch (error: any) {
      console.warn(
        `⚠️ Model ${modelName} failed. Error: ${error.message || error}`,
      );
      lastError = error;
      continue; // Fall through to the next model layout definition
    }
  }

  throw new Error(
    `All available Gemini models failed to respond. Last error: ${lastError?.message || lastError}`,
  );
};
