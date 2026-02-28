/**
 * Agent 2: Job Description (JD) Extraction Agent
 *
 * Extracts job requirements from JD text and returns structured JSON.
 * Fields: min_experience_years, max_experience_years, skills
 */

import { callGemini } from '../gemini-api.js';

const SYSTEM_INSTRUCTION = `You are an expert in filtering the required skills and experience from a given job description. Your task is to extract relevant details from the job description: Minimum work experience, Maximum work experience, and Skills. Your response must be a valid JSON object. If any specific data is missing from the job description, you must assign a null value to that field rather than making up information.`;

const PROMPT_TEMPLATE = `Extract the job requirements from the following job description text and return a valid JSON object following this exact structure:

{
  "min_experience_years": 3,
  "max_experience_years": 6,
  "skills": ["Python", "Machine Learning", "SQL", "AWS", "REST APIs"]
}

Rules:
- "min_experience_years" should be the minimum years of experience required as a number. If not found, set to null.
- "max_experience_years" should be the maximum years of experience as a number. If not found, set to null.
- If the job description only mentions something like "5+ years of experience" without a ceiling, consider it as 5 for minimum work experience and 8 for maximum work experience (assuming +3 years as the maximum ceiling).
- If it says "3-5 years", min is 3 and max is 5.
- "skills" should be an array of strings listing all required technical and relevant skills mentioned in the job description. If none found, set to an empty array [].

Here is the job description text:
{JD_TEXT}`;

/**
 * Extracts structured job requirements from JD text.
 * @param {string} apiKey - Gemini API key.
 * @param {string} jdText - Raw text extracted from the JD PDF.
 * @returns {Promise<object>} - Structured job requirements JSON.
 */
export async function extractJDData(apiKey, jdText) {
    const prompt = PROMPT_TEMPLATE.replace('{JD_TEXT}', jdText);
    return await callGemini(apiKey, SYSTEM_INSTRUCTION, prompt);
}
