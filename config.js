// config.js
// Configuration for Brevo (Sendinblue) and Server Settings

const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.BREVO_API_KEY); // Debug: Log all environment variables to verify loading

module.exports = {
    // Brevo/Sendinblue Email Configuration
    
    brevo: {
        apiKey: process.env.BREVO_API_KEY,
        sender: {
            name: process.env.SENDER_NAME || 'PEO Engineering',
            email: process.env.SENDER_EMAIL || 'info@peoengineering.co.za'
        },
        // Company email to receive inquiries
        companyEmail: process.env.COMPANY_EMAIL || 'info@peoengineering.co.za',
        // Optional: CC emails (can be comma-separated in env)
        ccEmails: process.env.CC_EMAILS ? process.env.CC_EMAILS.split(',') : []
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        host: process.env.HOST || 'localhost'
    },
    
    // config.js
cors: {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5006', 'http://127.0.0.1:5006'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
},
    
    // Rate Limiting (optional)
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
};