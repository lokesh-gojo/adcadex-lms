/* ============================================================
   Prime Vector LMS — quiz.js  (Quiz Engine)
   ============================================================ */

const QUIZZES = {
  1: {
    id: 1,
    title: 'JavaScript Fundamentals',
    course: 'Web Development',
    timeLimit: 600, // 10 minutes
    passing: 70,
    questions: [
      {
        id: 1,
        text: 'Which of the following is used to declare a variable in modern JavaScript?',
        options: ['var', 'let', 'const', 'Both let and const'],
        correct: 3,
        explanation: 'Both `let` and `const` are used in modern JS. `const` for immutable, `let` for mutable bindings.'
      },
      {
        id: 2,
        text: 'What does the `===` operator do?',
        options: ['Assigns a value', 'Compares value only', 'Compares value and type', 'Logical AND'],
        correct: 2,
        explanation: '`===` is the strict equality operator — it checks both value AND type without coercion.'
      },
      {
        id: 3,
        text: 'Which method is used to add an element to the END of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correct: 0,
        explanation: '`push()` adds elements to the end of an array and returns the new length.'
      },
      {
        id: 4,
        text: 'What will `typeof null` return?',
        options: ['"null"', '"undefined"', '"object"', '"string"'],
        correct: 2,
        explanation: 'This is a famous JavaScript quirk — `typeof null` returns `"object"` due to a legacy bug.'
      },
      {
        id: 5,
        text: 'Which of the following is NOT a valid way to create a function?',
        options: ['function myFunc() {}', 'const myFunc = () => {}', 'const myFunc = function() {}', 'function = myFunc() {}'],
        correct: 3,
        explanation: '`function = myFunc() {}` is not valid JavaScript syntax.'
      },
      {
        id: 6,
        text: 'What does `Array.prototype.map()` return?',
        options: ['The original array', 'A new array', 'undefined', 'A number'],
        correct: 1,
        explanation: '`.map()` creates and returns a NEW array with each element transformed by the callback.'
      },
      {
        id: 7,
        text: 'What is a Promise in JavaScript?',
        options: [
          'A synchronous function',
          'An object representing the eventual completion of an async operation',
          'A type of loop',
          'A data structure'
        ],
        correct: 1,
        explanation: 'A Promise represents an asynchronous operation that will either resolve or reject.'
      },
      {
        id: 8,
        text: 'Which keyword is used to handle errors in async/await?',
        options: ['catch', 'try/catch', 'error', 'handle'],
        correct: 1,
        explanation: '`try/catch` blocks are used with async/await to handle rejected promises.'
      },
      {
        id: 9,
        text: 'What does `JSON.stringify()` do?',
        options: [
          'Parses a JSON string',
          'Converts a JavaScript object to a JSON string',
          'Validates JSON data',
          'Deletes JSON properties'
        ],
        correct: 1,
        explanation: '`JSON.stringify()` serializes a JS value into a JSON-formatted string.'
      },
      {
        id: 10,
        text: 'What is the output of: `console.log(0.1 + 0.2 === 0.3)`?',
        options: ['true', 'false', 'undefined', 'Error'],
        correct: 1,
        explanation: 'Due to floating point precision, `0.1 + 0.2` equals `0.30000000000000004`, not `0.3`.'
      }
    ]
  }
};

// ── Quiz State ─────────────────────────────────────────────────
let quizState = {
  quiz: null,
  currentQ: 0,
  answers: [],
  startTime: null,
  timerInterval: null,
  timeLeft: 0,
  finished: false
};

// ── Load Quiz ─────────────────────────────────────────────────
function loadQuiz(quizId = 1) {
  quizState.quiz = QUIZZES[quizId] || QUIZZES[1];
  quizState.answers = new Array(quizState.quiz.questions.length).fill(null);
  quizState.currentQ = 0;
  quizState.timeLeft = quizState.quiz.timeLimit;
  quizState.finished = false;
  quizState.startTime = Date.now();

  renderQuestion();
  startTimer();
  renderQuestionNav();
}

// ── Render Question ───────────────────────────────────────────
function renderQuestion() {
  const q   = quizState.quiz.questions[quizState.currentQ];
  const num = quizState.currentQ + 1;
  const tot = quizState.quiz.questions.length;

  // Progress
  const progressBar = document.getElementById('quizProgressBar');
  const progressText = document.getElementById('quizProgressText');
  if (progressBar)  progressBar.style.width = `${(num / tot) * 100}%`;
  if (progressText) progressText.textContent = `Question ${num} of ${tot}`;

  // Question
  const qNum  = document.getElementById('questionNumber');
  const qText = document.getElementById('questionText');
  if (qNum)  qNum.textContent  = `Question ${num}`;
  if (qText) qText.textContent = q.text;

  // Options
  const optionsContainer = document.getElementById('optionsContainer');
  if (!optionsContainer) return;

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const selected = quizState.answers[quizState.currentQ];

  optionsContainer.innerHTML = q.options.map((opt, i) => `
    <div class="quiz-option ${selected === i ? 'selected' : ''}"
         onclick="selectOption(${i})" id="option-${i}">
      <div class="option-letter">${letters[i]}</div>
      <div class="option-text">${opt}</div>
    </div>
  `).join('');

  // Nav buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) {
    prevBtn.disabled = quizState.currentQ === 0;
    prevBtn.style.opacity = quizState.currentQ === 0 ? '0.4' : '1';
  }
  if (nextBtn) {
    nextBtn.textContent = quizState.currentQ === tot - 1 ? 'Submit Quiz' : 'Next →';
  }

  // Update nav dots
  renderQuestionNav();
}

// ── Select Option ─────────────────────────────────────────────
function selectOption(idx) {
  if (quizState.finished) return;
  quizState.answers[quizState.currentQ] = idx;
  renderQuestion();
}

// ── Navigate Questions ─────────────────────────────────────────
function nextQuestion() {
  const tot = quizState.quiz.questions.length;

  if (quizState.currentQ === tot - 1) {
    finishQuiz();
    return;
  }

  quizState.currentQ++;
  renderQuestion();
}

function prevQuestion() {
  if (quizState.currentQ > 0) {
    quizState.currentQ--;
    renderQuestion();
  }
}

function goToQuestion(idx) {
  quizState.currentQ = idx;
  renderQuestion();
}

// ── Question Navigation Dots ──────────────────────────────────
function renderQuestionNav() {
  const nav = document.getElementById('questionNav');
  if (!nav) return;

  nav.innerHTML = quizState.quiz.questions.map((_, i) => {
    const answered = quizState.answers[i] !== null;
    const current  = i === quizState.currentQ;
    return `
      <button class="q-nav-dot ${current ? 'current' : ''} ${answered ? 'answered' : ''}"
              onclick="goToQuestion(${i})"
              title="Question ${i + 1}"
              style="
                width:32px;height:32px;border-radius:50%;font-size:0.75rem;font-weight:700;
                border:2px solid ${current ? 'var(--primary)' : answered ? 'var(--success)' : 'var(--border)'};
                background:${current ? 'var(--primary)' : answered ? 'var(--success-light)' : 'var(--bg)'};
                color:${current ? '#fff' : answered ? 'var(--success)' : 'var(--text-muted)'};
                cursor:pointer;transition:all 0.2s;
              ">
        ${i + 1}
      </button>
    `;
  }).join('');
}

// ── Timer ─────────────────────────────────────────────────────
function startTimer() {
  const timerEl = document.getElementById('quizTimer');
  if (!timerEl) return;

  clearInterval(quizState.timerInterval);
  quizState.timerInterval = setInterval(() => {
    quizState.timeLeft--;

    const m = Math.floor(quizState.timeLeft / 60);
    const s = quizState.timeLeft % 60;
    timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    if (quizState.timeLeft <= 60) timerEl.parentElement?.classList.add('warning');
    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timerInterval);
      Toast.warning('Time\'s Up!', 'Quiz submitted automatically');
      finishQuiz();
    }
  }, 1000);
}

// ── Finish Quiz ───────────────────────────────────────────────
function finishQuiz() {
  clearInterval(quizState.timerInterval);
  quizState.finished = true;

  const quiz    = quizState.quiz;
  const answers = quizState.answers;
  let correct   = 0;

  answers.forEach((ans, i) => {
    if (ans === quiz.questions[i].correct) correct++;
  });

  const score   = Math.round((correct / quiz.questions.length) * 100);
  const passed  = score >= quiz.passing;
  const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  // Save result
  const history = Store.get('quiz_history', []);
  history.push({
    quizId: quiz.id,
    title: quiz.title,
    course: quiz.course,
    score,
    correct,
    total: quiz.questions.length,
    passed,
    date: new Date().toISOString()
  });
  Store.set('quiz_history', history);

  // Show results
  const quizBody    = document.getElementById('quizBody');
  const quizResults = document.getElementById('quizResults');

  if (quizBody)    quizBody.style.display = 'none';
  if (quizResults) quizResults.style.display = 'block';

  // Populate results
  const scoreEl   = document.getElementById('finalScore');
  const msgEl     = document.getElementById('resultMessage');
  const correctEl = document.getElementById('correctCount');
  const wrongEl   = document.getElementById('wrongCount');
  const timeEl    = document.getElementById('timeTaken');

  if (scoreEl) {
    scoreEl.textContent = score + '%';
    scoreEl.closest('.score-ring')?.classList.add(passed ? 'pass' : 'fail');
  }
  if (msgEl)     msgEl.textContent = passed ? '🎉 Congratulations! You passed!' : '😕 Keep practicing — you got this!';
  if (correctEl) correctEl.textContent = correct;
  if (wrongEl)   wrongEl.textContent   = quiz.questions.length - correct;
  if (timeEl)    timeEl.textContent    = `${minutes}m ${seconds}s`;

  // Review answers
  renderReview();
}

// ── Review Answers ─────────────────────────────────────────────
function renderReview() {
  const reviewContainer = document.getElementById('reviewContainer');
  if (!reviewContainer) return;

  const quiz    = quizState.quiz;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  reviewContainer.innerHTML = quiz.questions.map((q, i) => {
    const userAnswer    = quizState.answers[i];
    const correctAnswer = q.correct;
    const isCorrect     = userAnswer === correctAnswer;

    return `
      <div class="card" style="margin-bottom:16px">
        <div class="card-body">
          <div class="flex items-center gap-12" style="margin-bottom:16px">
            <span class="badge badge-${isCorrect ? 'success' : 'danger'}">
              Q${i + 1}
            </span>
            <p style="margin:0;font-weight:600;color:var(--text)">${q.text}</p>
            <span style="margin-left:auto">
              <i class="fa ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"
                 style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-size:1.25rem"></i>
            </span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
            ${q.options.map((opt, j) => `
              <div style="
                display:flex;align-items:center;gap:10px;padding:10px 14px;
                border-radius:var(--radius);font-size:0.875rem;
                background:${j === correctAnswer ? 'var(--success-light)' : (j === userAnswer && !isCorrect) ? 'var(--danger-light)' : 'var(--bg)'};
                border:1px solid ${j === correctAnswer ? 'var(--success)' : (j === userAnswer && !isCorrect) ? 'var(--danger)' : 'var(--border)'};
                color:${j === correctAnswer ? 'var(--success)' : (j === userAnswer && !isCorrect) ? 'var(--danger)' : 'var(--text)'};
              ">
                <span style="font-weight:700;min-width:24px">${letters[j]}.</span>
                <span>${opt}</span>
                ${j === correctAnswer ? '<span style="margin-left:auto;font-size:0.75rem;font-weight:700">✓ Correct</span>' : ''}
                ${j === userAnswer && !isCorrect ? '<span style="margin-left:auto;font-size:0.75rem;font-weight:700">✗ Your answer</span>' : ''}
              </div>
            `).join('')}
          </div>
          <div style="padding:12px;background:rgba(37,99,235,0.06);border-radius:var(--radius);font-size:0.85rem;color:var(--text-muted);border-left:3px solid var(--primary)">
            <strong style="color:var(--primary)">Explanation:</strong> ${q.explanation}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Retry Quiz ────────────────────────────────────────────────
function retryQuiz() {
  const quizBody    = document.getElementById('quizBody');
  const quizResults = document.getElementById('quizResults');
  if (quizBody)    quizBody.style.display = 'block';
  if (quizResults) quizResults.style.display = 'none';

  if (activeQuizMode === 'online') {
    generateNewOnlineQuiz();
  } else {
    loadQuiz(quizState.quiz.id);
  }
}

// ── Online Quiz Bank Mode Switcher & Generator ────────────────
let activeQuizMode = 'online';

function switchQuizMode(mode) {
  activeQuizMode = mode;
  const courseBtn = document.getElementById('bankCourseBtn');
  const onlineBtn = document.getElementById('bankOnlineBtn');
  const controls  = document.getElementById('onlineQuizControls');
  const badge     = document.getElementById('quizSourceBadge');

  if (mode === 'online') {
    if (onlineBtn) onlineBtn.className = 'btn btn-sm btn-primary';
    if (courseBtn) courseBtn.className = 'btn btn-sm btn-ghost';
    if (controls)  controls.style.display = 'flex';
    if (badge)     badge.textContent = '🌐 Source: Open Trivia DB Live API';
    generateNewOnlineQuiz();
  } else {
    if (courseBtn) courseBtn.className = 'btn btn-sm btn-primary';
    if (onlineBtn) onlineBtn.className = 'btn btn-sm btn-ghost';
    if (controls)  controls.style.display = 'none';
    if (badge)     badge.textContent = '⚡ Source: Prime Vector Module Assessment';
    loadQuiz(1);
  }
}

async function generateNewOnlineQuiz() {
  const icon = document.getElementById('genQuizIcon');
  if (icon) icon.className = 'fa fa-refresh fa-spin';
  
  const diffSelect = document.getElementById('onlineDifficultySelect');
  const difficulty = diffSelect ? diffSelect.value : 'medium';

  const badge = document.getElementById('quizSourceBadge');
  if (badge) badge.textContent = `🌐 Fetching ${difficulty.toUpperCase()} questions from Open Trivia DB...`;

  try {
    if (window.OnlineData) {
      const dynamicQuiz = await OnlineData.fetchDynamicQuiz({ amount: 10, difficulty });
      
      const quizBody    = document.getElementById('quizBody');
      const quizResults = document.getElementById('quizResults');
      if (quizBody)    quizBody.style.display = 'block';
      if (quizResults) quizResults.style.display = 'none';

      quizState.quiz = dynamicQuiz;
      quizState.answers = new Array(dynamicQuiz.questions.length).fill(null);
      quizState.currentQ = 0;
      quizState.timeLeft = dynamicQuiz.timeLimit;
      quizState.finished = false;
      quizState.startTime = Date.now();

      renderQuestion();
      startTimer();
      renderQuestionNav();

      if (badge) badge.textContent = `🌐 Source: Open Trivia DB Live API (${difficulty.toUpperCase()})`;
      Toast.success('Online Quiz Loaded', `Fetched 10 live questions in Computer Science (${difficulty.toUpperCase()}). Good luck!`);
    }
  } catch (err) {
    console.error('Quiz generate failed:', err);
    Toast.error('Load Error', 'Falling back to offline assessment bank');
    loadQuiz(1);
  } finally {
    if (icon) icon.className = 'fa fa-refresh';
  }
}

window.switchQuizMode = switchQuizMode;
window.generateNewOnlineQuiz = generateNewOnlineQuiz;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('quizPage')) return;
  if (!Auth.requireAuth()) return;

  const params = new URLSearchParams(window.location.search);
  const qId = params.get('id');

  if (qId && qId !== 'online') {
    switchQuizMode('course');
  } else {
    // Default to Live Online Question Bank for rich online experience
    switchQuizMode('online');
  }

  document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
  document.getElementById('prevBtn')?.addEventListener('click', prevQuestion);
  document.getElementById('retryBtn')?.addEventListener('click', retryQuiz);
});
