/* ============================================================
   Prime Vector LMS — Real-Time Data Engine (realtime-engine.js)
   ============================================================ */

const RealTimeEngine = {
  events: [],
  listeners: [],
  intervalId: null,
  activeUsers: 154,
  codeExecutionsToday: 3842,
  
  sampleActivities: [
    { type: 'enroll', text: 'Priya Sharma enrolled in Artificial Intelligence Bootcamp', icon: 'fa-graduation-cap', color: '#2563EB' },
    { type: 'quiz', text: 'Alex Johnson scored 96% on Python Functions Quiz', icon: 'fa-check-circle', color: '#10B981' },
    { type: 'compiler', text: 'Rahul Kumar executed C++ Algorithm in Code Sandbox', icon: 'fa-code', color: '#00F2FE' },
    { type: 'faculty', text: 'Dr. Sarah Chen scheduled a Live Cloud Security Workshop', icon: 'fa-video-camera', color: '#8B5CF6' },
    { type: 'cert', text: 'Ananya Roy unlocked Prime Vector Certified Full-Stack Diploma', icon: 'fa-certificate', color: '#F59E0B' },
    { type: 'placement', text: 'Vikram M. submitted resume for TechSolutions Placement Drive', icon: 'fa-briefcase', color: '#EC4899' },
    { type: 'assignment', text: 'Kavita N. submitted Microservices Capstone Project', icon: 'fa-tasks', color: '#14B8A6' },
    { type: 'sandbox', text: 'Siddharth T. tested SQL Query in W3 Sandbox', icon: 'fa-database', color: '#6366F1' }
  ],

  init() {
    // Seed initial 4 events
    const now = Date.now();
    this.events = [
      { id: 1, text: 'System Online — Prime Vector Real-Time Engine Active', icon: 'fa-server', color: '#10B981', timestamp: now - 12000 },
      { id: 2, text: 'Alex Johnson enrolled in AI & Machine Learning', icon: 'fa-graduation-cap', color: '#2563EB', timestamp: now - 8000 },
      { id: 3, text: 'Dr. Sarah Chen uploaded Advanced React Notes', icon: 'fa-sticky-note-o', color: '#8B5CF6', timestamp: now - 4000 },
      { id: 4, text: 'Rahul K. completed W3 Sandbox C++ Lab', icon: 'fa-code', color: '#00F2FE', timestamp: now - 1000 }
    ];

    this.startSimulation();
  },

  startSimulation() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.generateRandomEvent();
    }, 4500);
  },

  generateRandomEvent() {
    const template = this.sampleActivities[Math.floor(Math.random() * this.sampleActivities.length)];
    // Tweak active users randomly
    this.activeUsers += Math.floor(Math.random() * 5) - 2;
    this.activeUsers = Math.max(130, Math.min(185, this.activeUsers));
    this.codeExecutionsToday += 1;

    const newEvent = {
      id: Date.now(),
      text: template.text,
      icon: template.icon,
      color: template.color,
      timestamp: Date.now()
    };

    this.pushEvent(newEvent);
  },

  pushEvent(event) {
    this.events.unshift(event);
    if (this.events.length > 20) this.events.pop();

    // Notify all subscriber callbacks
    this.listeners.forEach(cb => {
      try { cb(event, this.getLiveMetrics()); } catch(e) {}
    });
  },

  subscribe(callback) {
    this.listeners.push(callback);
    // Send immediate snapshot
    callback(this.events[0], this.getLiveMetrics());
  },

  getLiveMetrics() {
    return {
      activeUsers: this.activeUsers,
      codeExecutionsToday: this.codeExecutionsToday,
      recentEvents: this.events
    };
  },

  formatRelativeTime(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 3) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  RealTimeEngine.init();
});
