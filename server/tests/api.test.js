const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Acadex LMS Production API Test Suite', async (t) => {
  let studentToken = '';
  let adminToken = '';
  let trainerToken = '';

  await t.test('1. Health Check Endpoint', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'online');
    assert.strictEqual(res.body.app, 'Acadex LMS Production API');
  });

  await t.test('2. Public Registration strictly enforces Student role', async () => {
    const testEmail = `student_${Date.now()}@acadex.edu`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Tester',
        email: testEmail,
        password: 'password123',
        role: 'super_admin' // Attempted privilege escalation
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    // Security check: must be student, NOT super_admin!
    assert.strictEqual(res.body.user.role, 'student');
    assert.ok(res.body.token);
    studentToken = res.body.token;
  });

  await t.test('3. Login with bcrypt verification and JWT generation', async () => {
    // 3a: Rejects wrong password
    const failRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'superadmin@demo.com', password: 'wrongpassword' });
    assert.strictEqual(failRes.status, 401);
    assert.strictEqual(failRes.body.success, false);

    // 3b: Super Admin Login
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'superadmin@demo.com', password: 'demo123' });
    assert.strictEqual(adminRes.status, 200);
    assert.strictEqual(adminRes.body.user.role, 'super_admin');
    assert.ok(adminRes.body.token);
    adminToken = adminRes.body.token;

    // 3c: Trainer Login
    const trainerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'trainer@demo.com', password: 'demo123' });
    assert.strictEqual(trainerRes.status, 200);
    assert.strictEqual(trainerRes.body.user.role, 'trainer');
    trainerToken = trainerRes.body.token;
  });

  await t.test('4. RBAC Protection on Admin Dashboard', async () => {
    // Student token cannot access Admin dashboard
    const forbiddenRes = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${studentToken}`);
    assert.strictEqual(forbiddenRes.status, 403);

    // Super Admin token can access Admin dashboard
    const allowedRes = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(allowedRes.status, 200);
    assert.ok(allowedRes.body.stats.totalUsers > 0);
  });

  await t.test('5. Real Assignment Submission & Faculty Evaluation Workflow', async () => {
    // 5a. Get existing assignment
    const listRes = await request(app).get('/api/assignments');
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.body.assignments.length > 0);
    const targetId = listRes.body.assignments[0].id;

    // 5b. Student submits assignment
    const submitRes = await request(app)
      .post('/api/assignments/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        assignmentId: targetId,
        submissionUrl: 'https://github.com/student/peft-lora-solution',
        notes: 'Implemented rank 16 LoRA with cross-entropy evaluation metrics.'
      });
    assert.strictEqual(submitRes.status, 200);
    assert.strictEqual(submitRes.body.assignment.status, 'submitted');
    assert.strictEqual(submitRes.body.assignment.grade, null); // No fake auto-grade

    // 5c. Student tries to grade (Forbidden)
    const unauthorizedGrade = await request(app)
      .post('/api/assignments/grade')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ assignmentId: targetId, score: 95 });
    assert.strictEqual(unauthorizedGrade.status, 403);

    // 5d. Faculty grades assignment
    const gradeRes = await request(app)
      .post('/api/assignments/grade')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        assignmentId: targetId,
        score: 94,
        feedback: 'Superb architecture. Clean gradient checkpointing.'
      });
    assert.strictEqual(gradeRes.status, 200);
    assert.strictEqual(gradeRes.body.assignment.status, 'graded');
    assert.strictEqual(gradeRes.body.assignment.grade, 'A');
    assert.strictEqual(gradeRes.body.assignment.score, 94);
  });

  await t.test('6. Quiz Assessment with Server-Side Scoring & Attempt Persistence', async () => {
    const listQuizzes = await request(app).get('/api/quizzes');
    assert.strictEqual(listQuizzes.status, 200);
    assert.ok(listQuizzes.body.quizzes.length > 0);
    const quizId = listQuizzes.body.quizzes[0].id;

    // Fetch quiz questions
    const quizDetails = await request(app).get(`/api/quizzes/${quizId}`);
    assert.strictEqual(quizDetails.status, 200);
    const qList = quizDetails.body.quiz.questions;
    assert.ok(qList.length > 0);

    const answers = {};
    qList.forEach(q => {
      answers[q.id] = 1; // pick option index 1
    });

    const quizRes = await request(app)
      .post(`/api/quizzes/${quizId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers });
    assert.strictEqual(quizRes.status, 200);
    assert.strictEqual(quizRes.body.total, qList.length);
    assert.ok(typeof quizRes.body.score === 'number');
    assert.ok(typeof quizRes.body.percentage === 'number');
    assert.ok(typeof quizRes.body.passed === 'boolean');
    assert.ok(quizRes.body.xpEarned > 0);
  });

  await t.test('7. QR Attendance Session & Check-in Risk Engine', async () => {
    // 7a. Faculty generates session
    const sessRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        courseId: '1',
        sessionTitle: 'Neural Network Optimizers',
        durationMins: 45
      });
    assert.strictEqual(sessRes.status, 201);
    const code = sessRes.body.session.sessionCode;
    assert.ok(code);

    // 7b. Student checks in
    const checkInRes = await request(app)
      .post('/api/attendance/check-in')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ sessionCode: code });
    assert.strictEqual(checkInRes.status, 201);
    assert.strictEqual(checkInRes.body.record.status, 'Present');

    // 7c. Check attendance metrics
    const statsRes = await request(app)
      .get('/api/attendance/my-stats')
      .set('Authorization', `Bearer ${studentToken}`);
    assert.strictEqual(statsRes.status, 200);
    assert.ok(statsRes.body.stats.attendanceRate >= 0);
    assert.ok(['Good', 'Normal', 'Warning'].includes(statsRes.body.stats.tier));
  });

  await t.test('8. Certificate Verification System', async () => {
    // 8a. Issue a signed ACX certificate first
    const issueRes = await request(app)
      .post('/api/certificates/issue')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        studentName: 'Alex Johnson',
        course: 'Advanced Transformer Engineering',
        grade: 'A+'
      });
    assert.strictEqual(issueRes.status, 201);
    const certId = issueRes.body.certificate.id;
    assert.ok(certId.startsWith('ACX-2026-'));

    // 8b. Public Authentic certificate verification
    const validRes = await request(app).get(`/api/certificates/verify/${certId}`);
    assert.strictEqual(validRes.status, 200);
    assert.strictEqual(validRes.body.verified, true);
    assert.strictEqual(validRes.body.certificate.studentName, 'Alex Johnson');
    assert.ok(validRes.body.certificate.blockchainProof);

    // 8c. Fraudulent / Non-existent certificate verification
    const invalidRes = await request(app).get('/api/certificates/verify/FAKE-ID-999');
    assert.strictEqual(invalidRes.status, 404);
    assert.strictEqual(invalidRes.body.verified, false);
  });

  await t.test('9. AI Placement Skill-Gap Analysis Engine', async () => {
    const gapRes = await request(app)
      .post('/api/placements/skill-gap')
      .send({
        targetRole: 'Full Stack Engineer',
        studentSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']
      });
    assert.strictEqual(gapRes.status, 200);
    assert.strictEqual(gapRes.body.matchPercentage, 50); // 4 out of 8
    assert.strictEqual(gapRes.body.matchedSkills.length, 4);
    assert.strictEqual(gapRes.body.missingSkills.length, 4);
    assert.ok(gapRes.body.recommendations.length > 0);
  });

  await t.test('10. Code Execution Sandbox Security Screen', async () => {
    // 10a. Host escape exploit via constructor is blocked
    const exploitRes1 = await request(app)
      .post('/api/compiler/run')
      .send({
        language: 'javascript',
        code: "Object.constructor('return process')()"
      });
    assert.strictEqual(exploitRes1.status, 403);
    assert.ok(exploitRes1.body.output.includes('Security Exception'));

    // 10b. require('child_process') is blocked
    const exploitRes2 = await request(app)
      .post('/api/compiler/run')
      .send({
        language: 'javascript',
        code: "require('child_process').execSync('whoami')"
      });
    assert.strictEqual(exploitRes2.status, 403);

    // 10c. Safe benign code executes cleanly
    const safeRes = await request(app)
      .post('/api/compiler/run')
      .send({
        language: 'javascript',
        code: "function add(a, b) { return a + b; } console.log('Result:', add(20, 22));"
      });
    assert.strictEqual(safeRes.status, 200);
    assert.strictEqual(safeRes.body.success, true);
    assert.ok(safeRes.body.output.includes('Result: 42'));
  });

  await t.test('11. Socratic AI Tutor Engine', async () => {
    const aiRes = await request(app)
      .post('/api/ai/tutor')
      .send({ query: 'Explain recursion in simple terms' });
    assert.strictEqual(aiRes.status, 200);
    assert.strictEqual(aiRes.body.data.topic, 'Recursion');
    assert.ok(aiRes.body.data.simpleExplanation);
    assert.ok(aiRes.body.data.codeExample);
    assert.ok(aiRes.body.data.miniQuiz);
  });
});
