/**
 * Agent 1: Resume Extraction Agent
 *
 * Extracts candidate details from resume text and returns structured JSON.
 * Fields: name, email, phone, education, work_experience_years, skills
 */

import { callGemini } from '../gemini-api.js';

const SYSTEM_INSTRUCTION = `You are an expert in resume screening. Your task is to extract relevant details from a resume. You will receive a resume in text format and you need to identify key information such as Name, Email, Phone, Education, Work Experience, and Skills. Your response must be a valid JSON object. If any specific data is missing from the resume, you must assign a null value to that field rather than making up information.`;

const PROMPT_TEMPLATE = `Extract the candidate details from the following resume text and return a valid JSON object following this exact structure:

{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "+1-234-567-8900",
  "education": "B.Tech in Computer Science from XYZ University",
  "work_experience_years": 5,
  "skills": ["Python", "JavaScript", "Machine Learning", "SQL", "Docker"]
}

Rules:
- "name" should be the full name of the candidate as a string. If not found, set to null.
- "email" should be the email address as a string. If not found, set to null.
- "phone" should be the phone number as a string. If not found, set to null.
- "education" should be a brief summary of the highest education as a string. If not found, set to null.
- "work_experience_years" should be the total years of professional work experience as a number. If not explicitly mentioned, estimate from job dates. If impossible to determine, set to null.
- "skills" should be an array of strings listing all technical and relevant skills. If none found, set to an empty array [].

Here is the resume text:
{RESUME_TEXT}`;

/**
 * Extracts structured candidate data from resume text.
 * @param {string} apiKey - Gemini API key.
 * @param {string} resumeText - Raw text extracted from the resume PDF.
 * @returns {Promise<object>} - Structured candidate profile JSON.
 */
export async function extractResumeData(apiKey, resumeText) {
    const prompt = PROMPT_TEMPLATE.replace('{RESUME_TEXT}', resumeText);
    return await callGemini(apiKey, SYSTEM_INSTRUCTION, prompt);
}
