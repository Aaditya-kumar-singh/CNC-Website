const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const hasEmailConfig = Boolean(
        process.env.EMAIL_HOST &&
        process.env.EMAIL_PORT &&
        process.env.EMAIL_USERNAME &&
        process.env.EMAIL_PASSWORD &&
        process.env.EMAIL_FROM
    );

    if (!hasEmailConfig) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Email service is not configured for production.');
        }

        // eslint-disable-next-line no-console
        console.log('--- DEVELOPMENT MODE: EMAIL INTERCEPTED ---');
        // eslint-disable-next-line no-console
        console.log(`To: ${options.email}`);
        // eslint-disable-next-line no-console
        console.log(`Subject: ${options.subject}`);
        // eslint-disable-next-line no-console
        console.log(`Body: ${options.message}`);
        // eslint-disable-next-line no-console
        console.log('-------------------------------------------');
        return true;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.htmlMessage || options.message
    });
};

module.exports = sendEmail;
