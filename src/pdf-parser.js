/**
 * PDF Parser Module
 * Uses pdf.js (loaded from CDN) to extract text from a PDF File object.
 */

// Import pdf.js from CDN – the module version
const PDF_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';

let pdfjsLib = null;

/**
 * Lazily loads and returns the pdfjsLib.
 */
async function getPdfJs() {
    if (pdfjsLib) return pdfjsLib;
    pdfjsLib = await import(PDF_JS_CDN);
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    return pdfjsLib;
}

/**
 * Extracts full text content from a PDF file.
 * @param {File} file - The PDF file to parse.
 * @returns {Promise<string>} - The extracted text content.
 */
export async function extractTextFromPDF(file) {
    const pdfjs = await getPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const textParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        textParts.push(pageText);
    }

    return textParts.join('\n\n');
}
