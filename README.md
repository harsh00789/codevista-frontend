# CodeVista Frontend 🚀

CodeVista is a premium, interactive platform for visualizing Data Structures, Algorithms, and System Design architectures.

## ✨ Features

- **DSA Visualizer**: Real-time visualization of algorithms like Bubble Sort with step-by-step execution.
- **LeetCode Solver**: Visual walkthroughs of popular coding problems like Two Sum.
- **System Design**: Interactive architecture diagrams for complex systems (e.g., URL Shortener) using React Flow.
- **Deep Insights**: Each visualization includes live code snippets, detailed explanations, and visual complexity analysis.
- **Modern UI**: A sleek, glassmorphic design built with Framer Motion and custom CSS tokens.

## 🛠️ Technology Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visualizations**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd projects/codevista/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

- `src/pages`: Main feature pages (BubbleSort, Two Sum, SystemDesign).
- `src/components`: Reusable UI components (ArrayVisualizer, ComplexityChart).
- `src/api`: Axios instance and backend communication logic.
- `src/index.css`: Global design system and premium styling.
