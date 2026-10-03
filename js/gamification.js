/* ============================================================
   Prime Vector LMS — Gamification Engine
   XP System · Badges · Leaderboard · Streaks
   ============================================================ */

const Gamification = (() => {
  const XP_KEY     = 'Prime Vector_xp';
  const BADGES_KEY = 'Prime Vector_badges';
  const STREAK_KEY = 'Prime Vector_streak';
  const LAST_KEY   = 'Prime Vector_last_login';

  /* ── XP Thresholds per Level ─────────────────────────────── */
  const LEVELS = [
    { level: 1, name: 'Newcomer',   minXP: 0    },
    { level: 2, name: 'Explorer',   minXP: 200  },
    { level: 3, name: 'Learner',    minXP: 500  },
    { level: 4, name: 'Scholar',    minXP: 1000 },
    { level: 5, name: 'Achiever',   minXP: 2000 },
    { level: 6, name: 'Expert',     minXP: 3500 },
    { level: 7, name: 'Master',     minXP: 5500 },
    { level: 8, name: 'Champion',   minXP: 8000 },
    { level: 9, name: 'Legend',     minXP: 11000 },
    { level: 10, name: 'Grandmaster', minXP: 15000 }
  ];

  /* ── Badge Definitions ────────────────────────────────────── */
  const BADGE_DEFS = [
    { id: 'first_login',    icon: '🎉', name: 'First Login',      desc: 'Welcome to Prime Vector!',              xp: 50  },
    { id: 'streak_3',       icon: '🔥', name: '3-Day Streak',     desc: 'Login 3 days in a row',           xp: 100 },
    { id: 'streak_7',       icon: '⚡', name: 'Week Warrior',     desc: '7-day login streak',              xp: 250 },
    { id: 'streak_30',      icon: '🌟', name: 'Month Master',     desc: '30-day login streak',             xp: 750 },
    { id: 'quiz_first',     icon: '🧠', name: 'Quiz Taker',       desc: 'Complete your first quiz',        xp: 100 },
    { id: 'quiz_ace',       icon: '🏆', name: 'Quiz Ace',         desc: 'Score 90%+ on any quiz',          xp: 200 },
    { id: 'assignment_sub', icon: '📝', name: 'Submitter',        desc: 'Submit your first assignment',    xp: 100 },
    { id: 'course_complete',icon: '🎓', name: 'Course Graduate',  desc: 'Complete a full course',          xp: 500 },
    { id: 'attendance_90',  icon: '📅', name: 'Attendance Pro',   desc: 'Maintain 90%+ attendance',        xp: 300 },
    { id: 'resume_done',    icon: '📄', name: 'Resume Ready',     desc: 'Complete your resume',            xp: 150 },
    { id: 'portfolio_done', icon: '🌐', name: 'Portfolio Pro',    desc: 'Publish your portfolio',          xp: 200 },
    { id: 'placement_ready',icon: '💼', name: 'Job Ready',        desc: 'Achieve 80%+ placement readiness', xp: 400 },
    { id: 'internship_done',icon: '🏢', name: 'Industry Expert',  desc: 'Complete your internship',        xp: 600 },
    { id: 'project_done',   icon: '🚀', name: 'Builder',          desc: 'Submit your final project',       xp: 500 },
    { id: 'cert_earned',    icon: '🥇', name: 'Certified',        desc: 'Earn your first certificate',     xp: 300 },
    { id: 'early_bird',     icon: '🌅', name: 'Early Bird',       desc: 'Login before 8 AM',               xp: 75  },
    { id: 'night_owl',      icon: '🦉', name: 'Night Owl',        desc: 'Study after 10 PM',               xp: 75  },
    { id: 'forum_post',     icon: '💬', name: 'Contributor',      desc: 'Post in the discussion forum',    xp: 50  },
    { id: 'top3_leader',    icon: '👑', name: 'Top Performer',    desc: 'Reach top 3 on leaderboard',      xp: 500 },
    { id: 'perfect_score',  icon: '💯', name: 'Perfect Score',    desc: 'Get 100% on any quiz',            xp: 300 }
  ];

  /* ── Leaderboard Mock Data ────────────────────────────────── */
  const LEADERBOARD = [
    { rank:1,  name:'Arjun Mehta',    dept:'CS',   xp:8420, level:'Master',   avatar:'AM', color:'#2563EB' },
    { rank:2,  name:'Priya Sharma',   dept:'ECE',  xp:7850, level:'Expert',   avatar:'PS', color:'#10B981' },
    { rank:3,  name:'Rohit Kumar',    dept:'CS',   xp:6920, level:'Expert',   avatar:'RK', color:'#8B5CF6' },
    { rank:4,  name:'Sneha Nair',     dept:'IT',   xp:5640, level:'Achiever', avatar:'SN', color:'#F59E0B' },
    { rank:5,  name:'Kiran Patel',    dept:'ME',   xp:4890, level:'Achiever', avatar:'KP', color:'#EF4444' },
    { rank:6,  name:'Deepa Reddy',    dept:'CS',   xp:4200, level:'Scholar',  avatar:'DR', color:'#14B8A6' },
    { rank:7,  name:'Aman Verma',     dept:'ECE',  xp:3750, level:'Scholar',  avatar:'AV', color:'#F97316' },
    { rank:8,  name:'Nisha Thomas',   dept:'IT',   xp:3100, level:'Learner',  avatar:'NT', color:'#EC4899' },
    { rank:9,  name:'Vijay Gupta',    dept:'CS',   xp:2680, level:'Learner',  avatar:'VG', color:'#6366F1' },
    { rank:10, name:'Pooja Iyer',     dept:'ME',   xp:2200, level:'Learner',  avatar:'PI', color:'#84CC16' }
  ];

  /* ── Storage Helpers ─────────────────────────────────────── */
  function getXP()      { return parseInt(localStorage.getItem(XP_KEY) || '1250'); }
  function setXP(v)     { localStorage.setItem(XP_KEY, v); }
  function getBadges()  { try { return JSON.parse(localStorage.getItem(BADGES_KEY) || '["first_login","quiz_first","streak_3"]'); } catch { return []; } }
  function setBadges(v) { localStorage.setItem(BADGES_KEY, JSON.stringify(v)); }
  function getStreak()  { return parseInt(localStorage.getItem(STREAK_KEY) || '12'); }

  function getLevel(xp) {
    let lvl = LEVELS[0];
    for (const l of LEVELS) { if (xp >= l.minXP) lvl = l; }
    return lvl;
  }
  function getNextLevel(xp) {
    const idx = LEVELS.findIndex(l => l.minXP > xp);
    return idx === -1 ? null : LEVELS[idx];
  }
  function getXPPercent(xp) {
    const cur  = getLevel(xp);
    const next = getNextLevel(xp);
    if (!next) return 100;
    const range = next.minXP - cur.minXP;
    const done  = xp - cur.minXP;
    return Math.round((done / range) * 100);
  }

  /* ── Award XP ────────────────────────────────────────────── */
  function awardXP(amount, reason) {
    const prev = getXP();
    const next = prev + amount;
    setXP(next);

    const prevLvl = getLevel(prev);
    const nextLvl = getLevel(next);

    if (typeof Toast !== 'undefined') {
      Toast.success(`+${amount} XP`, reason || 'XP Earned!');
      if (prevLvl.level < nextLvl.level) {
        setTimeout(() => Toast.success('🎉 Level Up!', `You are now ${nextLvl.name} (Level ${nextLvl.level})`), 800);
      }
    }
    return next;
  }

  /* ── Unlock Badge ────────────────────────────────────────── */
  function unlockBadge(id) {
    const badges = getBadges();
    if (badges.includes(id)) return false;
    const def = BADGE_DEFS.find(b => b.id === id);
    if (!def) return false;
    badges.push(id);
    setBadges(badges);
    awardXP(def.xp, `Badge Unlocked: ${def.name}!`);
    return true;
  }

  /* ── Update Streak ───────────────────────────────────────── */
  function updateStreak() {
    const last = localStorage.getItem(LAST_KEY);
    const today = new Date().toDateString();
    if (last === today) return getStreak();

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let streak = last === yesterday ? getStreak() + 1 : 1;

    localStorage.setItem(STREAK_KEY, streak);
    localStorage.setItem(LAST_KEY, today);

    if (streak === 3)  unlockBadge('streak_3');
    if (streak === 7)  unlockBadge('streak_7');
    if (streak === 30) unlockBadge('streak_30');

    return streak;
  }

  /* ── Render XP Bar ───────────────────────────────────────── */
  function renderXPBar(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const xp = getXP();
    const lvl = getLevel(xp);
    const next = getNextLevel(xp);
    const pct = getXPPercent(xp);

    el.innerHTML = `
      <div class="streak-counter" style="margin-bottom:12px">
        <span class="streak-flame">🔥</span>
        <div>
          <div class="streak-number">${getStreak()}</div>
          <div class="streak-label">Day Streak</div>
        </div>
        <div style="flex:1;text-align:right">
          <span class="level-badge"><i class="fa fa-star"></i> ${lvl.name} · Lv ${lvl.level}</span>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">
        <span><strong style="color:var(--text)">${xp.toLocaleString()} XP</strong></span>
        <span>${next ? next.minXP.toLocaleString() + ' XP' : 'MAX'}</span>
      </div>
      <div class="xp-bar-wrap">
        <div class="xp-bar" style="width:${pct}%"></div>
      </div>
      <div style="text-align:right;font-size:0.72rem;color:var(--text-muted);margin-top:3px">${pct}% to ${next ? next.name : 'Max Level'}</div>
    `;
  }

  /* ── Render Badges ───────────────────────────────────────── */
  function renderBadges(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const earned = getBadges();
    const defs = limit ? BADGE_DEFS.slice(0, limit) : BADGE_DEFS;

    el.innerHTML = defs.map(b => {
      const unlocked = earned.includes(b.id);
      return `
        <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}" title="${b.desc}">
          ${unlocked ? '<span class="badge-unlocked-tag">Earned</span>' : ''}
          <span class="badge-icon">${b.icon}</span>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${unlocked ? b.desc : '???'}</div>
          ${unlocked ? `<div style="font-size:0.7rem;color:#F59E0B;margin-top:6px;font-weight:700">+${b.xp} XP</div>` : ''}
        </div>
      `;
    }).join('');
  }

  /* ── Render Leaderboard ──────────────────────────────────── */
  function renderLeaderboard(containerId, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const rows = limit ? LEADERBOARD.slice(0, limit) : LEADERBOARD;
    const rankClasses = ['gold', 'silver', 'bronze'];

    el.innerHTML = rows.map(r => `
      <div class="leaderboard-row">
        <div class="leaderboard-rank ${rankClasses[r.rank - 1] || 'other'}">${r.rank}</div>
        <div class="leaderboard-avatar" style="background:${r.color}">${r.avatar}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${r.name}</div>
          <div class="leaderboard-dept">${r.dept}</div>
        </div>
        <div>
          <div class="leaderboard-xp">${r.xp.toLocaleString()} XP</div>
          <div style="text-align:right;margin-top:3px">
            <span class="leaderboard-level">${r.level}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ── Progress Ring ───────────────────────────────────────── */
  function createProgressRing(value, color, label, size) {
    const sz = size || 120;
    const r = (sz / 2) - 10;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return `
      <div class="progress-ring-wrap" style="width:${sz}px;height:${sz}px">
        <svg class="progress-ring-svg" width="${sz}" height="${sz}">
          <circle class="progress-ring-track" cx="${sz/2}" cy="${sz/2}" r="${r}"/>
          <circle class="progress-ring-fill" cx="${sz/2}" cy="${sz/2}" r="${r}"
            stroke="${color || '#2563EB'}"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${offset}"/>
        </svg>
        <div class="progress-ring-label">
          <span class="progress-ring-value">${value}%</span>
          <span class="progress-ring-text">${label || ''}</span>
        </div>
      </div>
    `;
  }

  /* ── Calculate Overall Progress ──────────────────────────── */
  function calcOverallProgress(metrics) {
    const weights = {
      courseProgress:    0.20,
      attendancePercent: 0.15,
      assignmentCompletion: 0.15,
      quizAvg:           0.15,
      internshipProgress:0.10,
      projectProgress:   0.10,
      videoCompletion:   0.10,
      resumeScore:       0.05
    };
    let total = 0, wSum = 0;
    for (const [k, w] of Object.entries(weights)) {
      if (metrics[k] !== undefined) {
        total += metrics[k] * w;
        wSum += w;
      }
    }
    return wSum > 0 ? Math.round(total / wSum) : 0;
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    getXP, setXP, awardXP, getBadges, unlockBadge,
    getStreak, updateStreak, getLevel, getNextLevel, getXPPercent,
    renderXPBar, renderBadges, renderLeaderboard,
    createProgressRing, calcOverallProgress,
    BADGE_DEFS, LEADERBOARD, LEVELS
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  Gamification.updateStreak();
});
