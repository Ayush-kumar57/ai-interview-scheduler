# 🗺️ AI Interview Planner & Report Generator

An automated, full-stack web application that acts as an AI-powered technical career assistant. The application analyzes a user's resume alongside their self-description and a specific job description to generate highly tailored interview preparation reports, complete with matching scores, customized technical/behavioral questions, skill gap analysis, and an actionable day-wise roadmap.

---

## 🚀 Features

* **Resume Parsing & Analyzer:** Automatically extracts content from uploaded PDF resumes.
* **AI-Powered Insights:** Leverages Gemini AI (`gemini-2.5-flash`) to run intelligent alignment algorithms.
* **Detailed Analytics Dashboard:**
    * 📊 **Match Score:** A percentage matrix indicating how well the profile aligns with the target job.
    * ❤️ **Technical Deep-Dive:** Targeted conceptual and coding questions, along with the interviewer's hidden intent and ideal structural answers.
    * 📋 **Behavioral Strategy:** Situation-based culture fit questions based on real project experiences.
    * ⚠️ **Skill Gap Tracker:** Real-time extraction of weak technical domains categorized by low, medium, and high severities.
    * 🗺️ **Day-by-Day Roadmap:** Fully detailed task breakdown schedules to systematically bridge the identified knowledge gaps.
* **Clean Monorepo Architecture:** Seamless state decoupling between the React-Vite UI pipeline and the Node-Express backend middleware.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React.js, JavaScript (ES6+)
* **Tooling:** Vite
* **Styling:** SCSS / SASS (Modular layout structures)
* **HTTP Client:** Axios (With custom context hooks)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **File Handling:** Multer (Memory buffers for seamless streaming)
* **Text Extraction:** PDF-Parse middleware
* **AI Core Engine:** Google Gen AI SDK (`@google/genai` utilizing structured Zod schemas)

---

## 📁 Repository Structure

```text
Gen AI/
├── Backend/          # Node.js + Express + Mongoose server logic
│   ├── controllers/  # API Controllers handling routing execution
│   ├── middlewares/  # Authentication & File stream filters
│   ├── models/       # Mongoose schemas enforcing structured storage
│   ├── services/     # AI Core prompt validation utilities
│   └── server.js     # Server entry point
└── Frontend/         # React + Vite client interface
    ├── src/
    │   ├── components/
