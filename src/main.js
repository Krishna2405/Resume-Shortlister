/**
 * Main Application Logic
 * Orchestrates the full resume screening pipeline.
 */

import './styles/index.css';
import { extractTextFromPDF } from './pdf-parser.js';
import { extractResumeData } from './agents/resume-extractor.js';
import { extractJDData } from './agents/jd-extractor.js';
import { evaluateCandidate } from './agents/candidate-evaluator.js';

// ===== DOM Elements =====
const apiKeyInput = document.getElementById('api-key-input');
const toggleKeyBtn = document.getElementById('toggle-key-btn');
const resumeUploadCard = document.getElementById('resume-upload-card');
const resumeFileInput = document.getElementById('resume-file-input');
const resumeFileInfo = document.getElementById('resume-file-info');
const resumeFileName = document.getElementById('resume-file-name');
const resumeRemoveBtn = document.getElementById('resume-remove-btn');
const jdUploadCard = document.getElementById('jd-upload-card');
const jdFileInput = document.getElementById('jd-file-input');
const jdFileInfo = document.getElementById('jd-file-info');
const jdFileName = document.getElementById('jd-file-name');
const jdRemoveBtn = document.getElementById('jd-remove-btn');
const screenBtn = document.getElementById('screen-btn');
const processingSection = document.getElementById('processing-section');
const resultsSection = document.getElementById('results-section');
const errorSection = document.getElementById('error-section');
const errorMessage = document.getElementById('error-message');
const errorDismissBtn = document.getElementById('error-dismiss-btn');

// ===== State =====
let resumeFile = null;
let jdFile = null;

// ===== API Key Toggle =====
toggleKeyBtn.addEventListener('click', () => {
  const isPassword = apiKeyInput.type === 'password';
  apiKeyInput.type = isPassword ? 'text' : 'password';
});

// ===== Upload Handlers =====
function setupUploadCard(card, fileInput, fileInfo, fileNameEl, removeBtn, setFile) {
  // Click to upload
  card.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remove') || e.target.closest('.file-info')) return;
    fileInput.click();
  });

  // File selected
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      setFile(fileInput.files[0]);
    }
  });

  // Drag & drop
  card.addEventListener('dragover', (e) => {
    e.preventDefault();
    card.classList.add('drag-over');
  });

  card.addEventListener('dragleave', () => {
    card.classList.remove('drag-over');
  });

  card.addEventListener('drop', (e) => {
    e.preventDefault();
    card.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
      } else {
        showError('Please upload a PDF file.');
      }
    }
  });

  // Remove file
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setFile(null);
    fileInput.value = '';
  });
}

function setResumeFile(file) {
  resumeFile = file;
  if (file) {
    resumeFileName.textContent = file.name;
    resumeFileInfo.style.display = 'flex';
    resumeUploadCard.classList.add('has-file');
  } else {
    resumeFileInfo.style.display = 'none';
    resumeUploadCard.classList.remove('has-file');
  }
  updateScreenButton();
}

function setJDFile(file) {
  jdFile = file;
  if (file) {
    jdFileName.textContent = file.name;
    jdFileInfo.style.display = 'flex';
    jdUploadCard.classList.add('has-file');
  } else {
    jdFileInfo.style.display = 'none';
    jdUploadCard.classList.remove('has-file');
  }
  updateScreenButton();
}

setupUploadCard(resumeUploadCard, resumeFileInput, resumeFileInfo, resumeFileName, resumeRemoveBtn, setResumeFile);
setupUploadCard(jdUploadCard, jdFileInput, jdFileInfo, jdFileName, jdRemoveBtn, setJDFile);

// ===== Screen Button State =====
function updateScreenButton() {
  screenBtn.disabled = !(resumeFile && jdFile && apiKeyInput.value.trim());
}

apiKeyInput.addEventListener('input', updateScreenButton);

// ===== Pipeline Steps =====
const steps = ['step-parse-resume', 'step-parse-jd', 'step-agent1', 'step-agent2', 'step-agent3'];

function resetPipeline() {
  steps.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('active', 'done', 'error');
  });
}

function setStepActive(stepId) {
  const el = document.getElementById(stepId);
  el.classList.add('active');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setStepDone(stepId) {
  const el = document.getElementById(stepId);
  el.classList.remove('active');
  el.classList.add('done');
}

function setStepError(stepId) {
  const el = document.getElementById(stepId);
  el.classList.remove('active');
  el.classList.add('error');
}

// ===== Error Handling =====
function showError(message) {
  errorMessage.textContent = message;
  errorSection.style.display = 'block';
  processingSection.style.display = 'none';
}

errorDismissBtn.addEventListener('click', () => {
  errorSection.style.display = 'none';
});

// ===== Results Rendering =====
function renderResults(candidateData, jdData, evaluation) {
  const verdictCard = document.getElementById('verdict-card');
  const verdictBadge = document.getElementById('verdict-badge');
  const verdictIcon = document.getElementById('verdict-icon');
  const verdictText = document.getElementById('verdict-text');
  const verdictReason = document.getElementById('verdict-reason');

  const isSelected = (evaluation.status || '').toLowerCase() === 'selected';

  verdictCard.className = `verdict-card glass-card ${isSelected ? 'selected' : 'rejected'}`;
  verdictIcon.textContent = isSelected ? '✅' : '❌';
  verdictText.textContent = isSelected ? 'SELECTED' : 'REJECTED';
  verdictReason.textContent = evaluation.reason || 'No reason provided.';

  // Render candidate details
  const resumeBody = document.getElementById('resume-details-body');
  resumeBody.innerHTML = '';

  const candidateFields = [
    { label: 'Name', value: candidateData.name },
    { label: 'Email', value: candidateData.email },
    { label: 'Phone', value: candidateData.phone },
    { label: 'Education', value: candidateData.education },
    { label: 'Experience', value: candidateData.work_experience_years != null ? `${candidateData.work_experience_years} years` : 'N/A' },
  ];

  candidateFields.forEach(({ label, value }) => {
    const row = document.createElement('div');
    row.className = 'detail-row';
    row.innerHTML = `
      <span class="detail-label">${label}</span>
      <span class="detail-value">${value || 'N/A'}</span>
    `;
    resumeBody.appendChild(row);
  });

  // Skills
  if (candidateData.skills && candidateData.skills.length) {
    const skillsRow = document.createElement('div');
    skillsRow.className = 'detail-row';
    const matchedSkills = (evaluation.matched_skills || []).map(s => s.toLowerCase());
    skillsRow.innerHTML = `
      <span class="detail-label">Skills</span>
      <div class="skill-tags">
        ${candidateData.skills.map(skill => {
      const isMatch = matchedSkills.includes(skill.toLowerCase());
      return `<span class="skill-tag ${isMatch ? 'match' : ''}">${skill}</span>`;
    }).join('')}
      </div>
    `;
    resumeBody.appendChild(skillsRow);
  }

  // Render JD details
  const jdBody = document.getElementById('jd-details-body');
  jdBody.innerHTML = '';

  const jdFields = [
    { label: 'Min Experience', value: jdData.min_experience_years != null ? `${jdData.min_experience_years} years` : 'N/A' },
    { label: 'Max Experience', value: jdData.max_experience_years != null ? `${jdData.max_experience_years} years` : 'N/A' },
    { label: 'Skills Match', value: evaluation.skills_match_percentage != null ? `${evaluation.skills_match_percentage}%` : 'N/A' },
    { label: 'Experience In Range', value: evaluation.experience_within_range != null ? (evaluation.experience_within_range ? '✅ Yes' : '❌ No') : 'N/A' },
  ];

  jdFields.forEach(({ label, value }) => {
    const row = document.createElement('div');
    row.className = 'detail-row';
    row.innerHTML = `
      <span class="detail-label">${label}</span>
      <span class="detail-value">${value}</span>
    `;
    jdBody.appendChild(row);
  });

  // Required skills
  if (jdData.skills && jdData.skills.length) {
    const skillsRow = document.createElement('div');
    skillsRow.className = 'detail-row';
    const matchedSkills = (evaluation.matched_skills || []).map(s => s.toLowerCase());
    skillsRow.innerHTML = `
      <span class="detail-label">Required Skills</span>
      <div class="skill-tags">
        ${jdData.skills.map(skill => {
      const isMatch = matchedSkills.some(ms => ms.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ms));
      return `<span class="skill-tag ${isMatch ? 'match' : ''}">${skill}</span>`;
    }).join('')}
      </div>
    `;
    jdBody.appendChild(skillsRow);
  }

  // Missing skills
  if (evaluation.missing_skills && evaluation.missing_skills.length) {
    const missingRow = document.createElement('div');
    missingRow.className = 'detail-row';
    missingRow.innerHTML = `
      <span class="detail-label">Missing Skills</span>
      <div class="skill-tags">
        ${evaluation.missing_skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    `;
    jdBody.appendChild(missingRow);
  }

  resultsSection.style.display = 'block';
}

// ===== Main Screening Pipeline =====
screenBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    showError('Please enter your Gemini API key.');
    return;
  }
  if (!resumeFile || !jdFile) {
    showError('Please upload both a Resume and a Job Description PDF.');
    return;
  }

  // Reset UI
  resultsSection.style.display = 'none';
  errorSection.style.display = 'none';
  resetPipeline();
  processingSection.style.display = 'block';
  screenBtn.disabled = true;
  screenBtn.classList.add('loading');
  screenBtn.querySelector('span').textContent = 'Screening...';

  let resumeText, jdText, candidateData, jdData, evaluation;

  try {
    // Step 1: Parse Resume PDF
    setStepActive('step-parse-resume');
    resumeText = await extractTextFromPDF(resumeFile);
    if (!resumeText || resumeText.trim().length < 20) {
      throw new Error('Could not extract meaningful text from the resume PDF. The file might be image-based or corrupt.');
    }
    setStepDone('step-parse-resume');

    // Step 2: Parse JD PDF
    setStepActive('step-parse-jd');
    jdText = await extractTextFromPDF(jdFile);
    if (!jdText || jdText.trim().length < 20) {
      throw new Error('Could not extract meaningful text from the JD PDF. The file might be image-based or corrupt.');
    }
    setStepDone('step-parse-jd');

    // Step 3 & 4: Run Agent 1 and Agent 2 in parallel
    setStepActive('step-agent1');
    setStepActive('step-agent2');

    const [candidateResult, jdResult] = await Promise.all([
      extractResumeData(apiKey, resumeText),
      extractJDData(apiKey, jdText),
    ]);

    candidateData = candidateResult;
    jdData = jdResult;
    setStepDone('step-agent1');
    setStepDone('step-agent2');

    // Step 5: Run Agent 3 - Evaluation
    setStepActive('step-agent3');
    evaluation = await evaluateCandidate(apiKey, candidateData, jdData);
    setStepDone('step-agent3');

    // Show results
    processingSection.style.display = 'none';
    renderResults(candidateData, jdData, evaluation);

  } catch (error) {
    console.error('Screening error:', error);
    // Mark current active steps as error
    steps.forEach(stepId => {
      const el = document.getElementById(stepId);
      if (el.classList.contains('active')) {
        setStepError(stepId);
      }
    });
    showError(error.message || 'An unexpected error occurred during screening.');
  } finally {
    screenBtn.disabled = false;
    screenBtn.classList.remove('loading');
    screenBtn.querySelector('span').textContent = 'Screen Candidate';
    updateScreenButton();
  }
});

// ===== Staggered Animation on Load =====
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.fade-in');
  sections.forEach((section, i) => {
    section.style.animationDelay = `${i * 0.15}s`;
  });
});
