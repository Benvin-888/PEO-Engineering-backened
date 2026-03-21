// email.js
// Premium Email Service for Brevo (Sendinblue) Integration
// Advanced white & gold luxury design with modern SVG icons and responsive layout
// PEO Engineering Brand Identity - Version 2.3 (Footer Icons Removed)

const axios = require('axios');
const config = require('../config');

class EmailService {
    constructor() {
        this.brevoApiUrl = 'https://api.brevo.com/v3';
        this.apiKey = config.brevo.apiKey;
        this.sender = config.brevo.sender;
        this.companyEmail = config.brevo.companyEmail;
        this.ccEmails = config.brevo.ccEmails || [];
        this.imageBaseUrl = process.env.IMAGE_BASE_URL || 'https://www.peoengineering.co.za';
        
        // Brand colors for consistent styling
        this.brand = {
            gold: '#D4AF37',
            goldLight: '#F5E6B0',
            goldDark: '#B8860B',
            dark: '#1A1A1A',
            gray: '#666666',
            lightGray: '#F8F8F5',
            border: '#EFEFEA'
        };
    }

    /**
     * Send email via Brevo API
     */
    async sendEmail(recipients, subject, htmlContent, textContent = '') {
        try {
            const response = await axios({
                method: 'POST',
                url: `${this.brevoApiUrl}/smtp/email`,
                headers: {
                    'accept': 'application/json',
                    'api-key': this.apiKey,
                    'content-type': 'application/json'
                },
                data: {
                    sender: this.sender,
                    to: recipients.map(email => ({ email: email.trim() })),
                    subject: subject,
                    htmlContent: htmlContent,
                    textContent: textContent || this.stripHtml(htmlContent)
                }
            });
            
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Brevo API Error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data || error.message };
        }
    }

    /**
     * Strip HTML tags for plain text version
     */
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();
    }

    /**
     * Advanced HTML escaping for security
     */
    escapeHtml(text) {
        if (!text) return '';
        
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        return String(text).replace(/[&<>"'`=/]/g, char => htmlEntities[char] || char);
    }

    /**
     * Generate premium admin notification email with enhanced design and SVG icons
     */
    generateAdminEmail(formData) {
        const submittedDate = new Date(formData.submittedAt).toLocaleString('en-ZA', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });
        
        const priorityColors = {
            'High': '#D4AF37',
            'Medium': '#F5A623',
            'Low': '#7F8C8D'
        };
        
        const urgencyColor = priorityColors[formData.urgency] || this.brand.gray;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry - PEO Engineering</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            background: radial-gradient(circle at 10% 30%, rgba(212,175,55,0.08) 0%, #F5F5F0 70%);
            line-height: 1.5;
        }
        
        .email-container {
            max-width: 680px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .email-card {
            background: #FFFFFF;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.1);
        }
        
        /* Header Section */
        .header {
            background: linear-gradient(135deg, #FFFFFF 0%, #FFFBF5 100%);
            padding: 48px 40px 32px;
            text-align: center;
            position: relative;
            border-bottom: 2px solid rgba(212, 175, 55, 0.2);
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #D4AF37, #F5E6B0, #D4AF37);
        }
        
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 24px;
            border-radius: 12px;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #1A1A1A 0%, #333333 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 8px;
        }
        
        .company-tagline {
            color: #D4AF37;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        
        .gold-divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #D4AF37, #F5E6B0);
            margin: 20px auto 0;
            border-radius: 3px;
        }
        
        /* Content Section */
        .content {
            padding: 40px;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #D4AF37 0%, #C4A02E 100%);
            color: #1A1A1A;
            padding: 8px 20px;
            border-radius: 40px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 28px;
        }
        
        .badge svg {
            width: 14px;
            height: 14px;
            stroke: currentColor;
        }
        
        .title-section {
            margin-bottom: 32px;
        }
        
        .title-section h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #1A1A1A;
        }
        
        .title-section p {
            color: #666666;
            font-size: 15px;
            border-left: 3px solid #D4AF37;
            padding-left: 16px;
        }
        
        /* Info Cards */
        .info-card {
            background: #FCFCFC;
            border-radius: 24px;
            margin-bottom: 24px;
            border: 1px solid #EFEFEA;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .card-header {
            background: #F8F8F5;
            padding: 16px 24px;
            border-bottom: 1px solid #EFEFEA;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .card-header svg {
            width: 20px;
            height: 20px;
            stroke: #D4AF37;
            stroke-width: 1.5;
        }
        
        .card-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: #D4AF37;
            letter-spacing: 0.5px;
        }
        
        .info-grid {
            padding: 24px;
        }
        
        .info-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #EFEFEA;
        }
        
        .info-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .info-label {
            width: 130px;
            font-weight: 600;
            color: #888888;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            flex: 1;
            color: #1A1A1A;
            font-weight: 500;
            font-size: 15px;
        }
        
        .info-value a {
            color: #D4AF37;
            text-decoration: none;
            font-weight: 600;
        }
        
        .service-tag {
            background: rgba(212, 175, 55, 0.12);
            padding: 5px 14px;
            border-radius: 30px;
            display: inline-block;
            font-size: 13px;
            font-weight: 600;
            color: #B8860B;
        }
        
        .priority-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            background: ${urgencyColor}20;
            color: ${urgencyColor};
            font-weight: 600;
            font-size: 13px;
        }
        
        /* Message Box */
        .message-box {
            background: #FCF9F0;
            border-radius: 20px;
            padding: 24px;
            margin: 24px 0;
            border-left: 4px solid #D4AF37;
        }
        
        .message-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 700;
            color: #D4AF37;
            margin-bottom: 12px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .message-label svg {
            width: 16px;
            height: 16px;
            stroke: #D4AF37;
            stroke-width: 1.5;
        }
        
        .message-box p {
            margin: 0;
            color: #2C2C2C;
            line-height: 1.7;
            font-size: 14px;
        }
        
        /* Meta Information */
        .meta-box {
            background: #F8F8F5;
            border-radius: 20px;
            padding: 20px;
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #666666;
        }
        
        .meta-item svg {
            width: 14px;
            height: 14px;
            stroke: #D4AF37;
            stroke-width: 1.5;
        }
        
        /* Action Button */
        .action-button {
            text-align: center;
            margin: 32px 0 0;
        }
        
        .btn-reply {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
            color: #D4AF37;
            padding: 14px 32px;
            border-radius: 60px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .btn-reply svg {
            width: 16px;
            height: 16px;
            stroke: #D4AF37;
            stroke-width: 1.5;
        }
        
        /* Enhanced Footer - Icons Removed */
        .footer {
            background: linear-gradient(135deg, #FCFCFC 0%, #F9F9F6 100%);
            padding: 40px 40px 32px;
            text-align: center;
            border-top: 1px solid #EFEFEA;
        }
        
        .footer-brand {
            margin-bottom: 28px;
        }
        
        .footer-logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #1A1A1A 0%, #333333 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .footer-logo span {
            background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .footer-tagline {
            color: #D4AF37;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        
        .footer-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin: 32px 0;
            padding: 24px 0;
            border-top: 1px solid #EFEFEA;
            border-bottom: 1px solid #EFEFEA;
        }
        
        .footer-section {
            text-align: left;
        }
        
        .footer-section h4 {
            font-size: 13px;
            font-weight: 700;
            color: #D4AF37;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Removed SVG from h4 */
        .footer-section h4 svg {
            display: none;
        }
        
        .footer-address p {
            color: #666666;
            font-size: 13px;
            line-height: 1.6;
            margin: 0;
        }
        
        .footer-contact-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-contact-list li {
            margin-bottom: 12px;
        }
        
        .footer-contact-list a {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: #666666;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s ease;
        }
        
        .footer-contact-list a:hover {
            color: #D4AF37;
        }
        
        /* Removed SVG from contact links */
        .footer-contact-list svg {
            display: none;
        }
        
        /* Removed Social Links Section */
        
        .footer-bottom {
            margin-top: 28px;
            text-align: center;
        }
        
        .footer-bottom p {
            color: #999999;
            font-size: 12px;
            margin: 8px 0;
        }
        
        .footer-bottom a {
            color: #D4AF37;
            text-decoration: none;
            font-weight: 500;
        }
        
        hr {
            border: none;
            border-top: 1px solid #EFEFEA;
            margin: 24px 0;
        }
        
        .copyright {
            color: #999999;
            font-size: 11px;
            margin-top: 16px;
        }
        
        @media (max-width: 550px) {
            .email-container { padding: 20px 12px; }
            .header { padding: 32px 24px; }
            .content { padding: 28px 20px; }
            .footer { padding: 32px 24px; }
            .info-label { width: 100px; font-size: 12px; }
            .info-value { font-size: 13px; }
            .company-name { font-size: 24px; }
            .footer-info { grid-template-columns: 1fr; gap: 28px; }
            .footer-section { text-align: center; }
            .footer-section h4 { justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="header">
                <img src="${this.imageBaseUrl}/Logo.jpg" alt="PEO Engineering" class="logo" style="display: block; margin: 0 auto;">
                <h1 class="company-name">PEO ENGINEERING</h1>
                <p class="company-tagline">Precision Engineering Solutions</p>
                <div class="gold-divider"></div>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        NEW INQUIRY
                    </span>
                </div>
                
                <div class="title-section">
                    <h1>New Contact Form Submission</h1>
                    <p>A new inquiry has been received from your website contact form.</p>
                </div>
                
                <div class="info-card">
                    <div class="card-header">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <h3>Client Information</h3>
                    </div>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Full Name</div>
                            <div class="info-value"><strong>${this.escapeHtml(formData.name || 'Not provided')}</strong></div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Email Address</div>
                            <div class="info-value"><a href="mailto:${formData.email}">${formData.email || 'Not provided'}</a></div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone Number</div>
                            <div class="info-value">${formData.phone || 'Not provided'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="info-card">
                    <div class="card-header">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <h3>Project Details</h3>
                    </div>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Service Required</div>
                            <div class="info-value"><span class="service-tag">${this.escapeHtml(formData.service || 'Not specified')}</span></div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Urgency Level</div>
                            <div class="info-value">
                                <span class="priority-indicator">
                                    ${formData.urgency === 'High' ? '🔴' : formData.urgency === 'Medium' ? '🟡' : '🟢'} 
                                    ${formData.urgency || 'Not specified'}
                                </span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Budget Range</div>
                            <div class="info-value">${formData.budget || 'Not specified'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="message-box">
                    <div class="message-label">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        MESSAGE FROM CLIENT
                    </div>
                    <p>${this.escapeHtml(formData.message || 'No message provided')}</p>
                </div>
                
                <div class="meta-box">
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${submittedDate}
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        IP: ${formData.ipAddress || 'Not recorded'}
                    </div>
                </div>
                
                <div class="action-button">
                    <a href="mailto:${formData.email}" class="btn-reply">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                        Reply to Client
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-brand">
                    <div class="footer-logo">
                        PEO <span>ENGINEERING</span>
                    </div>
                    <div class="footer-tagline">Excellence in Every Detail</div>
                </div>
                
                <div class="footer-info">
                    <div class="footer-section">
                        <h4>Location</h4>
                        <div class="footer-address">
                            <p>Unit 51, Sildale Park</p>
                            <p>Silvertondale, Conveyor Road</p>
                            <p>Pretoria, South Africa</p>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Contact</h4>
                        <ul class="footer-contact-list">
                            <li>
                                <a href="tel:+27128046406">
                                    +27 (012) 804 6406
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@peoengineering.co.za">
                                    info@peoengineering.co.za
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>© ${new Date().getFullYear()} PEO Engineering (Pty) Ltd. All rights reserved.</p>
                    <p>Precision Engineering Excellence Since 2005</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Generate premium user confirmation email with enhanced design and SVG icons
     */
    generateUserEmail(formData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - PEO Engineering</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            background: radial-gradient(circle at 10% 30%, rgba(212,175,55,0.08) 0%, #F5F5F0 70%);
            line-height: 1.5;
        }
        
        .email-container {
            max-width: 680px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .email-card {
            background: #FFFFFF;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #FFFFFF 0%, #FFFBF5 100%);
            padding: 48px 40px 32px;
            text-align: center;
            position: relative;
            border-bottom: 2px solid rgba(212, 175, 55, 0.2);
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #D4AF37, #F5E6B0, #D4AF37);
        }
        
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 24px;
            border-radius: 12px;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #1A1A1A 0%, #333333 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 8px;
        }
        
        .company-tagline {
            color: #D4AF37;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        
        .gold-divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #D4AF37, #F5E6B0);
            margin: 20px auto 0;
            border-radius: 3px;
        }
        
        .content {
            padding: 40px;
        }
        
        .success-icon {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .checkmark-svg {
            display: inline-block;
            width: 80px;
            height: 80px;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .checkmark-svg svg {
            width: 100%;
            height: 100%;
            display: block;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(212, 175, 55, 0.4)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3)); }
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #D4AF37 0%, #C4A02E 100%);
            color: #1A1A1A;
            padding: 8px 20px;
            border-radius: 40px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 28px;
        }
        
        .badge svg {
            width: 14px;
            height: 14px;
            stroke: currentColor;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 16px;
            font-weight: 500;
            color: #1A1A1A;
        }
        
        .greeting strong {
            color: #D4AF37;
            font-weight: 700;
        }
        
        .message-text {
            color: #555555;
            margin-bottom: 28px;
            line-height: 1.6;
            font-size: 15px;
        }
        
        .summary-card {
            background: #FCFCFC;
            border-radius: 24px;
            margin: 24px 0;
            border: 1px solid #EFEFEA;
            overflow: hidden;
        }
        
        .summary-header {
            background: #F8F8F5;
            padding: 16px 24px;
            border-bottom: 1px solid #EFEFEA;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .summary-header svg {
            width: 20px;
            height: 20px;
            stroke: #D4AF37;
            stroke-width: 1.5;
        }
        
        .summary-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: #D4AF37;
        }
        
        .summary-body {
            padding: 24px;
        }
        
        .summary-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #EFEFEA;
        }
        
        .summary-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .summary-label {
            font-weight: 600;
            color: #888888;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .summary-value {
            color: #1A1A1A;
            font-weight: 500;
            font-size: 15px;
        }
        
        .message-preview {
            background: #FCF9F0;
            border-radius: 16px;
            padding: 16px;
            margin-top: 12px;
        }
        
        .next-steps {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(184, 134, 11, 0.04));
            border-radius: 20px;
            padding: 28px;
            margin: 28px 0;
            text-align: center;
        }
        
        .next-steps h4 {
            margin: 0 0 8px;
            color: #D4AF37;
            font-size: 18px;
            font-weight: 700;
        }
        
        .next-steps p {
            margin: 0;
            color: #555555;
            font-size: 14px;
        }
        
        .contact-buttons {
            display: flex;
            gap: 14px;
            justify-content: center;
            margin: 32px 0 20px;
            flex-wrap: wrap;
        }
        
        .contact-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 28px;
            border-radius: 60px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            background: #FFFFFF;
            border: 1px solid #EFEFEA;
            color: #1A1A1A;
        }
        
        .contact-btn svg {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
        }
        
        .contact-btn.whatsapp {
            background: #25D366;
            border: none;
            color: white;
        }
        
        .contact-btn.whatsapp svg {
            stroke: white;
        }
        
        .contact-btn.phone {
            background: #1A1A1A;
            border: none;
            color: #D4AF37;
        }
        
        .contact-btn.phone svg {
            stroke: #D4AF37;
        }
        
        .contact-btn.email {
            background: #F8F8F5;
            border: 1px solid #D4AF37;
            color: #D4AF37;
        }
        
        .contact-btn.email svg {
            stroke: #D4AF37;
        }
        
        /* Enhanced Footer - Icons Removed */
        .footer {
            background: linear-gradient(135deg, #FCFCFC 0%, #F9F9F6 100%);
            padding: 40px 40px 32px;
            text-align: center;
            border-top: 1px solid #EFEFEA;
        }
        
        .footer-brand {
            margin-bottom: 28px;
        }
        
        .footer-logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #1A1A1A 0%, #333333 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .footer-logo span {
            background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .footer-tagline {
            color: #D4AF37;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        
        .footer-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin: 32px 0;
            padding: 24px 0;
            border-top: 1px solid #EFEFEA;
            border-bottom: 1px solid #EFEFEA;
        }
        
        .footer-section {
            text-align: left;
        }
        
        .footer-section h4 {
            font-size: 13px;
            font-weight: 700;
            color: #D4AF37;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Removed SVG from h4 */
        .footer-section h4 svg {
            display: none;
        }
        
        .footer-address p {
            color: #666666;
            font-size: 13px;
            line-height: 1.6;
            margin: 0;
        }
        
        .footer-contact-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-contact-list li {
            margin-bottom: 12px;
        }
        
        .footer-contact-list a {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: #666666;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s ease;
        }
        
        .footer-contact-list a:hover {
            color: #D4AF37;
        }
        
        /* Removed SVG from contact links */
        .footer-contact-list svg {
            display: none;
        }
        
        /* Removed Social Links Section */
        
        .footer-bottom {
            margin-top: 28px;
            text-align: center;
        }
        
        .footer-bottom p {
            color: #999999;
            font-size: 12px;
            margin: 8px 0;
        }
        
        hr {
            border: none;
            border-top: 1px solid #EFEFEA;
            margin: 24px 0;
        }
        
        .copyright {
            color: #999999;
            font-size: 11px;
            margin-top: 16px;
        }
        
        @media (max-width: 550px) {
            .email-container { padding: 20px 12px; }
            .header { padding: 32px 24px; }
            .content { padding: 28px 20px; }
            .footer { padding: 32px 24px; }
            .company-name { font-size: 24px; }
            .contact-btn { padding: 10px 20px; font-size: 12px; }
            .footer-info { grid-template-columns: 1fr; gap: 28px; }
            .footer-section { text-align: center; }
            .footer-section h4 { justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="header">
                <img src="${this.imageBaseUrl}/Logo.jpg" alt="PEO Engineering" class="logo" style="display: block; margin: 0 auto;">
                <h1 class="company-name">PEO ENGINEERING</h1>
                <p class="company-tagline">Precision Engineering Solutions</p>
                <div class="gold-divider"></div>
            </div>
            
            <div class="content">
                
                <div style="text-align: center;">
                    <span class="badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        RECEIVED
                    </span>
                </div>
                
                <div class="greeting">
                    Dear <strong>${this.escapeHtml(formData.name)}</strong>,
                </div>
                
                <p class="message-text">
                    Thank you for reaching out to <strong style="color: #D4AF37;">PEO Engineering</strong>. 
                    We have successfully received your inquiry and our team will review it promptly.
                    One of our specialists will be in touch with you shortly.
                </p>
                
                <div class="summary-card">
                    <div class="summary-header">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <h3>Your Inquiry Summary</h3>
                    </div>
                    <div class="summary-body">
                        <div class="summary-item">
                            <div class="summary-label">Service Interested In</div>
                            <div class="summary-value"><strong>${this.escapeHtml(formData.service || 'Not specified')}</strong></div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Project Urgency</div>
                            <div class="summary-value">${formData.urgency || 'Not specified'}</div>
                        </div>
                        ${formData.budget ? `
                        <div class="summary-item">
                            <div class="summary-label">Budget Range</div>
                            <div class="summary-value">${formData.budget}</div>
                        </div>
                        ` : ''}
                        <div class="message-preview">
                            <div class="summary-label" style="margin-bottom: 8px;">Your Message:</div>
                            <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">${this.escapeHtml(formData.message || 'No message provided')}</p>
                        </div>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>⏰ What happens next?</h4>
                    <p>One of our specialists will review your requirements and get back to you within <strong style="color: #D4AF37;">24 business hours</strong>. We'll provide you with a detailed proposal and timeline for your project.</p>
                </div>
                
                <div class="contact-buttons">
                    <a href="https://wa.me/27695791637" class="contact-btn whatsapp" target="_blank">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                            <path d="M12.031 2c-5.514 0-10 4.486-10 10 0 1.79.471 3.547 1.364 5.076l-1.414 4.184 4.34-1.332c1.472.826 3.144 1.261 4.86 1.261 5.514 0 10-4.486 10-10s-4.486-10-10-10z"/>
                            <path d="M16.947 14.706c-.168-.083-1.012-.5-1.17-.557-.158-.058-.274-.083-.39.083-.115.166-.447.557-.548.671-.101.115-.202.13-.37.047-.168-.083-.71-.262-1.352-.835-.5-.45-.837-1.005-.935-1.175-.099-.17-.01-.262.074-.347.076-.076.168-.2.252-.3.084-.1.112-.167.168-.278.056-.111.028-.208-.014-.292-.042-.083-.39-.94-.535-1.289-.141-.34-.283-.293-.39-.299-.101-.006-.216-.006-.332-.006-.115 0-.302.043-.46.208-.158.166-.603.59-.603 1.437 0 .848.617 1.668.703 1.783.086.115 1.213 1.852 2.939 2.598.411.179.731.286.981.365.412.129.787.11 1.084.067.33-.048 1.012-.414 1.155-.814.142-.4.142-.742.1-.813-.043-.072-.158-.115-.326-.199z"/>
                        </svg>
                        WhatsApp
                    </a>
                    <a href="tel:+27128046406" class="contact-btn phone" target="_blank">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        Call Now
                    </a>
                    <a href="mailto:info@peoengineering.co.za" class="contact-btn email" target="_blank">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                            <polyline points="22,7 12,13 2,7"/>
                        </svg>
                        Email Us
                    </a>
                </div>
                
                <hr>
                
                <p style="color: #777777; font-size: 13px; text-align: center; margin-top: 16px;">
                    If you need immediate assistance, feel free to contact us directly using the buttons above.<br>
                    We're here to help you with your precision engineering needs.
                </p>
            </div>
            
            <div class="footer">
                <div class="footer-brand">
                    <div class="footer-logo">
                        PEO <span>ENGINEERING</span>
                    </div>
                    <div class="footer-tagline">Excellence in Every Detail</div>
                </div>
                
                <div class="footer-info">
                    <div class="footer-section">
                        <h4>Location</h4>
                        <div class="footer-address">
                            <p>Unit 51, Sildale Park</p>
                            <p>Silvertondale, Conveyor Road</p>
                            <p>Pretoria, South Africa</p>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Contact</h4>
                        <ul class="footer-contact-list">
                            <li>
                                <a href="tel:+27128046406">
                                    +27 (012) 804 6406
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@peoengineering.co.za">
                                    info@peoengineering.co.za
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>© ${new Date().getFullYear()} PEO Engineering (Pty) Ltd. All rights reserved.</p>
                    <p>Precision Engineering Excellence Since 2005</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Send both admin and user emails with enhanced error handling
     */
    async sendContactEmails(formData) {
        const results = {
            admin: null,
            user: null,
            success: false,
            timestamp: new Date().toISOString()
        };

        try {
            const adminRecipients = [this.companyEmail];
            if (this.ccEmails?.length) {
                adminRecipients.push(...this.ccEmails);
            }

            const adminHtml = this.generateAdminEmail(formData);
            const userHtml = this.generateUserEmail(formData);

            const [adminResult, userResult] = await Promise.allSettled([
                this.sendEmail(adminRecipients, `[PEO Engineering] New Inquiry - ${formData.name}`, adminHtml),
                this.sendEmail([formData.email], `Thank You for Contacting PEO Engineering`, userHtml)
            ]);

            results.admin = adminResult.status === 'fulfilled' ? adminResult.value : { success: false, error: adminResult.reason };
            results.user = userResult.status === 'fulfilled' ? userResult.value : { success: false, error: userResult.reason };
            results.success = results.admin.success;

            if (!results.admin.success) {
                console.error('Admin email failed:', results.admin.error);
            }
            if (!results.user.success) {
                console.error('User email failed:', results.user.error);
            }

            return results;

        } catch (error) {
            console.error('Email service error:', error);
            results.error = error.message;
            return results;
        }
    }
}

module.exports = new EmailService();