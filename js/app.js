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

// ── Global AI Assistant Chatbot Panel ─────────────────────────
const AIAssistant = {
  chatHistory: [],
  isOpen: false,

  init() {
    const user = Auth.getUser();
    if (!user) return; // Only load for authenticated users
    this.injectStyles();
    this.injectWidget();
    this.loadWelcomeMessage();
  },

  injectStyles() {
    if (document.getElementById('ai-assistant-styles')) return;
    const style = document.createElement('style');
    style.id = 'ai-assistant-styles';
    style.textContent = `
      .offline-badge-btn {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 6px 12px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: var(--transition);
        margin-right: 8px;
      }
      .offline-badge-btn:hover {
        background: var(--border);
      }
      .ai-widget-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563EB 0%, #10B981 100%);
        color: white;
        box-shadow: 0 8px 30px rgba(37,99,235,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 10000;
        transition: var(--transition);
      }
      .ai-widget-btn:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 12px 35px rgba(37,99,235,0.5);
      }
      .ai-widget-btn.pulse::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        top: 0; left: 0;
        opacity: 0.4;
        animation: ai-pulse 2s infinite;
        z-index: -1;
      }
      @keyframes ai-pulse {
        0% { transform: scale(1); opacity: 0.4; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      .ai-chat-panel {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 380px;
        height: 520px;
        max-height: calc(100vh - 120px);
        border-radius: var(--radius-md);
        background: var(--surface);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .ai-chat-panel.active {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
      }
      .ai-chat-header {
        background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ai-chat-header-info { display: flex; align-items: center; gap: 10px; }
      .ai-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
      .ai-chat-title { font-weight: 700; font-size: 0.95rem; font-family: var(--font-display); }
      .ai-chat-status { font-size: 0.72rem; color: #93C5FD; display: flex; align-items: center; gap: 4px; }
      .ai-chat-status::before { content:''; width: 6px; height: 6px; background:#10B981; border-radius: 50%; display:inline-block; }
      .ai-chat-close { background: none; color: rgba(255,255,255,0.7); font-size: 1.25rem; transition: var(--transition); }
      .ai-chat-close:hover { color: white; }
      .ai-chat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: var(--bg);
      }
      .ai-msg { display: flex; flex-direction: column; max-width: 80%; padding: 12px 16px; border-radius: var(--radius); font-size: 0.85rem; line-height: 1.5; }
      .ai-msg.ai { background: var(--surface); color: var(--text); border-top-left-radius: 2px; border: 1px solid var(--border); }
      .ai-msg.user { background: var(--primary); color: white; border-top-right-radius: 2px; align-self: flex-end; }
      .ai-msg-time { font-size: 0.65rem; color: var(--text-light); margin-top: 4px; align-self: flex-end; }
      .ai-msg.user .ai-msg-time { color: rgba(255,255,255,0.7); }
      .ai-quick-actions {
        padding: 10px 16px;
        background: var(--surface);
        border-top: 1px solid var(--border);
        display: flex;
        gap: 8px;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
      }
      .ai-quick-actions::-webkit-scrollbar { display: none; }
      .ai-quick-btn {
        padding: 6px 12px;
        border-radius: var(--radius-full);
        background: var(--primary-light);
        color: var(--primary);
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
        border: 1px solid transparent;
      }
      .ai-quick-btn:hover {
        background: var(--primary);
        color: white;
      }
      .ai-chat-footer {
        padding: 12px 16px;
        background: var(--surface);
        border-top: 1px solid var(--border);
        display: flex;
        gap: 8px;
      }
      .ai-chat-input {
        flex: 1;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 8px 14px;
        font-size: 0.85rem;
        background: var(--bg);
        color: var(--text);
        transition: var(--transition);
      }
      .ai-chat-input:focus {
        border-color: var(--primary);
        background: var(--surface);
      }
      .ai-send-btn {
        width: 36px; height: 36px; border-radius: var(--radius);
        background: var(--primary); color: white;
        display: flex; align-items: center; justify-content: center;
        transition: var(--transition);
      }
      .ai-send-btn:hover { background: var(--primary-hover); transform: scale(1.05); }
    `;
    document.head.appendChild(style);
  },

  injectWidget() {
    if (document.getElementById('ai-assistant-widget-btn')) return;

    // Toggle button
    const btn = document.createElement('div');
    btn.id = 'ai-assistant-widget-btn';
    btn.className = 'ai-widget-btn pulse';
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
          <div class="ai-avatar"><i class="fa fa-android" style="color:#60A5FA"></i></div>
          <div>
            <div class="ai-chat-title">Prime Vector AI Tutor & Advisor</div>
            <div class="ai-chat-status">Always active</div>
          </div>
        </div>
        <button class="ai-chat-close" id="ai-chat-close-btn">&times;</button>
      </div>
      <div class="ai-chat-messages" id="ai-chat-messages-container"></div>
      <div class="ai-quick-actions">
        <button class="ai-quick-btn" data-ai-act="path">🛣️ Learning Path</button>
        <button class="ai-quick-btn" data-ai-act="score">📊 Placement Score</button>
        <button class="ai-quick-btn" data-ai-act="summary">📝 Summarize Notes</button>
        <button class="ai-quick-btn" data-ai-act="interview">🎤 Mock Interview</button>
        <button class="ai-quick-btn" data-ai-act="verify">🔍 Verify Cert</button>
      </div>
      <div class="ai-chat-footer">
        <input type="text" class="ai-chat-input" id="ai-chat-input-field" placeholder="Ask Prime Vector AI anything...">
        <button class="ai-send-btn" id="ai-chat-send-btn"><i class="fa fa-paper-plane"></i></button>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('ai-chat-close-btn').addEventListener('click', () => this.toggle());
    document.getElementById('ai-chat-send-btn').addEventListener('click', () => this.handleSend());
    document.getElementById('ai-chat-input-field').addEventListener('keypress', e => {
      if (e.key === 'Enter') this.handleSend();
    });

    // Quick action hooks
    panel.querySelectorAll('.ai-quick-btn').forEach(qb => {
      qb.addEventListener('click', () => this.triggerAction(qb.dataset.aiAct));
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('ai-assistant-chat-panel');
    const btn = document.getElementById('ai-assistant-widget-btn');
    if (this.isOpen) {
      panel.classList.add('active');
      btn.classList.remove('pulse');
      btn.innerHTML = '<i class="fa fa-times"></i>';
      // scroll to bottom
      setTimeout(() => {
        const c = document.getElementById('ai-chat-messages-container');
        c.scrollTop = c.scrollHeight;
      }, 100);
    } else {
      panel.classList.remove('active');
      btn.classList.add('pulse');
      btn.innerHTML = '<i class="fa fa-android"></i>';
    }
  },

  addMessage(text, isUser = false) {
    const container = document.getElementById('ai-chat-messages-container');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `ai-msg ${isUser ? 'user' : 'ai'}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msg.innerHTML = `
      <div>${text}</div>
      <div class="ai-msg-time">${time}</div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  },

  loadWelcomeMessage() {
    const user = Auth.getUser() || { name: 'User', role: 'student' };
    const greeting = `Hello ${user.name}! I am your **Prime Vector AI Assistant**. I can help guide your learning path, analyze your resume, predictions, or run an AI Mock Interview with you. How can I help you today?`;
    this.addMessage(greeting);
  },

  handleSend() {
    const input = document.getElementById('ai-chat-input-field');
    const text = input.value.trim();
    if (!text) return;

    this.addMessage(text, true);
    input.value = '';

    // Show simulated typing status
    const container = document.getElementById('ai-chat-messages-container');
    const typing = document.createElement('div');
    typing.className = 'ai-msg ai typing-indicator-msg';
    typing.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Prime Vector AI is thinking...`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const reply = this.generateResponse(text);
      this.addMessage(reply);
    }, 1000);
  },

  generateResponse(query) {
    const q = query.toLowerCase();
    const user = Auth.getUser() || { name: 'Alex Johnson', role: 'student' };

    if (q.includes('help') || q.includes('menu')) {
      return `Here is what I can do for you:
1. **🛣️ Learning Path**: Type "path" to view personalized syllabus recommendations.
2. **📊 Placement Score**: Type "readiness" to get placement score analytics.
3. **📝 Summarize Notes**: Type "summarize" to generate lecture highlights.
4. **🎤 Mock Interview**: Type "interview" to start simulator.
5. **🔍 Verify Certificate**: Type "verify [cert-id]" to run verification.`;
    }

    if (q.includes('path') || q.includes('roadmap') || q.includes('learning')) {
      return this.simulateAction('path');
    }

    if (q.includes('readiness') || q.includes('placement') || q.includes('score')) {
      return this.simulateAction('score');
    }

    if (q.includes('summarize') || q.includes('summary') || q.includes('notes')) {
      return this.simulateAction('summary');
    }

    if (q.includes('interview') || q.includes('mock')) {
      return this.simulateAction('interview');
    }

    if (q.includes('verify')) {
      return this.simulateAction('verify');
    }

    if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
      return `Hello ${user.name}! Feel free to ask me questions about your curriculum, assignments, career paths, or try out my mock interview simulator.`;
    }

    // Default conversational AI tutor replies
    return `Based on Prime Vector Knowledge Base for ${user.department || 'Computer Science'}:
I recommend focusing on **Advanced SQL Optimization** and **REST API Security Protocols** this week.
*Tip: Completing the current "Project Module" increases your simulated Placement Readiness Score by 12%!*`;
  },

  triggerAction(act) {
    this.addMessage(`Triggering AI ${act.toUpperCase()} Feature...`, true);
    setTimeout(() => {
      const resp = this.simulateAction(act);
      this.addMessage(resp);
    }, 600);
  },

  simulateAction(act) {
    const user = Auth.getUser() || { name: 'Alex Johnson', role: 'student' };
    if (act === 'path') {
      return `🎯 **AI Personalized Learning Path Recommendation**
Role Goal: **Full Stack Engineer**
- **Complete**: Web Dev Basics (100% completed)
- **Current Weak Spot**: JavaScript Async / Promises (Score: 68%)
- **Recommended Actions**:
  1. Complete Module 4 (Advanced JS)
  2. Take "Async Code Quiz"
  3. Spend 2.5 hours on code compiler.`;
    }

    if (act === 'score') {
      const gpa = 8.8;
      const attendance = 92;
      const projects = 2;
      const mockScore = Math.round(75 + (gpa * 2) + (attendance / 10) + (projects * 2));
      
      let assessment = '🟢 Excellent Readiness';
      if (mockScore < 70) assessment = '🔴 At-Risk (Needs immediate practice)';
      else if (mockScore < 85) assessment = '🟡 Moderate (Prepare resume + portfolios)';

      return `📊 **AI Placement Readiness Assessment**
Student: **${user.name}**
- **Calculated Readiness Score**: **${mockScore}/100**
- **Status**: ${assessment}
- **Factors Analyzed**:
  - GPA: 8.8/10
  - Attendance: ${attendance}%
  - Verified Certificates: 2
  - Core Skill Gap: Cloud Services Integration.`;
    }

    if (act === 'summary') {
      return `📝 **AI Notes Summarizer**
Generated summary from last live recorded class (*Advanced Backend Development*):
- **Core Topic**: REST API architectures and microservice patterns.
- **Key Takeaways**:
  1. Stateless communication is preferred for horizontal scaling.
  2. Use JSON Web Tokens (JWT) for secure authentication.
  3. Implementation of rate-limiting filters prevents DDoS threats.
- **Auto-generated Quiz Question**: What does JWT stand for? (*Answer: JSON Web Token*)`;
    }

    if (act === 'interview') {
      return `🎤 **AI Mock Interview Coach**
Let's begin! Answer this question in the chat box:
**"Explain the difference between synchronous and asynchronous code in JavaScript, and when would you use async?"**
*(Reply directly, I will evaluate and score your answer)*`;
    }

    if (act === 'verify') {
      const demoId = 'ACAD-' + Math.floor(Math.random() * 900000 + 100000);
      return `🔍 **AI Certificate Verification Portal**
- **Format**: Certificate ID must follow "ACAD-XXXXXX"
- **Demo verification**:
  - Code \`${demoId}\` status: **🟢 VERIFIED**
  - Issuer: Prime Vector LMS Smart Contract
  - Recipient: **${user.name}**
  - Signee: Dr. Sarah Chen (Digital Signature SHA-256 Verified).`;
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

