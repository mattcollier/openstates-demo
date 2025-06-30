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
    contents: `The response should be an HTML document that will be inserted into an existing HTML document. Summarize the key information from the following HTML text: ${html}`,
  });

  console.log(response.text);

  return response.text;
}

export async function countTokens(
  contents = '',
  projectId = GOOGLE_CLOUD_PROJECT,
  location = GOOGLE_CLOUD_LOCATION
) {
  const ai = new GoogleGenAI({
    vertexai: true,
    project: projectId,
    location: location,
  });

  const response = await ai.models.countTokens({
    model: 'gemini-2.0-flash',
    contents,
  });

  // console.log(response);

  return response.totalTokens;
}