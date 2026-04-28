/**
 * 🛡️ Project Access Gate Logic - V3 (Simple Name & Email)
 * Validates Email, Name and blocks disposable domains
 */

const DISPOSABLE_DOMAINS = [
    'mailinator.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com', 
    'trashmail.com', 'yopmail.com', 'getnada.com', 'dispostable.com', 
    'fakeinbox.com', 'burnermail.io', 'mailnesia.com', 'tempmail.com',
    // User Provided Spam Domains
    'bltiwd.com', 'xkxkud.com', 'wnbaldwy.com', 'bwmyga.com', 'ozsaip.com',
    'yzcalo.com', 'Inovic.com', 'ruutukf.com', 'soppat.com'
];

class ProjectGate {
    constructor() {
        this.storageKey = 'project_access_authorized';
        this.overlay = null;
        this.form = null;
        this.submitBtn = null;
        this.errorEl = null;
        this.userData = { email: '', name: '' };
        
        this.init();
    }

    init() {
        // Bypass for Dramebaaz project as requested
        if (window.location.pathname.includes('/projects/Drame/') || 
            window.location.pathname.includes('/projects/Drame/index.html')) {
            console.log('🛡️ Project Gate: Bypassing for Dramebaaz');
            return;
        }

        if (this.isAuthorized()) return;

        document.addEventListener('DOMContentLoaded', () => {
            this.createUI();
            this.show();
        });
    }

    isAuthorized() {
        return localStorage.getItem(this.storageKey) === 'true';
    }

    createUI() {
        const html = `
            <div class="project-gate-overlay" id="projectGate">
                <div class="gate-card">
                    <div class="gate-icon">
                        <i class="icon icon-lock"></i>
                    </div>
                    <div id="gateStep1">
                        <h2>Secure Access</h2>
                        <p>Enter your details to view this project case study.</p>
                        
                        <form class="gate-form" id="gateForm">
                            <div class="input-group">
                                <label>Full Name</label>
                                <input type="text" id="gateName" class="gate-input" placeholder="Your Name" required>
                            </div>
                            <div class="input-group">
                                <label>Work Email</label>
                                <input type="email" id="gateEmail" class="gate-input" placeholder="name@company.com" required>
                            </div>
                            <button type="submit" class="gate-submit" id="gateSubmit">
                                <span>Access Project</span>
                                <div class="spinner"></div>
                            </button>
                        </form>
                    </div>
                    <div class="gate-error" id="gateError"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.overlay = document.getElementById('projectGate');
        this.form = document.getElementById('gateForm');
        this.submitBtn = document.getElementById('gateSubmit');
        this.errorEl = document.getElementById('gateError');

        this.form.addEventListener('submit', (e) => this.handleInfoSubmit(e));
    }

    show() {
        if (this.overlay) {
            this.overlay.classList.add('show');
            document.body.classList.add('project-gate-active');
        }
    }

    async handleInfoSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('gateName').value.trim();
        const email = document.getElementById('gateEmail').value.trim();

        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        this.errorEl.style.display = 'none';

        // Validation
        const domain = email.split('@')[1]?.toLowerCase();
        if (DISPOSABLE_DOMAINS.includes(domain)) {
            return this.showError('This domain is blocked due to spam protection.', this.submitBtn);
        }

        const hasMX = await this.verifyMX(domain);
        if (!hasMX) {
            return this.showError('Invalid email domain. Please use a valid email.', this.submitBtn);
        }

        this.userData = { email, name };
        
        // Immediately authorize access
        this.authorize();
    }

    async verifyMX(domain) {
        try {
            const response = await fetch(\`https://dns.google/resolve?name=\${domain}&type=MX\`);
            const data = await response.json();
            return !!(data.Answer && data.Answer.length > 0);
        } catch (err) { return true; }
    }

    showError(msg, btn) {
        this.errorEl.textContent = msg;
        this.errorEl.style.display = 'block';
        if (btn) {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    authorize() {
        localStorage.setItem(this.storageKey, 'true');
        localStorage.setItem('project_user_email', this.userData.email);
        localStorage.setItem('project_user_name', this.userData.name);
        
        if (window.logVisit) window.logVisit(\`Verified Access: \${this.userData.email} (\${this.userData.name})\`);
        
        this.overlay.classList.remove('show');
        document.body.classList.remove('project-gate-active');
        setTimeout(() => this.overlay.remove(), 600);
    }
}

// Initialize
const projectGate = new ProjectGate();
