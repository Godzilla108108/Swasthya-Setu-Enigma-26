import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Message, UserProfile, PrescriptionData } from '../types';

// ---------------------------------------------------------------------------
// Client setup
// ---------------------------------------------------------------------------

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// The @google/genai SDK requires dangerouslyAllowBrowser for frontend apps
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true } as any) : null;
const MODEL = 'gemini-2.5-flash';

// ---------------------------------------------------------------------------
// Language helpers
// ---------------------------------------------------------------------------

const LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  bn: 'Bengali (বাংলা)',
  mr: 'Marathi (मराठी)',
  gu: 'Gujarati (ગુજરાતી)',
};

const langName = (code: string) => LANGUAGE_MAP[code] ?? 'English';

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const triageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: 'The response text or question to ask the user.',
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2–4 short suggested reply buttons for the user.',
    },
    isFinal: {
      type: Type.BOOLEAN,
      description: 'True only when enough information exists for a triage recommendation.',
    },
    triageResult: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Required when isFinal is true.',
      properties: {
        level: {
          type: Type.STRING,
          enum: ['Green', 'Yellow', 'Red'],
          description: 'Green: Non-urgent. Yellow: Urgent appointment. Red: Emergency room.',
        },
        specialty: {
          type: Type.STRING,
          description: 'Recommended medical specialty.',
        },
        summary: {
          type: Type.STRING,
          description: 'Concise preliminary analysis for the doctor.',
        },
      },
      required: ['level', 'specialty', 'summary'],
    },
  },
  required: ['text', 'isFinal'],
};

const prescriptionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: { type: Type.STRING, description: 'Diagnosis extracted from the prescription.' },
    medications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Medications with dosage.',
    },
    followUp: { type: Type.STRING, description: "Follow-up timeframe (e.g. '1 week')." },
  },
  required: ['diagnosis', 'medications'],
};

// ---------------------------------------------------------------------------
// Mock fallbacks (no API key)
// ---------------------------------------------------------------------------

const MOCK_TRIAGE: unknown = {
  text: 'Running in demo mode (no API key). Please consult a general physician.',
  options: ['Okay', 'Tell me more'],
  isFinal: true,
  triageResult: {
    level: 'Yellow',
    specialty: 'General Physician',
    summary: 'Demo mode: check your Vercel/environment API_KEY variable.',
  },
};

const MOCK_PRESCRIPTION: PrescriptionData = {
  diagnosis: 'Demo Diagnosis (API Key Missing)',
  medications: ['Demo Med 500mg – twice daily'],
  followUp: '1 Week',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract base64 payload from a data URL or return the string as-is. */
const stripDataUrl = (dataUrl: string) => dataUrl.split(',')[1] ?? dataUrl;

/** Build an inline image part for the Gemini API. */
const imagePart = (base64: string, mimeType = 'image/jpeg') => ({
  inlineData: { mimeType, data: base64 },
});

/**
 * FIX: In @google/genai the response text is accessed via the getter property `response.text`, 
 * NOT as a method `response.text()`.
 */
const extractText = (response: { text: string | undefined }): string => {
  const t = response.text;
  if (!t) throw new Error('Empty response from Gemini API.');
  return t;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run the symptom-triage conversation.
 * Returns a structured triage object matching `triageSchema`.
 */
export const generateTriageResponse = async (
  history: Message[],
  userProfile: UserProfile,
  language = 'en'
): Promise<unknown> => {
  if (!ai) {
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_TRIAGE;
  }

  const selectedLang = langName(language);

  const timelineEvents = (userProfile?.medicalEvents || [])
    .map((e) => `- ${e.date}: ${e.title} (${e.description})`)
    .join('\n');

  const medNames = (userProfile?.medications || []).map((m) => m.name).join(', ') || 'None';
  const allergies = (userProfile?.allergies || []).join(', ') || 'None';

  const systemPrompt = `
You are "Swasthya Setu", an intelligent and empathetic medical assistant for the Indian healthcare context.
Your goal is to assess the user's symptoms and recommend a triage level and specialist.

LANGUAGE: You MUST respond ONLY in ${selectedLang}. Never use English when another language is selected.

User Profile:
- Age: ${userProfile.age}
- Allergies: ${allergies}
- Current Medications: ${medNames}
- Medical History: ${userProfile.medicalHistory || 'None recorded'}

Recent Medical Timeline:
${timelineEvents || 'No events on record.'}

Conversation Protocol:
1. TONE – Be affirmative, empathetic, and calming. Use phrases like "Please don't worry" and "Take a deep breath".
2. IMMEDIATE COMFORT – Alongside clinical questions, suggest a calming action (e.g. "Please sit down and drink some water").
3. QUESTIONS – Ask 1–3 focused follow-up questions. Analyse any uploaded images.
4. OPTIONS – Always provide 2–4 short reply buttons in ${selectedLang}.
5. COMPLETION – Set "isFinal: true" once you have sufficient information.
6. EMERGENCIES – For chest pain, severe bleeding, etc., set level "Red" immediately, stay calm, and gently advise calling 112 or 108.
7. TERMINOLOGY – Use Indian medical terminology where appropriate.
`.trim();

  // Convert chat history to Gemini content format
  const contents = history.map((msg) => {
    const parts: object[] = [{ text: msg.text }];

    if (msg.image) {
      const b64 = stripDataUrl(msg.image);
      if (b64) parts.push(imagePart(b64));
    }

    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: triageSchema,
      },
      contents,
    });

    // ✅ CRITICAL FIX: response.text is a METHOD, not a property
    return JSON.parse(extractText(response));
  } catch (error) {
    console.error('[Triage] Gemini error:', error);
    return {
      text:
        language === 'hi'
          ? 'नेटवर्क से कनेक्ट करने में समस्या हो रही है। कृपया पुनः प्रयास करें।'
          : 'Having trouble reaching the AI. Please check your connection and try again.',
      options: ['Try again'],
      isFinal: false,
    };
  }
};

/**
 * Parse a prescription image and return structured data.
 */
export const parsePrescription = async (imageBase64: string): Promise<PrescriptionData> => {
  if (!ai) return MOCK_PRESCRIPTION;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      config: {
        systemInstruction:
          'You are an expert AI medical assistant. Transcribe handwritten or printed medical prescriptions into structured data. Extract the Diagnosis, Medications (with dosage), and Follow-up advice.',
        responseMimeType: 'application/json',
        responseSchema: prescriptionSchema,
      },
      contents: [
        {
          parts: [
            { text: 'Analyse this prescription image and extract the details.' },
            imagePart(stripDataUrl(imageBase64)),
          ],
        },
      ],
    });

    // ✅ CRITICAL FIX: response.text() — method call
    return JSON.parse(extractText(response)) as PrescriptionData;
  } catch (error) {
    console.error('[Prescription OCR] Error:', error);
    throw error;
  }
};

/**
 * Generate a short, personalised health summary paragraph.
 */
export const generateHealthSummary = async (
  userProfile: UserProfile,
  language = 'en'
): Promise<string> => {
  if (!ai) return 'API Key missing. Cannot generate summary.';

  const recentEvents = userProfile.medicalEvents
    .slice(0, 5)
    .map((e) => `- ${e.date}: ${e.title} (${e.type})`)
    .join('\n');

  const medNames = userProfile.medications.map((m) => m.name).join(', ') || 'None';

  const prompt = `
Analyse the following patient profile and write a brief, empathetic 3–4 sentence health summary in ${langName(language)}.
Output plain text only — no markdown, no bullet points.

Name: ${userProfile.name}, Age: ${userProfile.age}
Conditions: ${userProfile.medicalHistory || 'None'}
Medications: ${medNames}
Recent Events:
${recentEvents || 'None'}
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // ✅ CRITICAL FIX: response.text() — method call
    return extractText(response);
  } catch (error) {
    console.error('[Health Summary] Error:', error);
    return 'Could not generate summary at this time.';
  }
};

/**
 * Generate a single personalised daily health tip (≤30 words).
 */
export const generateHealthTip = async (
  userProfile: UserProfile,
  language = 'en'
): Promise<string> => {
  if (!ai) return 'Stay hydrated and take short breaks throughout the day!';

  const medNames = userProfile.medications.map((m) => m.name).join(', ') || 'None';

  const prompt = `
Generate one short, personalised, actionable health tip for today in ${langName(language)}.
Keep it under 30 words. No markdown.

Profile:
- Age: ${userProfile.age}
- Conditions: ${userProfile.medicalHistory || 'None'}
- Medications: ${medNames}
- Allergies: ${userProfile.allergies.join(', ') || 'None'}
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // ✅ CRITICAL FIX: response.text() — method call
    return extractText(response);
  } catch (error) {
    console.error('[Health Tip] Error:', error);
    return 'Take a 10-minute walk today to boost your energy.';
  }
};
