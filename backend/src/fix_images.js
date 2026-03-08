require('dotenv').config();
const mongoose = require('mongoose');
const Design = require('./models/Design.model');

const MONGO_URI = process.env.MONGODB_URI;

const fixImages = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB. Fixing images...');

        // Remove the external unsplash URLs so the frontend uses the local placeholder image instead
        await Design.updateMany({}, { $set: { previewImages: [] } });

        console.log('Fixed! All broken unsplash links removed.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixImages();
