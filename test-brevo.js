// test-brevo.js
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.BREVO_API_KEY;

console.log('Testing Brevo API Key...');
console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');
console.log('Full API Key length:', apiKey ? apiKey.length : 0);

async function testApiKey() {
    try {
        // Test 1: Get account info
        const response = await axios({
            method: 'GET',
            url: 'https://api.brevo.com/v3/account',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey
            }
        });
        
        console.log('✅ API Key is valid!');
        console.log('Account Email:', response.data.email);
        console.log('Plan:', response.data.plan[0]?.type);
        
        // Test 2: Try sending a test email
        console.log('\n📧 Testing email sending...');
        
        const emailResponse = await axios({
            method: 'POST',
            url: 'https://api.brevo.com/v3/smtp/email',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            data: {
                sender: {
                    name: 'PEO Engineering Test',
                    email: 'collinsndungu953@gmail.com'
                },
                to: [{
                    email: 'collinsndungu953@gmail.com'
                }],
                subject: 'Test Email from PEO Engineering',
                htmlContent: '<h1>Test Email</h1><p>This is a test email to verify your Brevo API key is working.</p>'
            }
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', emailResponse.data.messageId);
        
    } catch (error) {
        console.error('❌ API Key validation failed');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('\n🔍 Possible issues:');
            console.log('1. API key is invalid or expired');
            console.log('2. You might be using SMTP key instead of API key');
            console.log('3. Account might be suspended or not verified');
            console.log('4. API key might be from wrong environment (test vs production)');
        }
    }
}

testApiKey();