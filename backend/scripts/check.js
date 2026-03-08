const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User.model');
const fs = require('fs');

dotenv.config();

const doCheck = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({});
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (e) {
        fs.writeFileSync('error.txt', e.message);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

doCheck();
