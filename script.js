/**
 * SMART STUDY PLANNER - COMPLETE APPLICATION CONTROLLER
 * Vanilla JavaScript (ES6+), localStorage persistence, Chart.js analytics,
 * Rule-based timetable generator, and Pomodoro focus engine.
 */

(function () {
    'use strict';

    // =========================================================================
    // STORAGE KEYS & CONSTANTS
    // =========================================================================
    const STORAGE_KEYS = {
        SUBJECTS: 'ssp_subjects_v1',
        TASKS: 'ssp_tasks_v1',
        EXAMS: 'ssp_exams_v1',
        SESSIONS: 'ssp_sessions_v1',
        TIMETABLE: 'ssp_timetable_v1',
        SETTINGS: 'ssp_settings_v1',
        TIMER_STATE: 'ssp_timer_state_v1',
        THEME: 'ssp_theme_v1',
        SIDEBAR_COLLAPSED: 'ssp_sidebar_collapsed_v1'
    };

    // Motivational study quotes
    const MOTIVATIONAL_QUOTES = [
        { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
        { text: "Focus is a muscle. The more you practice deep study, the stronger it grows.", author: "Cal Newport" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
        { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" }
    ];

    // Wellness tips for timetable break intervals
    const BREAK_WELLNESS_TIPS = [
        "Drink a tall glass of cold water and hydrate.",
        "Stand up, stretch your back, and roll your shoulders.",
        "Look at an object 20 feet away for 20 seconds to rest your eyes (20-20-20 rule).",
        "Take 5 deep diaphragmatic breaths to reset mental focus.",
        "Walk around the room or do a quick 3-minute stretch.",
        "Grab a healthy brain snack (almonds, fruit, or tea)."
    ];

    // =========================================================================
    // SAMPLE DATA GENERATOR (Relative to Current Date)
    // =========================================================================
    function getSampleData() {
        const today = new Date();
        const formatDate = (daysOffset) => {
            const d = new Date(today);
            d.setDate(d.getDate() + daysOffset);
            return d.toISOString().split('T')[0];
        };

        const subjects = [
            {
                id: 'sub-1',
                name: 'Data Structures & Algorithms',
                code: 'CS201',
                color: '#6366f1',
                credits: '4 Credits (Target: A)',
                examDate: formatDate(5),
                topics: [
                    { id: 'top-1-1', name: 'Binary Search Trees & AVL Trees', completed: true },
                    { id: 'top-1-2', name: 'Graph Traversals (BFS & DFS)', completed: true },
                    { id: 'top-1-3', name: "Dijkstra's & Prim's Minimum Spanning Tree", completed: true },
                    { id: 'top-1-4', name: 'Dynamic Programming (Knapsack & LCS)', completed: false },
                    { id: 'top-1-5', name: 'Red-Black Trees & B-Trees', completed: false }
                ]
            },
            {
                id: 'sub-2',
                name: 'Database Management Systems',
                code: 'CS304',
                color: '#06b6d4',
                credits: '3 Credits (Target: A-)',
                examDate: formatDate(12),
                topics: [
                    { id: 'top-2-1', name: 'Relational Algebra & Normalization (3NF, BCNF)', completed: true },
                    { id: 'top-2-2', name: 'SQL Joins, Subqueries & Indexing B+ Trees', completed: true },
                    { id: 'top-2-3', name: 'Transaction Management & ACID Guarantees', completed: false },
                    { id: 'top-2-4', name: 'Concurrency Control & 2-Phase Locking', completed: false }
                ]
            },
            {
                id: 'sub-3',
                name: 'Computer Networks',
                code: 'CS308',
                color: '#8b5cf6',
                credits: '3 Credits (Target: B+)',
                examDate: formatDate(18),
                topics: [
                    { id: 'top-3-1', name: 'OSI 7-Layer & TCP/IP Protocol Stack', completed: true },
                    { id: 'top-3-2', name: 'IPv4 Subnetting & CIDR Calculation', completed: true },
                    { id: 'top-3-3', name: 'TCP Flow Control & Congestion Avoidance', completed: false },
                    { id: 'top-3-4', name: 'DNS, HTTP/3, and TLS 1.3 Cryptography', completed: false }
                ]
            },
            {
                id: 'sub-4',
                name: 'Linear Algebra & Optimization',
                code: 'MATH205',
                color: '#ec4899',
                credits: '4 Credits (Target: A)',
                examDate: formatDate(2), // Urgent!
                topics: [
                    { id: 'top-4-1', name: 'Matrix Inverses, Ranks & Determinants', completed: true },
                    { id: 'top-4-2', name: 'Eigenvalues & Characteristic Polynomials', completed: true },
                    { id: 'top-4-3', name: 'Singular Value Decomposition (SVD)', completed: true },
                    { id: 'top-4-4', name: 'PCA Projection & Gradient Optimization', completed: false }
                ]
            },
            {
                id: 'sub-5',
                name: 'Web Engineering & Architecture',
                code: 'CS315',
                color: '#10b981',
                credits: '3 Credits (Target: A+)',
                examDate: formatDate(26),
                topics: [
                    { id: 'top-5-1', name: 'Responsive Layouts & CSS Grid Systems', completed: true },
                    { id: 'top-5-2', name: 'Asynchronous JavaScript & Event Loops', completed: true },
                    { id: 'top-5-3', name: 'RESTful API Design & Authentication', completed: true },
                    { id: 'top-5-4', name: 'Web Performance Optimization & PWA', completed: false }
                ]
            }
        ];

        const tasks = [
            {
                id: 'task-1',
                title: 'Review Linear Algebra Eigenvalue formula sheet',
                description: 'Crucial for upcoming midterm in 2 days. Practice solving 3x3 diagonalizations.',
                subjectId: 'sub-4',
                priority: 'High',
                status: 'In Progress',
                date: formatDate(0), // Today
                startTime: '15:30',
                duration: 45
            },
            {
                id: 'task-2',
                title: 'Solve 4 Dynamic Programming LCS problems on LeetCode',
                description: 'Focus on drawing out the 2D memoization table grid and reconstructing path.',
                subjectId: 'sub-1',
                priority: 'High',
                status: 'Pending',
                date: formatDate(0), // Today
                startTime: '17:00',
                duration: 60
            },
            {
                id: 'task-3',
                title: 'Complete SQL practice lab on BCNF decomposition',
                description: 'Check functional dependency closures and lossless join conditions.',
                subjectId: 'sub-2',
                priority: 'Medium',
                status: 'Pending',
                date: formatDate(0), // Today
                startTime: '19:00',
                duration: 50
            },
            {
                id: 'task-4',
                title: 'Read Kurose & Ross Chapter 3: TCP Congestion Control',
                description: 'Take Cornell notes on AIMD, Slow Start, and Fast Recovery.',
                subjectId: 'sub-3',
                priority: 'Medium',
                status: 'Pending',
                date: formatDate(1), // Tomorrow
                startTime: '16:00',
                duration: 45
            },
            {
                id: 'task-5',
                title: 'Build responsive glassmorphic dashboard card component',
                description: 'Submitted assignment on laboratory portal.',
                subjectId: 'sub-5',
                priority: 'Low',
                status: 'Completed',
                date: formatDate(-1), // Yesterday
                startTime: '14:00',
                duration: 90
            },
            {
                id: 'task-6',
                title: 'Graph BFS/DFS traversal problem set review',
                description: 'Solved topological sort and cycle detection in directed graphs.',
                subjectId: 'sub-1',
                priority: 'High',
                status: 'Completed',
                date: formatDate(-1), // Yesterday
                startTime: '16:30',
                duration: 60
            }
        ];

        const exams = [
            {
                id: 'exam-1',
                title: 'Midterm 1: Linear Algebra & Matrix Calculus',
                subjectId: 'sub-4',
                date: formatDate(2),
                time: '09:00',
                location: 'Hall B - Room 204',
                weightage: '35%',
                topics: [
                    'Matrix Inverses and Determinants',
                    'Eigenvalues and Eigenvectors',
                    'Singular Value Decomposition (SVD)',
                    'Orthogonal Projections'
                ]
            },
            {
                id: 'exam-2',
                title: 'Algorithms & Data Structures Midterm Exam',
                subjectId: 'sub-1',
                date: formatDate(5),
                time: '14:00',
                location: 'Tech Center Auditorium 1',
                weightage: '40%',
                topics: [
                    'Binary Search Trees & AVL rotations',
                    'Graph algorithms (BFS, DFS, Dijkstra)',
                    'Dynamic Programming fundamentals',
                    'Asymptotic Big-O proofs'
                ]
            },
            {
                id: 'exam-3',
                title: 'DBMS Comprehensive Mid-Semester Assessment',
                subjectId: 'sub-2',
                date: formatDate(12),
                time: '10:30',
                location: 'CS Department Lab 3',
                weightage: '30%',
                topics: [
                    'ER Diagrams to Relational Schema',
                    'Relational Algebra & Tuple Calculus',
                    'Functional Dependencies and BCNF',
                    'Indexing & Hash tables'
                ]
            },
            {
                id: 'exam-4',
                title: 'Computer Networks Final Theory Examination',
                subjectId: 'sub-3',
                date: formatDate(18),
                time: '13:30',
                location: 'Main Campus Hall A',
                weightage: '40%',
                topics: [
                    'OSI Reference Model vs TCP/IP',
                    'Subnet mask calculations',
                    'TCP vs UDP socket programming',
                    'Routing Information Protocol (RIP)'
                ]
            }
        ];

        // Past 7 days realistic study sessions log
        const sessions = [
            { id: 'sess-1', date: formatDate(-6), subjectId: 'sub-1', topic: 'Binary Search Tree Balancing', minutes: 75, type: 'Focus' },
            { id: 'sess-2', date: formatDate(-6), subjectId: 'sub-4', topic: 'Matrix Transformation Proofs', minutes: 60, type: 'Focus' },
            { id: 'sess-3', date: formatDate(-5), subjectId: 'sub-2', topic: 'SQL Query Optimization', minutes: 90, type: 'Focus' },
            { id: 'sess-4', date: formatDate(-4), subjectId: 'sub-3', topic: 'Subnetting Exercises', minutes: 75, type: 'Focus' },
            { id: 'sess-5', date: formatDate(-3), subjectId: 'sub-1', topic: 'Graph Traversal Problems', minutes: 120, type: 'Focus' },
            { id: 'sess-6', date: formatDate(-3), subjectId: 'sub-4', topic: 'Eigenvector Computations', minutes: 60, type: 'Focus' },
            { id: 'sess-7', date: formatDate(-2), subjectId: 'sub-5', topic: 'CSS Flexbox & Grid Lab', minutes: 90, type: 'Focus' },
            { id: 'sess-8', date: formatDate(-1), subjectId: 'sub-4', topic: 'SVD Matrix Decompositions', minutes: 100, type: 'Focus' },
            { id: 'sess-9', date: formatDate(0), subjectId: 'sub-4', topic: 'Linear Algebra Midterm Formula Review', minutes: 50, type: 'Focus' },
            { id: 'sess-10', date: formatDate(0), subjectId: 'sub-1', topic: 'Dynamic Programming Memoization', minutes: 25, type: 'Focus' }
        ];

        const settings = {
            studentName: 'Alex Morgan',
            major: 'Computer Science & Engineering',
            dailyGoal: 4, // hours
            focusDuration: 25,
            shortBreak: 5,
            longBreak: 15,
            soundEnabled: true,
            streakCount: 5
        };

        return { subjects, tasks, exams, sessions, settings };
    }

    // =========================================================================
    // STATE & DATA STORE
    // =========================================================================
    class DataStore {
        constructor() {
            this.init();
        }

        init() {
            if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
                this.seedSampleData();
            }
        }

        seedSampleData() {
            const data = getSampleData();
            this.setSubjects(data.subjects);
            this.setTasks(data.tasks);
            this.setExams(data.exams);
            this.setSessions(data.sessions);
            this.setSettings(data.settings);
        }

        clearAllData() {
            this.setSubjects([]);
            this.setTasks([]);
            this.setExams([]);
            this.setSessions([]);
            localStorage.removeItem(STORAGE_KEYS.TIMETABLE);
        }

        // Subjects
        getSubjects() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS)) || [];
            } catch (e) { return []; }
        }
        setSubjects(subjects) {
            localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
        }
        getSubjectById(id) {
            return this.getSubjects().find(s => s.id === id) || null;
        }

        // Tasks
        getTasks() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
            } catch (e) { return []; }
        }
        setTasks(tasks) {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        }
        getTaskById(id) {
            return this.getTasks().find(t => t.id === id) || null;
        }

        // Exams
        getExams() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS)) || [];
            } catch (e) { return []; }
        }
        setExams(exams) {
            localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
        }

        // Sessions Log
        getSessions() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS)) || [];
            } catch (e) { return []; }
        }
        setSessions(sessions) {
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
        }
        addSession(session) {
            const sessions = this.getSessions();
            sessions.unshift(session);
            this.setSessions(sessions);
        }

        // Timetable
        getTimetable() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMETABLE)) || null;
            } catch (e) { return null; }
        }
        setTimetable(tt) {
            localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(tt));
        }

        // Settings
        getSettings() {
            try {
                const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
                return s || {
                    studentName: 'Alex Morgan',
                    major: 'Computer Science & Engineering',
                    dailyGoal: 4,
                    focusDuration: 25,
                    shortBreak: 5,
                    longBreak: 15,
                    soundEnabled: true,
                    streakCount: 5
                };
            } catch (e) {
                return {
                    studentName: 'Alex Morgan',
                    major: 'Computer Science & Engineering',
                    dailyGoal: 4,
                    focusDuration: 25,
                    shortBreak: 5,
                    longBreak: 15,
                    soundEnabled: true,
                    streakCount: 5
                };
            }
        }
        setSettings(settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        }

        // Export All to JSON
        exportJSON() {
            const fullExport = {
                version: 1,
                exportedAt: new Date().toISOString(),
                subjects: this.getSubjects(),
                tasks: this.getTasks(),
                exams: this.getExams(),
                sessions: this.getSessions(),
                settings: this.getSettings()
            };
            return JSON.stringify(fullExport, null, 2);
        }

        // Import from JSON
        importJSON(jsonString) {
            const parsed = JSON.parse(jsonString);
            if (!parsed.subjects || !parsed.tasks) {
                throw new Error("Invalid Study Planner backup file format.");
            }
            if (Array.isArray(parsed.subjects)) this.setSubjects(parsed.subjects);
            if (Array.isArray(parsed.tasks)) this.setTasks(parsed.tasks);
            if (Array.isArray(parsed.exams)) this.setExams(parsed.exams);
            if (Array.isArray(parsed.sessions)) this.setSessions(parsed.sessions);
            if (parsed.settings) this.setSettings(parsed.settings);
        }
    }

    const store = new DataStore();

    // =========================================================================
    // AUDIO SYNTHESIS ENGINE (Professional Chime via Web Audio API)
    // =========================================================================
    function playChimeSound() {
        const settings = store.getSettings();
        if (!settings.soundEnabled) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            // Play pleasant 3-tone harmonic arpeggio (E5 -> G#5 -> B5)
            const notes = [659.25, 830.61, 987.77];
            const startTime = ctx.currentTime;

            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime + idx * 0.12);

                gain.gain.setValueAtTime(0, startTime + idx * 0.12);
                gain.gain.linearRampToValueAtTime(0.25, startTime + idx * 0.12 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.12 + 0.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime + idx * 0.12);
                osc.stop(startTime + idx * 0.12 + 0.85);
            });
        } catch (err) {
            console.warn('Audio playback not initialized or blocked:', err);
        }
    }

    // =========================================================================
    // TOAST NOTIFICATION & CONFIRMATION MODAL HELPERS
    // =========================================================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            info: 'fa-circle-info',
            warning: 'fa-triangle-exclamation'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || 'fa-info'}"></i>
            <span>${escapeHTML(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }

    let confirmCallback = null;
    function showConfirmModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const titleEl = document.getElementById('confirmModalTitle');
        const msgEl = document.getElementById('confirmModalMessage');
        const confirmBtn = document.getElementById('confirmModalConfirmBtn');

        titleEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ${escapeHTML(title)}`;
        msgEl.textContent = message;
        confirmCallback = onConfirm;

        modal.hidden = false;
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function generateId(prefix = 'id') {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    }

    function formatDateFriendly(dateStr) {
        if (!dateStr) return 'No Date';
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function getDaysDiff(targetDateStr) {
        if (!targetDateStr) return null;
        const target = new Date(targetDateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffMs = target - today;
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    function formatTimeFriendly(time24) {
        if (!time24) return '';
        const [h, m] = time24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 === 0 ? 12 : h % 12;
        return `${formattedHour}:${m < 10 ? '0' + m : m} ${ampm}`;
    }

    function addMinutesToTime(time24, minsToAdd) {
        const [h, m] = time24.split(':').map(Number);
        const totalMins = h * 60 + m + minsToAdd;
        const newH = Math.floor(totalMins / 60) % 24;
        const newM = totalMins % 60;
        return `${newH < 10 ? '0' + newH : newH}:${newM < 10 ? '0' + newM : newM}`;
    }

    // =========================================================================
    // CHART.JS CONTROLLER (Productivity & Analytics Visualizations)
    // =========================================================================
    const ChartManager = {
        instances: {},

        destroyChart(key) {
            if (this.instances[key]) {
                this.instances[key].destroy();
                delete this.instances[key];
            }
        },

        renderDashboardChart() {
            const ctx = document.getElementById('dashWeeklyChart');
            if (!ctx) return;
            this.destroyChart('dashboardWeekly');

            const isDark = document.body.classList.contains('dark-theme');
            const textColor = isDark ? '#cbd5e1' : '#475569';
            const gridColor = isDark ? '#1e293b' : '#f1f5f9';

            // Calculate past 7 days study hours from real session logs
            const days = [];
            const hoursData = [];
            const goalData = [];
            const settings = store.getSettings();
            const dailyGoal = Number(settings.dailyGoal) || 4;
            const sessions = store.getSessions();

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateKey = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                days.push(dayName);

                const dayMins = sessions
                    .filter(s => s.date === dateKey)
                    .reduce((acc, curr) => acc + (Number(curr.minutes) || 0), 0);
                hoursData.push(Number((dayMins / 60).toFixed(1)));
                goalData.push(dailyGoal);
            }

            this.instances['dashboardWeekly'] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: days,
                    datasets: [
                        {
                            label: 'Hours Studied',
                            data: hoursData,
                            backgroundColor: 'rgba(99, 102, 241, 0.85)',
                            borderRadius: 6,
                            maxBarThickness: 32
                        },
                        {
                            label: 'Daily Target',
                            data: goalData,
                            type: 'line',
                            borderColor: 'rgba(245, 158, 11, 0.9)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointRadius: 3,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif" } }
                        },
                        tooltip: {
                            callbacks: {
                                label: (item) => `${item.dataset.label}: ${item.raw} hrs`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: Math.max(...hoursData, dailyGoal) + 1,
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: textColor }
                        }
                    }
                }
            });
        },

        renderAnalyticsCharts() {
            const isDark = document.body.classList.contains('dark-theme');
            const textColor = isDark ? '#cbd5e1' : '#475569';
            const gridColor = isDark ? '#1e293b' : '#f1f5f9';

            const tasks = store.getTasks();
            const subjects = store.getSubjects();
            const sessions = store.getSessions();
            const settings = store.getSettings();

            // 1. Weekly Hours Chart
            const weeklyCtx = document.getElementById('chartWeeklyHours');
            if (weeklyCtx) {
                this.destroyChart('analyticsWeekly');
                const days = [];
                const hoursData = [];
                const goalData = [];
                const dailyGoal = Number(settings.dailyGoal) || 4;

                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateKey = d.toISOString().split('T')[0];
                    days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }));

                    const dayMins = sessions
                        .filter(s => s.date === dateKey)
                        .reduce((acc, curr) => acc + (Number(curr.minutes) || 0), 0);
                    hoursData.push(Number((dayMins / 60).toFixed(1)));
                    goalData.push(dailyGoal);
                }

                this.instances['analyticsWeekly'] = new Chart(weeklyCtx, {
                    type: 'bar',
                    data: {
                        labels: days,
                        datasets: [
                            {
                                label: 'Studied (Hours)',
                                data: hoursData,
                                backgroundColor: 'rgba(99, 102, 241, 0.85)',
                                borderRadius: 8,
                                maxBarThickness: 36
                            },
                            {
                                label: 'Goal Target',
                                data: goalData,
                                type: 'line',
                                borderColor: 'rgba(245, 158, 11, 0.9)',
                                borderWidth: 2,
                                borderDash: [4, 4],
                                pointRadius: 4,
                                fill: false
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { labels: { color: textColor } }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: { color: textColor }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: textColor }
                            }
                        }
                    }
                });
            }

            // 2. Task Status Doughnut Chart
            const taskCtx = document.getElementById('chartTaskStatus');
            if (taskCtx) {
                this.destroyChart('analyticsTasks');
                const completedCount = tasks.filter(t => t.status === 'Completed').length;
                const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
                const pendingCount = tasks.filter(t => t.status === 'Pending').length;

                this.instances['analyticsTasks'] = new Chart(taskCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'In Progress', 'Pending'],
                        datasets: [{
                            data: [completedCount, inProgressCount, pendingCount],
                            backgroundColor: ['#10b981', '#06b6d4', '#f59e0b'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor } }
                        },
                        cutout: '65%'
                    }
                });
            }

            // 3. Subject Syllabus Completion Bar Chart
            const subCtx = document.getElementById('chartSubjectCompletion');
            if (subCtx) {
                this.destroyChart('analyticsSubjects');
                const subLabels = subjects.map(s => s.code || s.name);
                const subCompletion = subjects.map(s => {
                    const totalTopics = s.topics ? s.topics.length : 0;
                    if (totalTopics === 0) return 0;
                    const done = s.topics.filter(t => t.completed).length;
                    return Math.round((done / totalTopics) * 100);
                });
                const subColors = subjects.map(s => s.color || '#6366f1');

                this.instances['analyticsSubjects'] = new Chart(subCtx, {
                    type: 'bar',
                    data: {
                        labels: subLabels,
                        datasets: [{
                            label: 'Syllabus Covered (%)',
                            data: subCompletion,
                            backgroundColor: subColors,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: {
                                max: 100,
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: { color: textColor, callback: val => `${val}%` }
                            },
                            y: {
                                grid: { display: false },
                                ticks: { color: textColor }
                            }
                        }
                    }
                });
            }

            // 4. Study Hours by Subject Doughnut/Polar Chart
            const distCtx = document.getElementById('chartSubjectDistribution');
            if (distCtx) {
                this.destroyChart('analyticsDistribution');
                const subjectHoursMap = {};
                subjects.forEach(s => { subjectHoursMap[s.id] = 0; });

                sessions.forEach(sess => {
                    if (subjectHoursMap[sess.subjectId] !== undefined) {
                        subjectHoursMap[sess.subjectId] += (Number(sess.minutes) || 0) / 60;
                    }
                });

                const labels = subjects.map(s => s.name);
                const data = subjects.map(s => Number((subjectHoursMap[s.id] || 0).toFixed(1)));
                const colors = subjects.map(s => s.color || '#6366f1');

                this.instances['analyticsDistribution'] = new Chart(distCtx, {
                    type: 'polarArea',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: colors.map(c => `${c}B3`), // with opacity
                            borderColor: colors
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor } }
                        },
                        scales: {
                            r: {
                                grid: { color: gridColor },
                                ticks: { display: false }
                            }
                        }
                    }
                });
            }
        }
    };

    // =========================================================================
    // FOCUS POMODORO TIMER ENGINE
    // =========================================================================
    const PomodoroTimer = {
        mode: 'focus', // 'focus' | 'short-break' | 'long-break'
        timeRemaining: 25 * 60,
        isRunning: false,
        cycleIndex: 1, // 1 to 4
        intervalId: null,
        targetSubjectId: '',
        targetTaskId: '',

        init() {
            this.loadSettings();
            this.updateDisplay();
            this.bindEvents();
            this.updateTaskAndSubjectDropdowns();
        },

        loadSettings() {
            const settings = store.getSettings();
            if (this.mode === 'focus') {
                this.timeRemaining = (Number(settings.focusDuration) || 25) * 60;
            } else if (this.mode === 'short-break') {
                this.timeRemaining = (Number(settings.shortBreak) || 5) * 60;
            } else {
                this.timeRemaining = (Number(settings.longBreak) || 15) * 60;
            }
        },

        bindEvents() {
            const toggleBtn = document.getElementById('timerMainToggleBtn');
            const resetBtn = document.getElementById('timerResetBtn');
            const skipBtn = document.getElementById('timerSkipBtn');
            const sidebarBtn = document.getElementById('sidebarQuickTimerBtn');
            const soundBtn = document.getElementById('timerSoundToggleBtn');

            if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggle());
            if (sidebarBtn) sidebarBtn.addEventListener('click', () => this.toggle());
            if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
            if (skipBtn) skipBtn.addEventListener('click', () => this.skip());

            if (soundBtn) {
                soundBtn.addEventListener('click', () => {
                    const settings = store.getSettings();
                    settings.soundEnabled = !settings.soundEnabled;
                    store.setSettings(settings);
                    this.updateSoundButtonUI(settings.soundEnabled);
                    showToast(`Timer sound: ${settings.soundEnabled ? 'Enabled' : 'Muted'}`, 'info');
                });
            }

            // Mode tab switches
            document.querySelectorAll('[data-timer-mode]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const mode = e.currentTarget.getAttribute('data-timer-mode');
                    this.setMode(mode);
                });
            });

            // Target selector binds
            const subSelect = document.getElementById('timerSubjectSelect');
            const taskSelect = document.getElementById('timerTaskSelect');

            if (subSelect) {
                subSelect.addEventListener('change', (e) => {
                    this.targetSubjectId = e.target.value;
                    this.updateTargetTaskName();
                });
            }
            if (taskSelect) {
                taskSelect.addEventListener('change', (e) => {
                    this.targetTaskId = e.target.value;
                    if (this.targetTaskId) {
                        const task = store.getTaskById(this.targetTaskId);
                        if (task && task.subjectId) {
                            this.targetSubjectId = task.subjectId;
                            if (subSelect) subSelect.value = task.subjectId;
                        }
                    }
                    this.updateTargetTaskName();
                });
            }
        },

        updateSoundButtonUI(enabled) {
            const soundIcon = document.getElementById('timerSoundIcon');
            const soundText = document.getElementById('timerSoundStatusText');
            if (soundIcon) soundIcon.className = enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark text-muted';
            if (soundText) soundText.textContent = enabled ? 'Sound On' : 'Sound Muted';
        },

        updateTaskAndSubjectDropdowns() {
            const subSelect = document.getElementById('timerSubjectSelect');
            const taskSelect = document.getElementById('timerTaskSelect');
            const subjects = store.getSubjects();
            const tasks = store.getTasks().filter(t => t.status !== 'Completed');

            if (subSelect) {
                const currentVal = subSelect.value;
                subSelect.innerHTML = '<option value="">Select a Subject (Optional)</option>' +
                    subjects.map(s => `<option value="${s.id}">${escapeHTML(s.name)} (${s.code || ''})</option>`).join('');
                subSelect.value = currentVal;
            }

            if (taskSelect) {
                const currentVal = taskSelect.value;
                taskSelect.innerHTML = '<option value="">Link to a Task (Optional)</option>' +
                    tasks.map(t => `<option value="${t.id}">${escapeHTML(t.title)}</option>`).join('');
                taskSelect.value = currentVal;
            }
        },

        updateTargetTaskName() {
            const display = document.getElementById('timerCurrentTaskDisplay');
            if (!display) return;
            if (this.targetTaskId) {
                const task = store.getTaskById(this.targetTaskId);
                if (task) {
                    display.textContent = task.title;
                    return;
                }
            }
            if (this.targetSubjectId) {
                const sub = store.getSubjectById(this.targetSubjectId);
                if (sub) {
                    display.textContent = sub.name;
                    return;
                }
            }
            display.textContent = this.mode === 'focus' ? 'Deep Study' : 'Rest Break';
        },

        setMode(newMode) {
            this.pause();
            this.mode = newMode;

            // update tab classes
            document.querySelectorAll('[data-timer-mode]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-timer-mode') === newMode);
            });

            const modeLabel = document.getElementById('timerModeLabel');
            if (modeLabel) {
                if (newMode === 'focus') modeLabel.textContent = 'FOCUS SESSION';
                else if (newMode === 'short-break') modeLabel.textContent = 'SHORT BREAK';
                else modeLabel.textContent = 'LONG RECUPERATION BREAK';
            }

            this.loadSettings();
            this.updateDisplay();
            this.updateTargetTaskName();
        },

        toggle() {
            if (this.isRunning) {
                this.pause();
            } else {
                this.start();
            }
        },

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.updateButtonsUI();

            this.intervalId = setInterval(() => {
                this.tick();
            }, 1000);
        },

        pause() {
            if (!this.isRunning) return;
            this.isRunning = false;
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.updateButtonsUI();
        },

        reset() {
            this.pause();
            this.loadSettings();
            this.updateDisplay();
        },

        skip() {
            this.pause();
            this.onSessionComplete(true); // marked as skipped without recording session time
        },

        tick() {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateDisplay();
            } else {
                this.pause();
                this.onSessionComplete(false);
            }
        },

        onSessionComplete(skipped = false) {
            playChimeSound();

            if (!skipped && this.mode === 'focus') {
                const settings = store.getSettings();
                const focusMins = Number(settings.focusDuration) || 25;
                const today = new Date().toISOString().split('T')[0];

                // Record session
                const newSession = {
                    id: generateId('sess'),
                    date: today,
                    subjectId: this.targetSubjectId || 'sub-1',
                    topic: this.targetTaskId ? (store.getTaskById(this.targetTaskId)?.title || 'Task Study') : 'General Focus Session',
                    minutes: focusMins,
                    type: 'Focus'
                };
                store.addSession(newSession);

                // If a task was linked, mark it in-progress or check if completed
                if (this.targetTaskId) {
                    const task = store.getTaskById(this.targetTaskId);
                    if (task && task.status === 'Pending') {
                        task.status = 'In Progress';
                        const allTasks = store.getTasks().map(t => t.id === task.id ? task : t);
                        store.setTasks(allTasks);
                    }
                }

                showToast(`🎉 Focus session completed! Logged ${focusMins} minutes.`, 'success');

                // Advance cycle
                if (this.cycleIndex < 4) {
                    this.cycleIndex++;
                    this.setMode('short-break');
                } else {
                    this.cycleIndex = 1;
                    this.setMode('long-break');
                }
            } else if (!skipped) {
                showToast(`Break time is over! Ready for another focus round?`, 'info');
                this.setMode('focus');
            } else {
                // Was skipped
                if (this.mode === 'focus') {
                    this.setMode('short-break');
                } else {
                    this.setMode('focus');
                }
            }

            // Refresh dashboards and analytics
            App.renderDashboard();
            this.updateCycleDots();
        },

        updateDisplay() {
            const mins = Math.floor(this.timeRemaining / 60);
            const secs = this.timeRemaining % 60;
            const timeStr = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;

            // Big digits on timer page
            const bigDigits = document.getElementById('timerBigDigits');
            if (bigDigits) bigDigits.textContent = timeStr;

            // Mini digits on sidebar
            const sidebarDigits = document.getElementById('sidebarTimerDigits');
            if (sidebarDigits) sidebarDigits.textContent = timeStr;

            // Update circular SVG progress ring
            const circle = document.getElementById('timerProgressRing');
            if (circle) {
                const settings = store.getSettings();
                let totalSecs = (Number(settings.focusDuration) || 25) * 60;
                if (this.mode === 'short-break') totalSecs = (Number(settings.shortBreak) || 5) * 60;
                if (this.mode === 'long-break') totalSecs = (Number(settings.longBreak) || 15) * 60;

                const radius = circle.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                circle.style.strokeDasharray = `${circumference} ${circumference}`;

                const offset = circumference - (this.timeRemaining / totalSecs) * circumference;
                circle.style.strokeDashoffset = offset;
            }

            this.updateTodayStatsBanner();
        },

        updateButtonsUI() {
            const mainIcon = document.getElementById('timerMainIcon');
            const mainText = document.getElementById('timerMainBtnText');
            const sidebarIcon = document.getElementById('sidebarQuickTimerIcon');
            const mainBtn = document.getElementById('timerMainToggleBtn');

            if (this.isRunning) {
                if (mainIcon) mainIcon.className = 'fa-solid fa-pause';
                if (mainText) mainText.textContent = 'Pause Focus';
                if (sidebarIcon) sidebarIcon.className = 'fa-solid fa-pause';
                if (mainBtn) mainBtn.classList.add('active');
            } else {
                if (mainIcon) mainIcon.className = 'fa-solid fa-play';
                if (mainText) mainText.textContent = this.timeRemaining === 0 ? 'Start Next' : 'Resume Focus';
                if (sidebarIcon) sidebarIcon.className = 'fa-solid fa-play';
                if (mainBtn) mainBtn.classList.remove('active');
            }
        },

        updateCycleDots() {
            const dotsContainer = document.getElementById('timerCycleDots');
            const counterText = document.getElementById('timerCompletedSessionsCount');
            if (!dotsContainer) return;

            dotsContainer.innerHTML = '';
            for (let i = 1; i <= 4; i++) {
                const dot = document.createElement('span');
                dot.className = 'cycle-dot';
                if (i < this.cycleIndex) dot.classList.add('completed');
                else if (i === this.cycleIndex) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            }

            if (counterText) {
                counterText.textContent = `${this.cycleIndex - 1} of 4 completed in cycle`;
            }
        },

        updateTodayStatsBanner() {
            const todayStr = new Date().toISOString().split('T')[0];
            const sessions = store.getSessions().filter(s => s.date === todayStr);
            const totalMins = sessions.reduce((acc, curr) => acc + (Number(curr.minutes) || 0), 0);
            const settings = store.getSettings();
            const goalMins = (Number(settings.dailyGoal) || 4) * 60;
            const pct = Math.min(100, Math.round((totalMins / goalMins) * 100));

            const sessEl = document.getElementById('timerTodaySessionsTotal');
            const minsEl = document.getElementById('timerTodayMinutesTotal');
            const pctEl = document.getElementById('timerGoalProgressPercent');

            if (sessEl) sessEl.textContent = sessions.length;
            if (minsEl) minsEl.textContent = `${totalMins}m`;
            if (pctEl) pctEl.textContent = `${pct}%`;
        }
    };

    // =========================================================================
    // SMART TIMETABLE GENERATOR ENGINE (Rule-Based Constraint Scheduling)
    // =========================================================================
    const TimetableEngine = {
        generate(options) {
            const {
                availableHours,
                startTime,
                sessionDuration,
                breakDuration,
                strategy,
                includedSubjectIds
            } = options;

            const subjects = store.getSubjects().filter(s => includedSubjectIds.includes(s.id));
            if (subjects.length === 0) {
                return { success: false, message: 'Please select at least one active subject to generate a timetable.' };
            }

            const totalAvailableMinutes = Math.round(availableHours * 60);
            const cycleMinutes = sessionDuration + breakDuration;
            const maxSessions = Math.floor((totalAvailableMinutes + breakDuration) / cycleMinutes);

            if (maxSessions < 1) {
                return { success: false, message: 'Available study time is too short for the chosen session duration.' };
            }

            // Calculate deterministic weight for each subject
            const weightedSubjects = subjects.map(sub => {
                let weight = 10;

                // 1. Exam Urgency Factor
                const daysUntilExam = getDaysDiff(sub.examDate);
                if (daysUntilExam !== null) {
                    if (daysUntilExam <= 2) weight += 40;
                    else if (daysUntilExam <= 5) weight += 25;
                    else if (daysUntilExam <= 10) weight += 15;
                    else if (daysUntilExam <= 20) weight += 8;
                }

                // 2. Syllabus Deficit Factor
                const totalTopics = sub.topics ? sub.topics.length : 0;
                const doneTopics = sub.topics ? sub.topics.filter(t => t.completed).length : 0;
                const deficitRatio = totalTopics > 0 ? (1 - (doneTopics / totalTopics)) : 0.5;
                weight += Math.round(deficitRatio * 30);

                // 3. User Strategy Adjustment
                if (strategy === 'exam_sprint' && daysUntilExam !== null && daysUntilExam <= 7) {
                    weight *= 1.8;
                } else if (strategy === 'syllabus_deficit') {
                    weight += Math.round(deficitRatio * 40);
                }

                return { subject: sub, weight };
            });

            // Sort subjects descending by rule-based weight
            weightedSubjects.sort((a, b) => b.weight - a.weight);

            // Generate timeline slots
            const timeline = [];
            let currentTime = startTime;
            let totalStudyMinutes = 0;
            let totalBreakMinutes = 0;

            for (let i = 0; i < maxSessions; i++) {
                // Round robin through top weighted subjects
                const targetObj = weightedSubjects[i % weightedSubjects.length];
                const sub = targetObj.subject;

                // Pick next pending topic for this subject if available
                const pendingTopic = (sub.topics && sub.topics.find(t => !t.completed))?.name || 'General Practice & Concept Review';

                const sessionEndTime = addMinutesToTime(currentTime, sessionDuration);

                // Add Study Session Block
                timeline.push({
                    type: 'study',
                    subjectId: sub.id,
                    subjectName: sub.name,
                    subjectCode: sub.code || '',
                    subjectColor: sub.color || '#6366f1',
                    startTime: currentTime,
                    endTime: sessionEndTime,
                    duration: sessionDuration,
                    topic: pendingTopic,
                    goal: `Focus on mastering key concepts and active recall for ${pendingTopic}.`
                });

                totalStudyMinutes += sessionDuration;
                currentTime = sessionEndTime;

                // Add Break Block if not the very last session
                if (i < maxSessions - 1) {
                    const breakEndTime = addMinutesToTime(currentTime, breakDuration);
                    const tip = BREAK_WELLNESS_TIPS[i % BREAK_WELLNESS_TIPS.length];

                    timeline.push({
                        type: 'break',
                        startTime: currentTime,
                        endTime: breakEndTime,
                        duration: breakDuration,
                        tip: tip
                    });

                    totalBreakMinutes += breakDuration;
                    currentTime = breakEndTime;
                }
            }

            const result = {
                success: true,
                generatedAt: new Date().toISOString(),
                totalStudyMinutes,
                totalBreakMinutes,
                finishTime: currentTime,
                sessionsCount: maxSessions,
                timeline
            };

            store.setTimetable(result);
            return result;
        }
    };

    // =========================================================================
    // MAIN APP CONTROLLER & VIEW RENDERING
    // =========================================================================
    const App = {
        currentPage: 'dashboard',
        currentTaskView: 'list', // 'list' | 'board' | 'agenda'

        init() {
            this.applySavedTheme();
            this.applySidebarState();
            this.bindNavigation();
            this.bindGlobalSearch();
            this.bindModals();
            this.bindForms();
            this.bindSettingsAndBackups();
            this.bindTimetableEvents();

            PomodoroTimer.init();

            // Handle initial route
            const initialHash = window.location.hash.replace('#', '') || 'dashboard';
            this.navigateTo(initialHash);

            // Periodic live clock update in navbar
            this.updateLiveDateDisplay();
            setInterval(() => this.updateLiveDateDisplay(), 60000);
        },

        updateLiveDateDisplay() {
            const dateEl = document.getElementById('currentDateDisplay');
            if (dateEl) {
                const now = new Date();
                dateEl.textContent = now.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
            }
        },

        // Theme management
        applySavedTheme() {
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
            document.body.className = `${savedTheme}-theme`;
            const icon = document.getElementById('themeIcon');
            if (icon) {
                icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        },

        toggleTheme() {
            const isDark = document.body.classList.contains('dark-theme');
            const newTheme = isDark ? 'light' : 'dark';
            document.body.className = `${newTheme}-theme`;
            localStorage.setItem(STORAGE_KEYS.THEME, newTheme);

            const icon = document.getElementById('themeIcon');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }

            // Re-render active charts with updated theme colors
            if (this.currentPage === 'dashboard') ChartManager.renderDashboardChart();
            if (this.currentPage === 'analytics') ChartManager.renderAnalyticsCharts();
        },

        // Sidebar management
        applySidebarState() {
            const isCollapsed = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true';
            const sidebar = document.getElementById('sidebar');
            if (sidebar && isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        },

        toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;
            const willCollapse = !sidebar.classList.contains('collapsed');
            sidebar.classList.toggle('collapsed', willCollapse);
            localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, willCollapse.toString());
        },

        // Navigation Router
        bindNavigation() {
            // Theme toggle button
            document.getElementById('themeToggleBtn')?.addEventListener('click', () => this.toggleTheme());

            // Sidebar collapse button
            document.getElementById('sidebarCollapseBtn')?.addEventListener('click', () => this.toggleSidebar());

            // Mobile menu toggles
            const mobileBtn = document.getElementById('mobileMenuBtn');
            const overlay = document.getElementById('sidebarOverlay');
            const sidebar = document.getElementById('sidebar');

            if (mobileBtn && sidebar && overlay) {
                mobileBtn.addEventListener('click', () => {
                    sidebar.classList.add('mobile-open');
                    overlay.classList.add('active');
                });
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                });
            }

            // Nav link click listeners
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    const page = e.currentTarget.getAttribute('data-page');
                    if (page) {
                        e.preventDefault();
                        this.navigateTo(page);
                        // Close mobile drawer on navigation
                        sidebar?.classList.remove('mobile-open');
                        overlay?.classList.remove('active');
                    }
                });
            });

            // Nav profile pill -> settings
            document.getElementById('navProfilePill')?.addEventListener('click', () => this.navigateTo('settings'));

            // Top Quick Add Task button
            document.getElementById('topQuickAddTaskBtn')?.addEventListener('click', () => this.openTaskModal());

            // Listen to browser back/forward hash changes
            window.addEventListener('hashchange', () => {
                const hashPage = window.location.hash.replace('#', '') || 'dashboard';
                if (hashPage !== this.currentPage) {
                    this.navigateTo(hashPage);
                }
            });
        },

        navigateTo(pageId) {
            const targetView = document.getElementById(`page-${pageId}`);
            if (!targetView) {
                pageId = 'dashboard';
            }

            this.currentPage = pageId;
            window.location.hash = pageId;

            // Switch active view section
            document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));
            document.getElementById(`page-${pageId}`)?.classList.add('active');

            // Switch active nav link
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-page') === pageId);
            });

            // Render current page content
            this.renderPage(pageId);
        },

        renderPage(pageId) {
            this.updateHeaderAndSidebarBadges();

            switch (pageId) {
                case 'dashboard':
                    this.renderDashboard();
                    break;
                case 'subjects':
                    this.renderSubjects();
                    break;
                case 'tasks':
                    this.renderTasks();
                    break;
                case 'timetable':
                    this.renderTimetable();
                    break;
                case 'exams':
                    this.renderExams();
                    break;
                case 'timer':
                    PomodoroTimer.updateDisplay();
                    PomodoroTimer.updateTaskAndSubjectDropdowns();
                    break;
                case 'analytics':
                    this.renderAnalytics();
                    break;
                case 'settings':
                    this.renderSettings();
                    break;
            }
        },

        updateHeaderAndSidebarBadges() {
            const subjects = store.getSubjects();
            const tasks = store.getTasks();
            const exams = store.getExams();
            const settings = store.getSettings();

            // Sidebar counts
            const subBadge = document.getElementById('navSubjectCount');
            const taskBadge = document.getElementById('navPendingTaskCount');
            const examBadge = document.getElementById('navUrgentExamCount');
            const streakCount = document.getElementById('sidebarStreakCount');
            const userNameEl = document.getElementById('sidebarUserName');
            const userRoleEl = document.getElementById('sidebarUserRole');
            const navAvatar = document.getElementById('navAvatarSmall');
            const sidebarAvatar = document.getElementById('sidebarAvatar');
            const navName = document.getElementById('navStudentNameDisplay');

            if (subBadge) subBadge.textContent = subjects.length;

            const pendingTasks = tasks.filter(t => t.status !== 'Completed');
            if (taskBadge) taskBadge.textContent = pendingTasks.length;

            const urgentExams = exams.filter(e => {
                const diff = getDaysDiff(e.date);
                return diff !== null && diff >= 0 && diff <= 3;
            });
            if (examBadge) examBadge.textContent = urgentExams.length;

            if (streakCount) streakCount.textContent = `${settings.streakCount || 1}d`;

            const initials = settings.studentName ? settings.studentName.split(' ').map(n => n[0]).join('').substr(0, 2).toUpperCase() : 'AM';
            if (userNameEl) userNameEl.textContent = settings.studentName || 'Alex Morgan';
            if (userRoleEl) userRoleEl.textContent = settings.major || 'College Student';
            if (navName) navName.textContent = (settings.studentName || 'Alex').split(' ')[0];
            if (navAvatar) navAvatar.textContent = initials;
            if (sidebarAvatar) sidebarAvatar.textContent = initials;
        },

        // =====================================================================
        // DASHBOARD RENDERING
        // =====================================================================
        renderDashboard() {
            const settings = store.getSettings();
            const subjects = store.getSubjects();
            const tasks = store.getTasks();
            const exams = store.getExams();

            // Greeting based on time of day
            const greetingEl = document.getElementById('heroGreeting');
            if (greetingEl) {
                const hour = new Date().getHours();
                const firstName = (settings.studentName || 'Alex').split(' ')[0];
                let timeGreeting = 'Good morning';
                if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
                else if (hour >= 17) timeGreeting = 'Good evening';
                greetingEl.textContent = `${timeGreeting}, ${firstName}! 👋`;
            }

            // Pending count in hero
            const pendingTasks = tasks.filter(t => t.status !== 'Completed');
            const heroCountEl = document.getElementById('heroPendingCount');
            if (heroCountEl) heroCountEl.textContent = `${pendingTasks.length} tasks`;

            // Daily Motivational Quote
            const quoteEl = document.getElementById('dailyQuoteText');
            const authorEl = document.getElementById('dailyQuoteAuthor');
            if (quoteEl && authorEl) {
                const q = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
                quoteEl.textContent = `"${q.text}"`;
                authorEl.textContent = `— ${q.author}`;
            }

            // Quote refresh button
            document.getElementById('quoteRefreshBtn')?.addEventListener('click', () => {
                const q = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
                if (quoteEl) quoteEl.textContent = `"${q.text}"`;
                if (authorEl) authorEl.textContent = `— ${q.author}`;
            });

            // Action buttons on dashboard
            document.getElementById('dashGenerateTimetableBtn')?.addEventListener('click', () => this.navigateTo('timetable'));
            document.getElementById('dashStartTimerBtn')?.addEventListener('click', () => this.navigateTo('timer'));
            document.getElementById('dashViewAllTasksBtn')?.addEventListener('click', () => this.navigateTo('tasks'));
            document.getElementById('dashAddTaskBtn')?.addEventListener('click', () => this.openTaskModal());
            document.getElementById('dashViewAllExamsBtn')?.addEventListener('click', () => this.navigateTo('exams'));
            document.getElementById('dashOpenTimetableBtn')?.addEventListener('click', () => this.navigateTo('timetable'));

            // KPI Calculations
            const kpiSub = document.getElementById('kpiSubjectCount');
            const kpiTopics = document.getElementById('kpiTopicsCount');
            const kpiPending = document.getElementById('kpiPendingCount');
            const kpiUrgent = document.getElementById('kpiUrgentTasksHint');
            const kpiCompleted = document.getElementById('kpiCompletedCount');
            const kpiRate = document.getElementById('kpiCompletionRate');
            const kpiSyllabus = document.getElementById('kpiSyllabusProgress');
            const kpiFill = document.getElementById('kpiSyllabusFill');

            let totalTopics = 0;
            let doneTopics = 0;
            subjects.forEach(s => {
                if (s.topics) {
                    totalTopics += s.topics.length;
                    doneTopics += s.topics.filter(t => t.completed).length;
                }
            });

            const completedTasks = tasks.filter(t => t.status === 'Completed');
            const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
            const syllabusProgress = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;
            const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

            if (kpiSub) kpiSub.textContent = subjects.length;
            if (kpiTopics) kpiTopics.textContent = `${totalTopics} topics in syllabus`;
            if (kpiPending) kpiPending.textContent = pendingTasks.length;
            if (kpiUrgent) kpiUrgent.textContent = `${highPriorityCount} high priority`;
            if (kpiCompleted) kpiCompleted.textContent = completedTasks.length;
            if (kpiRate) kpiRate.textContent = `${completionRate}% completion rate`;
            if (kpiSyllabus) kpiSyllabus.textContent = `${syllabusProgress}%`;
            if (kpiFill) kpiFill.style.width = `${syllabusProgress}%`;

            // Today's Priority Tasks List
            const priorityListEl = document.getElementById('dashPriorityTaskList');
            const priorityBadgeEl = document.getElementById('dashPriorityTaskBadge');
            if (priorityListEl) {
                // Show High priority tasks and today's tasks
                const todayStr = new Date().toISOString().split('T')[0];
                const priorityTasks = tasks.filter(t => t.priority === 'High' || t.date === todayStr);

                if (priorityBadgeEl) priorityBadgeEl.textContent = `${priorityTasks.length} Tasks`;

                if (priorityTasks.length === 0) {
                    priorityListEl.innerHTML = `
                        <div class="empty-state" style="padding: 1.5rem;">
                            <i class="fa-solid fa-champagne-glasses text-emerald" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; font-size: 0.85rem;">All priority tasks cleared for today! Great job.</p>
                        </div>
                    `;
                } else {
                    priorityListEl.innerHTML = priorityTasks.slice(0, 5).map(task => {
                        const sub = store.getSubjectById(task.subjectId);
                        const isDone = task.status === 'Completed';
                        return `
                            <div class="task-item-card ${isDone ? 'completed' : ''}" data-task-id="${task.id}">
                                <div class="task-checkbox-custom" onclick="window.sspApp.toggleTaskComplete('${task.id}')">
                                    ${isDone ? '<i class="fa-solid fa-check"></i>' : ''}
                                </div>
                                <div class="task-info">
                                    <div class="task-title">${escapeHTML(task.title)}</div>
                                    <div class="task-meta">
                                        <span class="task-subject-tag">
                                            <span class="subject-color-dot" style="background:${sub ? sub.color : '#6366f1'};"></span>
                                            ${escapeHTML(sub ? (sub.code || sub.name) : 'General')}
                                        </span>
                                        <span>•</span>
                                        <span><i class="fa-regular fa-clock"></i> ${task.duration}m</span>
                                        <span>•</span>
                                        <span class="badge ${task.priority === 'High' ? 'badge-danger' : task.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}">${task.priority}</span>
                                    </div>
                                </div>
                                <button class="btn-icon" title="Focus on this task" onclick="window.sspApp.startTimerForTask('${task.id}')">
                                    <i class="fa-solid fa-play text-indigo"></i>
                                </button>
                            </div>
                        `;
                    }).join('');
                }
            }

            // Exam Countdowns on Dashboard
            const examListEl = document.getElementById('dashExamList');
            if (examListEl) {
                // Sort exams by date ascending
                const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
                if (sortedExams.length === 0) {
                    examListEl.innerHTML = '<p class="text-muted text-center" style="font-size:0.85rem; padding: 1rem;">No exams scheduled.</p>';
                } else {
                    examListEl.innerHTML = sortedExams.slice(0, 4).map(exam => {
                        const sub = store.getSubjectById(exam.subjectId);
                        const daysDiff = getDaysDiff(exam.date);
                        let urgencyClass = 'normal';
                        let countdownText = `${daysDiff} days`;

                        if (daysDiff < 0) {
                            urgencyClass = 'passed';
                            countdownText = 'Passed';
                        } else if (daysDiff === 0) {
                            urgencyClass = 'urgent';
                            countdownText = 'Today!';
                        } else if (daysDiff <= 3) {
                            urgencyClass = 'urgent';
                        } else if (daysDiff <= 7) {
                            urgencyClass = 'approaching';
                        }

                        return `
                            <div class="countdown-card ${urgencyClass}">
                                <div class="exam-info">
                                    <h4>${escapeHTML(exam.title)}</h4>
                                    <div class="exam-meta">
                                        <span class="badge" style="background:${sub ? sub.color + '20' : '#e0e7ff'}; color:${sub ? sub.color : '#6366f1'}">${escapeHTML(sub ? (sub.code || sub.name) : 'Course')}</span>
                                        <span>${formatDateFriendly(exam.date)}</span>
                                    </div>
                                </div>
                                <div class="exam-countdown-badge">
                                    <span class="countdown-days ${urgencyClass === 'urgent' ? 'text-danger' : ''}">${countdownText}</span>
                                    <span class="countdown-label">${daysDiff >= 0 ? 'Remaining' : 'Status'}</span>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }

            // Today's Study Schedule Timeline
            const todayTimelineEl = document.getElementById('dashTodayTimeline');
            if (todayTimelineEl) {
                const timetable = store.getTimetable();
                if (timetable && timetable.timeline && timetable.timeline.length > 0) {
                    todayTimelineEl.innerHTML = timetable.timeline.slice(0, 5).map(item => {
                        if (item.type === 'study') {
                            return `
                                <div class="timeline-item">
                                    <div class="timeline-dot" style="background:${item.subjectColor};"></div>
                                    <div class="timeline-content">
                                        <span class="timeline-time">${formatTimeFriendly(item.startTime)} - ${formatTimeFriendly(item.endTime)}</span>
                                        <h4 class="timeline-title">${escapeHTML(item.subjectName)}</h4>
                                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${escapeHTML(item.topic)}</p>
                                    </div>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="timeline-item">
                                    <div class="timeline-dot break-dot"></div>
                                    <div class="timeline-content" style="background: var(--bg-surface); border: 1px dashed var(--border-color);">
                                        <span class="timeline-time text-emerald">${formatTimeFriendly(item.startTime)} - ${formatTimeFriendly(item.endTime)}</span>
                                        <h4 class="timeline-title" style="color: var(--success);"><i class="fa-solid fa-mug-hot"></i> Rest & Recharge (${item.duration}m)</h4>
                                    </div>
                                </div>
                            `;
                        }
                    }).join('');
                } else {
                    // Fallback to today's tasks
                    const todayStr = new Date().toISOString().split('T')[0];
                    const todayTasks = tasks.filter(t => t.date === todayStr);

                    if (todayTasks.length === 0) {
                        todayTimelineEl.innerHTML = `
                            <div style="padding: 1rem; text-align: center;">
                                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">No timetable generated yet today.</p>
                                <button class="btn btn-sm btn-primary" onclick="window.sspApp.navigateTo('timetable')">Generate Timetable</button>
                            </div>
                        `;
                    } else {
                        todayTimelineEl.innerHTML = todayTasks.map(t => {
                            const sub = store.getSubjectById(t.subjectId);
                            return `
                                <div class="timeline-item">
                                    <div class="timeline-dot" style="background:${sub ? sub.color : '#6366f1'};"></div>
                                    <div class="timeline-content">
                                        <span class="timeline-time">${formatTimeFriendly(t.startTime || '16:00')} (${t.duration}m)</span>
                                        <h4 class="timeline-title">${escapeHTML(t.title)}</h4>
                                        <span style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML(sub ? sub.name : 'Study')}</span>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    }
                }
            }

            // Render Dashboard Chart
            ChartManager.renderDashboardChart();
        },

        // =====================================================================
        // SUBJECT MANAGEMENT RENDERING
        // =====================================================================
        renderSubjects(filterStatus = 'all', searchQuery = '') {
            const grid = document.getElementById('subjectsGrid');
            const emptyState = document.getElementById('subjectsEmptyState');
            const filterCount = document.getElementById('filterAllCount');
            if (!grid) return;

            let subjects = store.getSubjects();
            if (filterCount) filterCount.textContent = subjects.length;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                subjects = subjects.filter(s =>
                    s.name.toLowerCase().includes(q) ||
                    (s.code && s.code.toLowerCase().includes(q))
                );
            }

            if (filterStatus === 'completed') {
                subjects = subjects.filter(s => {
                    const total = s.topics ? s.topics.length : 0;
                    return total > 0 && s.topics.every(t => t.completed);
                });
            } else if (filterStatus === 'in-progress') {
                subjects = subjects.filter(s => {
                    const total = s.topics ? s.topics.length : 0;
                    return total === 0 || !s.topics.every(t => t.completed);
                });
            }

            if (subjects.length === 0) {
                grid.innerHTML = '';
                if (emptyState) emptyState.hidden = false;
                return;
            }

            if (emptyState) emptyState.hidden = true;

            grid.innerHTML = subjects.map(sub => {
                const totalTopics = sub.topics ? sub.topics.length : 0;
                const completedTopics = sub.topics ? sub.topics.filter(t => t.completed).length : 0;
                const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
                const daysDiff = getDaysDiff(sub.examDate);

                return `
                    <div class="subject-card" data-subject-id="${sub.id}">
                        <div class="subject-card-banner" style="background: ${sub.color || '#6366f1'};"></div>
                        <div class="subject-card-header">
                            <div>
                                ${sub.code ? `<span class="subject-code-badge" style="background:${sub.color}20; color:${sub.color};">${escapeHTML(sub.code)}</span>` : ''}
                                <h3 class="subject-name">${escapeHTML(sub.name)}</h3>
                            </div>
                            <div class="subject-actions">
                                <button class="btn-icon" title="Edit Subject" onclick="window.sspApp.openSubjectModal('${sub.id}')">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn-icon" title="Delete Subject" onclick="window.sspApp.deleteSubject('${sub.id}')">
                                    <i class="fa-solid fa-trash-can text-danger"></i>
                                </button>
                            </div>
                        </div>

                        <div class="subject-card-body">
                            <div class="subject-meta-row">
                                <span><i class="fa-solid fa-award"></i> ${escapeHTML(sub.credits || '3 Credits')}</span>
                                ${sub.examDate ? `<span><i class="fa-regular fa-calendar-check"></i> Exam: ${formatDateFriendly(sub.examDate)} (${daysDiff >= 0 ? daysDiff + 'd left' : 'Passed'})</span>` : ''}
                            </div>

                            <div class="subject-progress-section">
                                <div class="progress-header">
                                    <span>Syllabus Covered</span>
                                    <span class="progress-percentage">${completedTopics}/${totalTopics} (${pct}%)</span>
                                </div>
                                <div class="mini-progress-bar">
                                    <div class="progress-fill" style="width: ${pct}%; background: ${sub.color || '#6366f1'};"></div>
                                </div>
                            </div>

                            <div class="topics-section">
                                <div class="topics-header">
                                    <span>Topics & Syllabus</span>
                                    <span style="font-size:0.75rem; color:var(--text-muted);">${completedTopics} of ${totalTopics} Done</span>
                                </div>
                                <div class="topics-list" id="topicList-${sub.id}">
                                    ${(sub.topics || []).map(topic => `
                                        <div class="topic-item ${topic.completed ? 'completed' : ''}">
                                            <div class="topic-left">
                                                <input type="checkbox" ${topic.completed ? 'checked' : ''} onchange="window.sspApp.toggleTopicComplete('${sub.id}', '${topic.id}')" style="accent-color:${sub.color || '#6366f1'};">
                                                <span class="topic-name">${escapeHTML(topic.name)}</span>
                                            </div>
                                            <div class="topic-actions">
                                                <button class="btn-icon topic-del-btn" title="Delete Topic" onclick="window.sspApp.deleteTopic('${sub.id}', '${topic.id}')">
                                                    <i class="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="add-topic-inline">
                                    <input type="text" id="inlineTopicInput-${sub.id}" placeholder="Add syllabus topic..." onkeydown="if(event.key==='Enter') window.sspApp.addTopicInline('${sub.id}')">
                                    <button class="btn btn-sm btn-secondary" onclick="window.sspApp.addTopicInline('${sub.id}')">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        },

        // =====================================================================
        // TASK & PLANNER RENDERING
        // =====================================================================
        renderTasks() {
            // Populate subject filter dropdown in planner
            const subFilter = document.getElementById('taskFilterSubject');
            const subjects = store.getSubjects();
            if (subFilter) {
                const currentVal = subFilter.value;
                subFilter.innerHTML = '<option value="all">All Subjects</option>' +
                    subjects.map(s => `<option value="${s.id}">${escapeHTML(s.name)} (${s.code || ''})</option>`).join('');
                subFilter.value = currentVal;
            }

            this.applyTaskFiltersAndRender();
        },

        applyTaskFiltersAndRender() {
            let tasks = store.getTasks();

            const searchVal = document.getElementById('taskSearchInput')?.value.toLowerCase().trim() || '';
            const subFilterVal = document.getElementById('taskFilterSubject')?.value || 'all';
            const priorityVal = document.getElementById('taskFilterPriority')?.value || 'all';
            const statusVal = document.getElementById('taskFilterStatus')?.value || 'all';
            const dateVal = document.getElementById('taskFilterDate')?.value || 'all';

            const todayStr = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            // Apply Filters
            if (searchVal) {
                tasks = tasks.filter(t =>
                    t.title.toLowerCase().includes(searchVal) ||
                    (t.description && t.description.toLowerCase().includes(searchVal))
                );
            }

            if (subFilterVal !== 'all') {
                tasks = tasks.filter(t => t.subjectId === subFilterVal);
            }

            if (priorityVal !== 'all') {
                tasks = tasks.filter(t => t.priority === priorityVal);
            }

            if (statusVal !== 'all') {
                tasks = tasks.filter(t => t.status === statusVal);
            }

            if (dateVal === 'today') {
                tasks = tasks.filter(t => t.date === todayStr);
            } else if (dateVal === 'tomorrow') {
                tasks = tasks.filter(t => t.date === tomorrowStr);
            } else if (dateVal === 'week') {
                const now = new Date();
                const weekEnd = new Date();
                weekEnd.setDate(now.getDate() + 7);
                tasks = tasks.filter(t => {
                    const taskDate = new Date(t.date);
                    return taskDate >= now && taskDate <= weekEnd;
                });
            } else if (dateVal === 'overdue') {
                tasks = tasks.filter(t => t.date < todayStr && t.status !== 'Completed');
            }

            // Render according to active view pane
            this.renderTasksListView(tasks);
            this.renderTasksBoardView(tasks);
            this.renderTasksAgendaView(tasks);
        },

        renderTasksListView(tasks) {
            const tbody = document.getElementById('tasksTableBody');
            const empty = document.getElementById('tasksEmptyState');
            if (!tbody) return;

            if (tasks.length === 0) {
                tbody.innerHTML = '';
                if (empty) empty.hidden = false;
                return;
            }

            if (empty) empty.hidden = true;

            tbody.innerHTML = tasks.map(task => {
                const sub = store.getSubjectById(task.subjectId);
                const isDone = task.status === 'Completed';
                const priorityClass = task.priority === 'High' ? 'priority-badge-high' :
                    task.priority === 'Medium' ? 'priority-badge-medium' : 'priority-badge-low';

                return `
                    <tr class="${isDone ? 'completed-row' : ''}">
                        <td>
                            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window.sspApp.toggleTaskComplete('${task.id}')" style="accent-color:var(--primary-color); cursor:pointer;">
                        </td>
                        <td>
                            <div class="task-cell-main">
                                <span class="task-name-text ${isDone ? 'text-decoration-line-through text-muted' : ''}">${escapeHTML(task.title)}</span>
                                <div style="display:flex; align-items:center; gap: 0.4rem; margin-top:2px;">
                                    <span class="subject-color-dot" style="background:${sub ? sub.color : '#6366f1'};"></span>
                                    <span style="font-size:0.75rem; color:var(--text-secondary);">${escapeHTML(sub ? sub.name : 'General')}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="task-date-pill">
                                <i class="fa-regular fa-calendar"></i>
                                ${formatDateFriendly(task.date)} ${task.startTime ? formatTimeFriendly(task.startTime) : ''}
                            </span>
                        </td>
                        <td>
                            <span style="font-size:0.8rem; font-weight:600;"><i class="fa-regular fa-clock text-muted"></i> ${task.duration}m</span>
                        </td>
                        <td>
                            <span class="badge ${priorityClass}">${task.priority}</span>
                        </td>
                        <td>
                            <select onchange="window.sspApp.updateTaskStatus('${task.id}', this.value)" style="padding: 2px 6px; font-size: 0.78rem; border-radius: 4px;">
                                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </td>
                        <td style="text-align: right;">
                            <button class="btn-icon" title="Focus Timer" onclick="window.sspApp.startTimerForTask('${task.id}')">
                                <i class="fa-solid fa-play text-indigo"></i>
                            </button>
                            <button class="btn-icon" title="Edit Task" onclick="window.sspApp.openTaskModal('${task.id}')">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-icon" title="Delete Task" onclick="window.sspApp.deleteTask('${task.id}')">
                                <i class="fa-solid fa-trash-can text-danger"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        },

        renderTasksBoardView(tasks) {
            const pendingList = document.getElementById('kanbanPendingList');
            const progressList = document.getElementById('kanbanProgressList');
            const completedList = document.getElementById('kanbanCompletedList');

            const pendingCountEl = document.getElementById('kanbanPendingCount');
            const progressCountEl = document.getElementById('kanbanProgressCount');
            const completedCountEl = document.getElementById('kanbanCompletedCount');

            if (!pendingList || !progressList || !completedList) return;

            const pendingTasks = tasks.filter(t => t.status === 'Pending');
            const progressTasks = tasks.filter(t => t.status === 'In Progress');
            const completedTasks = tasks.filter(t => t.status === 'Completed');

            if (pendingCountEl) pendingCountEl.textContent = pendingTasks.length;
            if (progressCountEl) progressCountEl.textContent = progressTasks.length;
            if (completedCountEl) completedCountEl.textContent = completedTasks.length;

            const renderCard = (task) => {
                const sub = store.getSubjectById(task.subjectId);
                const priorityClass = task.priority === 'High' ? 'priority-badge-high' :
                    task.priority === 'Medium' ? 'priority-badge-medium' : 'priority-badge-low';

                return `
                    <div class="kanban-card" data-task-id="${task.id}">
                        <div class="kanban-card-top">
                            <span class="badge" style="background:${sub ? sub.color + '20' : '#e0e7ff'}; color:${sub ? sub.color : '#6366f1'}">${escapeHTML(sub ? (sub.code || sub.name) : 'Course')}</span>
                            <span class="badge ${priorityClass}">${task.priority}</span>
                        </div>
                        <h4 class="kanban-card-title">${escapeHTML(task.title)}</h4>
                        ${task.description ? `<p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.4rem;">${escapeHTML(task.description)}</p>` : ''}
                        <div class="kanban-card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${formatDateFriendly(task.date)}</span>
                            <span><i class="fa-regular fa-clock"></i> ${task.duration}m</span>
                        </div>
                        <div class="kanban-card-actions">
                            ${task.status !== 'Pending' ? `<button class="btn btn-ghost btn-sm" onclick="window.sspApp.updateTaskStatus('${task.id}', 'Pending')" title="Move to Pending"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
                            ${task.status !== 'In Progress' ? `<button class="btn btn-ghost btn-sm" onclick="window.sspApp.updateTaskStatus('${task.id}', 'In Progress')" title="Move to In Progress"><i class="fa-solid fa-play text-indigo"></i></button>` : ''}
                            ${task.status !== 'Completed' ? `<button class="btn btn-ghost btn-sm" onclick="window.sspApp.updateTaskStatus('${task.id}', 'Completed')" title="Move to Completed"><i class="fa-solid fa-check text-emerald"></i></button>` : ''}
                            <div style="margin-left:auto; display:flex; gap:0.25rem;">
                                <button class="btn-icon" onclick="window.sspApp.openTaskModal('${task.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button class="btn-icon" onclick="window.sspApp.deleteTask('${task.id}')"><i class="fa-solid fa-trash-can text-danger"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            };

            pendingList.innerHTML = pendingTasks.map(renderCard).join('') || '<p class="text-muted text-center" style="font-size:0.8rem; padding:1rem;">No pending tasks</p>';
            progressList.innerHTML = progressTasks.map(renderCard).join('') || '<p class="text-muted text-center" style="font-size:0.8rem; padding:1rem;">No tasks in progress</p>';
            completedList.innerHTML = completedTasks.map(renderCard).join('') || '<p class="text-muted text-center" style="font-size:0.8rem; padding:1rem;">No completed tasks</p>';
        },

        renderTasksAgendaView(tasks) {
            const container = document.getElementById('agendaTimeline');
            if (!container) return;

            // Group tasks by date
            const grouped = {};
            tasks.forEach(t => {
                if (!grouped[t.date]) grouped[t.date] = [];
                grouped[t.date].push(t);
            });

            const sortedDates = Object.keys(grouped).sort();

            if (sortedDates.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No tasks scheduled</h3><p>Add study tasks to populate your daily agenda.</p></div>';
                return;
            }

            container.innerHTML = sortedDates.map(dateKey => {
                const dateTasks = grouped[dateKey];
                const friendlyDate = formatDateFriendly(dateKey);

                return `
                    <div class="agenda-day-card">
                        <div class="agenda-day-header">
                            <h3><i class="fa-regular fa-calendar-days text-indigo"></i> ${friendlyDate}</h3>
                            <span class="badge badge-pill badge-primary">${dateTasks.length} Sessions</span>
                        </div>
                        <div class="agenda-day-list">
                            ${dateTasks.map(t => {
                                const sub = store.getSubjectById(t.subjectId);
                                return `
                                    <div class="task-item-card ${t.status === 'Completed' ? 'completed' : ''}">
                                        <div class="task-checkbox-custom" onclick="window.sspApp.toggleTaskComplete('${t.id}')">
                                            ${t.status === 'Completed' ? '<i class="fa-solid fa-check"></i>' : ''}
                                        </div>
                                        <div class="task-info">
                                            <div class="task-title">${escapeHTML(t.title)}</div>
                                            <div class="task-meta">
                                                <span class="task-subject-tag">
                                                    <span class="subject-color-dot" style="background:${sub ? sub.color : '#6366f1'};"></span>
                                                    ${escapeHTML(sub ? sub.name : 'Course')}
                                                </span>
                                                <span>•</span>
                                                <span><i class="fa-regular fa-clock"></i> ${formatTimeFriendly(t.startTime || '16:00')} (${t.duration}m)</span>
                                                <span>•</span>
                                                <span class="badge ${t.priority === 'High' ? 'badge-danger' : t.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}">${t.priority}</span>
                                            </div>
                                        </div>
                                        <button class="btn-icon" title="Focus Timer" onclick="window.sspApp.startTimerForTask('${t.id}')">
                                            <i class="fa-solid fa-play text-indigo"></i>
                                        </button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        },

        // Switch Planner Views (List, Board, Agenda)
        setPlannerView(viewName) {
            this.currentTaskView = viewName;
            document.querySelectorAll('.view-toggle-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-task-view') === viewName);
            });

            document.getElementById('pane-list-view').hidden = viewName !== 'list';
            document.getElementById('pane-board-view').hidden = viewName !== 'board';
            document.getElementById('pane-agenda-view').hidden = viewName !== 'agenda';

            this.applyTaskFiltersAndRender();
        },

        // =====================================================================
        // SMART TIMETABLE GENERATOR RENDERING
        // =====================================================================
        renderTimetable() {
            const subjects = store.getSubjects();
            const checkboxContainer = document.getElementById('ttSubjectCheckboxes');

            if (checkboxContainer) {
                checkboxContainer.innerHTML = subjects.map(s => `
                    <label class="subject-check-item">
                        <input type="checkbox" name="ttSubject" value="${s.id}" checked>
                        <span class="subject-color-dot" style="background:${s.color || '#6366f1'};"></span>
                        <span>${escapeHTML(s.name)} (${s.code || ''})</span>
                    </label>
                `).join('') || '<p class="text-muted" style="font-size:0.8rem;">No subjects added yet.</p>';
            }

            // Sync hours slider display
            const slider = document.getElementById('ttStudyHours');
            const display = document.getElementById('ttHoursDisplay');
            if (slider && display) {
                slider.addEventListener('input', () => {
                    display.textContent = `${slider.value} hours`;
                });
            }

            // Render existing timetable if stored
            const savedTT = store.getTimetable();
            if (savedTT) {
                this.displayGeneratedTimetable(savedTT);
            }
        },

        displayGeneratedTimetable(result) {
            const listEl = document.getElementById('generatedTimelineList');
            const summaryBadge = document.getElementById('ttScheduleSummaryBadge');
            const studyTimeEl = document.getElementById('ttTotalStudyTime');
            const breakTimeEl = document.getElementById('ttTotalBreakTime');
            const finishTimeEl = document.getElementById('ttFinishTime');

            if (!listEl) return;

            if (!result || !result.timeline || result.timeline.length === 0) {
                listEl.innerHTML = '<p class="text-muted text-center" style="padding: 2rem;">Click "Generate Smart Timetable" to build today\'s study plan.</p>';
                return;
            }

            if (summaryBadge) summaryBadge.textContent = `${result.sessionsCount} Sessions Planned`;

            const studyHours = Math.floor(result.totalStudyMinutes / 60);
            const studyMins = result.totalStudyMinutes % 60;
            if (studyTimeEl) studyTimeEl.textContent = `${studyHours}h ${studyMins < 10 ? '0' + studyMins : studyMins}m`;

            if (breakTimeEl) breakTimeEl.textContent = `${result.totalBreakMinutes}m`;
            if (finishTimeEl) finishTimeEl.textContent = formatTimeFriendly(result.finishTime);

            listEl.innerHTML = result.timeline.map((item, idx) => {
                if (item.type === 'study') {
                    return `
                        <div class="timeline-session-card">
                            <div class="session-color-strip" style="background:${item.subjectColor};"></div>
                            <div class="session-time-col">
                                <span class="session-time-range">${formatTimeFriendly(item.startTime)} - ${formatTimeFriendly(item.endTime)}</span>
                                <span class="session-duration"><i class="fa-regular fa-clock"></i> ${item.duration} Minutes</span>
                            </div>
                            <div class="session-content-col">
                                <span class="session-subject-badge" style="color:${item.subjectColor};">${escapeHTML(item.subjectName)} (${item.subjectCode})</span>
                                <h4 class="session-topic-title">${escapeHTML(item.topic)}</h4>
                                <span class="session-goal-sub">${escapeHTML(item.goal)}</span>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="timeline-break-card">
                            <i class="fa-solid fa-mug-hot break-icon"></i>
                            <div class="break-text">
                                <strong>${item.duration}-Minute Wellness Break (${formatTimeFriendly(item.startTime)} - ${formatTimeFriendly(item.endTime)}):</strong>
                                <span>${item.tip}</span>
                            </div>
                        </div>
                    `;
                }
            }).join('');
        },

        bindTimetableEvents() {
            const form = document.getElementById('timetableGeneratorForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const availableHours = parseFloat(document.getElementById('ttStudyHours').value) || 4;
                    const startTime = document.getElementById('ttStartTime').value || '16:00';
                    const sessionDuration = parseInt(document.getElementById('ttSessionDuration').value, 10) || 45;
                    const breakDuration = parseInt(document.getElementById('ttBreakDuration').value, 10) || 10;
                    const strategy = document.getElementById('ttStrategy').value || 'balanced';

                    const includedSubjectIds = Array.from(document.querySelectorAll('input[name="ttSubject"]:checked')).map(cb => cb.value);

                    const result = TimetableEngine.generate({
                        availableHours,
                        startTime,
                        sessionDuration,
                        breakDuration,
                        strategy,
                        includedSubjectIds
                    });

                    if (result.success) {
                        this.displayGeneratedTimetable(result);
                        showToast(`Smart Timetable generated! ${result.sessionsCount} sessions scheduled.`, 'success');
                    } else {
                        showToast(result.message, 'warning');
                    }
                });
            }

            // Save Timetable to Tasks
            document.getElementById('saveTimetableToTasksBtn')?.addEventListener('click', () => {
                const tt = store.getTimetable();
                if (!tt || !tt.timeline) {
                    showToast('Please generate a timetable first.', 'info');
                    return;
                }

                const todayStr = new Date().toISOString().split('T')[0];
                const currentTasks = store.getTasks();
                let addedCount = 0;

                tt.timeline.forEach(item => {
                    if (item.type === 'study') {
                        const newTask = {
                            id: generateId('task'),
                            title: `Study Session: ${item.topic}`,
                            description: item.goal,
                            subjectId: item.subjectId,
                            priority: 'High',
                            status: 'Pending',
                            date: todayStr,
                            startTime: item.startTime,
                            duration: item.duration
                        };
                        currentTasks.unshift(newTask);
                        addedCount++;
                    }
                });

                store.setTasks(currentTasks);
                this.updateHeaderAndSidebarBadges();
                showToast(`Saved ${addedCount} timetable sessions into your tasks!`, 'success');
            });

            // Export Timetable as CSV
            document.getElementById('exportTimetableCsvBtn')?.addEventListener('click', () => {
                const tt = store.getTimetable();
                if (!tt || !tt.timeline) {
                    showToast('No generated timetable to export.', 'info');
                    return;
                }

                let csv = 'Type,Start Time,End Time,Duration (Mins),Subject,Topic / Activity,Notes\n';
                tt.timeline.forEach(item => {
                    if (item.type === 'study') {
                        csv += `"Study","${item.startTime}","${item.endTime}","${item.duration}","${item.subjectName.replace(/"/g, '""')}","${item.topic.replace(/"/g, '""')}","${item.goal.replace(/"/g, '""')}"\n`;
                    } else {
                        csv += `"Break","${item.startTime}","${item.endTime}","${item.duration}","-","Recuperation Break","${item.tip.replace(/"/g, '""')}"\n`;
                    }
                });

                this.downloadCSV(csv, 'study_timetable.csv');
                showToast('Timetable exported as CSV.', 'success');
            });
        },

        // =====================================================================
        // EXAM COUNTDOWN RENDERING
        // =====================================================================
        renderExams() {
            const grid = document.getElementById('examsGrid');
            const empty = document.getElementById('examsEmptyState');
            if (!grid) return;

            const exams = store.getExams();
            if (exams.length === 0) {
                grid.innerHTML = '';
                if (empty) empty.hidden = false;
                return;
            }

            if (empty) empty.hidden = true;

            // Sort exams chronologically
            const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

            grid.innerHTML = sorted.map(exam => {
                const sub = store.getSubjectById(exam.subjectId);
                const daysDiff = getDaysDiff(exam.date);

                // Urgency classification
                let urgencyBadge = '<span class="badge badge-primary">Upcoming</span>';
                let daysClass = 'text-indigo';

                if (daysDiff < 0) {
                    urgencyBadge = '<span class="badge" style="background:var(--bg-muted); color:var(--text-muted);">Completed / Passed</span>';
                    daysClass = 'text-muted';
                } else if (daysDiff === 0) {
                    urgencyBadge = '<span class="badge badge-danger">EXAM TODAY</span>';
                    daysClass = 'text-danger';
                } else if (daysDiff <= 3) {
                    urgencyBadge = '<span class="badge badge-danger">URGENT (< 3 Days)</span>';
                    daysClass = 'text-danger';
                } else if (daysDiff <= 7) {
                    urgencyBadge = '<span class="badge badge-warning">Approaching (1 Week)</span>';
                    daysClass = 'text-amber';
                }

                // Hours and minutes calculation for realistic countdown
                const hoursLeft = daysDiff >= 0 ? Math.max(0, daysDiff * 24 - new Date().getHours()) : 0;

                return `
                    <div class="exam-detail-card" data-exam-id="${exam.id}">
                        <div class="exam-card-top-banner">
                            <div class="exam-title-group">
                                <span class="exam-subject-pill" style="background:${sub ? sub.color + '20' : '#e0e7ff'}; color:${sub ? sub.color : '#6366f1'};">${escapeHTML(sub ? (sub.code || sub.name) : 'Course')}</span>
                                <h3>${escapeHTML(exam.title)}</h3>
                            </div>
                            ${urgencyBadge}
                        </div>

                        <div class="exam-big-countdown">
                            <div class="countdown-timer-units">
                                <div class="timer-unit-box">
                                    <span class="timer-unit-number ${daysClass}">${daysDiff >= 0 ? daysDiff : 0}</span>
                                    <span class="timer-unit-label">Days</span>
                                </div>
                                <span class="timer-unit-separator">:</span>
                                <div class="timer-unit-box">
                                    <span class="timer-unit-number ${daysClass}">${hoursLeft % 24}</span>
                                    <span class="timer-unit-label">Hours</span>
                                </div>
                                <span class="timer-unit-separator">:</span>
                                <div class="timer-unit-box">
                                    <span class="timer-unit-number ${daysClass}">00</span>
                                    <span class="timer-unit-label">Mins</span>
                                </div>
                            </div>
                        </div>

                        <div class="exam-details-body">
                            <div class="exam-info-row">
                                <i class="fa-regular fa-calendar text-indigo"></i>
                                <span><strong>Date & Time:</strong> ${formatDateFriendly(exam.date)} at ${formatTimeFriendly(exam.time || '09:00')}</span>
                            </div>
                            ${exam.location ? `
                                <div class="exam-info-row">
                                    <i class="fa-solid fa-location-dot text-danger"></i>
                                    <span><strong>Venue:</strong> ${escapeHTML(exam.location)}</span>
                                </div>
                            ` : ''}
                            ${exam.weightage ? `
                                <div class="exam-info-row">
                                    <i class="fa-solid fa-percent text-amber"></i>
                                    <span><strong>Grade Weightage:</strong> ${escapeHTML(exam.weightage)}</span>
                                </div>
                            ` : ''}

                            ${(exam.topics && exam.topics.length > 0) ? `
                                <div class="exam-syllabus-box">
                                    <div class="exam-syllabus-header">Target Syllabus Topics</div>
                                    <div class="exam-topics-pills">
                                        ${exam.topics.map(t => `<span class="exam-topic-pill"><i class="fa-solid fa-check-circle text-emerald"></i> ${escapeHTML(t)}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="exam-card-footer">
                            <button class="btn btn-sm btn-secondary" onclick="window.sspApp.scheduleStudyForExam('${exam.id}')">
                                <i class="fa-solid fa-calendar-plus"></i> Schedule Study
                            </button>
                            <div style="display:flex; gap:0.25rem;">
                                <button class="btn-icon" title="Edit Exam" onclick="window.sspApp.openExamModal('${exam.id}')">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn-icon" title="Delete Exam" onclick="window.sspApp.deleteExam('${exam.id}')">
                                    <i class="fa-solid fa-trash-can text-danger"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        },

        scheduleStudyForExam(examId) {
            const exam = store.getExams().find(e => e.id === examId);
            if (!exam) return;
            this.openTaskModal(null, {
                title: `Intensive Prep for ${exam.title}`,
                subjectId: exam.subjectId,
                priority: 'High',
                duration: 60
            });
        },

        // =====================================================================
        // PROGRESS ANALYTICS RENDERING
        // =====================================================================
        renderAnalytics() {
            const tasks = store.getTasks();
            const sessions = store.getSessions();
            const settings = store.getSettings();

            // Total study hours
            const totalMinutes = sessions.reduce((acc, curr) => acc + (Number(curr.minutes) || 0), 0);
            const totalHours = (totalMinutes / 60).toFixed(1);

            // This week's study hours
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - 7);
            const thisWeekMinutes = sessions
                .filter(s => new Date(s.date) >= startOfWeek)
                .reduce((acc, curr) => acc + (Number(curr.minutes) || 0), 0);
            const thisWeekHours = (thisWeekMinutes / 60).toFixed(1);

            // Task completion rate
            const completedCount = tasks.filter(t => t.status === 'Completed').length;
            const taskRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

            const hoursEl = document.getElementById('analyticsTotalStudyHours');
            const weekHoursEl = document.getElementById('analyticsThisWeekHours');
            const rateEl = document.getElementById('analyticsTaskCompletionRate');
            const taskSummaryEl = document.getElementById('analyticsTaskCountSummary');
            const pomosEl = document.getElementById('analyticsTotalPomodoros');
            const streakEl = document.getElementById('analyticsStudyStreak');

            if (hoursEl) hoursEl.textContent = `${totalHours} hrs`;
            if (weekHoursEl) weekHoursEl.textContent = `${thisWeekHours} hrs this week`;
            if (rateEl) rateEl.textContent = `${taskRate}%`;
            if (taskSummaryEl) taskSummaryEl.textContent = `${completedCount} of ${tasks.length} tasks done`;
            if (pomosEl) pomosEl.textContent = sessions.length;
            if (streakEl) streakEl.textContent = `${settings.streakCount || 1} Days`;

            // Sessions history table
            const tbody = document.getElementById('analyticsSessionsLogBody');
            if (tbody) {
                if (sessions.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:1.5rem;">No study sessions logged yet. Complete a Pomodoro session to see your logs!</td></tr>';
                } else {
                    tbody.innerHTML = sessions.slice(0, 15).map(sess => {
                        const sub = store.getSubjectById(sess.subjectId);
                        return `
                            <tr>
                                <td>${formatDateFriendly(sess.date)}</td>
                                <td>
                                    <div style="display:flex; align-items:center; gap:0.4rem;">
                                        <span class="subject-color-dot" style="background:${sub ? sub.color : '#6366f1'};"></span>
                                        <strong>${escapeHTML(sub ? sub.name : 'General')}</strong>
                                    </div>
                                </td>
                                <td>${escapeHTML(sess.topic || 'Deep Focus Session')}</td>
                                <td><strong>${sess.minutes}m</strong></td>
                                <td><span class="badge badge-purple">${sess.type || 'Focus'}</span></td>
                            </tr>
                        `;
                    }).join('');
                }
            }

            // Render Chart.js charts
            ChartManager.renderAnalyticsCharts();
        },

        // =====================================================================
        // SETTINGS PAGE RENDERING
        // =====================================================================
        renderSettings() {
            const settings = store.getSettings();

            const nameInput = document.getElementById('setStudentName');
            const majorInput = document.getElementById('setUserMajor');
            const goalInput = document.getElementById('setDailyGoal');

            const focusInput = document.getElementById('setFocusDuration');
            const shortInput = document.getElementById('setShortBreak');
            const longInput = document.getElementById('setLongBreak');
            const soundCheck = document.getElementById('setSoundEnabled');

            if (nameInput) nameInput.value = settings.studentName || 'Alex Morgan';
            if (majorInput) majorInput.value = settings.major || 'Computer Science & Engineering';
            if (goalInput) goalInput.value = settings.dailyGoal || 4;

            if (focusInput) focusInput.value = settings.focusDuration || 25;
            if (shortInput) shortInput.value = settings.shortBreak || 5;
            if (longInput) longInput.value = settings.longBreak || 15;
            if (soundCheck) soundCheck.checked = settings.soundEnabled !== false;
        },

        bindSettingsAndBackups() {
            // Profile Form
            document.getElementById('settingsProfileForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const settings = store.getSettings();
                settings.studentName = document.getElementById('setStudentName').value.trim() || 'Student';
                settings.major = document.getElementById('setUserMajor').value.trim() || 'College Student';
                settings.dailyGoal = parseFloat(document.getElementById('setDailyGoal').value) || 4;
                store.setSettings(settings);

                this.updateHeaderAndSidebarBadges();
                showToast('Profile and study goals updated successfully!', 'success');
            });

            // Timer Form
            document.getElementById('settingsTimerForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const settings = store.getSettings();
                settings.focusDuration = parseInt(document.getElementById('setFocusDuration').value, 10) || 25;
                settings.shortBreak = parseInt(document.getElementById('setShortBreak').value, 10) || 5;
                settings.longBreak = parseInt(document.getElementById('setLongBreak').value, 10) || 15;
                settings.soundEnabled = document.getElementById('setSoundEnabled').checked;
                store.setSettings(settings);

                PomodoroTimer.loadSettings();
                PomodoroTimer.updateDisplay();
                PomodoroTimer.updateSoundButtonUI(settings.soundEnabled);
                showToast('Pomodoro preferences saved.', 'success');
            });

            // Export JSON
            document.getElementById('btnExportJson')?.addEventListener('click', () => {
                const json = store.exportJSON();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `smart_study_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Backup JSON downloaded.', 'success');
            });

            // Import JSON
            document.getElementById('btnImportJson')?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        store.importJSON(event.target.result);
                        this.renderPage(this.currentPage);
                        showToast('Backup restored successfully!', 'success');
                    } catch (err) {
                        showToast(`Failed to import: ${err.message}`, 'error');
                    }
                };
                reader.readAsText(file);
            });

            // Reset Demo Data
            document.getElementById('btnResetDemoData')?.addEventListener('click', () => {
                showConfirmModal(
                    'Reset to Sample Demo Data?',
                    'This will overwrite your existing subjects and tasks with the rich default college sample curriculum.',
                    () => {
                        store.seedSampleData();
                        this.renderPage(this.currentPage);
                        showToast('Reset to demo sample data complete.', 'success');
                    }
                );
            });

            // Clear All Data
            document.getElementById('btnClearAllData')?.addEventListener('click', () => {
                showConfirmModal(
                    'Clear All Data?',
                    'Are you sure you want to delete all subjects, tasks, exams, and logs? This action is permanent.',
                    () => {
                        store.clearAllData();
                        this.renderPage(this.currentPage);
                        showToast('All planner data cleared.', 'info');
                    }
                );
            });

            // Export Tasks CSV
            document.getElementById('exportTasksCsvBtn')?.addEventListener('click', () => {
                const tasks = store.getTasks();
                if (tasks.length === 0) {
                    showToast('No tasks to export.', 'info');
                    return;
                }

                let csv = 'Task ID,Title,Description,Subject,Scheduled Date,Start Time,Duration (Mins),Priority,Status\n';
                tasks.forEach(t => {
                    const sub = store.getSubjectById(t.subjectId);
                    csv += `"${t.id}","${t.title.replace(/"/g, '""')}","${(t.description || '').replace(/"/g, '""')}","${sub ? sub.name.replace(/"/g, '""') : ''}","${t.date}","${t.startTime || ''}","${t.duration}","${t.priority}","${t.status}"\n`;
                });

                this.downloadCSV(csv, 'study_tasks.csv');
                showToast('Tasks exported as CSV.', 'success');
            });

            // Export Analytics CSV
            document.getElementById('exportAnalyticsCsvBtn')?.addEventListener('click', () => {
                const sessions = store.getSessions();
                if (sessions.length === 0) {
                    showToast('No session history to export.', 'info');
                    return;
                }

                let csv = 'Session ID,Date,Subject,Topic,Duration (Mins),Type\n';
                sessions.forEach(s => {
                    const sub = store.getSubjectById(s.subjectId);
                    csv += `"${s.id}","${s.date}","${sub ? sub.name.replace(/"/g, '""') : ''}","${(s.topic || '').replace(/"/g, '""')}","${s.minutes}","${s.type || 'Focus'}"\n`;
                });

                this.downloadCSV(csv, 'study_sessions_log.csv');
                showToast('Study session log exported as CSV.', 'success');
            });
        },

        downloadCSV(csvContent, filename) {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        },

        // =====================================================================
        // GLOBAL SEARCH & KEYBOARD SHORTCUTS
        // =====================================================================
        bindGlobalSearch() {
            const input = document.getElementById('globalSearchInput');
            const dropdown = document.getElementById('searchResultsDropdown');

            if (!input || !dropdown) return;

            // Shortcut Ctrl/Cmd + K
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    input.focus();
                }
            });

            input.addEventListener('input', () => {
                const query = input.value.trim().toLowerCase();
                if (!query) {
                    dropdown.hidden = true;
                    return;
                }

                const tasks = store.getTasks();
                const subjects = store.getSubjects();

                const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query)));
                const matchedSubjects = subjects.filter(s => s.name.toLowerCase().includes(query) || (s.code && s.code.toLowerCase().includes(query)));

                if (matchedTasks.length === 0 && matchedSubjects.length === 0) {
                    dropdown.innerHTML = '<div style="padding:0.75rem; font-size:0.85rem; color:var(--text-muted); text-align:center;">No matching results found</div>';
                    dropdown.hidden = false;
                    return;
                }

                let html = '';

                if (matchedTasks.length > 0) {
                    html += '<div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); padding:4px 8px; text-transform:uppercase;">Tasks</div>';
                    html += matchedTasks.slice(0, 4).map(t => `
                        <div class="search-result-item" onclick="window.sspApp.onSearchResultClick('task', '${t.id}')">
                            <span class="search-result-badge badge-primary">Task</span>
                            <span class="search-result-title">${escapeHTML(t.title)}</span>
                            <span class="search-result-sub">${t.priority}</span>
                        </div>
                    `).join('');
                }

                if (matchedSubjects.length > 0) {
                    html += '<div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); padding:4px 8px; text-transform:uppercase; margin-top:4px;">Subjects</div>';
                    html += matchedSubjects.slice(0, 3).map(s => `
                        <div class="search-result-item" onclick="window.sspApp.onSearchResultClick('subject', '${s.id}')">
                            <span class="search-result-badge badge-purple">Course</span>
                            <span class="search-result-title">${escapeHTML(s.name)}</span>
                            <span class="search-result-sub">${s.code || ''}</span>
                        </div>
                    `).join('');
                }

                dropdown.innerHTML = html;
                dropdown.hidden = false;
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.hidden = true;
                }
            });
        },

        onSearchResultClick(type, id) {
            const dropdown = document.getElementById('searchResultsDropdown');
            const input = document.getElementById('globalSearchInput');
            if (dropdown) dropdown.hidden = true;
            if (input) input.value = '';

            if (type === 'task') {
                this.navigateTo('tasks');
                this.openTaskModal(id);
            } else if (type === 'subject') {
                this.navigateTo('subjects');
            }
        },

        // =====================================================================
        // MODALS & FORM CONTROLLERS
        // =====================================================================
        bindModals() {
            // Close buttons on all modals
            document.querySelectorAll('[data-close-modal]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const modalId = e.currentTarget.getAttribute('data-close-modal');
                    const modal = document.getElementById(modalId);
                    if (modal) modal.hidden = true;
                });
            });

            // Confirm modal buttons
            document.getElementById('confirmModalCancelBtn')?.addEventListener('click', () => {
                document.getElementById('confirmModal').hidden = true;
                confirmCallback = null;
            });

            document.getElementById('confirmModalConfirmBtn')?.addEventListener('click', () => {
                document.getElementById('confirmModal').hidden = true;
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                    confirmCallback = null;
                }
            });

            // Add button triggers
            document.getElementById('openAddSubjectModalBtn')?.addEventListener('click', () => this.openSubjectModal());
            document.getElementById('emptyAddSubjectBtn')?.addEventListener('click', () => this.openSubjectModal());

            document.getElementById('openAddTaskModalBtn')?.addEventListener('click', () => this.openTaskModal());

            document.getElementById('openAddExamModalBtn')?.addEventListener('click', () => this.openExamModal());
            document.getElementById('emptyAddExamBtn')?.addEventListener('click', () => this.openExamModal());

            // Subject Filter Chips
            document.querySelectorAll('[data-subject-filter]').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    document.querySelectorAll('[data-subject-filter]').forEach(c => c.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    const filter = e.currentTarget.getAttribute('data-subject-filter');
                    const search = document.getElementById('subjectSearchInput')?.value || '';
                    this.renderSubjects(filter, search);
                });
            });

            // Subject Search Input
            document.getElementById('subjectSearchInput')?.addEventListener('input', (e) => {
                const activeFilter = document.querySelector('[data-subject-filter].active')?.getAttribute('data-subject-filter') || 'all';
                this.renderSubjects(activeFilter, e.target.value);
            });

            // Planner View Toggle Buttons
            document.getElementById('taskViewListBtn')?.addEventListener('click', () => this.setPlannerView('list'));
            document.getElementById('taskViewBoardBtn')?.addEventListener('click', () => this.setPlannerView('board'));
            document.getElementById('taskViewAgendaBtn')?.addEventListener('click', () => this.setPlannerView('agenda'));

            // Planner filter event listeners
            ['taskSearchInput', 'taskFilterSubject', 'taskFilterPriority', 'taskFilterStatus', 'taskFilterDate'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', () => this.applyTaskFiltersAndRender());
                document.getElementById(id)?.addEventListener('input', () => this.applyTaskFiltersAndRender());
            });

            // Reset planner filters
            document.getElementById('resetTaskFiltersBtn')?.addEventListener('click', () => {
                if (document.getElementById('taskSearchInput')) document.getElementById('taskSearchInput').value = '';
                if (document.getElementById('taskFilterSubject')) document.getElementById('taskFilterSubject').value = 'all';
                if (document.getElementById('taskFilterPriority')) document.getElementById('taskFilterPriority').value = 'all';
                if (document.getElementById('taskFilterStatus')) document.getElementById('taskFilterStatus').value = 'all';
                if (document.getElementById('taskFilterDate')) document.getElementById('taskFilterDate').value = 'all';
                this.applyTaskFiltersAndRender();
            });

            // Color Swatches in Subject Modal
            document.querySelectorAll('#subjectColorPresets .color-swatch').forEach(swatch => {
                swatch.addEventListener('click', (e) => {
                    const color = e.currentTarget.getAttribute('data-color');
                    document.getElementById('subColor').value = color;
                    document.querySelectorAll('#subjectColorPresets .color-swatch').forEach(s => s.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                });
            });
        },

        bindForms() {
            // Subject Form Submit
            document.getElementById('subjectForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('subjectFormId').value;
                const name = document.getElementById('subName').value.trim();
                const code = document.getElementById('subCode').value.trim();
                const color = document.getElementById('subColor').value;
                const credits = document.getElementById('subCredits').value.trim();
                const examDate = document.getElementById('subExamDate').value;
                const topicsRaw = document.getElementById('subTopicsInput').value;

                if (!name) {
                    showToast('Subject name is required.', 'error');
                    return;
                }

                const subjects = store.getSubjects();

                if (id) {
                    // Update existing
                    const sub = subjects.find(s => s.id === id);
                    if (sub) {
                        sub.name = name;
                        sub.code = code;
                        sub.color = color;
                        sub.credits = credits;
                        sub.examDate = examDate;

                        // Append any newly typed topics
                        if (topicsRaw.trim()) {
                            const newTopics = topicsRaw.split('\n')
                                .map(t => t.trim())
                                .filter(t => t.length > 0)
                                .map(name => ({ id: generateId('top'), name, completed: false }));
                            sub.topics = (sub.topics || []).concat(newTopics);
                        }
                    }
                    showToast('Subject updated successfully.', 'success');
                } else {
                    // Create new
                    const topics = topicsRaw.split('\n')
                        .map(t => t.trim())
                        .filter(t => t.length > 0)
                        .map(name => ({ id: generateId('top'), name, completed: false }));

                    subjects.push({
                        id: generateId('sub'),
                        name,
                        code,
                        color,
                        credits: credits || '3 Credits',
                        examDate,
                        topics
                    });
                    showToast('New subject added.', 'success');
                }

                store.setSubjects(subjects);
                document.getElementById('subjectModal').hidden = true;
                this.renderPage(this.currentPage);
            });

            // Task Form Submit
            document.getElementById('taskForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('taskFormId').value;
                const title = document.getElementById('taskTitle').value.trim();
                const description = document.getElementById('taskDescription').value.trim();
                const subjectId = document.getElementById('taskSubject').value;
                const priority = document.getElementById('taskPriority').value;
                const date = document.getElementById('taskDate').value;
                const startTime = document.getElementById('taskStartTime').value || '16:00';
                const duration = parseInt(document.getElementById('taskDuration').value, 10) || 45;
                const status = document.getElementById('taskStatus').value;

                if (!title || !subjectId || !date) {
                    showToast('Please fill in title, subject, and date.', 'error');
                    return;
                }

                if (duration <= 0) {
                    showToast('Duration must be greater than zero.', 'error');
                    return;
                }

                const tasks = store.getTasks();

                if (id) {
                    const task = tasks.find(t => t.id === id);
                    if (task) {
                        task.title = title;
                        task.description = description;
                        task.subjectId = subjectId;
                        task.priority = priority;
                        task.date = date;
                        task.startTime = startTime;
                        task.duration = duration;
                        task.status = status;
                    }
                    showToast('Task updated successfully.', 'success');
                } else {
                    tasks.unshift({
                        id: generateId('task'),
                        title,
                        description,
                        subjectId,
                        priority,
                        date,
                        startTime,
                        duration,
                        status
                    });
                    showToast('New study task scheduled.', 'success');
                }

                store.setTasks(tasks);
                document.getElementById('taskModal').hidden = true;
                this.renderPage(this.currentPage);
            });

            // Exam Form Submit
            document.getElementById('examForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('examFormId').value;
                const title = document.getElementById('examTitle').value.trim();
                const subjectId = document.getElementById('examSubject').value;
                const weightage = document.getElementById('examWeightage').value.trim();
                const date = document.getElementById('examDate').value;
                const time = document.getElementById('examTime').value || '09:00';
                const location = document.getElementById('examLocation').value.trim();
                const topicsRaw = document.getElementById('examTopics').value;

                if (!title || !subjectId || !date) {
                    showToast('Title, subject, and date are required.', 'error');
                    return;
                }

                const exams = store.getExams();
                const topics = topicsRaw.split('\n').map(t => t.trim()).filter(t => t.length > 0);

                if (id) {
                    const exam = exams.find(e => e.id === id);
                    if (exam) {
                        exam.title = title;
                        exam.subjectId = subjectId;
                        exam.weightage = weightage;
                        exam.date = date;
                        exam.time = time;
                        exam.location = location;
                        exam.topics = topics;
                    }
                    showToast('Exam updated successfully.', 'success');
                } else {
                    exams.push({
                        id: generateId('exam'),
                        title,
                        subjectId,
                        weightage,
                        date,
                        time,
                        location,
                        topics
                    });
                    showToast('Exam countdown scheduled.', 'success');
                }

                store.setExams(exams);
                document.getElementById('examModal').hidden = true;
                this.renderPage(this.currentPage);
            });
        },

        // Open Modal Helpers
        openSubjectModal(subjectId = null) {
            const modal = document.getElementById('subjectModal');
            const titleEl = document.getElementById('subjectModalTitle');
            const form = document.getElementById('subjectForm');
            form.reset();

            if (subjectId) {
                const sub = store.getSubjectById(subjectId);
                if (!sub) return;
                titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square text-indigo"></i> Edit Subject';
                document.getElementById('subjectFormId').value = sub.id;
                document.getElementById('subName').value = sub.name;
                document.getElementById('subCode').value = sub.code || '';
                document.getElementById('subColor').value = sub.color || '#6366f1';
                document.getElementById('subCredits').value = sub.credits || '';
                document.getElementById('subExamDate').value = sub.examDate || '';
                document.getElementById('subTopicsInput').value = '';
            } else {
                titleEl.innerHTML = '<i class="fa-solid fa-book-bookmark text-indigo"></i> Add New Subject';
                document.getElementById('subjectFormId').value = '';
                document.getElementById('subColor').value = '#6366f1';
            }

            modal.hidden = false;
        },

        deleteSubject(subjectId) {
            const sub = store.getSubjectById(subjectId);
            if (!sub) return;

            showConfirmModal(
                `Delete "${sub.name}"?`,
                `This will remove this subject and all its topics. Associated tasks will remain in your planner.`,
                () => {
                    const subjects = store.getSubjects().filter(s => s.id !== subjectId);
                    store.setSubjects(subjects);
                    this.renderPage(this.currentPage);
                    showToast(`Deleted subject "${sub.name}".`, 'info');
                }
            );
        },

        // Topics inside Subject card
        addTopicInline(subjectId) {
            const input = document.getElementById(`inlineTopicInput-${subjectId}`);
            if (!input) return;
            const topicName = input.value.trim();
            if (!topicName) return;

            const subjects = store.getSubjects();
            const sub = subjects.find(s => s.id === subjectId);
            if (!sub) return;

            if (!sub.topics) sub.topics = [];
            sub.topics.push({
                id: generateId('top'),
                name: topicName,
                completed: false
            });

            store.setSubjects(subjects);
            input.value = '';
            this.renderSubjects();
            showToast(`Added topic: "${topicName}"`, 'success');
        },

        toggleTopicComplete(subjectId, topicId) {
            const subjects = store.getSubjects();
            const sub = subjects.find(s => s.id === subjectId);
            if (!sub || !sub.topics) return;

            const topic = sub.topics.find(t => t.id === topicId);
            if (topic) {
                topic.completed = !topic.completed;
                store.setSubjects(subjects);
                this.renderSubjects();
                this.updateHeaderAndSidebarBadges();
            }
        },

        deleteTopic(subjectId, topicId) {
            const subjects = store.getSubjects();
            const sub = subjects.find(s => s.id === subjectId);
            if (!sub || !sub.topics) return;

            sub.topics = sub.topics.filter(t => t.id !== topicId);
            store.setSubjects(subjects);
            this.renderSubjects();
        },

        openTaskModal(taskId = null, prefillData = null) {
            const modal = document.getElementById('taskModal');
            const titleEl = document.getElementById('taskModalTitle');
            const form = document.getElementById('taskForm');
            const subSelect = document.getElementById('taskSubject');

            form.reset();

            // Populate subject options
            const subjects = store.getSubjects();
            subSelect.innerHTML = '<option value="">Select a Subject</option>' +
                subjects.map(s => `<option value="${s.id}">${escapeHTML(s.name)} (${s.code || ''})</option>`).join('');

            const todayStr = new Date().toISOString().split('T')[0];

            if (taskId) {
                const task = store.getTaskById(taskId);
                if (!task) return;
                titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square text-indigo"></i> Edit Study Task';
                document.getElementById('taskFormId').value = task.id;
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskSubject').value = task.subjectId;
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskDate').value = task.date;
                document.getElementById('taskStartTime').value = task.startTime || '16:00';
                document.getElementById('taskDuration').value = task.duration || 45;
                document.getElementById('taskStatus').value = task.status;
            } else if (prefillData) {
                titleEl.innerHTML = '<i class="fa-solid fa-list-check text-indigo"></i> Add Study Task';
                document.getElementById('taskFormId').value = '';
                document.getElementById('taskTitle').value = prefillData.title || '';
                document.getElementById('taskSubject').value = prefillData.subjectId || (subjects[0]?.id || '');
                document.getElementById('taskPriority').value = prefillData.priority || 'Medium';
                document.getElementById('taskDate').value = todayStr;
                document.getElementById('taskStartTime').value = '16:00';
                document.getElementById('taskDuration').value = prefillData.duration || 45;
                document.getElementById('taskStatus').value = 'Pending';
            } else {
                titleEl.innerHTML = '<i class="fa-solid fa-list-check text-indigo"></i> Add Study Task';
                document.getElementById('taskFormId').value = '';
                document.getElementById('taskDate').value = todayStr;
                document.getElementById('taskStartTime').value = '16:00';
                document.getElementById('taskDuration').value = 45;
                document.getElementById('taskPriority').value = 'Medium';
                document.getElementById('taskStatus').value = 'Pending';
            }

            modal.hidden = false;
        },

        deleteTask(taskId) {
            const task = store.getTaskById(taskId);
            if (!task) return;

            showConfirmModal(
                `Delete task "${task.title}"?`,
                `This study task will be permanently removed from your planner.`,
                () => {
                    const tasks = store.getTasks().filter(t => t.id !== taskId);
                    store.setTasks(tasks);
                    this.renderPage(this.currentPage);
                    showToast('Task deleted.', 'info');
                }
            );
        },

        toggleTaskComplete(taskId) {
            const tasks = store.getTasks();
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
            store.setTasks(tasks);
            this.renderPage(this.currentPage);

            if (task.status === 'Completed') {
                showToast(`Task marked completed! Well done.`, 'success');
            }
        },

        updateTaskStatus(taskId, newStatus) {
            const tasks = store.getTasks();
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            task.status = newStatus;
            store.setTasks(tasks);
            this.renderPage(this.currentPage);
        },

        startTimerForTask(taskId) {
            const task = store.getTaskById(taskId);
            if (!task) return;

            this.navigateTo('timer');
            PomodoroTimer.targetTaskId = task.id;
            PomodoroTimer.targetSubjectId = task.subjectId;

            const subSelect = document.getElementById('timerSubjectSelect');
            const taskSelect = document.getElementById('timerTaskSelect');
            if (subSelect) subSelect.value = task.subjectId;
            if (taskSelect) taskSelect.value = task.id;

            PomodoroTimer.updateTargetTaskName();
            PomodoroTimer.setMode('focus');
            showToast(`Focus timer set for: "${task.title}"`, 'info');
        },

        openExamModal(examId = null) {
            const modal = document.getElementById('examModal');
            const titleEl = document.getElementById('examModalTitle');
            const form = document.getElementById('examForm');
            const subSelect = document.getElementById('examSubject');

            form.reset();

            const subjects = store.getSubjects();
            subSelect.innerHTML = '<option value="">Select a Subject</option>' +
                subjects.map(s => `<option value="${s.id}">${escapeHTML(s.name)} (${s.code || ''})</option>`).join('');

            if (examId) {
                const exam = store.getExams().find(e => e.id === examId);
                if (!exam) return;
                titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square text-indigo"></i> Edit Exam';
                document.getElementById('examFormId').value = exam.id;
                document.getElementById('examTitle').value = exam.title;
                document.getElementById('examSubject').value = exam.subjectId;
                document.getElementById('examWeightage').value = exam.weightage || '';
                document.getElementById('examDate').value = exam.date;
                document.getElementById('examTime').value = exam.time || '09:00';
                document.getElementById('examLocation').value = exam.location || '';
                document.getElementById('examTopics').value = (exam.topics || []).join('\n');
            } else {
                titleEl.innerHTML = '<i class="fa-solid fa-stopwatch text-indigo"></i> Add Exam Countdown';
                document.getElementById('examFormId').value = '';
                document.getElementById('examTime').value = '09:00';
            }

            modal.hidden = false;
        },

        deleteExam(examId) {
            const exam = store.getExams().find(e => e.id === examId);
            if (!exam) return;

            showConfirmModal(
                `Delete exam "${exam.title}"?`,
                `This exam countdown and syllabus tracker will be deleted.`,
                () => {
                    const exams = store.getExams().filter(e => e.id !== examId);
                    store.setExams(exams);
                    this.renderPage(this.currentPage);
                    showToast('Exam deleted.', 'info');
                }
            );
        }
    };

    // Attach App instance globally for inline HTML event handlers
    window.sspApp = App;

    // Boot application when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });

})();
