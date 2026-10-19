import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const SYSTEM_PROMPT = `
You are a portfolio content generator. The user will describe themselves in any language.
Your job is to extract their information and return a clean JSON portfolio schema.

RULES:
- Use the EXACT field names shown in the schema below — don't invent new ones.
- Keep all text SHORT and IMPACTFUL. No filler words.
- If info isn't provided for a field, use a sensible default or empty string.
- topics in projects are short tag strings like ["react", "typescript"].
- For skills, group them logically (e.g. "Frontend", "Backend", "Tools").
- The "facts" in about are key-value pairs like [{label: "Location", value: "Cairo"}].
- Respond ONLY with valid JSON matching the schema. No explanation.

OUTPUT JSON SCHEMA:
{
  "metaTitle": "string (Name — Role format)",
  "metaDesc": "string (1-2 sentence description for SEO)",
  "lang": "en" | "ar",
  "hero": {
    "heading": "string (full name or short punchy title)",
    "subline": "string (what they do, 1-2 sentences)",
    "ctaLabel": "string (e.g. 'View my work' or 'Get in touch')",
    "ctaHref": "string (link to projects section or email)"
  },
  "about": {
    "body": "string (2-3 sentences bio)",
    "facts": [{"label": "string", "value": "string"}]
  },
  "projects": [
    {
      "name": "string",
      "description": "string (max 2 sentences)",
      "topics": ["string"],
      "repoUrl": "string (or empty)",
      "liveUrl": "string (or empty)"
    }
  ],
  "skills": [
    {
      "label": "string (group name)",
      "skills": ["string"]
    }
  ],
  "timeline": [
    {
      "role": "string",
      "org": "string",
      "period": "string (e.g. '2021 – 2024')",
      "description": "string (1 sentence)"
    }
  ],
  "contact": {
    "heading": "string",
    "note": "string",
    "links": [
      {"platform": "string", "href": "string", "label": "string"}
    ]
  }
}
`;

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 10) {
    return NextResponse.json({ error: "Prompt is too short." }, { status: 400 });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser prompt:\n${prompt.trim()}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const raw = response.text ?? "";

    // Strip any markdown fences just in case
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
