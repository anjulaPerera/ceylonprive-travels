import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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
  estimatedBudget: string;
}

export const generateItinerary = async (
  days: number,
  interests: string[],
  groupSize: number = 2,
  budget: string = "mid-range",
): Promise<GeneratedItinerary> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an expert luxury travel consultant for Sri Lanka with deep local knowledge.
  
Create a detailed ${days}-day Sri Lanka travel itinerary for the following:
- Group size: ${groupSize} people
- Interests: ${interests.join(", ")}
- Budget level: ${budget}

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
  "bestTimeToVisit": "month range recommendation",
  "estimatedBudget": "per person budget estimate in USD"
}

Focus on authentic, off-the-beaten-path experiences alongside iconic landmarks.
Include cultural insights and practical tips. Make it feel premium and exclusive.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean the response — sometimes Gemini wraps JSON in markdown backticks
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    const itinerary = JSON.parse(cleaned) as GeneratedItinerary;
    return itinerary;
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }
};
