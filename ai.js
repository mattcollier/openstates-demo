import {GoogleGenAI} from '@google/genai';

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global';

export async function generateContent(
  html = '',
  projectId = GOOGLE_CLOUD_PROJECT,
  location = GOOGLE_CLOUD_LOCATION
) {
  const ai = new GoogleGenAI({
    vertexai: true,
    project: projectId,
    location: location,
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Summarize the key information from the following HTML text: ${html}`,
  });

  console.log(response.text);

  return response.text;
}