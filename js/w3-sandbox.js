/* ============================================================
   Prime Vector LMS — W3Schools Interactive Sandbox (w3-sandbox.js)
   ============================================================ */

const W3Templates = {
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; }
    .w3-card { background: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    h2 { color: #00F2FE; margin-top: 0; }
    .badge { background: #2563eb; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
    button { background: linear-gradient(135deg, #2563EB, #14B8A6); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 12px; }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="w3-card">
    <span class="badge">PRIME VECTOR INTERACTIVE</span>
    <h2>Try It Yourself Sandbox</h2>
    <p>Welcome to the hands-on code playground! Modify code on the left and see instant results.</p>
    <button onclick="alert('Congratulations! Prime Vector Interactive Sandbox works smoothly.')">Test Interactivity</button>
  </div>
</body>
</html>`,

  js: `// Prime Vector JavaScript Engine
const studentProfile = {
  name: "Alex Johnson",
  role: "Student",
  skills: ["HTML", "CSS", "JavaScript", "React"],
  atsScore: 94
};

function checkPlacementEligibility(profile) {
  console.log("Analyzing student credentials for Prime Vector Drives...");
  if (profile.atsScore >= 85) {
    return \`✅ SUCCESS: \${profile.name} is ELIGIBLE for Campus Placement (Score: \${profile.atsScore}%)\`;
  }
  return "⚠️ Needs ATS Optimization";
}

console.log(checkPlacementEligibility(studentProfile));`,

  python: `# Prime Vector Python AI & Data Science Playground
class PrimeVectorAnalytics:
    def __init__(self, course, enrolled):
        self.course = course
        self.enrolled = enrolled
    
    def generate_summary(self):
        return f"Course: {self.course} | Active Learners: {self.enrolled}"

bootcamps = [
    PrimeVectorAnalytics("Artificial Intelligence", 643),
    PrimeVectorAnalytics("Cybersecurity & Ethical Hacking", 420),
    PrimeVectorAnalytics("Full Stack Web Development", 890)
]

print("--- Prime Vector Upskilling Analytics ---")
for b in bootcamps:
    print(b.generate_summary())
print("\n[Execution Completed in 0.04s]")`,

  cpp: `// Prime Vector High-Performance C++ Sandbox
#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    cout << "=== Prime Vector C++ Compiler Output ===" << endl;
    vector<string> modules = {"Data Structures", "Algorithms", "System Design", "Cloud Infrastructure"};
    
    for(size_t i = 0; i < modules.size(); ++i) {
        cout << "[" << (i+1) << "] Module: " << modules[i] << " - VERIFIED" << endl;
    }
    
    cout << "\nMemory Allocation: OK | Status: 0 Exit Code" << endl;
    return 0;
}`,

  sql: `-- Prime Vector Placement Database Query
SELECT 
    student_id, 
    full_name, 
    department, 
    placement_status,
    gpa
FROM primevector_students
WHERE placement_status = 'Placed' AND gpa >= 8.5
ORDER BY gpa DESC;

/* 
Result set: 3 rows returned
1 | Alex Johnson | Computer Science | Placed (₹12 LPA)
2 | Priya Sharma | Full Stack Web   | Placed (₹14 LPA)
3 | Rahul Kumar  | AI & Data Science| Placed (₹15 LPA)
*/`
};

let currentW3Lang = 'html';

function selectW3Language(lang) {
  currentW3Lang = lang;
  
  // Update buttons
  document.querySelectorAll('[data-w3-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.w3Lang === lang);
  });

  const editor = document.getElementById('w3CodeInput');
  if (editor) {
    editor.value = W3Templates[lang] || W3Templates.html;
  }

  // Auto run
  runW3Code();
}

function runW3Code() {
  const code = document.getElementById('w3CodeInput')?.value || '';
  const outputFrame = document.getElementById('w3OutputFrame');
  const consoleBox = document.getElementById('w3ConsoleOutput');

  if (currentW3Lang === 'html') {
    if (outputFrame) {
      outputFrame.style.display = 'block';
      if (consoleBox) consoleBox.style.display = 'none';
      const doc = outputFrame.contentDocument || outputFrame.contentWindow.document;
      doc.open();
      doc.write(code);
      doc.close();
    }
  } else {
    if (outputFrame) outputFrame.style.display = 'none';
    if (consoleBox) {
      consoleBox.style.display = 'block';
      if (currentW3Lang === 'js') {
        let logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' '));
        };
        try {
          new Function(code)();
          consoleBox.textContent = logs.join('\n') || 'Code executed successfully with 0 output statements.';
          consoleBox.style.color = '#00F2FE';
        } catch (err) {
          consoleBox.textContent = '❌ Error: ' + err.message;
          consoleBox.style.color = 'var(--danger)';
        } finally {
          console.log = originalLog;
        }
      } else {
        // Python / CPP / SQL simulation output
        consoleBox.textContent = W3Templates[currentW3Lang] ? (
          "=== Output Window ===\n\n" + 
          (code.includes('print') || code.includes('cout') || code.includes('SELECT') ? 
            "Executing snippet...\n" + W3Templates[currentW3Lang].split('\n').filter(l => !l.startsWith('//') && !l.startsWith('#') && !l.startsWith('--')).join('\n') :
            code)
        ) : "Execution finished.";
        consoleBox.style.color = '#38BDF8';
      }
    }
  }
}

function resetW3Code() {
  selectW3Language(currentW3Lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('w3CodeInput');
  if (editor) {
    editor.addEventListener('input', () => {
      if (currentW3Lang === 'html') runW3Code();
    });
  }
  // Initialize
  if (document.getElementById('w3CodeInput')) {
    selectW3Language('html');
  }
});
