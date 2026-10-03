const express = require('express');
const router = express.Router();
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { optionalAuth } = require('../middleware/auth');

// POST /api/compiler/run
router.post('/run', optionalAuth, (req, res) => {
  const { language, code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, output: 'Error: No code provided to execute.' });
  }

  if (code.length > 50000) {
    return res.status(400).json({ success: false, output: 'Error: Code exceeds maximum allowed size (50KB).' });
  }

  const startTime = Date.now();

  // JavaScript & DSA execution via hardened sterile sandbox
  if (language === 'javascript' || language === 'dsa') {
    const dangerousPatterns = [
      /\bprocess\b/i,
      /\brequire\s*\(/i,
      /\bimport\s*\(/i,
      /\bchild_process\b/i,
      /\bfs\b/i,
      /\bFunction\s*\(/i,
      /\beval\s*\(/i,
      /constructor\s*\.\s*constructor/i,
      /__proto__/i,
      /\bmainModule\b/i,
      /\bmodule\b/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return res.status(403).json({
          success: false,
          engine: 'Acadex Isolated Sandbox',
          output: 'Security Exception: Execution blocked. Process access, filesystem, external modules, and reflection constructors are forbidden in the sandbox.',
          executionTime: '0.00s'
        });
      }
    }

    const logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args) => logs.push('ERROR: ' + args.join(' ')),
      warn: (...args) => logs.push('WARN: ' + args.join(' '))
    };

    try {
      const sandbox = {
        console: customConsole,
        Math,
        Date,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        JSON: {
          parse: JSON.parse,
          stringify: JSON.stringify
        }
      };

      const context = vm.createContext(sandbox);
      const script = new vm.Script(code);
      script.runInContext(context, { timeout: 2000 });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);
      return res.json({
        success: true,
        engine: 'Acadex JS Isolated Sandbox Engine',
        output: logs.join('\n') || '> Program ran with no console output.\n> Process completed with code 0.',
        executionTime: `${elapsed}s`
      });
    } catch (err) {
      return res.json({
        success: false,
        engine: 'Acadex JS Isolated Sandbox Engine',
        output: `Runtime Error: ${err.message}`,
        executionTime: '0.00s'
      });
    }
  }

  // Python 3 execution with security screening & resource bounds
  if (language === 'python') {
    const dangerousPyPatterns = [
      /\bimport\s+os\b/,
      /\bfrom\s+os\b/,
      /\bimport\s+sys\b/,
      /\bfrom\s+sys\b/,
      /\bimport\s+subprocess\b/,
      /\bfrom\s+subprocess\b/,
      /\bimport\s+socket\b/,
      /\bfrom\s+socket\b/,
      /\bimport\s+pty\b/,
      /\bimport\s+shutil\b/,
      /\bopen\s*\(/,
      /\beval\s*\(/,
      /\bexec\s*\(/,
      /\b__import__\b/
    ];

    for (const pattern of dangerousPyPatterns) {
      if (pattern.test(code)) {
        return res.status(403).json({
          success: false,
          engine: 'Acadex Python Sandbox',
          output: 'Security Exception: Execution blocked. OS system calls, network sockets, file I/O, and subprocess spawning are forbidden in the student sandbox.',
          executionTime: '0.00s'
        });
      }
    }

    const tempFile = path.join(os.tmpdir(), `acadex_py_${Date.now()}_${Math.floor(Math.random() * 1000)}.py`);
    fs.writeFile(tempFile, code, 'utf8', (writeErr) => {
      if (writeErr) {
        return res.json({ success: false, output: `Failed to initialize Python sandbox: ${writeErr.message}` });
      }

      execFile('python', [tempFile], { timeout: 3000, maxBuffer: 64 * 1024 }, (execErr, stdout, stderr) => {
        fs.unlink(tempFile, () => {});

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);

        if (execErr && execErr.killed) {
          return res.json({
            success: false,
            engine: 'Python 3 Runtime Engine',
            output: 'Execution timed out (3.0s limit exceeded). Infinite loop or heavy computation detected.',
            executionTime: `${elapsed}s`
          });
        }

        const out = stdout || '';
        const err = stderr || '';
        const fullOutput = (out + (err ? `\n[STDERR]:\n${err}` : '')).trim();

        res.json({
          success: !execErr || !err,
          engine: 'Python 3 Runtime Engine',
          output: fullOutput || '> Process completed with code 0 (no output).',
          executionTime: `${elapsed}s`
        });
      });
    });
    return;
  }

  // HTML / Preview
  if (language === 'html') {
    return res.json({
      success: true,
      engine: 'Web Sandbox Renderer',
      output: '> HTML / CSS / DOM rendered in live sandbox frame.',
      executionTime: '0.01s'
    });
  }

  // C++ / Java - Truthful Toolchain Notification
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);
  res.json({
    success: false,
    engine: `${language.toUpperCase()} Toolchain`,
    output: `Notice: Native ${language.toUpperCase()} (g++ / javac) build toolchains are not configured on this server. Please select JavaScript or Python for live native sandbox execution.`,
    executionTime: `${elapsed}s`
  });
});

module.exports = router;
