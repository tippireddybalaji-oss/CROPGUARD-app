// Firebase Studio Pro - Enhanced JavaScript
class FirebaseStudioPro {
    constructor() {
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        this.charts = {};
        this.mockData = this.generateMockData();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.hideLoadingScreen();
        this.populateData();
        this.initializeCharts();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Database controls
        document.getElementById('add-collection')?.addEventListener('click', () => {
            this.showModal('Add Collection', this.getAddCollectionForm());
        });

        document.getElementById('import-data')?.addEventListener('click', () => {
            this.showToast('Import feature coming soon!', 'info');
        });

        document.getElementById('export-data')?.addEventListener('click', () => {
            this.exportData();
        });

        // Collection items
        document.querySelectorAll('.collection-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectCollection(item);
            });
        });

        // Modal close
        document.getElementById('modal-close')?.addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.hideModal();
            }
        });

        // Auth toggles
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const method = e.target.closest('.auth-card').querySelector('h3').textContent;
                this.showToast(`${method} authentication ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
            });
        });
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#theme-toggle i');
        themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.initializeTheme();
        this.showToast(`Switched to ${this.theme} theme`, 'success');
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    switchSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Initialize section-specific features
        if (sectionId === 'analytics') {
            setTimeout(() => this.initializeCharts(), 100);
        }
    }

    generateMockData() {
        return {
            users: [
                { id: 'user1', email: 'john.doe@example.com', provider: 'Email', created: '2024-01-15', lastSignIn: '2024-01-20' },
                { id: 'user2', email: 'jane.smith@example.com', provider: 'Google', created: '2024-01-16', lastSignIn: '2024-01-21' },
                { id: 'user3', email: 'bob.johnson@example.com', provider: 'Email', created: '2024-01-17', lastSignIn: '2024-01-22' },
                { id: 'user4', email: 'alice.brown@example.com', provider: 'Facebook', created: '2024-01-18', lastSignIn: '2024-01-23' },
                { id: 'user5', email: 'charlie.wilson@example.com', provider: 'Google', created: '2024-01-19', lastSignIn: '2024-01-24' }
            ],
            collections: {
                users: [
                    { id: 'doc1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
                    { id: 'doc2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
                    { id: 'doc3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
                ],
                products: [
                    { id: 'prod1', name: 'Laptop', price: 999, category: 'Electronics' },
                    { id: 'prod2', name: 'Phone', price: 699, category: 'Electronics' },
                    { id: 'prod3', name: 'Book', price: 29, category: 'Education' }
                ],
                orders: [
                    { id: 'order1', userId: 'user1', total: 999, status: 'completed' },
                    { id: 'order2', userId: 'user2', total: 699, status: 'pending' },
                    { id: 'order3', userId: 'user3', total: 29, status: 'shipped' }
                ]
            },
            stats: {
                activeUsers: 1234,
                dbReads: 45600,
                storageUsed: 2.3,
                functionCalls: 12800
            }
        };
    }

    populateData() {
        // Populate users table
        const usersTableBody = document.getElementById('users-table-body');
        if (usersTableBody) {
            usersTableBody.innerHTML = this.mockData.users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="provider-badge ${user.provider.toLowerCase()}">${user.provider}</span>
                    </td>
                    <td>${user.created}</td>
                    <td>${user.lastSignIn}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="firebaseStudio.editUser('${user.id}')">Edit</button>
                        <button class="btn btn-sm btn-outline" onclick="firebaseStudio.deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        // Update stats with animation
        this.animateStats();

        // Populate documents for default collection
        this.loadDocuments('users');
    }

    animateStats() {
        const stats = [
            { id: 'active-users', target: this.mockData.stats.activeUsers, suffix: '' },
            { id: 'db-reads', target: this.mockData.stats.dbReads, suffix: 'K' },
            { id: 'storage-used', target: this.mockData.stats.storageUsed, suffix: 'GB' },
            { id: 'functions-calls', target: this.mockData.stats.functionCalls, suffix: 'K' }
        ];

        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (element) {
                this.countUp(element, 0, stat.target, stat.suffix, 2000);
            }
        });
    }

    countUp(element, start, end, suffix, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (suffix === 'K' && displayValue >= 1000) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            } else if (suffix === 'GB') {
                displayValue = current.toFixed(1) + 'GB';
            } else if (suffix === 'K') {
                displayValue = displayValue.toLocaleString();
            } else {
                displayValue = displayValue.toLocaleString();
            }
            
            element.textContent = displayValue;
        }, 16);
    }

    selectCollection(collectionElement) {
        // Update active collection
        document.querySelectorAll('.collection-item').forEach(item => {
            item.classList.remove('active');
        });
        collectionElement.classList.add('active');

        // Load documents for selected collection
        const collectionName = collectionElement.dataset.collection;
        this.loadDocuments(collectionName);
    }

    loadDocuments(collectionName) {
        const documentList = document.getElementById('document-list');
        if (!documentList) return;

        const documents = this.mockData.collections[collectionName] || [];
        
        documentList.innerHTML = documents.map(doc => `
            <div class="document-item" onclick="firebaseStudio.editDocument('${collectionName}', '${doc.id}')">
                <div class="document-header">
                    <i class="fas fa-file-alt"></i>
                    <span class="document-id">${doc.id}</span>
                </div>
                <div class="document-preview">
                    ${Object.entries(doc).slice(1, 3).map(([key, value]) => 
                        `<span class="field">${key}: ${value}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
    }

    initializeCharts() {
        // Performance Chart
        const performanceCtx = document.getElementById('performance-chart');
        if (performanceCtx && !this.charts.performance) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Response Time (ms)',
                        data: [120, 110, 95, 85, 90, 75],
                        borderColor: '#4285f4',
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Engagement Chart
        const engagementCtx = document.getElementById('engagement-chart');
        if (engagementCtx && !this.charts.engagement) {
            this.charts.engagement = new Chart(engagementCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Desktop', 'Mobile', 'Tablet'],
                    datasets: [{
                        data: [45, 40, 15],
                        backgroundColor: ['#4285f4', '#34a853', '#fbbc04'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Page Views Chart
        const pageviewsCtx = document.getElementById('pageviews-chart');
        if (pageviewsCtx && !this.charts.pageviews) {
            this.charts.pageviews = new Chart(pageviewsCtx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Page Views',
                        data: [1200, 1900, 1500, 2200, 2800, 1800, 1400],
                        backgroundColor: '#34a853',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateStats();
            this.addRandomActivity();
        }, 5000);
    }

    updateStats() {
        // Randomly update stats
        const elements = [
            { id: 'active-users', change: Math.floor(Math.random() * 10) - 5 },
            { id: 'db-reads', change: Math.floor(Math.random() * 100) - 50 },
            { id: 'functions-calls', change: Math.floor(Math.random() * 50) - 25 }
        ];

        elements.forEach(({ id, change }) => {
            const element = document.getElementById(id);
            if (element && change !== 0) {
                // Add subtle animation for updates
                element.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    addRandomActivity() {
        const activities = [
            { icon: 'fas fa-user-plus', text: 'New user registered', time: 'Just now' },
            { icon: 'fas fa-database', text: 'Database query executed', time: 'Just now' },
            { icon: 'fas fa-cloud-upload-alt', text: 'File uploaded to storage', time: 'Just now' },
            { icon: 'fas fa-cog', text: 'Function deployed', time: 'Just now' }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const activityList = document.querySelector('.activity-list');
        
        if (activityList) {
            const newActivity = document.createElement('div');
            newActivity.className = 'activity-item';
            newActivity.innerHTML = `
                <i class="${randomActivity.icon}"></i>
                <span>${randomActivity.text}</span>
                <time>${randomActivity.time}</time>
            `;
            
            // Add with animation
            newActivity.style.opacity = '0';
            newActivity.style.transform = 'translateY(-10px)';
            activityList.insertBefore(newActivity, activityList.firstChild);
            
            setTimeout(() => {
                newActivity.style.opacity = '1';
                newActivity.style.transform = 'translateY(0)';
            }, 100);

            // Remove oldest activity if more than 5
            const activities = activityList.querySelectorAll('.activity-item');
            if (activities.length > 5) {
                activities[activities.length - 1].remove();
            }
        }
    }

    showModal(title, content) {
        const modal = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
    }

    hideModal() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.remove('active');
    }

    getAddCollectionForm() {
        return `
            <form id="add-collection-form">
                <div class="form-group">
                    <label for="collection-name">Collection Name</label>
                    <input type="text" id="collection-name" class="form-input" placeholder="Enter collection name" required>
                </div>
                <div class="form-group">
                    <label for="collection-description">Description (Optional)</label>
                    <textarea id="collection-description" class="form-input" placeholder="Describe your collection"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="firebaseStudio.hideModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Collection</button>
                </div>
            </form>
            <style>
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary); }
                .form-input { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--bg-secondary); color: var(--text-primary); }
                .form-input:focus { outline: none; border-color: var(--primary-color); }
                .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
            </style>
        `;
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    exportData() {
        const data = JSON.stringify(this.mockData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'firebase-studio-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully!', 'success');
    }

    editUser(userId) {
        const user = this.mockData.users.find(u => u.id === userId);
        if (user) {
            this.showModal('Edit User', `
                <p><strong>User ID:</strong> ${user.id}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Provider:</strong> ${user.provider}</p>
                <div class="form-actions" style="margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="firebaseStudio.hideModal()">Close</button>
                    <button class="btn btn-primary" onclick="firebaseStudio.showToast('User updated!', 'success'); firebaseStudio.hideModal()">Save Changes</button>
                </div>
            `);
        }
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.mockData.users = this.mockData.users.filter(u => u.id !== userId);
            this.populateData();
            this.showToast('User deleted successfully!', 'success');
        }
    }

    editDocument(collection, docId) {
        const doc = this.mockData.collections[collection]?.find(d => d.id === docId);
        if (doc) {
            this.showModal(`Edit Document: ${docId}`, `
                <div class="document-editor">
                    <pre><code>${JSON.stringify(doc, null, 2)}</code></pre>
                </div>
                <div class="form-actions" style="margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="firebaseStudio.hideModal()">Close</button>
                    <button class="btn btn-primary" onclick="firebaseStudio.showToast('Document updated!', 'success'); firebaseStudio.hideModal()">Save Changes</button>
                </div>
                <style>
                    .document-editor { background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin: 1rem 0; }
                    .document-editor code { color: var(--text-primary); }
                </style>
            `);
        }
    }
}

// Initialize the application
const firebaseStudio = new FirebaseStudioPro();

// Add some additional CSS for dynamic elements
const additionalStyles = `
    .provider-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    .provider-badge.email {
        background: rgba(66, 133, 244, 0.1);
        color: #4285f4;
    }
    .provider-badge.google {
        background: rgba(234, 67, 53, 0.1);
        color: #ea4335;
    }
    .provider-badge.facebook {
        background: rgba(24, 119, 242, 0.1);
        color: #1877f2;
    }
    .document-item {
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: var(--transition);
    }
    .document-item:hover {
        background: var(--bg-secondary);
        border-color: var(--primary-color);
    }
    .document-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .document-header i {
        color: var(--primary-color);
    }
    .document-id {
        font-weight: 600;
        color: var(--text-primary);
    }
    .document-preview {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .document-preview .field {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
