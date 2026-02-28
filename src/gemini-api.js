/**
 * Gemini API Client Module
 * Handles communication with the Google Gemini REST API.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Calls the Gemini API with a system instruction and user prompt.
 * Returns parsed JSON from the response.
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {string} systemInstruction - The system-level context for the model.
 * @param {string} userPrompt - The user prompt with the actual data.
 * @returns {Promise<object>} - The parsed JSON response from the model.
 */
export async function callGemini(apiKey, systemInstruction, userPrompt) {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;

    const requestBody = {
        system_instruction: {
            parts: [{ text: systemInstruction }]
        },
        contents: [
            {
                parts: [{ text: userPrompt }]
            }
        ],
        generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.2,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response.json();

    // Extract the text from the response
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
        throw new Error('No content returned from Gemini API.');
    }

    // Parse the JSON from the response
    try {
        return JSON.parse(textContent);
    } catch (e) {
        // Try to extract JSON from markdown code blocks if direct parse fails
        const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1].trim());
        }
        throw new Error('Failed to parse JSON from Gemini response: ' + textContent.substring(0, 200));
    }
}
