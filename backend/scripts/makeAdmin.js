const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User.model');

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connection Successful!');

        const identifier = process.argv[2];

        if (!identifier) {
            console.log('Please provide an email address or name. Usage: node makeAdmin.js <email_or_name>');
            process.exit(1);
        }

        const user = await User.findOneAndUpdate(
            {
                $or: [
                    { email: identifier },
                    { name: new RegExp(identifier, 'i') }
                ]
            },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log(`No user found with email: ${email}`);
        } else {
            console.log(`Success! User ${user.email} is now an admin.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

makeAdmin();
