# 🤖 AI Resume Screener

> **Intelligent, AI-powered resume screening** — Match candidates to job descriptions instantly using Google Gemini's Generative AI.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## ✨ Overview

**AI Resume Screener** is a web application that automates the resume screening process using a multi-agent AI pipeline. Upload a resume and a job description (both as PDFs), and the app will extract, analyze, and evaluate the candidate's fit — all powered by **Google Gemini AI**.

Perfect for recruiters, hiring managers, and HR teams looking to save time on initial candidate screening.

---

## 🚀 Features

- **📄 PDF Parsing** — Extracts text from resume and job description PDFs directly in the browser using PDF.js.
- **🧠 Multi-Agent AI Pipeline** — Three specialized AI agents work in sequence:
  | Agent | Role |
  |-------|------|
  | **Agent 1 — Resume Extractor** | Extracts candidate details: name, skills, experience, education, certifications, and more. |
  | **Agent 2 — JD Extractor** | Parses job requirements: role, required skills, experience level, qualifications, and responsibilities. |
  | **Agent 3 — Candidate Evaluator** | Compares candidate profile against job requirements and produces a fit evaluation with a verdict. |
- **✅ Instant Verdict** — Get a clear **Shortlist / Reject / Maybe** recommendation with detailed reasoning.
- **📊 Detailed Breakdown** — View extracted candidate profiles and job requirements side-by-side.
- **🎨 Modern UI** — Glassmorphism design with smooth animations, dark theme, and responsive layout.
- **🔒 Privacy-First** — All processing happens client-side. Your API key and documents never touch a server.
- **⚡ Drag & Drop** — Intuitive file upload with drag-and-drop support.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite** | Build tool & dev server |
| **Vanilla JavaScript** | Application logic (ES Modules) |
| **CSS3** | Glassmorphism UI, animations, responsive design |
| **Google Gemini API** | Generative AI for extraction & evaluation |
| **PDF.js** | Client-side PDF text extraction |

---

## 📁 Project Structure

```
Resume-Shortlister/
├── index.html                  # Main HTML page
├── package.json                # Project dependencies
├── .gitignore
├── public/                     # Static assets
└── src/
    ├── main.js                 # App orchestrator & pipeline logic
    ├── gemini-api.js           # Google Gemini API integration
    ├── pdf-parser.js           # PDF text extraction utility
    ├── agents/
    │   ├── resume-extractor.js # Agent 1: Resume data extraction
    │   ├── jd-extractor.js     # Agent 2: Job description extraction
    │   └── candidate-evaluator.js # Agent 3: Candidate evaluation
    └── styles/
        └── index.css           # Full design system & styling
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/Krishna2405/Resume-Shortlister.git
cd Resume-Shortlister

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Usage

1. **Enter your Gemini API key** in the configuration section.
2. **Upload a resume** (PDF format) by dragging & dropping or clicking the upload card.
3. **Upload a job description** (PDF format) in the same way.
4. **Click "Screen Candidate"** and watch the AI pipeline process your documents.
5. **Review the results** — verdict, candidate profile, and job requirements breakdown.

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

---

## 🧩 How It Works

```
┌─────────────┐    ┌──────────────┐
│  Resume PDF  │    │    JD PDF     │
└──────┬───────┘    └──────┬───────┘
       │                   │
       ▼                   ▼
  ┌─────────┐        ┌─────────┐
  │ PDF.js  │        │ PDF.js  │
  │ Parser  │        │ Parser  │
  └────┬────┘        └────┬────┘
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────┐
│   Agent 1    │   │   Agent 2    │
│   Resume     │   │     JD       │
│  Extractor   │   │  Extractor   │
└──────┬───────┘   └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
        ┌────────────────┐
        │    Agent 3     │
        │   Candidate    │
        │   Evaluator    │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │    Verdict     │
        │ Shortlist /    │
        │ Reject / Maybe │
        └────────────────┘
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for powering the AI agents
- [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla for client-side PDF parsing
- [Vite](https://vitejs.dev/) for the lightning-fast build tooling

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Krishna2405">Krishna2405</a>
</p>
