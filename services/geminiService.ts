
import { GoogleGenAI, Type } from "@google/genai";
import { OnboardingAnswers, Diagnosis, Task } from "../types";

export async function generateDiagnosis(answers: OnboardingAnswers): Promise<Diagnosis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const priorities = (answers.areasOfFocus || []).join(', ');
  const places = (answers.commonPlaces || []).join(', ');
  const times = (answers.freeTimeSlots || []).join(', ');
  const tools = (answers.previousTools || []).join(', ');
  const breakers = (answers.focusBreakers || []).join(', ');

  const prompt = `You are a helpful life coach for someone who wants better habits.
    
    USER CONTEXT:
    - Feeling: ${answers.lifeFeeling || 'Not specified'}
    - Struggle: ${answers.frustration || 'Not specified'}
    - Priorities: ${priorities}
    - Level: ${answers.routineLevel || 'BEGINNER'}
    - Daily Reality: ${answers.weekdayReality || 'Typical day'}
    - Focus Breakers: ${breakers}
    - Stress Response: ${answers.overwhelmedBehavior || 'Not specified'}
    - Previous history: ${tools}

    ENVIRONMENTAL CONSTRAINTS:
    - Places: ${places}
    - Times: ${times}
    
    STRICT RULES:
    1. Define a "Future Identity" using SIMPLE, inspiring words (e.g., "The Daily Dreamer" or "The Learning Pro").
    2. Use very simple, clear language. No jargon. No "executive" or "cognitive" talk.
    3. Create 3 suggested habits following the formula: "When I am at [PLACE] at [TIME], I will [VERY SMALL ACTION]."
    4. Since the user might be a student or younger, make the habits fun and very easy.
    5. Generate 2 additional high-impact goals based on their struggle: "${answers.frustration || 'productivity'}".
    6. Ensure the habits specifically help counter their Focus Breakers (${breakers}).

    Return as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reflection: { type: Type.STRING },
          identityName: { type: Type.STRING },
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedHabits: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                habitFormula: { type: Type.STRING },
                reason: { type: Type.STRING },
                importance: { type: Type.NUMBER }
              },
              required: ["title", "habitFormula", "reason", "importance"]
            }
          },
          patterns: {
            type: Type.OBJECT,
            properties: {
              behavioral: { type: Type.STRING },
              emotional: { type: Type.STRING },
              blocker: { type: Type.STRING },
              strength: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (e) {
    const fallbackPlace = (answers.commonPlaces && answers.commonPlaces[0]) || 'My Desk';
    const fallbackTime = (answers.freeTimeSlots && answers.freeTimeSlots[0]) || 'Waking up';
    
    return {
      reflection: "Every big change starts with a small step.",
      identityName: "The Simple Pro",
      insights: ["Small habits grow fast.", "Pick one thing and do it well."],
      suggestedHabits: [
        { 
          title: "The 1-Minute Win", 
          habitFormula: `When I am at ${fallbackPlace} at ${fallbackTime}, I will spend 1 minute on my focus.`, 
          reason: "Starting is the hardest part.", 
          importance: 5 
        }
      ],
      patterns: {
        behavioral: "Working on consistency",
        emotional: "Ready to start",
        blocker: "Distractions",
        strength: "Willing to learn"
      }
    };
  }
}

export async function processBrainDump(dump: string): Promise<{ tasks: Partial<Task>[], detectedEmotions: string[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract 3-5 simple tasks from this text: "${dump}".
    Explain why each task is good in very simple words (max 8 words).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                reason: { type: Type.STRING },
                importance: { type: Type.NUMBER }
              },
              required: ["title", "reason", "importance"]
            }
          },
          detectedEmotions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { tasks: [], detectedEmotions: [] };
  }
}

export async function generateWeeklyInsights(tasks: Task[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const tasksList = (tasks || []).map(t => t.title).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Look at these tasks: ${tasksList}. Give a short, helpful tip in simple words about how to keep going.`,
    config: { systemInstruction: "Be friendly, simple, and encouraging. No big words. Max 20 words." }
  });
  return response.text || "You are doing great! Just keep taking small steps every day.";
}
