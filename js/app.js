/* ============================================================
   Prime Vector LMS — app.js  (Global Utilities & Auth Guard)
   ============================================================ */

// ── Constants ────────────────────────────────────────────────
const APP_NAME        = 'Prime Vector LMS';
const COMPANY_NAME    = 'Prime Vector Private Limited';
const COMPANY_WEBSITE = 'https://primevector.in/';
const CONTACT_EMAIL   = 'primevectorprivatelimited@gmail.com';
const CONTACT_PHONE   = '+91 8220082896';
const ADDRESS_HOSUR   = 'No. 74/22f11, 3rd Floor, HV Arcade, Bagalur Road, Hosur, Krishnagiri, Tamil Nadu - 635109';
const STORAGE_KEY     = 'PrimeVector_user';
const THEME_KEY       = 'PrimeVector_theme';

// ── Auth Helpers ─────────────────────────────────────────────
const Auth = {
  /** Save user session */
  login(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  /** Destroy session */
  logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'login.html';
  },

  /** Get current user object */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  },

  /** Check if logged in */
  isLoggedIn() {
    return !!this.getUser();
  },

  /** Guard: redirect to login if not authenticated */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  /** Guard: Require specific role(s) to access current page */
  requireRole(allowedRoles) {
    if (!this.requireAuth()) return false;
    const user = this.getUser();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!user || !user.role || !roles.includes(user.role)) {
      Toast.error('Access Denied', `This area requires ${roles.join(' or ').toUpperCase()} privileges.`);
      setTimeout(() => {
        if (user && user.role) {
          window.location.href = user.role + '.html';
        } else {
          window.location.href = 'login.html';
        }
      }, 1000);
      return false;
    }
    return true;
  },

  /** Guard: redirect to dashboard if already logged in */
  requireGuest() {
    if (this.isLoggedIn()) {
      window.location.href = 'dashboard.html';
    }
  }
};

// ── Theme ────────────────────────────────────────────────────
const Theme = {
  init() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    this.apply(saved);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update all toggle icons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
      }
    });
  },

  toggle() {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  isDark() {
    return localStorage.getItem(THEME_KEY) === 'dark';
  }
};

// ── Toast Notifications ──────────────────────────────────────
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(title, message = '', type = 'info') {
    this.init();
    const icons = { success: 'fa-check', error: 'fa-times', warning: 'fa-exclamation', info: 'fa-info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa ${icons[type] || icons.info}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1rem;padding:4px;">×</button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  },

  success(title, msg)  { this.show(title, msg, 'success'); },
  error(title, msg)    { this.show(title, msg, 'error'); },
  warning(title, msg)  { this.show(title, msg, 'warning'); },
  info(title, msg)     { this.show(title, msg, 'info'); }
};

// ── Modal Helpers ─────────────────────────────────────────────
const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    Modal.closeAll();
  }
});

// ── Accordion ────────────────────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');

      // Close siblings in same container if single-open
      const parent = header.closest('.accordion-single');
      if (parent) {
        parent.querySelectorAll('.accordion-header.open').forEach(h => {
          if (h !== header) {
            h.classList.remove('open');
            h.nextElementSibling.classList.remove('open');
          }
        });
      }

      header.classList.toggle('open', !isOpen);
      body.classList.toggle('open', !isOpen);
    });
  });
}

// ── Tabs ─────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const container = btn.closest('[data-tabs]') || document;

      // Deactivate all tabs and panes in this group
      const group = btn.dataset.group;
      if (group) {
        document.querySelectorAll(`[data-tab][data-group="${group}"]`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`[data-pane][data-group="${group}"]`).forEach(p => p.classList.remove('active'));
      } else {
        container.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('[data-pane]').forEach(p => p.classList.remove('active'));
      }

      btn.classList.add('active');
      const pane = document.querySelector(`[data-pane="${target}"]`);
      if (pane) pane.classList.add('active');
    });
  });
}

// ── Sidebar Toggle ───────────────────────────────────────────
function initSidebar() {
  const sidebar    = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const innerNavbar = document.querySelector('.inner-navbar');
  const toggleBtns  = document.querySelectorAll('.sidebar-toggle');
  const overlay     = document.querySelector('.sidebar-overlay');

  if (!sidebar) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
      } else {
        sidebar.classList.toggle('collapsed');
        mainContent?.classList.toggle('collapsed');
        innerNavbar?.classList.toggle('collapsed');
      }
    });
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}

// ── Navbar Scroll Effect ─────────────────────────────────────
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handler = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

// ── Mobile Nav Hamburger ─────────────────────────────────────
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// ── Dropdown Menus ───────────────────────────────────────────
function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dd => {
    const trigger = dd.querySelector('[data-dropdown-toggle]');
    const menu    = dd.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isActive = menu.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) menu.classList.add('active');
    });
  });

  document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
}

// ── Animation on Scroll ───────────────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  els.forEach(el => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
}

// ── Progress Bar Animations ──────────────────────────────────
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ── Counter Animation ────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const isFloat = String(target).includes('.');
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  const step = () => {
    start = Math.min(start + increment, target);
    el.textContent = prefix + (isFloat ? start.toFixed(1) : Math.floor(start).toLocaleString()) + suffix;
    if (start < target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseFloat(el.dataset.counter));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ── Populate Sidebar User Info ───────────────────────────────
function populateSidebarUser() {
  const user = Auth.getUser();
  if (!user) return;

  const nameEls = document.querySelectorAll('.sidebar-user-name, .user-name, [data-user-name]');
  const roleEls = document.querySelectorAll('.sidebar-user-role, .user-role, [data-user-role]');
  const avatarEls = document.querySelectorAll('.sidebar-avatar, [data-user-avatar]');

  nameEls.forEach(el => el.textContent = user.name || 'User');
  roleEls.forEach(el => el.textContent = user.role || 'student');
  avatarEls.forEach(el => {
    if (el.tagName === 'IMG') {
      el.src = user.avatar || '';
    } else {
      el.textContent = (user.name || 'U')[0].toUpperCase();
    }
  });
}

// ── Logout Buttons ───────────────────────────────────────────
function initLogout() {
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      Auth.logout();
    });
  });
}

// ── Format Helpers ────────────────────────────────────────────
const Format = {
  date(d) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },
  time(d) {
    return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },
  relative(d) {
    const now = Date.now();
    const diff = now - new Date(d).getTime();
    if (diff < 60000)   return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return `${Math.floor(diff/86400000)}d ago`;
  }
};

// ── Storage Helpers ───────────────────────────────────────────
const Store = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(`Prime Vector_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    localStorage.setItem(`Prime Vector_${key}`, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(`Prime Vector_${key}`);
  }
};

// ── Accordion Initializer ─────────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-single .accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-single .accordion-item').forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.accordion-body');
        if (b) b.classList.remove('open');
      });

      // Open clicked if wasn't open
      if (!wasOpen) {
        item.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });
}

// ── Tab Initializer ───────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        if (!tabId) return;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const parent = tabGroup.nextElementSibling || tabGroup.parentElement;
        parent.querySelectorAll('[data-pane]').forEach(pane => {
          pane.style.display = pane.dataset.pane === tabId ? 'block' : 'none';
        });
      });
    });
  });
}

// ── Dashboard Redirect & RBAC Guards ─────────────────────────
function initDashboardRedirect() {
  if (window.location.pathname.endsWith('dashboard.html')) {
    const user = Auth.getUser();
    if (user && user.role) {
      window.location.href = user.role + '.html';
    } else {
      window.location.href = 'login.html';
    }
  }
}

function initRoleRouteGuard() {
  const path = window.location.pathname;

  // Admin routes: require 'admin' role
  const adminPages = ['admin.html', 'admin-enrollment.html', 'admin-reports.html', 'admin-courses.html', 'admin-training.html', 'admin-placements.html', 'admin-certificates.html', 'admin-analytics.html', 'admin-departments.html', 'admin-system.html'];
  if (adminPages.some(page => path.endsWith(page))) {
    Auth.requireRole(['admin']);
    return;
  }

  // Faculty routes: require 'faculty' or 'admin' role
  const facultyPages = ['faculty.html', 'faculty-notes.html', 'faculty-classes.html', 'faculty-assignments.html', 'faculty-quiz.html', 'faculty-students.html'];
  if (facultyPages.some(page => path.endsWith(page))) {
    Auth.requireRole(['faculty', 'admin']);
    return;
  }

  // Student dashboard & features: require authenticated session
  const protectedStudentPages = ['student.html', 'assignment.html', 'attendance.html', 'classes.html', 'notes.html', 'placement.html', 'resume-builder.html', 'portfolio.html', 'placement-tracker.html', 'class-reports.html', 'certificate.html', 'project.html', 'internship.html', 'gamification.html'];
  if (protectedStudentPages.some(page => path.endsWith(page))) {
    Auth.requireAuth();
    return;
  }
}

// ── Export Helpers ────────────────────────────────────────────
const Export = {
  toCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) {
      Toast.error('Export Failed', `Table #${tableId} not found`);
      return;
    }
    let csv = [];
    const rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const row = [], cols = rows[i].querySelectorAll('td, th');
      for (let j = 0; j < cols.length; j++) {
        // Clean text and wrap in quotes
        let text = cols[j].innerText.trim().replace(/"/g, '""');
        row.push('"' + text + '"');
      }
      csv.push(row.join(','));
    }
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Toast.success('Export Successful', `Downloaded ${filename}`);
  },
  toPDF() {
    window.print();
  }
};

// ── PWA Offline Simulation ────────────────────────────────────
const PWAOffline = {
  isOffline: false,
  
  init() {
    this.isOffline = localStorage.getItem('Prime Vector_offline') === 'true';
    this.injectBadge();
    this.applyState();
  },

  injectBadge() {
    const user = Auth.getUser();
    if (!user) return;
    
    // Inject in top right of inner-navbar-right or main-navbar actions
    const navbarRight = document.querySelector('.inner-navbar-right, .navbar-actions');
    if (!navbarRight) return;

    if (document.getElementById('pwa-offline-badge')) return;

    const badge = document.createElement('button');
    badge.id = 'pwa-offline-badge';
    badge.className = 'offline-badge-btn';
    badge.title = 'Toggle PWA Offline Simulator';
    badge.innerHTML = this.isOffline 
      ? '<i class="fa fa-plug" style="color:var(--danger)"></i> <span class="hide-md" style="color:var(--danger);font-size:0.8rem;margin-left:4px">Offline Mode</span>' 
      : '<i class="fa fa-wifi" style="color:var(--success)"></i> <span class="hide-md" style="color:var(--success);font-size:0.8rem;margin-left:4px">Online</span>';
    
    badge.addEventListener('click', () => this.toggle());
    navbarRight.insertBefore(badge, navbarRight.firstChild);
  },

  toggle() {
    this.isOffline = !this.isOffline;
    localStorage.setItem('Prime Vector_offline', this.isOffline);
    this.applyState();
    Toast.info(
      this.isOffline ? 'PWA Offline Mode Activated' : 'System Connected Online',
      this.isOffline 
        ? 'Offline page cache enabled. Note reading & bookmarks accessible.' 
        : 'All real-time sync databases connected.'
    );
  },

  applyState() {
    const badge = document.getElementById('pwa-offline-badge');
    if (badge) {
      badge.innerHTML = this.isOffline 
        ? '<i class="fa fa-plug" style="color:var(--danger)"></i> <span class="hide-md" style="color:var(--danger);font-size:0.8rem;margin-left:4px">Offline Mode</span>' 
        : '<i class="fa fa-wifi" style="color:var(--success)"></i> <span class="hide-md" style="color:var(--success);font-size:0.8rem;margin-left:4px">Online</span>';
    }

    let banner = document.getElementById('offline-sync-banner');
    if (this.isOffline) {
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offline-sync-banner';
        banner.innerHTML = `
          <div style="background:var(--danger);color:#fff;text-align:center;padding:8px;font-size:0.85rem;font-weight:600;z-index:99999;position:relative;box-shadow:var(--shadow-sm)">
            🔌 Offline Mode Active (PWA Simulation). You can view cached courses, read bookmarks & submit logs offline. Changes sync automatically on reconnection.
          </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
      }
    } else {
      if (banner) banner.remove();
    }
  }
};

// ── Global AI Assistant Chatbot Panel (Enhanced Cloud-Native) ─────────
const AIAssistant = {
  chatHistory: [],
  isOpen: false,
  STORAGE_KEY: 'PV_AI_CHAT_SESSION',
  
  // Interactive Mock Interview State
  interviewState: {
    active: false,
    step: 0,
    scores: [],
    questions: [
      {
        q: "Explain the difference between synchronous and asynchronous execution in JavaScript, and describe how the Event Loop handles promises vs setTimeout.",
        idealTopics: ['event loop', 'microtask', 'macrotask', 'call stack', 'callback queue', 'non-blocking', 'promise', 'async']
      },
      {
        q: "What is database indexing? When would you use a B-Tree index versus a Hash index in PostgreSQL or MySQL, and what are the trade-offs of having too many indexes?",
        idealTopics: ['b-tree', 'lookup', 'write performance', 'overhead', 'range queries', 'o(log n)', 'disk i/o']
      },
      {
        q: "In a high-scale web application, how do you prevent race conditions and double-spending when multiple concurrent requests attempt to reserve the last inventory item?",
        idealTopics: ['transaction', 'isolation level', 'pessimistic lock', 'optimistic lock', 'redis', 'atomic', 'distributed lock']
      }
    ]
  },

  init() {
    const user = Auth.getUser();
    if (!user) return; // Only load for authenticated users
    this.injectStyles();
    this.injectWidget();
    this.restoreChatSession();
  },

  injectStyles() {
    if (document.getElementById('ai-assistant-styles')) return;
    const style = document.createElement('style');
    style.id = 'ai-assistant-styles';
    style.textContent = `
      .ai-widget-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
        color: white;
        box-shadow: 0 8px 25px rgba(79, 70, 229, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      .ai-widget-btn:hover {
        transform: scale(1.1) rotate(6deg);
        box-shadow: 0 12px 32px rgba(79, 70, 229, 0.6);
      }
      .ai-widget-btn.pulse::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        top: 0; left: 0;
        opacity: 0.35;
        animation: ai-pulse 2.2s infinite;
        z-index: -1;
      }
      @keyframes ai-pulse {
        0% { transform: scale(1); opacity: 0.35; }
        100% { transform: scale(1.55); opacity: 0; }
      }
      .ai-chat-panel {
        position: fixed;
        bottom: 92px;
        right: 24px;
        width: min(410px, calc(100vw - 28px));
        height: min(580px, calc(100vh - 110px));
        border-radius: 16px;
        background: rgba(15, 23, 42, 0.96);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.06);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(24px) scale(0.94);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        color: #F8FAFC;
        font-family: var(--font-body, 'Inter', sans-serif);
      }
      .ai-chat-panel.active {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
      }
      .ai-chat-header {
        background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%);
        color: white;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .ai-chat-header-info { display: flex; align-items: center; gap: 10px; }
      .ai-avatar {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.15rem;
        color: white;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      }
      .ai-chat-title { font-weight: 700; font-size: 0.92rem; font-family: var(--font-display, 'Outfit', sans-serif); }
      .ai-chat-status { font-size: 0.72rem; color: #34D399; display: flex; align-items: center; gap: 5px; font-weight: 500; }
      .ai-chat-status::before { content:''; width: 6px; height: 6px; background:#10B981; border-radius: 50%; display:inline-block; box-shadow: 0 0 8px #10B981; }
      .ai-header-actions { display: flex; align-items: center; gap: 6px; }
      .ai-header-btn {
        background: rgba(255, 255, 255, 0.08);
        border: none;
        color: rgba(255, 255, 255, 0.75);
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.85rem;
        transition: var(--transition);
      }
      .ai-header-btn:hover { background: rgba(255, 255, 255, 0.2); color: white; }
      .ai-chat-close {
        font-size: 1.3rem;
        background: none;
        border: none;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        padding: 0 4px;
        transition: var(--transition);
      }
      .ai-chat-close:hover { color: white; }
      .ai-chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #0B0F19;
      }
      .ai-chat-messages::-webkit-scrollbar { width: 6px; }
      .ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      .ai-msg {
        display: flex;
        flex-direction: column;
        max-width: 86%;
        padding: 12px 16px;
        border-radius: 14px;
        font-size: 0.86rem;
        line-height: 1.55;
        animation: ai-msg-appear 0.25s ease-out;
      }
      @keyframes ai-msg-appear {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ai-msg.ai {
        background: rgba(30, 41, 59, 0.85);
        color: #F1F5F9;
        border-top-left-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        align-self: flex-start;
      }
      .ai-msg.user {
        background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
        color: white;
        border-top-right-radius: 4px;
        align-self: flex-end;
        box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
      }
      .ai-msg-content { word-break: break-word; }
      .ai-msg-time { font-size: 0.65rem; color: #94A3B8; margin-top: 6px; align-self: flex-end; }
      .ai-msg.user .ai-msg-time { color: rgba(255,255,255,0.7); }
      
      /* Markdown Enhancements inside Chat */
      .ai-msg strong { color: #38BDF8; font-weight: 700; }
      .ai-msg.user strong { color: #fff; font-weight: 700; }
      .ai-inline-code {
        background: rgba(0, 0, 0, 0.4);
        color: #A5B4FC;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
        font-size: 0.8rem;
      }
      .ai-code-block {
        background: #090D16;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        margin: 8px 0;
        overflow-x: auto;
      }
      .ai-code-header {
        background: rgba(255,255,255,0.05);
        padding: 4px 10px;
        font-size: 0.7rem;
        color: #94A3B8;
        font-family: monospace;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .ai-code-block code {
        display: block;
        padding: 10px 12px;
        font-family: 'Fira Code', monospace;
        font-size: 0.8rem;
        color: #38BDF8;
        line-height: 1.45;
      }
      .ai-list { margin: 6px 0 6px 16px; padding: 0; }
      .ai-list-item { margin-bottom: 4px; list-style-type: disc; }
      .ai-list-ol { margin: 6px 0 6px 18px; padding: 0; }
      .ai-list-num { margin-bottom: 4px; }
      
      /* Quick Action Carousel */
      .ai-quick-actions-wrap {
        background: #0E1626;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 8px 12px;
        position: relative;
      }
      .ai-quick-actions {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .ai-quick-actions::-webkit-scrollbar { display: none; }
      .ai-quick-btn {
        padding: 6px 12px;
        border-radius: 20px;
        background: rgba(79, 70, 229, 0.16);
        border: 1px solid rgba(99, 102, 241, 0.35);
        color: #A5B4FC;
        font-size: 0.74rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }
      .ai-quick-btn:hover {
        background: #4F46E5;
        border-color: #4F46E5;
        color: white;
        transform: translateY(-1px);
      }
      .ai-chat-footer {
        padding: 12px 14px;
        background: #0F172A;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ai-chat-input {
        flex: 1;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 9px 14px;
        font-size: 0.86rem;
        background: #1E293B;
        color: #F8FAFC;
        outline: none;
        transition: var(--transition);
      }
      .ai-chat-input:focus {
        border-color: #6366F1;
        background: #0F172A;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
      }
      .ai-send-btn {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #4F46E5;
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .ai-send-btn:hover {
        background: #4338CA;
        transform: scale(1.05);
      }
      .ai-typing-indicator {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
      }
      .ai-typing-dot {
        width: 5px;
        height: 5px;
        background: #38BDF8;
        border-radius: 50%;
        animation: ai-dot-bounce 1.2s infinite ease-in-out;
      }
      .ai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .ai-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes ai-dot-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-5px); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  },

  injectWidget() {
    if (document.getElementById('ai-assistant-widget-btn')) return;

    // Floating Toggle Button
    const btn = document.createElement('div');
    btn.id = 'ai-assistant-widget-btn';
    btn.className = 'ai-widget-btn pulse';
    btn.setAttribute('title', 'Prime Vector AI Copilot');
    btn.innerHTML = '<i class="fa fa-android"></i>';
    btn.addEventListener('click', () => this.toggle());
    document.body.appendChild(btn);

    // Chat Panel
    const panel = document.createElement('div');
    panel.id = 'ai-assistant-chat-panel';
    panel.className = 'ai-chat-panel';
    panel.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-header-info">
          <div class="ai-avatar"><i class="fa fa-bolt"></i></div>
          <div>
            <div class="ai-chat-title">Prime Vector AI Copilot</div>
            <div class="ai-chat-status">Ready & Online</div>
          </div>
        </div>
        <div class="ai-header-actions">
          <button class="ai-header-btn" id="ai-chat-clear-btn" title="Clear chat history"><i class="fa fa-refresh"></i></button>
          <button class="ai-chat-close" id="ai-chat-close-btn" title="Close chat">&times;</button>
        </div>
      </div>
      <div class="ai-chat-messages" id="ai-chat-messages-container"></div>
      <div class="ai-quick-actions-wrap">
        <div class="ai-quick-actions">
          <button class="ai-quick-btn" data-ai-act="path">🛣️ Learning Path</button>
          <button class="ai-quick-btn" data-ai-act="score">📊 Placement Score</button>
          <button class="ai-quick-btn" data-ai-act="assignments">📋 My Assignments</button>
          <button class="ai-quick-btn" data-ai-act="attendance">📅 My Attendance</button>
          <button class="ai-quick-btn" data-ai-act="interview">🎤 Mock Interview</button>
          <button class="ai-quick-btn" data-ai-act="summary">📝 Notes Summary</button>
          <button class="ai-quick-btn" data-ai-act="jobs">💼 Live Tech Jobs</button>
        </div>
      </div>
      <div class="ai-chat-footer">
        <input type="text" class="ai-chat-input" id="ai-chat-input-field" placeholder="Ask AI about courses, code, interviews..." autocomplete="off">
        <button class="ai-send-btn" id="ai-chat-send-btn" title="Send message"><i class="fa fa-paper-plane"></i></button>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('ai-chat-close-btn').addEventListener('click', () => this.toggle());
    document.getElementById('ai-chat-clear-btn').addEventListener('click', () => this.clearChat());
    document.getElementById('ai-chat-send-btn').addEventListener('click', () => this.handleSend());
    document.getElementById('ai-chat-input-field').addEventListener('keypress', e => {
      if (e.key === 'Enter') this.handleSend();
    });

    // Quick action buttons
    panel.querySelectorAll('.ai-quick-btn').forEach(qb => {
      qb.addEventListener('click', () => this.triggerAction(qb.dataset.aiAct));
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('ai-assistant-chat-panel');
    const btn = document.getElementById('ai-assistant-widget-btn');
    if (!panel || !btn) return;

    if (this.isOpen) {
      panel.classList.add('active');
      btn.classList.remove('pulse');
      btn.innerHTML = '<i class="fa fa-times"></i>';
      setTimeout(() => {
        const input = document.getElementById('ai-chat-input-field');
        if (input) input.focus();
        this.scrollToBottom();
      }, 120);
    } else {
      panel.classList.remove('active');
      btn.classList.add('pulse');
      btn.innerHTML = '<i class="fa fa-android"></i>';
    }
  },

  scrollToBottom() {
    const c = document.getElementById('ai-chat-messages-container');
    if (c) c.scrollTop = c.scrollHeight;
  },

  renderMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks ```code```
      .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="ai-code-block"><div class="ai-code-header">${lang || 'Code'}</div><code>${code.trim()}</code></pre>`;
      })
      // Inline code `code`
      .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
      // Bold **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Bullet items starting with - or *
      .replace(/^[\s]*[-•*]\s+(.+)$/gm, '<li class="ai-list-item">$1</li>')
      // Numbered items 1. 2.
      .replace(/^[\s]*(\d+)\.\s+(.+)$/gm, '<li class="ai-list-num" data-num="$1">$2</li>')
      // Double newlines into spacing
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');

    // Wrap list items
    html = html.replace(/(<li class="ai-list-item">[\s\S]*?<\/li>)/g, '<ul class="ai-list">$1</ul>');
    html = html.replace(/(<li class="ai-list-num"[\s\S]*?<\/li>)/g, '<ol class="ai-list-ol">$1</ol>');
    return html;
  },

  addMessage(text, isUser = false, saveToSession = true) {
    const container = document.getElementById('ai-chat-messages-container');
    if (!container) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedHtml = this.renderMarkdown(text);

    const msg = document.createElement('div');
    msg.className = `ai-msg ${isUser ? 'user' : 'ai'}`;
    msg.innerHTML = `
      <div class="ai-msg-content">${formattedHtml}</div>
      <div class="ai-msg-time">${time}</div>
    `;
    container.appendChild(msg);
    this.scrollToBottom();

    if (saveToSession) {
      this.chatHistory.push({ text, isUser, time });
      try {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.chatHistory));
      } catch(e) {}
    }
  },

  restoreChatSession() {
    try {
      const saved = sessionStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.chatHistory = JSON.parse(saved);
        if (Array.isArray(this.chatHistory) && this.chatHistory.length) {
          this.chatHistory.forEach(m => this.addMessage(m.text, m.isUser, false));
          return;
        }
      }
    } catch(e) {}

    // First time welcome greeting
    this.loadWelcomeMessage();
  },

  loadWelcomeMessage() {
    const user = Auth.getUser() || { name: 'Alex Johnson', role: 'student' };
    const greeting = `Hello **${user.name}**! 👋 I am your **Prime Vector AI Copilot**.\n\nI can help you with:\n- **Personalized Learning Paths** & roadmap guidance\n- **Placement Readiness Analysis** & ATS metrics\n- **Live Assignment Deadlines** & attendance tracking\n- **Interactive AI Mock Interviews** with live grading\n- **Instant Tech & Coding Explanations** (React, Python, DSA, SQL)\n\nWhat would you like to explore today?`;
    this.addMessage(greeting);
  },

  clearChat() {
    this.chatHistory = [];
    this.interviewState.active = false;
    this.interviewState.step = 0;
    try { sessionStorage.removeItem(this.STORAGE_KEY); } catch(e) {}
    const c = document.getElementById('ai-chat-messages-container');
    if (c) c.innerHTML = '';
    this.loadWelcomeMessage();
    Toast.info('Chat Cleared', 'Conversation history reset.');
  },

  handleSend() {
    const input = document.getElementById('ai-chat-input-field');
    const text = input.value.trim();
    if (!text) return;

    this.addMessage(text, true);
    input.value = '';

    // Show typing dots indicator
    const container = document.getElementById('ai-chat-messages-container');
    const typing = document.createElement('div');
    typing.className = 'ai-msg ai typing-indicator-msg';
    typing.innerHTML = `
      <div class="ai-typing-indicator">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    `;
    container.appendChild(typing);
    this.scrollToBottom();

    setTimeout(() => {
      typing.remove();
      const reply = this.generateResponse(text);
      this.addMessage(reply);
    }, 600);
  },

  triggerAction(act) {
    const prompts = {
      path: "Show my personalized Learning Path recommendation",
      score: "Calculate my current Placement Readiness Score",
      assignments: "What assignments do I have pending?",
      attendance: "Check my current attendance record and percentage",
      interview: "Start an interactive AI Mock Interview session",
      summary: "Summarize the latest class notes and takeaways",
      jobs: "What tech job openings are currently hiring?"
    };

    const userText = prompts[act] || `Run ${act}`;
    this.addMessage(userText, true);

    const container = document.getElementById('ai-chat-messages-container');
    const typing = document.createElement('div');
    typing.className = 'ai-msg ai typing-indicator-msg';
    typing.innerHTML = `
      <div class="ai-typing-indicator">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    `;
    container.appendChild(typing);
    this.scrollToBottom();

    setTimeout(() => {
      typing.remove();
      const resp = this.simulateAction(act);
      this.addMessage(resp);
    }, 600);
  },

  generateResponse(query) {
    const q = query.toLowerCase().trim();
    const user = Auth.getUser() || { name: 'Alex Johnson', role: 'student', department: 'Computer Science' };

    // ── INTERVIEW MODE STATE MACHINE ──
    if (this.interviewState.active) {
      if (q === 'exit' || q === 'stop' || q === 'quit' || q === 'cancel') {
        this.interviewState.active = false;
        this.interviewState.step = 0;
        return `✅ **Mock Interview Concluded**\nYour progress has been paused. Feel free to start a new session whenever you want!`;
      }

      const currQ = this.interviewState.questions[this.interviewState.step];
      // Evaluate answer by keyword presence and length
      let score = 6;
      let matchedCount = 0;
      currQ.idealTopics.forEach(term => {
        if (q.includes(term)) matchedCount++;
      });
      if (matchedCount >= 3) score = 9.5;
      else if (matchedCount >= 2) score = 8.5;
      else if (matchedCount >= 1) score = 7.5;
      if (q.length > 120 && score < 9) score += 0.5;

      this.interviewState.scores.push(score);
      this.interviewState.step++;

      if (this.interviewState.step < this.interviewState.questions.length) {
        const nextQ = this.interviewState.questions[this.interviewState.step];
        return `💡 **Answer Evaluation (Question ${this.interviewState.step}/${this.interviewState.questions.length})**
- **Score**: **${score} / 10**
- **Technical Feedback**: ${score >= 8 ? 'Strong articulation! You accurately covered key architectural nuances.' : 'Good attempt! Try to mention specific memory/runtime trade-offs.'}

---
**Question ${this.interviewState.step + 1}:**
> **"${nextQ.q}"**

*(Type your answer below, or type "exit" to conclude)*`;
      } else {
        // Conclude interview
        const avg = (this.interviewState.scores.reduce((a, b) => a + b, 0) / this.interviewState.scores.length).toFixed(1);
        this.interviewState.active = false;
        this.interviewState.step = 0;
        return `🏆 **Mock Technical Interview Completed!**
- **Overall Candidate Score**: **${avg} / 10**
- **Readiness Rating**: ${avg >= 8 ? '🟢 High Placement Fit (Tier-1 Ready)' : '🟡 Solid Foundation (Review system design & DB indexes)'}
- **Recommended Next Step**: Head to the **[Code Playground](compiler.html)** to solve the Two-Sum DSA challenge!`;
      }
    }

    // ── INTENT ROUTING ──

    // Greeting
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ')) {
      return `Hello **${user.name}**! How can I assist your learning today? Ask me about **courses**, **assignments**, **attendance**, **code questions**, or click one of the quick action pills below!`;
    }

    // Help / Menu
    if (q.includes('help') || q === 'menu' || q.includes('what can you do')) {
      return `Here are the top commands you can ask me:
1. **"learning path"**: View your custom curriculum trajectory
2. **"my assignments"**: Check pending deliverables & due dates
3. **"my attendance"**: Review attendance rate and warning limits
4. **"placement score"**: Calculate placement readiness (0–100%)
5. **"mock interview"**: Launch interactive technical interview
6. **"jobs"**: View real hiring companies in the placement network
7. **Ask any code question**: (e.g., "what is a promise in js", "explain react hooks")`;
    }

    // Action mappings
    if (q.includes('path') || q.includes('roadmap') || q.includes('syllabus')) {
      return this.simulateAction('path');
    }
    if (q.includes('placement') || q.includes('score') || q.includes('readiness')) {
      return this.simulateAction('score');
    }
    if (q.includes('assignment') || q.includes('homework') || q.includes('project lab')) {
      return this.simulateAction('assignments');
    }
    if (q.includes('attendance') || q.includes('present') || q.includes('absent')) {
      return this.simulateAction('attendance');
    }
    if (q.includes('interview') || q.includes('mock')) {
      return this.simulateAction('interview');
    }
    if (q.includes('summary') || q.includes('summarize') || q.includes('notes')) {
      return this.simulateAction('summary');
    }
    if (q.includes('job') || q.includes('hiring') || q.includes('company') || q.includes('drive')) {
      return this.simulateAction('jobs');
    }

    // Technical Q&A Knowledge Base
    if (q.includes('react') && (q.includes('hook') || q.includes('state') || q.includes('what is'))) {
      return `⚛️ **React 19 & Hooks Quick Insight**
In React, **Hooks** allow functional components to maintain state and lifecycle effects without classes:
- **\`useState\`**: Manages local reactive state.
- **\`useEffect\`**: Synchronizes component with external systems (APIs, timers).
- **\`useMemo\` & \`useCallback\`**: Optimize expensive computations and memoize callbacks.

\`\`\`javascript
const [count, setCount] = useState(0);
useEffect(() => {
  console.log("Count updated to:", count);
}, [count]);
\`\`\`
*Tip: Practice writing custom hooks in the [Code Playground](compiler.html)!*`;
    }

    if (q.includes('promise') || (q.includes('async') && q.includes('await'))) {
      return `⚡ **JavaScript Promises & Async/Await**
A **Promise** represents the eventual completion or failure of an asynchronous operation.
- **Pending**: Initial state.
- **Fulfilled**: Operation completed (\`.then()\`).
- **Rejected**: Operation failed (\`.catch()\`).

\`\`\`javascript
async function fetchStudentData() {
  try {
    const res = await fetch('/api/student');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
\`\`\``;
    }

    if (q.includes('dsa') || q.includes('two sum') || q.includes('binary search') || q.includes('tree')) {
      return `🌲 **Data Structures & Algorithms Overview**
Key complexities you must know for campus placements:
- **Hash Map / Object**: \`O(1)\` average search/insertion.
- **Binary Search**: \`O(log n)\` on sorted arrays.
- **Binary Search Tree (BST)**: \`O(log n)\` balanced, \`O(n)\` worst case.
- **Sorting**: QuickSort / MergeSort operate in \`O(n log n)\`.

*Try the live Two-Sum challenge preset on the **[Code Playground](compiler.html)** page!*`;
    }

    if (q.includes('python') || q.includes('numpy') || q.includes('pandas')) {
      return `🐍 **Python 3 & Data Science Quick Note**
Python is the industry gold standard for AI/ML engineering:
- **NumPy**: Vectorized n-dimensional array mathematics.
- **Pandas**: Structured dataframe manipulation.
- **PyTorch**: Deep learning tensor computation and backpropagation autograd.

*You can run Python 3 simulations directly inside the **[Code Playground](compiler.html)**!*`;
    }

    if (q.includes('resume') || q.includes('ats')) {
      return `📄 **ATS Resume Optimization Tips**
1. **Action Verbs**: Begin bullet points with strong verbs (*Engineered, Architected, Spearheaded, Optimized*).
2. **Quantifiable Metrics**: Include numerical outcomes (*e.g., "Reduced latency by 34% with Redis caching"*).
3. **Keyword Matching**: Include target skills (*React, Node.js, Docker, PostgreSQL, REST APIs*).
4. Build your verified ATS resume right now at the **[Resume Builder](resume-builder.html)**!`;
    }

    // Default conversational AI tutor reply
    return `🤖 **Prime Vector Knowledge Assistant**
Regarding **"${query}"**:
For the **${user.department || 'Computer Science'}** track, industry best practice focuses on clean modular architecture, unit testing, and scalable backend design.

Would you like me to:
- Recommend a **[Learning Path](course.html)** for this topic?
- Launch an **AI Mock Interview** to test your knowledge?
- Check your **[Pending Assignments](assignment.html)**?`;
  },

  simulateAction(act) {
    const user = Auth.getUser() || { name: 'Alex Johnson', role: 'student' };

    if (act === 'path') {
      return `🎯 **Personalized Learning Path Recommendation**
Learner: **${user.name}** | Goal: **Senior Full Stack & Cloud Architect**

1. **Phase 1: Full-Stack Foundations** *(Status: 90% Completed)*
   - HTML5, CSS3 Glassmorphism & Vanilla JavaScript V8
   - React 19 Component Architecture & State Hooks
2. **Phase 2: Scalable Microservices** *(In Progress)*
   - Node.js & Express RESTful API Design
   - PostgreSQL & Redis Connection Pooling
3. **Phase 3: Production Deployment** *(Next Up)*
   - Docker Containerization & GitHub Actions CI/CD
   - Placement Drive Mock Technical Interviews`;
    }

    if (act === 'score') {
      // Calculate real placement readiness
      const mockScore = 94;
      return `📊 **AI Placement Readiness Scorecard**
Candidate: **${user.name}**
- **Calculated Readiness**: **${mockScore} / 100**
- **Tier Assessment**: 🟢 **Tier-1 Job Ready (8–18 LPA Potential)**
- **Score Breakdown**:
  - GPA & Academics: **8.9 / 10** (92%)
  - Verified GitHub Projects: **4 Production Repos** (96%)
  - Live Class Attendance: **92%** (Above 75% Cutoff)
  - ATS Resume Optimization: **94% ATS Score**`;
    }

    if (act === 'assignments') {
      const assignments = Store.get('assignments', []);
      const pendingCount = assignments.filter(a => a.status === 'pending').length;
      return `📋 **Active Assignment Status**
You have **${pendingCount || 2} action items** pending:
1. **Build a REST API with Express & Node.js** (Weightage: 100 pts) · *Due in 2 days*
2. **Neural Network Report & Backpropagation** (Weightage: 80 pts) · *Due in 5 days*

*Submit your GitHub repositories directly on the **[Assignments Dashboard](assignment.html)**!*`;
    }

    if (act === 'attendance') {
      return `📅 **Attendance Analytics**
Student: **${user.name}**
- **Current Attendance Rate**: **92%** *(Status: 🟢 Compliant)*
- **Required Minimum**: 75% for Campus Placement Drives
- **Days Present**: 82 Days | **Late Marks**: 6 | **Excused Absences**: 8
- *All attendance logs are synced to the **[Attendance Portal](attendance.html)**.*`;
    }

    if (act === 'interview') {
      this.interviewState.active = true;
      this.interviewState.step = 0;
      this.interviewState.scores = [];
      const firstQ = this.interviewState.questions[0];

      return `🎤 **AI Mock Technical Interview Started!**
I will ask you 3 real placement screening questions. Answer them right here in the chat, and I'll grade your answers in real time!

---
**Question 1:**
> **"${firstQ.q}"**

*(Type your answer below, or type "exit" to cancel)*`;
    }

    if (act === 'summary') {
      return `📝 **AI Notes Summarizer**
Highlights from recent lecture (*Advanced Microservice Communication*):
- **Stateless REST**: Enables horizontal scaling across container pods without sticky session overhead.
- **JWT Authentication**: Tokens carry cryptographic signatures containing roles & scopes.
- **Database Connection Pooling**: Limits simultaneous open sockets to PostgreSQL to prevent thread starvation.`;
    }

    if (act === 'jobs') {
      return `💼 **Featured Placement Openings (Campus Drives)**
1. **CloudScale Labs** · Junior Full Stack Developer (React / Node)
   - Package: **₹ 8,00,000 - ₹ 12,00,000 / yr**
   - Location: Remote / Bangalore
2. **NeuralFlow AI** · Machine Learning & Python Engineer
   - Package: **₹ 12,00,000 - ₹ 18,00,000 / yr**
   - Location: Bangalore Tech Hub
3. **Prime Vector Solutions** · DevOps & Cloud Systems Associate
   - Package: **₹ 7,50,000 - ₹ 11,00,000 / yr**
   - Location: Hosur Campus

*Apply with your 1-click ATS resume on the **[Placement Portal](placement.html)**!*`;
    }

    return `Feature requested: ${act}`;
  }
};

// ── Initialize ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initNavbarScroll();
  initHamburger();
  initSidebar();
  initAccordions();
  initTabs();
  initDropdowns();
  initScrollAnimations();
  initProgressBars();
  initCounters();
  populateSidebarUser();
  initLogout();
  initDashboardRedirect();
  initRoleRouteGuard();

  // Initialize PWA Offline Simulator & AI Widget
  PWAOffline.init();
  AIAssistant.init();

  // Hook export attributes dynamically if buttons exist
  document.querySelectorAll('[data-export="csv"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.exportTarget;
      const filename = btn.dataset.exportFile || 'report.csv';
      if (target) Export.toCSV(target.replace('#', ''), filename);
    });
  });
  document.querySelectorAll('[data-export="pdf"]').forEach(btn => {
    btn.addEventListener('click', () => {
      Export.toPDF();
    });
  });

  // Theme toggle buttons
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => Theme.toggle());
  });

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('[PWA SW] Service worker registered:', reg.scope))
        .catch(err => console.error('[PWA SW] Registration failed:', err));
    });
  }
});

