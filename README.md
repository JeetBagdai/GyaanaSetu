# 🎓 GyaanaSetu

**🌐 Live Demo:** [https://gyaanasetu.vercel.app](https://gyaanasetu-bnmit.vercel.app/)

> **A Next-Generation, AI-Powered Learning Ecosystem.** 
> Revolutionizing the way students interact with educational material by bridging traditional learning with cutting-edge Cloud Architecture, Computer Vision, and Large Language Models (LLMs).

---

## 🌟 Overview

GyaanaSetu creates a personalized, highly interactive, and engaging learning environment. By combining dynamic frontend experiences with powerful AI backend processing, the platform transforms static curriculum into a conversational and intelligent journey.

---

## 🚀 Key Features

*   📝 **Intelligent Notebook Grading (Computer Vision & LLMs)**  
    Students can handwrite answers in their physical notebooks, snap a picture, and instantly receive intelligent grading. The platform leverages state-of-the-art vision models (**Llama 3.2 Vision** via Groq) to read handwriting, cross-reference it with the expected rubric, and provide granular scoring along with constructive feedback.

*   🤖 **Conversational AI Tutor**  
    A floating, context-aware AI companion powered by **Llama-3.3-70b-versatile**. It helps clarify doubts, explain complex concepts interactively, and acts as an intelligent assistant during study sessions.

*   💻 **CodeIT Integrated Editor**  
    A built-in code editor (powered by Monaco Editor) for programming problems. Supports strict proctoring mode to prevent cheating during lab assessments.

*   📅 **Smart Attendance & Timetable Management**  
    Facilitates digital classrooms with dynamic QR-based attendance tracking and automated timetable generation for seamless scheduling.

*   ☁️ **Serverless Architecture**  
    Fully decentralized and autoscaling backend using **Vercel Serverless Functions** combined with **Firebase** for low-latency, real-time data access.

---

## 🛠️ Architecture & Tech Stack

### Frontend
*   **React + Vite**: Lightning-fast, modern component architecture.
*   **Vanilla CSS**: Custom Glassmorphism UI, smooth micro-animations, and dynamic Dark/Light themes.
*   **Libraries**: `react-pdf` for curriculum delivery, `html5-qrcode` for attendance scanners, `@monaco-editor/react` for the CodeIT environment, and `lucide-react` for iconography.

### Backend API
*   **Vercel Serverless Functions**: Node.js & Express API endpoints hosted natively on Vercel.
*   **Groq API**: Blazing fast AI inference using:
    *   `llama-3.3-70b-versatile` for conversational AI logic and content generation.
    *   `llama-3.2-90b-vision-preview` (or equivalent) for optical character recognition and visual answer evaluation.

### Database & Auth
*   **Firebase Firestore**: Real-time NoSQL database for users, progress tracking, and timetables.
*   **Firebase Authentication**: Secure user identity management.
*   **Firebase Storage**: Scalable asset and PDF curriculum delivery.

---

## 🔒 Security

All sensitive API keys and service account credentials (Firebase Admin, Groq) are securely managed through Vercel Environment Variables and excluded from source control.

---

## 🏃‍♂️ Getting Started (Local Development)

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20+)
*   [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/JeetBagdai/GyaanaSetu.git
   cd GyaanaSetu
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend API Dependencies**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Environment Variables**
   Create a `.env` file in the root directory using `.env.example` as a reference. You will need:
   *   `FIREBASE_SERVICE_ACCOUNT` (or specific key/email variables)
   *   `GROQ_API_KEY` for AI features
   *   Firebase client configuration variables

5. **Run the Full Stack Locally**
   We use Vercel CLI to simultaneously spin up the Vite frontend and the serverless Express API.
   ```bash
   npx vercel dev
   ```
   Open `http://localhost:3000` to view the app.

---

## 🌍 Deployment

This project is configured for seamless deployment on **Vercel**. 
Simply connect your GitHub repository to Vercel, ensuring the Root Directory is set to the project root, and populate the Environment Variables in the Vercel Dashboard. The `vercel.json` configuration handles all API routing automatically.

---

*Built with ❤️ to empower the next generation of learners.*
