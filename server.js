// server.js
// Express server with Brevo email integration using email.js service

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const emailService = require('./services/emailService');
const config = require('./config');

// Initialize Express app
const app = express();
const PORT = config.server.port;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable if you're serving HTML with inline styles
}));

// CORS middleware
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    }
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Also add this to serve from the parent directory if needed
app.use(express.static(path.join(__dirname, '../')));

// ============= SPECIFIC ROUTE FOR LOGO =============
/**
 * GET /Logo.jpg
 * Serve the company logo file
 */
app.get('/Logo.jpg', (req, res) => {
    const logoPath = path.join(__dirname, 'public', 'Logo.jpg');
    console.log(`📸 Serving logo from: ${logoPath}`);
    
    // Send the file with proper headers
    res.sendFile(logoPath, (err) => {
        if (err) {
            console.error('❌ Error serving logo:', err);
            res.status(404).send('Logo not found');
        } else {
            console.log('✅ Logo served successfully');
        }
    });
});

// Also add a route for lowercase logo.jpg (for case-insensitive access)
app.get('/logo.jpg', (req, res) => {
    const logoPath = path.join(__dirname, 'public', 'Logo.jpg');
    res.sendFile(logoPath);
});

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Helper function to get client IP
const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           req.connection.socket?.remoteAddress || 
           'Unknown';
};

// ============= API ROUTES =============

/**
 * POST /api/send-email
 * Send contact form emails (admin + user)
 */
app.post('/api/send-email', async (req, res) => {
    try {
        const formData = req.body;
        
        // Log incoming request
        console.log('📧 Processing contact form submission from:', formData.name);
        
        // Validate required fields
        const validationErrors = [];
        
        if (!formData.name || formData.name.trim() === '') {
            validationErrors.push('Full name is required');
        }
        
        if (!formData.email || formData.email.trim() === '') {
            validationErrors.push('Email address is required');
        } else {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                validationErrors.push('Please provide a valid email address');
            }
        }
        
        if (!formData.message || formData.message.trim() === '') {
            validationErrors.push('Message is required');
        }
        
        if (!formData.service) {
            validationErrors.push('Please select a service');
        }
        
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: validationErrors.join(', ')
            });
        }
        
        // Add additional metadata to form data
        const enrichedFormData = {
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone ? formData.phone.trim() : '',
            message: formData.message.trim(),
            service: formData.service || 'Not specified',
            urgency: formData.urgency || 'Not specified',
            budget: formData.budget || 'Not specified',
            submittedAt: new Date().toISOString(),
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent'] || 'Unknown'
        };
        
        // Handle "Other" service option
        if (enrichedFormData.service === 'Other' && formData['other-service']) {
            enrichedFormData.service = formData['other-service'].trim();
        }
        
        // Send emails using email service
        const emailResults = await emailService.sendContactEmails(enrichedFormData);
        
        if (emailResults.success) {
            console.log(`✅ Contact form processed successfully for: ${enrichedFormData.email}`);
            
            res.status(200).json({
                success: true,
                message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
                data: {
                    adminSent: emailResults.admin?.success || false,
                    userSent: emailResults.user?.success || false
                }
            });
        } else {
            console.error('❌ Failed to send emails:', emailResults.error);
            
            res.status(500).json({
                success: false,
                error: 'Failed to send email. Please try again later or contact us directly.',
                details: config.server.env === 'development' ? emailResults.error : undefined
            });
        }
        
    } catch (error) {
        console.error('🔥 Error in /api/send-email:', error);
        
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
            details: config.server.env === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.server.env,
        service: 'PEO Engineering Contact Form API'
    });
});

/**
 * GET /api/test-email
 * Test email endpoint (only in development)
 */
if (config.server.env === 'development') {
    app.post('/api/test-email', async (req, res) => {
        try {
            const testData = {
                name: 'Test User',
                email: 'test@example.com',
                phone: '+27 12 345 6789',
                service: 'Steel Cutting',
                message: 'This is a test message to verify email functionality.',
                urgency: 'Standard (2-4 weeks)',
                budget: 'R5,000 - R20,000',
                submittedAt: new Date().toISOString(),
                ipAddress: '127.0.0.1'
            };
            
            const result = await emailService.sendContactEmails(testData);
            
            res.status(200).json({
                success: result.success,
                message: 'Test email sent',
                results: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
}


// Catch-all for other routes - serve contact page
app.get('/catch-all', (req, res) => {
    // Check if the request is for an API endpoint
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: 'API endpoint not found'
        });
    }
    // Otherwise serve the contact page
    res.sendFile(path.join(__dirname, '../contact.html'));
});

// ============= ERROR HANDLING =============

// 404 handler for API routes
app.use('/api/', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: config.server.env === 'development' ? err.message : undefined
    });
});

// ============= START SERVER =============

app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('🚀 PEO Engineering Server Started');
    console.log('=================================');
    console.log(`📡 Server running on: http://${config.server.host}:${PORT}`);
    console.log(`🌍 Environment: ${config.server.env}`);
    console.log(`📧 Email Service: Brevo (Sendinblue)`);
    console.log(`📧 Sender Email: ${config.brevo.sender.email}`);
    console.log(`📧 Admin Email: ${config.brevo.companyEmail}`);
    console.log(`🖼️  Logo URL: http://${config.server.host}:${PORT}/Logo.jpg`);
    console.log('=================================\n');
});