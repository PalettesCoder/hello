/**
 * 🛡️ Project Access Gate Logic - V2 (OTP + Advanced Blocklist)
 * Validates Email, Company, OTP via EmailJS, and Blocklist
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
        this.currentStep = 1; // 1: Info, 2: OTP
        this.generatedOTP = null;
        this.userData = { email: '', company: '' };
        
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
                        <p>Enter your work details. We will send a verification code to your email.</p>
                        
                        <form class="gate-form" id="gateForm">
                            <div class="input-group">
                                <label>Work Email</label>
                                <input type="email" id="gateEmail" class="gate-input" placeholder="name@company.com" required>
                            </div>
                            <div class="input-group">
                                <label>Company Name</label>
                                <input type="text" id="gateCompany" class="gate-input" placeholder="e.g. Google, Tesla, etc." required>
                            </div>
                            <button type="submit" class="gate-submit" id="gateSubmit">
                                <span>Send Verification Code</span>
                                <div class="spinner"></div>
                            </button>
                        </form>
                    </div>

                    <div id="gateStep2" style="display: none;">
                        <h2>Verify Identity</h2>
                        <p>A 6-digit code has been sent to <b id="displayEmail"></b>. Please enter it below.</p>
                        
                        <form class="gate-form" id="otpForm">
                            <div class="input-group">
                                <label>6-Digit Code</label>
                                <input type="text" id="gateOTP" class="gate-input" placeholder="000000" maxlength="6" pattern="[0-9]{6}" required style="text-align: center; font-size: 24px; letter-spacing: 8px;">
                            </div>
                            <button type="submit" class="gate-submit" id="otpSubmit">
                                <span>Verify & Access</span>
                                <div class="spinner"></div>
                            </button>
                            <button type="button" class="gate-back" id="gateBack" style="background:none; border:none; color:#999; font-size:12px; margin-top:10px; cursor:pointer;">Wrong email? Go back</button>
                        </form>
                    </div>

                    <div class="gate-error" id="gateError"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.overlay = document.getElementById('projectGate');
        this.form = document.getElementById('gateForm');
        this.otpForm = document.getElementById('otpForm');
        this.submitBtn = document.getElementById('gateSubmit');
        this.errorEl = document.getElementById('gateError');

        this.form.addEventListener('submit', (e) => this.handleInfoSubmit(e));
        this.otpForm.addEventListener('submit', (e) => this.handleOTPSubmit(e));
        document.getElementById('gateBack').addEventListener('click', () => this.switchStep(1));
    }

    show() {
        if (this.overlay) {
            this.overlay.classList.add('show');
            document.body.classList.add('project-gate-active');
        }
    }

    switchStep(step) {
        this.currentStep = step;
        document.getElementById('gateStep1').style.display = step === 1 ? 'block' : 'none';
        document.getElementById('gateStep2').style.display = step === 2 ? 'block' : 'none';
        this.errorEl.style.display = 'none';
    }

    async handleInfoSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('gateEmail').value.trim();
        const company = document.getElementById('gateCompany').value.trim();

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
            return this.showError('Invalid email domain. Please use a work email.', this.submitBtn);
        }

        // Generate OTP
        this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        this.userData = { email, company };

        // Send Email via EmailJS
        const success = await this.sendOTP(email, this.generatedOTP);
        
        if (success) {
            document.getElementById('displayEmail').textContent = email;
            this.switchStep(2);
        } else {
            this.showError('Failed to send verification code. Try again later.', this.submitBtn);
        }

        this.submitBtn.classList.remove('loading');
        this.submitBtn.disabled = false;
    }

    async handleOTPSubmit(e) {
        e.preventDefault();
        const enteredOTP = document.getElementById('gateOTP').value.trim();
        const otpBtn = document.getElementById('otpSubmit');

        if (enteredOTP === this.generatedOTP) {
            this.authorize();
        } else {
            this.showError('Incorrect verification code. Please check your email.');
        }
    }

    async sendOTP(email, otp) {
        try {
            // Using your existing EmailJS init "G8jc2t6dBS8BNn7sQ"
            // We expect a template with {{otp_code}} and {{to_email}}
            const response = await emailjs.send("service_val0glr", "template_81082yp", {
                otp_code: otp,
                to_email: email,
                company_name: this.userData.company
            });
            return response.status === 200;
        } catch (err) {
            console.error('EmailJS Error:', err);
            return false;
        }
    }

    async verifyMX(domain) {
        try {
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
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
        localStorage.setItem('project_user_company', this.userData.company);
        
        if (window.logVisit) window.logVisit(`Verified Access: ${this.userData.email}`);
        
        this.overlay.classList.remove('show');
        document.body.classList.remove('project-gate-active');
        setTimeout(() => this.overlay.remove(), 600);
    }
}

// Initialize
const projectGate = new ProjectGate();
