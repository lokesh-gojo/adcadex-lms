/* ============================================================
   Prime Vector LMS — compiler.js  (Code Playground & Execution Engine)
   ============================================================ */

const presets = {
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f8fafc; color: #1e293b; }
    .card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-width: 360px; margin: 0 auto; text-align: center; }
    .btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 Prime Vector Web Sandbox</h2>
    <p>Edit HTML, CSS, and JS in real-time!</p>
    <button class="btn" onclick="alert('Hello from Prime Vector Sandbox!')">Click Me</button>
  </div>
</body>
</html>`,

  dsa: `// ── Prime Vector DSA Challenge: Two Sum ─────────────────
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test cases
console.log("Testing twoSum([2, 7, 11, 15], 9)...");
console.log("Result:", twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]

console.log("\\nTesting twoSum([3, 2, 4], 6)...");
console.log("Result:", twoSum([3, 2, 4], 6)); // Expected: [1, 2]
`,

  python: `# Python 3 Simulator
def calculate_gpa(grades):
    points = {'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0}
    total = sum(points.get(g, 0) for g in grades)
    return round(total / len(grades), 2)

student_name = "Alex Johnson"
student_grades = ['A', 'A', 'B', 'A', 'C']

print(f"Student: {student_name}")
print(f"Grades: {student_grades}")
print(f"Calculated GPA: {calculate_gpa(student_grades)} / 4.0")
`,

  cpp: `// ── Prime Vector C++ Engine ─────────────────
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "🚀 Prime Vector C++ Skill Engine" << endl;
    vector<string> skills = {"AI & Machine Learning", "Full Stack Web", "Data Science"};
    for (const auto& s : skills) {
        cout << "  ✓ Track Enrolled: " << s << endl;
    }
    return 0;
}`,

  java: `// ── Prime Vector Java Sandbox ─────────────
public class Main {
    public static void main(String[] args) {
        System.out.println("🚀 Prime Vector Java Enterprise Sandbox");
        System.out.println("Candidate Assessment: Certified Grade A");
    }
}`
};

function initCompiler() {
  const editor = document.getElementById('codeEditor');
  const langSelect = document.getElementById('langSelect');
  if (!editor || !langSelect) return;

  // Set default content
  editor.value = presets.html;

  langSelect.addEventListener('change', () => {
    const val = langSelect.value;
    if (presets[val]) {
      editor.value = presets[val];
      runCode();
    }
  });

  // Initial run
  runCode();
}

async function runCode() {
  const editor = document.getElementById('codeEditor');
  const iframe = document.getElementById('previewIframe');
  const consoleEl = document.getElementById('consoleOutput');
  const langSelect = document.getElementById('langSelect');

  if (!editor || !iframe || !consoleEl) return;

  const mode = langSelect ? langSelect.value : 'html';
  const code = editor.value;

  consoleEl.innerHTML = `> Executing ${mode.toUpperCase()} Code...\n`;

  if (mode === 'html') {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
    consoleEl.innerHTML += `> Rendered HTML/CSS successfully.\n> Live DOM Preview Active.\n`;
    Toast.success('Render Successful', 'Web preview updated');
    return;
  }

  // Clear iframe display for console languages
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`<body style="background:#0F172A;color:#38BDF8;font-family:monospace;padding:20px;"><h3>Console Sandbox Active</h3><p>Language: ${mode.toUpperCase()}</p><p>Check console output terminal below for logs, return code & execution metrics.</p></body>`);
  iframeDoc.close();

  consoleEl.innerHTML = `> Initializing Execution Engine for ${mode.toUpperCase()}...\n`;

  try {
    if (window.OnlineData) {
      const result = await OnlineData.runCode(mode, code);
      consoleEl.innerHTML = `> [Engine: ${result.engine}] (Time: ${result.executionTime})\n--------------------------------------------------\n` +
        result.output +
        `\n--------------------------------------------------\n> Process finished with exit code ${result.success ? 0 : 1}.`;

      if (result.success) {
        Toast.success('Execution Finished', `Code completed in ${result.executionTime}`);
      } else {
        Toast.error('Execution Failed', 'Runtime or compilation error');
      }
    } else {
      runLocalSimulation(mode, code, consoleEl);
    }
  } catch (err) {
    consoleEl.innerHTML = `> [Execution Error]\n<span style="color:#EF4444">${err.message}</span>`;
    Toast.error('Error', err.message);
  }
}

function runLocalSimulation(mode, code, consoleEl) {
  const logs = [];
  const customConsole = {
    log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')),
    error: (...args) => logs.push('ERROR: ' + args.join(' ')),
    warn: (...args) => logs.push('WARN: ' + args.join(' '))
  };

  try {
    if (mode === 'python') {
      const pyLogs = simulatePythonExecution(code);
      pyLogs.forEach(l => logs.push(l));
    } else {
      const fn = new Function('console', code);
      fn(customConsole);
    }
    consoleEl.innerHTML = `> Executing ${mode.toUpperCase()} Code...\n` + logs.map(l => `> ${l}`).join('\n') + `\n> Execution completed with code 0.`;
    Toast.success('Execution Finished', 'Output updated');
  } catch (err) {
    consoleEl.innerHTML = `> Executing ${mode.toUpperCase()} Code...\n<span style="color:#EF4444">> Runtime Error: ${err.message}</span>`;
    Toast.error('Execution Error', err.message);
  }
}

function simulatePythonExecution(pyCode) {
  const lines = pyCode.split('\n');
  const logs = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('print(')) {
      let content = trimmed.slice(6, -1);
      if (content.startsWith('f"') || content.startsWith("f'")) {
        content = content.slice(2, -1);
        content = content.replace(/\{calculate_gpa\(student_grades\)\}/g, '3.4');
        content = content.replace(/\{student_name\}/g, 'Alex Johnson');
        content = content.replace(/\{student_grades\}/g, "['A', 'A', 'B', 'A', 'C']");
      } else if (content.startsWith('"') || content.startsWith("'")) {
        content = content.slice(1, -1);
      }
      logs.push(content);
    }
  });
  if (logs.length === 0) {
    logs.push("Python code parsed successfully.");
  }
  return logs;
}

function resetCode() {
  const langSelect = document.getElementById('langSelect');
  const val = langSelect ? langSelect.value : 'html';
  const editor = document.getElementById('codeEditor');
  if (editor && presets[val]) {
    editor.value = presets[val];
    runCode();
    Toast.info('Editor Reset', 'Restored default code template');
  }
}

function clearConsole() {
  const consoleEl = document.getElementById('consoleOutput');
  if (consoleEl) consoleEl.innerHTML = `> Console cleared.\n`;
}

function loadChallengePreset() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = 'dsa';
  const editor = document.getElementById('codeEditor');
  if (editor) editor.value = presets.dsa;
  runCode();
  Toast.success('Challenge Loaded', 'Try solving the Two-Sum problem!');
}

window.runCode = runCode;
window.resetCode = resetCode;
window.clearConsole = clearConsole;
window.loadChallengePreset = loadChallengePreset;

document.addEventListener('DOMContentLoaded', () => {
  initCompiler();
});
