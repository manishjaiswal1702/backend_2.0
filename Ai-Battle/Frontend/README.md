# AI Battle Arena

A premium web application that pits two AI models against each other to solve coding challenges. Watch Mistral AI and Cohere AI compete, then get expert judgment from Gemini AI on their solutions.

## ✨ Features

- **AI vs AI Competition**: Two powerful AI models (Mistral and Cohere) generate solutions to your coding problems
- **Expert Judgment**: Gemini AI evaluates and scores both solutions with detailed reasoning
- **Premium UI**: Modern, responsive design with smooth animations and professional styling
- **Dark Mode Support**: Automatic dark/light mode with system preference detection
- **Real-time Loading**: Beautiful loading animations while AI models are processing
- **Code Highlighting**: Syntax-highlighted code blocks with professional styling
- **Markdown Support**: Rich text rendering for AI responses

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-battle-arena
   ```

2. **Install frontend dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the Backend directory with your API keys:
   ```env
   MISTRAL_API_KEY=your_mistral_api_key
   COHERE_API_KEY=your_cohere_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd Backend
   npm run dev
   ```
   The backend will run on http://localhost:3000

2. **Start the frontend (in a new terminal)**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173 (or next available port)

3. **Open your browser** and navigate to the frontend URL

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom premium design system
- **Typography**: Inter font family
- **Icons**: Heroicons
- **Code Highlighting**: Highlight.js
- **Markdown**: React Markdown with GitHub Flavored Markdown support

### Backend (Node.js + TypeScript)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **AI Integration**: LangGraph for orchestrating AI model interactions
- **Models**:
  - Mistral AI (Solution 1)
  - Cohere AI (Solution 2)
  - Gemini AI (Judge)

## 🎨 Design System

The application features a premium design system with:

- **Color Palette**: Professional slate/blue gradient backgrounds
- **Typography**: Inter font with optimized line heights
- **Shadows**: Subtle, layered shadows for depth
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design that works on all devices
- **Accessibility**: High contrast ratios and keyboard navigation

## 🔧 API Endpoints

### POST /invoke
Generates AI solutions and judgment for a coding problem.

**Request Body:**
```json
{
  "input": "Write a function to calculate fibonacci numbers"
}
```

**Response:**
```json
{
  "message": "Graph executed successfully",
  "success": true,
  "result": {
    "solution_1": "AI-generated solution...",
    "solution_2": "AI-generated solution...",
    "judge": {
      "solution_1_score": 9,
      "solution_2_score": 8,
      "solution_1_reasoning": "Detailed reasoning...",
      "solution_2_reasoning": "Detailed reasoning..."
    }
  }
}
```

## 📱 Usage

1. Enter a coding challenge in the input field
2. Click the send button or press Enter
3. Watch as two AI models generate solutions
4. Review the judge's evaluation and scoring
5. Compare the approaches and learn from the analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
