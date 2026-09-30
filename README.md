# AAS — Anatomic Agentic System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-green.svg)](https://threejs.org/)

**AAS (Anatomic Agentic System)** is an interactive, browser-based 3D learning platform that transforms abstract medical knowledge into observable, decomposable, and verifiable learning experiences. 

Currently featuring medical anatomy as its flagship discipline, AAS is built to be a highly polished, discipline-agnostic education engine. It connects raw 3D WebGL interactions with structured pedagogy (learning objectives, guided activities, and assessments).

---

## ✨ Key Features

- **High-Fidelity 3D Exploration**: Smooth rotation, zooming, and panning of anatomical structures using optimized Meshopt files.
- **Advanced Model Interaction**:
  - **Semantic Selection**: Click on specific meshes to highlight and focus on distinct anatomical parts.
  - **Real Clipping Planes**: Dynamic cross-sectioning (cutting) of models to inspect internal geometries and cavities.
  - **Auto-Rotation & Focus**: Guided camera states and automated model inspection.
- **Structured Learning Lessons**: Go beyond free exploration with guided paths. AAS includes a complete heart lesson that bridges 3D structural locating, section observation, and knowledge assessment (quizzes).
- **Rich Medical Data Layer**: English content, functional descriptions, clinical facts, anatomical labels, and contextual quizzes natively bound to the 3D objects.
- **Modern UI/UX Workspace**:
  - A responsive, dark-mode prioritized 3D workspace.
  - Search functionality, system-level filtering (Cardiovascular, Nervous, Respiratory, etc.), and local favorites management.
  - Accessible fallback rendering for environments where WebGL is unavailable.
  - Respects OS-level `prefers-reduced-motion` settings.

## 🏗️ Architecture & Tech Stack

AAS is engineered as a clean-room implementation optimized for performance and Cloudflare-compatible worker deployment. 

- **Framework**: Next.js 16 + React 19 (using `vinext` and `Vite`)
- **3D Engine**: Three.js, React Three Fiber (R3F), and `@react-three/drei`
- **Typing**: Strict TypeScript definitions enforcing a robust, discipline-agnostic learning contract (`LearningTopic`, `LearningLesson`, `LearningActivity`, `LearningAssessment`).
- **Styling**: Modular CSS (`globals.css`) structured around a custom design system ("Swiss Editorial" + "Soft Docs" principles).
- **State**: React hooks with `localStorage` persistence for progress and user settings.

## 🚀 Setup & Local Development

### Requirements
- Node.js `22.13` or newer
- npm or yarn

### Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-org/aas.git
cd aas
npm install
```

### Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The application will hot-reload as you make changes.

### Build & Quality Checks
To verify types, linting, and build the production bundle:
```bash
npm run check
npm run build
```

## 🎮 Usage & Controls

- **Left-Click + Drag**: Rotate the camera around the specimen.
- **Scroll Wheel**: Zoom in and out.
- **Keyboard Shortcuts**:
  - `J` / `K`: Switch between previous and next organs.
  - `Spacebar`: Toggle auto-rotation.
  - `Escape`: Close modals (sources, quizzes).
- **Bottom Control Bar**: Toggle labels, enable the clipping/section slider, and reset the view.

## 🗺️ Project Status

AAS successfully validates its core pedagogical contract through the medical anatomy flagship discipline (specifically the fully integrated guided heart lesson). 

**Immediate Roadmap**:
- Expanding fact-level citations and metadata for all 13 included models.
- Deepening the guided lesson catalog across other cardiovascular and neurological organs.
- Validating the discipline-agnostic nature of the platform by introducing a second scientific discipline.

## ⚖️ Licensing & Attribution

- **Source Code**: MIT License.
- **3D Assets**: The 12 binary `.glb` 3D models in `public/models/` are third-party data sourced from the Human Reference Atlas and are licensed under **CC BY 4.0**.

> **Disclaimer**: This application is built strictly for educational purposes and anatomical learning. It is **not** a diagnostic tool and does not replace professional medical advice, clinician consultation, or certified medical training.
