import { Experience, GeneratedResult } from "../types";

/**
 * Sends a curl-style HTTP POST to the Generative AI endpoint.
 *
 * Notes:
 * - Ensure NODE version supports global fetch (Node 18+) or install a fetch polyfill.
 * - The API key is read from process.env.API_KEY and used as a Bearer token.
 * - You can override the API URL via process.env.GENAI_API_URL if needed.
 */
const API_KEY = process.env.API_KEY || '';
const API_URL =
  process.env.GENAI_API_URL ||
  "https://generativelanguage.googleapis.com/v1/models/gemini-3-flash-preview:generate";

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
    5. Provide a brief "Roadmap Context" explaining what the company was focused on during this tenure (e.g., "During this time, ${experience.company} was pivoting to AI-first services and expanding its cloud platform").

    Format the output as a valid JSON object with these keys:
    - bulletPoints: string[]
    - roadmapContext: string
  `;

  try {
    // Build the request body similar to a curl JSON payload.
    // The exact request schema can vary by API version; this payload sends the prompt in a "prompt" / "input" block.
    const body = {
      // If your API expects a different field name (e.g., "prompt" or "input"), adjust here.
      prompt: {
        text: prompt
      },
      // Optional generation params:
      temperature: 0.0,
      maxOutputTokens: 1024,
      // If your API supports tools or search, include the relevant config keys here.
      // e.g., tools: [{ googleSearch: {} }]
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }

    // Use Bearer token as typical curl Authorization header.
    headers["x-goog-api-key"] = `${API_KEY}`;

    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Generative API HTTP error:", res.status, errText);
      throw new Error(`Generative API request failed with status ${res.status}`);
    }

    const responseJson: any = await res.json();

    // Try to locate the model's text output in a few common shapes returned by generative APIs.
    const possibleText =
      // new style: output -> [ { content: [ { type: 'output_text', text: '...' } ] } ]
      responseJson.output?.[0]?.content?.find((c: any) => c.text || c.type === "output_text")?.text ||
      // older/candidate style:
      responseJson.candidates?.[0]?.content?.[0]?.text ||
      // fallback fields some APIs use:
      responseJson.outputText ||
      responseJson.text ||
      // Last fallback: stringify the whole response so parsing doesn't crash (will likely fail JSON.parse).
      JSON.stringify(responseJson);

    let data: any = {};
    try {
      data = typeof possibleText === "string" ? JSON.parse(possibleText) : possibleText;
    } catch (parseError) {
      // If the model didn't return strict JSON, throw with helpful debugging info.
      console.error("Failed to parse generation output as JSON:", parseError, "raw:", possibleText);
      throw new Error("Model output was not valid JSON. See server logs for raw output.");
    }

    // Extract grounding sources if available (structure may vary).
    const groundingChunks =
      responseJson.candidates?.[0]?.groundingMetadata?.groundingChunks ||
      responseJson.output?.[0]?.groundingMetadata?.groundingChunks ||
      [];

    const contextSources = (groundingChunks || [])
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web?.title || "Related Source",
        uri: chunk.web?.uri || "#",
      }));

    return {
      experienceId: experience.id,
      company: experience.company,
      role: experience.role,
      bulletPoints: data.bulletPoints || [],
      roadmapContext: data.roadmapContext || "Researching roadmap...",
      contextSources,
    };
  } catch (error) {
    console.error("Generative API Error:", error);
    throw new Error("Failed to generate content. Please ensure your API key and endpoint are correct.");
  }
};
