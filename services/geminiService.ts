
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Experience, GeneratedResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateResumeContent = async (experience: Experience): Promise<GeneratedResult> => {
  const prompt = `
    Analyze this career experience and perform deep research using Google Search.
    
    Company: ${experience.company}
    Role: ${experience.role}
    Period: ${experience.startDate} to ${experience.endDate}
    User's basic input: ${experience.description || "None provided. Research the company's state and projects from scratch."}

    CRITICAL INSTRUCTIONS:
    1. Research actual high-impact projects, product launches, architectural shifts, or business milestones ${experience.company} was undergoing between ${experience.startDate} and ${experience.endDate}.
    2. Even if the user provided NO description, construct 4 high-impact resume bullet points (STAR method) as if the user was a top-performing ${experience.role} contributing to these real-world events.
    3. Use specific terminology, tools, and project names found in your research (e.g., "Contributed to the launch of [Actual Project Name]", "Helped scale [Actual Service] during [Actual Event]").
    4. Ensure the bullet points are metric-driven and highly professional.
    5. Provide a brief "Roadmap Context" explaining what the company was focused on during this tenure (e.g., "During this time, ${experience.company} was pivoting to AI-first services and expanding into the APAC market").

    Format the output as a valid JSON object with these keys:
    - bulletPoints: string[]
    - roadmapContext: string
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json'
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const contextSources = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'Related Source',
        uri: chunk.web?.uri || '#'
      }));

    return {
      experienceId: experience.id,
      company: experience.company,
      role: experience.role,
      bulletPoints: data.bulletPoints || [],
      roadmapContext: data.roadmapContext || "Researching roadmap...",
      contextSources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please ensure your API key is valid.");
  }
};
