const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User.model');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existing = await User.findOne({ email: 'aaditya@example.com' });
        if (existing) {
            existing.role = 'admin';
            await existing.save();
            console.log('User aaditya@example.com updated to admin.');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Aaditya',
            email: 'aaditya@example.com',
            password: 'password123',
            role: 'admin'
        });

        console.log(`Successfully created admin user: ${admin.email} / password123`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdmin();
