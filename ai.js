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

  const prompt = 'You are a legislative analyst. Produce: ' +
    '1. A 200-word abstract. ' + 
    '2. Section-by-section bullets (≤15). ' +
    // '3. A JSON array “key_changes” listing any amendments to existing statutes. ' +
    'Use plain language; cite section numbers in parentheses. ' +
    'The response should be an HTML document. The HTML should not include any style attributes. ';

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `${prompt} This is the HTML document to be summarized: ${html}`,
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