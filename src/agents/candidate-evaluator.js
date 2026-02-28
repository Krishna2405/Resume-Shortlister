/**
 * Agent 3: Candidate Evaluation Agent
 *
 * Compares candidate profile JSON against JD requirements JSON
 * and returns a selection decision with reasoning.
 */

import { callGemini } from '../gemini-api.js';

const SYSTEM_INSTRUCTION = `You are a candidate evaluation agent. You will receive a candidate's profile and a job description, both in JSON format. Your task is to evaluate whether the candidate is a good fit for the job based on strict criteria. Your response must be a valid JSON object.`;

const PROMPT_TEMPLATE = `Evaluate the following candidate against the job requirements and return a JSON object with the evaluation result.

**Candidate Profile:**
{CANDIDATE_JSON}

**Job Requirements:**
{JD_JSON}

**Evaluation Criteria:**
1. **Skills Match**: The candidate must have at least a 50% skills match with the JD. Calculate the percentage of JD-required skills that the candidate possesses.
2. **Experience Match**: The candidate's work experience must be within the acceptable range (minimum and maximum experience from JD) with a tolerance of +/- 2 years. For example, if JD requires 3-6 years and the candidate has 2 years, that is within tolerance (3-2=1, which is ≤2). If the candidate has experience of null, treat it as not meeting the criteria.
3. **Contextual Reasoning**: Use contextual understanding for skill matching. For example:
   - If the JD mentions "CI/CD" and the candidate's resume mentions "DevOps", consider it a skill match because they are contextually the same.
   - If the JD mentions "React" and the candidate knows "Next.js", consider it a partial match.
   - If the JD mentions "Cloud" and the candidate knows "AWS" or "Azure" or "GCP", consider it a match.
   - Apply similar contextual reasoning for other related technologies.

**Output Format:**
Return a valid JSON object with this exact structure:
{
  "status": "Selected",
  "skills_match_percentage": 75,
  "experience_within_range": true,
  "matched_skills": ["Python", "SQL", "AWS"],
  "missing_skills": ["Kubernetes"],
  "reason": "The candidate has 75% skills match (3 out of 4 required skills) and 5 years of experience which falls within the required 3-6 years range. The candidate is a strong fit for the role."
}

- "status" must be either "Selected" or "Rejected".
- "skills_match_percentage" is a number from 0 to 100.
- "experience_within_range" is a boolean.
- "matched_skills" is an array of matched skill strings.
- "missing_skills" is an array of missing skill strings.
- "reason" is a detailed string explaining the evaluation decision.`;

/**
 * Evaluates a candidate against job requirements.
 * @param {string} apiKey - Gemini API key.
 * @param {object} candidateData - Structured candidate profile from Agent 1.
 * @param {object} jdData - Structured JD requirements from Agent 2.
 * @returns {Promise<object>} - Evaluation result with status and reason.
 */
export async function evaluateCandidate(apiKey, candidateData, jdData) {
    const prompt = PROMPT_TEMPLATE
        .replace('{CANDIDATE_JSON}', JSON.stringify(candidateData, null, 2))
        .replace('{JD_JSON}', JSON.stringify(jdData, null, 2));
    return await callGemini(apiKey, SYSTEM_INSTRUCTION, prompt);
}
