const express = require('express');
const router = express.Router();
const config = require('../config');
const { optionalAuth } = require('../middleware/auth');

// POST /api/ai/tutor (Structured Socratic AI Tutor)
router.post('/tutor', optionalAuth, (req, res) => {
  const { query, topic } = req.body;
  const userQuery = query || topic || 'Explain recursion in simple terms';

  // Topic recognition & structured pedagogical framework
  const qLower = userQuery.toLowerCase();

  let explanationData;

  if (qLower.includes('recur') || qLower.includes('recursive')) {
    explanationData = {
      topic: 'Recursion',
      simpleExplanation: 'Recursion is a programming technique where a function solves a problem by calling a smaller instance of itself until it reaches an explicit termination condition called the base case.',
      analogy: 'Think of looking into two parallel mirrors where each reflection shows a smaller copy of yourself, or a set of Russian Matryoshka nesting dolls that open up until you reach the smallest solid doll in the center.',
      codeExample: `// Classic Factorial via Recursion
function factorial(n) {
  // 1. Base Case: stops infinite loops
  if (n <= 1) return 1;

  // 2. Recursive Case: calls itself with a smaller input
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120 (5 * 4 * 3 * 2 * 1)`,
      practiceQuestion: 'How would you write a recursive function to compute the Nth Fibonacci number (where fib(0)=0, fib(1)=1)?',
      miniQuiz: {
        question: 'What occurs if a recursive function lacks a valid base case?',
        options: [
          'The function executes in O(1) time',
          'A Maximum Call Stack Size Exceeded error (Stack Overflow)',
          'The return value is automatically cast to null',
          'Node.js automatically inserts a loop'
        ],
        correctIndex: 1,
        explanation: 'Each function call consumes a stack frame. Without a terminating base case, the call stack memory fills up, causing a stack overflow.'
      }
    };
  } else if (qLower.includes('event loop') || qLower.includes('node') || qLower.includes('async')) {
    explanationData = {
      topic: 'Node.js Event Loop',
      simpleExplanation: 'The Event Loop is the engine behind Node.js single-threaded non-blocking concurrency model. It continuously checks for pending tasks, offloads blocking operations to libuv threadpools or the OS kernel, and processes completion callbacks.',
      analogy: 'Imagine a busy restaurant head waiter (the main JavaScript thread). Instead of cooking the meals himself, he takes orders from diners and passes the tickets to kitchen line cooks (libuv threadpool). As soon as dishes are ready, the waiter serves them without making other guests wait.',
      codeExample: `console.log('1: Synchronous start');

setTimeout(() => {
  console.log('3: Macrotask timer fired');
}, 0);

Promise.resolve().then(() => {
  console.log('2: Microtask resolved');
});

console.log('4: Synchronous end');

// Output order: 1 -> 4 -> 2 -> 3`,
      practiceQuestion: 'Why does Promise.then execute before setTimeout(..., 0) in Node.js?',
      miniQuiz: {
        question: 'Which phase of the event loop executes setTimeout and setInterval timers?',
        options: ['Poll phase', 'Timers phase', 'Check phase', 'Close callbacks phase'],
        correctIndex: 1,
        explanation: 'The Timers phase executes callbacks scheduled by setTimeout() and setInterval().'
      }
    };
  } else {
    explanationData = {
      topic: userQuery.slice(0, 40),
      simpleExplanation: `In enterprise software engineering, "${userQuery}" is structured around core principles of modularity, data encapsulation, and predictable time/space complexity.`,
      analogy: 'Think of this concept like an assembly line where each workstation executes a deterministic transformation on incoming parameters before passing the state onward.',
      codeExample: `// Clean implementation template
function executeEngine(input) {
  if (!input) throw new Error("Input payload required");
  return { status: "processed", payload: input, timestamp: Date.now() };
}`,
      practiceQuestion: `What edge cases should be evaluated when testing "${userQuery}" in a production CI/CD pipeline?`,
      miniQuiz: {
        question: `What is the primary architectural benefit of isolating "${userQuery}" into a dedicated module?`,
        options: [
          'High cohesion and low coupling',
          'Guaranteed zero memory footprint',
          'Eliminates the need for testing',
          'Allows bypassing network transport'
        ],
        correctIndex: 0,
        explanation: 'Modular encapsulation ensures high cohesion within the module and low coupling with external dependencies.'
      }
    };
  }

  res.json({
    success: true,
    engine: 'Acadex Socratic AI Tutor Engine',
    data: explanationData
  });
});

// POST /api/ai/generate-quiz
router.post('/generate-quiz', optionalAuth, (req, res) => {
  const { topic = 'React Hooks & State', questionCount = 3 } = req.body;

  const generatedQuestions = [
    {
      id: `ai_q_${Date.now()}_1`,
      question: `What is the primary purpose of the dependency array in React's useEffect hook?`,
      options: [
        'To define CSS styles dynamically',
        'To control when the effect re-runs based on state/prop mutations',
        'To bind Redux actions directly to JSX',
        'To allocate memory for the component'
      ],
      correctIndex: 1,
      explanation: 'React compares dependency array elements across renders using Object.is. If values differ, the effect runs again.'
    },
    {
      id: `ai_q_${Date.now()}_2`,
      question: 'Why must React Hook invocations never be placed inside conditionals or loops?',
      options: [
        'To preserve the deterministic calling order React relies upon between renders',
        'Because JavaScript does not allow functions in if statements',
        'To avoid TypeScript compiler errors',
        'Because conditional renders trigger automatic browser reloads'
      ],
      correctIndex: 0,
      explanation: 'React uses the order in which hooks are called to preserve state across multiple component renders.'
    }
  ];

  res.json({
    success: true,
    topic,
    totalQuestions: generatedQuestions.length,
    questions: generatedQuestions
  });
});

// POST /api/ai/study-plan
router.post('/study-plan', optionalAuth, (req, res) => {
  const { targetRole = 'Full Stack & AI Engineer', weeklyHours = 15 } = req.body;

  const milestones = [
    {
      week: 'Weeks 1–2',
      title: 'Advanced JavaScript & Microservice Architecture',
      deliverables: ['Event loop benchmarks', 'Async generators & streams', 'Clean RESTful CRUD with JWT']
    },
    {
      week: 'Weeks 3–4',
      title: 'PostgreSQL Relational Modeling & Prisma ORM',
      deliverables: ['Schema migration scripts', 'Index optimization', 'Deadlock prevention in transactions']
    },
    {
      week: 'Weeks 5–6',
      title: 'Applied AI & LLM Integration',
      deliverables: ['PyTorch tensors', 'Vector embeddings with pgvector', 'RAG pipeline with LangChain']
    },
    {
      week: 'Weeks 7–8',
      title: 'Production DevOps, Docker & CI/CD Pipelines',
      deliverables: ['Multi-stage Docker builds', 'GitHub Actions automated testing', 'Vercel + Railway cloud deployment']
    }
  ];

  res.json({
    success: true,
    targetRole,
    weeklyCommitment: `${weeklyHours} hours/week`,
    totalWeeks: 8,
    milestones
  });
});

module.exports = router;
