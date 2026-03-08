const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Determine transport mode. In dev without credentials, use a fake stream transport or log.
    // Ideally user provides SMTP host and port in .env
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: Number(process.env.EMAIL_PORT) || 2525, // Fix #1: must be Number — string port silently defaults to 25
        auth: {
            user: process.env.EMAIL_USERNAME || 'fake_user',
            pass: process.env.EMAIL_PASSWORD || 'fake_pass'
        }
    });

    const mailOptions = {
        // Fix #4: use EMAIL_FROM env var — hardcoded domain is rejected by SendGrid/Mailgun as unverified sender
        from: process.env.EMAIL_FROM || 'CNC Market <noreply@cncmarket.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.htmlMessage || options.message
    };

    // If no real credentials, just log the reset link to console for testing locally
    if (!process.env.EMAIL_USERNAME) {
        console.log('--- DEVELOPMENT MODE: EMAIL INTERCEPTED ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.message}`);
        console.log('-------------------------------------------');
        return true;
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
