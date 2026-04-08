# AI Battle Arena

A cutting-edge web application that pits advanced AI models against each other to solve coding challenges. Watch Mistral AI and Cohere AI compete in real-time, then receive expert evaluation from Gemini AI. Built with modern technologies and featuring a premium, professional user interface.

![AI Battle Arena](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-TypeScript-green)

## 🚀 Overview

AI Battle Arena is an innovative platform designed for developers and coding enthusiasts to:
- **Compare AI Solutions**: See how different AI models approach the same coding problem
- **Learn Best Practices**: Understand different coding paradigms and optimization techniques
- **Get Expert Judgment**: Receive detailed analysis and scoring from a third AI
- **Improve Coding Skills**: Learn from real-time AI-generated solutions

## ✨ Key Features

### For End Users
- **AI vs AI Competitions**: Two AI models generate solutions simultaneously
- **Expert Judgment**: Independent AI evaluates and scores both solutions
- **Real-time Processing**: Live loading indicators and smooth animations
- **Code Highlighting**: Professional syntax highlighting for multiple languages
- **Dark Mode Support**: Automatic dark/light theme with system preference detection
- **Responsive Design**: Full mobile and desktop support
- **Rich Markdown Support**: Beautiful rendering of AI responses with GitHub-flavored markdown

### For Developers
- **Clean Architecture**: Separated frontend and backend with clear responsibilities
- **Type Safety**: Full TypeScript support in backend
- **LangGraph Integration**: Advanced AI orchestration with state management
- **CORS Enabled**: Ready for cross-origin requests
- **Error Handling**: Comprehensive error management
- **Scalable Design**: Built for easy expansion and new AI models

## 📦 Technology Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Typography**: Inter Font Family
- **Code Highlighting**: Highlight.js with Atom One Dark theme
- **Markdown**: React Markdown with GitHub Flavored Markdown (GFM)
- **HTTP Client**: Axios
- **Package Manager**: npm

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **AI Orchestration**: LangGraph
- **AI Models**:
  - Mistral AI (Solution 1 generation)
  - Cohere AI (Solution 2 generation)
  - Gemini AI (Solution evaluation)
- **Development**: tsx watch for hot reloading
- **Environment**: dotenv for configuration

## 🏗️ Project Structure

```
ai-battle-arena/
├── Frontend/                          # React frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx               # Main App component
│   │   │   ├── App.css               # Global styles with animations
│   │   │   └── components/
│   │   │       ├── ChatInterface.jsx # Main chat container
│   │   │       ├── UserMessage.jsx   # User message component
│   │   │       └── ArenaResponse.jsx # AI solutions display
│   │   └── main.jsx                  # React entry point
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── README.md                    # Frontend-specific docs
│
├── Backend/                          # Node.js backend server
│   ├── src/
│   │   ├── app.ts                   # Express app configuration
│   │   └── ai/
│   │       ├── graph.ai.ts          # LangGraph orchestration
│   │       └── model.ai.ts          # AI model initialization
│   ├── server.ts                    # Server entry point
│   ├── package.json                 # Backend dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   └── .env                        # Environment variables
│
└── README.md                        # This file
```

## 🔧 Installation

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git**

You'll also need API keys from:
- Mistral AI (https://console.mistral.ai)
- Cohere AI (https://dashboard.cohere.com)
- Google Gemini AI (https://makersuite.google.com)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd ai-battle-arena
```

### Step 2: Setup Backend

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your API keys:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Setup Frontend

```bash
cd ../Frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Development Mode

#### Terminal 1: Start Backend Server
```bash
cd Backend
npm run dev
```
The backend will start on **http://localhost:3000**

#### Terminal 2: Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
The frontend will start on **http://localhost:5173** (or next available port)

### Open Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build

```bash
# Build frontend
cd Frontend
npm run build

# Output will be in Frontend/dist/
```

## 📚 API Documentation

### POST /invoke

Generates AI solutions and receives expert judgment for a coding problem.

**Endpoint**: `http://localhost:3000/invoke`

**Request Body**:
```json
{
  "input": "Write a function to calculate factorial in JavaScript"
}
```

**Response Success (200)**:
```json
{
  "message": "Graph executed successfully",
  "success": true,
  "result": {
    "solution_1": "Here is a clean solution...",
    "solution_2": "An alternative approach...",
    "judge": {
      "solution_1_score": 9,
      "solution_2_score": 7,
      "solution_1_reasoning": "Excellent solution with optimal time and space complexity.",
      "solution_2_reasoning": "Good approach but uses more memory."
    }
  }
}
```

**Response Error (500)**:
```json
{
  "message": "Error message",
  "success": false
}
```

### GET /

Health check endpoint that returns a test response.

**Endpoint**: `http://localhost:3000/`

**Response**:
```json
{
  "message": "Graph executed successfully",
  "success": true,
  "result": { ... }
}
```

## 🎨 Design System

The application implements a premium, modern design system:

### Color Palette
- **Primary**: Blue gradient (600 → Indigo 600)
- **Secondary**: Emerald (for Solution 1), Violet (for Solution 2)
- **Accent**: Amber/Orange (for Judge)
- **Neutral**: Slate (50 → 950)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Sizes**: 
  - Title: 2xl - 3xl (32px - 48px)
  - Heading: lg - xl (18px - 20px)
  - Body: base - lg (16px - 18px)
  - Small: sm - xs (14px - 12px)

### Components
- **Cards**: Rounded corners (3xl), subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Inputs**: Border-based design, focus rings, placeholder styling
- **Code Blocks**: Dark background with language-specific highlighting
- **Animations**: Smooth fade-in and slide-up effects

## 📊 Application Flow

```
User Input
    ↓
[ChatInterface Component]
    ↓
POST /invoke API Call
    ↓
[Backend - Graph Execution]
    ├─ Solution Node
    │  ├─ Mistral AI (async)
    │  └─ Cohere AI (async)
    ↓
[Judge Node]
    └─ Gemini AI Evaluation
    ↓
Response to Frontend
    ↓
[ArenaResponse Component]
    ├─ Display Solution 1
    ├─ Display Solution 2
    └─ Display Judge Verdict
```

## ⚙️ Configuration

### Backend Configuration

The backend can be configured through environment variables:

```env
# API Keys (Required)
MISTRAL_API_KEY=xxx
COHERE_API_KEY=xxx
GEMINI_API_KEY=xxx

# Server (Optional)
PORT=3000
NODE_ENV=development
```

### Frontend Configuration

Environment-specific settings can be added to `.env` files:

```env
VITE_API_URL=http://localhost:3000
```

## 🧪 Testing

### Frontend Linting

```bash
cd Frontend
npm run lint
```

### Build Verification

```bash
cd Frontend
npm run build
```

## 📝 Code Examples

### Using the API with JavaScript

```javascript
const askQuestion = async (problem) => {
  try {
    const response = await fetch('http://localhost:3000/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: problem })
    });
    
    const data = await response.json();
    console.log(data.result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
askQuestion('Write a quicksort algorithm');
```

### Using with Axios (as in the app)

```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/invoke', {
  input: 'Write a function to find prime numbers'
});

const { solution_1, solution_2, judge } = response.data.result;
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in code
```

### API Keys Not Working

- Verify keys are correctly set in `.env`
- Check that API keys have appropriate permissions
- Ensure keys are not expired or revoked

### CORS Errors

The backend is configured to accept requests from `http://localhost:5173`. If you're running on a different port, update the CORS configuration in `Backend/src/app.ts`:

```typescript
app.use(cors({
    origin: "http://localhost:YOUR_PORT",
    methods: ["GET", "POST"],
    credentials: true,
}))
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
cd Backend
rm -rf node_modules
npm install

cd ../Frontend
rm -rf node_modules
npm install
```

## 🚀 Performance Optimization

### Frontend
- **Code Splitting**: Vite automatically handles route-based code splitting
- **Lazy Loading**: Large components can be lazy-loaded
- **Production Build**: Use `npm run build` for optimized bundle
- **Asset Optimization**: Vite automatically optimizes images and assets

### Backend
- **Parallel Processing**: AI calls are made in parallel using `Promise.all()`
- **Connection Pooling**: Express handles request pooling efficiently
- **Response Compression**: Consider adding compression middleware

## 📈 Scaling Considerations

To scale the application:

1. **Add Load Balancer**: Deploy multiple backend instances
2. **Database Integration**: Store conversation history
3. **Caching**: Implement Redis for common queries
4. **Queue System**: Use Bullmq or RabbitMQ for complex operations
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Authentication**: Add user authentication and authorization

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure ESLint passes (`npm run lint`)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing frontend framework
- **Vite**: For the lightning-fast build tool
- **Tailwind CSS**: For utility-first CSS framework
- **LangGraph**: For AI orchestration capabilities
- **Express.js**: For the robust backend framework

## 📞 Support

For support, issues, or questions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and environment details
4. Provide steps to reproduce the issue

## 🔐 Security

- Never commit API keys to version control
- Use `.env` files for sensitive information
- Keep dependencies updated: `npm audit fix`
- Validate all user inputs
- Use HTTPS in production

## 🌟 Roadmap

Future features and improvements:

- [ ] User authentication and profiles
- [ ] Conversation history and saving
- [ ] Multiple language support
- [ ] Leaderboard and statistics
- [ ] Custom AI model selection
- [ ] Real-time collaboration
- [ ] Advanced code analysis
- [ ] Performance benchmarking
- [ ] Export solutions as files
- [ ] Integration with code editors

## 📊 Stats

- **Lines of Code**: 2000+
- **Components**: 5 (Frontend)
- **API Endpoints**: 2
- **AI Models Integrated**: 3
- **Dependencies**: 20+
- **Supported Themes**: 2 (Light/Dark)

---

**Made with ❤️ by the AI Battle Arena Team**

**Last Updated**: April 2026
**Version**: 1.0.0
