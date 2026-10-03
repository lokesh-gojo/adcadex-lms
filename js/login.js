/* ============================================================
   Prime Vector LMS — login.js  (Auth Logic)
   ============================================================ */

// Seed demo users into localStorage on first load
function seedUsers() {
  Store.set('users', [
    { id: 1, name: 'Alex Johnson', email: 'student@demo.com', password: 'demo123', role: 'student', joined: '2024-09-01', department: 'Computer Science & AI', avatar: '' },
    { id: 2, name: 'Dr. Sarah Chen', email: 'faculty@demo.com', password: 'demo123', role: 'faculty', joined: '2023-01-15', department: 'Full Stack & Cloud', avatar: '' },
    { id: 3, name: 'Executive Admin', email: 'admin@demo.com', password: 'demo123', role: 'admin', joined: '2022-06-01', department: 'Executive Governance', avatar: '' },
    { id: 4, name: 'Jane Recruiter', email: 'hr@demo.com', password: 'demo123', role: 'hr', joined: '2025-01-10', department: 'Talent Acquisition', avatar: '' },
    { id: 5, name: 'Priya Sharma', email: 'placement@demo.com', password: 'demo123', role: 'placement', joined: '2023-08-11', department: 'Corporate Relations', avatar: '' },
    { id: 6, name: 'Marcus Vance', email: 'mentor@demo.com', password: 'demo123', role: 'mentor', joined: '2024-03-20', department: 'Full Stack Engineering', avatar: '' }
  ]);
}

// ── Login Page ───────────────────────────────────────────────
function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  Auth.requireGuest();
  seedUsers();

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    let valid = true;

    if (!email) {
      showError('emailError', 'Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('emailError', 'Enter a valid email address');
      valid = false;
    }

    if (!password) {
      showError('passwordError', 'Password is required');
      valid = false;
    }

    if (!valid) return;

    const users = Store.get('users', []);
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      Toast.error('Login Failed', 'Invalid email or password');
      showError('passwordError', 'Invalid credentials');
      return;
    }

    // Simulate loading
    const btn = loginForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Signing in...';

    setTimeout(() => {
      Auth.login(user);
      Toast.success('Welcome back!', `Logged in as ${user.role.toUpperCase()} (${user.name})`);
      setTimeout(() => {
        const destMap = {
          admin: 'admin.html',
          super_admin: 'admin.html',
          faculty: 'faculty.html',
          trainer: 'faculty.html',
          student: 'student.html',
          hr: 'hr.html',
          hr_admin: 'hr.html',
          placement: 'placement.html',
          placement_officer: 'placement.html',
          mentor: 'faculty.html'
        };
        const dest = destMap[user.role] || 'student.html';
        window.location.href = dest;
      }, 500);
    }, 600);
  });

  // Demo login buttons (All 6 roles supported)
  document.querySelectorAll('[data-demo-login]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.demoLogin;
      const demos = {
        student:   { email: 'student@demo.com',   password: 'demo123' },
        faculty:   { email: 'faculty@demo.com',   password: 'demo123' },
        trainer:   { email: 'faculty@demo.com',   password: 'demo123' },
        admin:     { email: 'admin@demo.com',     password: 'demo123' },
        hr:        { email: 'hr@demo.com',        password: 'demo123' },
        placement: { email: 'placement@demo.com', password: 'demo123' },
        mentor:    { email: 'mentor@demo.com',    password: 'demo123' }
      };
      const d = demos[role];
      if (d) {
        document.getElementById('email').value    = d.email;
        document.getElementById('password').value = d.password;
        Toast.info('Logging in as ' + role.toUpperCase(), 'Authenticating demo credentials...');
        setTimeout(() => {
          loginForm.dispatchEvent(new Event('submit'));
        }, 300);
      }
    });
  });

  // Password toggle
  const eyeBtn = document.querySelector('.input-icon-right');
  const pwdInput = document.getElementById('password');
  if (eyeBtn && pwdInput) {
    eyeBtn.addEventListener('click', () => {
      const isText = pwdInput.type === 'text';
      pwdInput.type = isText ? 'password' : 'text';
      eyeBtn.className = `input-icon-right fa ${isText ? 'fa-eye' : 'fa-eye-slash'}`;
    });
  }
}

// ── Register Page ────────────────────────────────────────────
function initRegisterPage() {
  const regForm = document.getElementById('registerForm');
  if (!regForm) return;

  Auth.requireGuest();
  seedUsers();

  regForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name     = document.getElementById('fullName').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm  = document.getElementById('confirmPassword').value;
    const role     = document.getElementById('role').value;
    let valid = true;

    if (!name || name.length < 2) {
      showError('nameError', 'Full name must be at least 2 characters');
      valid = false;
    }

    if (!email || !isValidEmail(email)) {
      showError('emailError', 'Enter a valid email address');
      valid = false;
    }

    if (!password || password.length < 6) {
      showError('passwordError', 'Password must be at least 6 characters');
      valid = false;
    }

    if (password !== confirm) {
      showError('confirmError', 'Passwords do not match');
      valid = false;
    }

    if (!role) {
      showError('roleError', 'Please select a role');
      valid = false;
    }

    if (!valid) return;

    const users = Store.get('users', []);
    if (users.find(u => u.email === email)) {
      showError('emailError', 'Email already registered');
      Toast.error('Registration Failed', 'This email is already in use');
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      joined: new Date().toISOString().slice(0, 10),
      department: 'General',
      avatar: ''
    };

    users.push(newUser);
    Store.set('users', users);

    const btn = regForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Creating Account...';

    setTimeout(() => {
      Auth.login(newUser);
      Toast.success('Account Created!', `Welcome to Prime Vector LMS, ${newUser.name}!`);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    }, 900);
  });

  // Role selector
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('role').value = card.dataset.role;
    });
  });

  // Password strength
  const pwdInput = document.getElementById('password');
  if (pwdInput) {
    pwdInput.addEventListener('input', () => {
      updatePasswordStrength(pwdInput.value);
    });
  }
}

function updatePasswordStrength(pwd) {
  const bar      = document.getElementById('strengthBar');
  const text     = document.getElementById('strengthText');
  if (!bar || !text) return;

  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { label: 'Very Weak', color: '#EF4444', w: 20 },
    { label: 'Weak',      color: '#F97316', w: 40 },
    { label: 'Fair',      color: '#F59E0B', w: 60 },
    { label: 'Strong',    color: '#10B981', w: 80 },
    { label: 'Very Strong', color: '#059669', w: 100 }
  ];

  const level = levels[Math.min(score, 4)];
  bar.style.width = level.w + '%';
  bar.style.background = level.color;
  text.textContent = level.label;
  text.style.color = level.color;
}

// ── Helpers ───────────────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
  const input = el?.previousElementSibling?.querySelector('input, select');
  if (input) input.classList.add('error');
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(e => {
    e.textContent = '';
    e.style.display = 'none';
  });
  document.querySelectorAll('.form-control.error').forEach(i => i.classList.remove('error'));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Dashboard Redirect ────────────────────────────────────────
function initDashboardRedirect() {
  if (!document.getElementById('dashboard-redirect')) return;
  if (!Auth.requireAuth()) return;

  const user = Auth.getUser();
  const routes = {
    student: 'student.html',
    faculty: 'faculty.html',
    admin:   'admin.html',
    parent:  'parent.html',
    hr:      'hr.html',
    alumni:  'alumni.html'
  };

  setTimeout(() => {
    window.location.href = routes[user.role] || 'student.html';
  }, 300);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  seedUsers();
  initLoginPage();
  initRegisterPage();
  initDashboardRedirect();
});
