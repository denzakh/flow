import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskWeight } from "../types.ts";

export const optimizeTasks = async (tasks: Task[], periodLabel: string): Promise<string[]> => {
  if (tasks.length === 0) return [];
  
  try {
    // Accessing process.env.API_KEY directly as required by the system instructions
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing, skipping task optimization.");
      return tasks.map(t => t.id);
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a productivity expert. Given a list of tasks for the ${periodLabel}, suggest the most logical order to complete them.
      Tasks: ${tasks.map(t => `${t.title} (Priority: ${t.priority}, Weight: ${t.weight})`).join(', ')}.
      Return only a JSON array of task IDs in the recommended order.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text?.trim();
    if (!text) return tasks.map(t => t.id);

    const result = JSON.parse(text);
    return Array.isArray(result) ? result : tasks.map(t => t.id);
  } catch (error) {
    console.error("Failed to optimize tasks:", error);
    return tasks.map(t => t.id);
  }
};

export const suggestWeight = async (title: string): Promise<TaskWeight> => {
  if (!title.trim() || title.length < 3) return TaskWeight.FOCUSED;

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return TaskWeight.FOCUSED;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize the following task into one of three complexity levels: 
      - "QUICK": Simple tasks taking < 15 mins (e.g., send email, coffee, call friend, check mail).
      - "FOCUSED": Standard tasks taking 30-60 mins (e.g., write report, meeting, exercise, cook dinner).
      - "DEEP": Intensive tasks taking 2+ hours (e.g., code feature, design system, study for exam, strategic planning).
      
      Task: "${title}"
      
      Return ONLY the word "QUICK", "FOCUSED", or "DEEP".`,
      config: {
        temperature: 0.1,
      }
    });

    const text = (response.text || "").trim().toUpperCase();
    if (text.includes("DEEP")) return TaskWeight.DEEP;
    if (text.includes("FOCUSED")) return TaskWeight.FOCUSED;
    if (text.includes("QUICK")) return TaskWeight.QUICK;
    return TaskWeight.FOCUSED;
  } catch (error) {
    console.warn("Gemini weight suggestion error (silent fallback):", error);
    return TaskWeight.FOCUSED;
  }
};