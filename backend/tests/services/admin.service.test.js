const mongoose = require('mongoose');
const adminService = require('../../src/services/admin.service');
const User = require('../../src/models/User.model');
const Design = require('../../src/models/Design.model');
const Order = require('../../src/models/Order.model');
const cloudinary = require('../../src/config/cloudinary');
const r2 = require('../../src/config/storage');

jest.mock('../../src/models/User.model');
jest.mock('../../src/models/Design.model');
jest.mock('../../src/models/Order.model');
jest.mock('../../src/config/storage', () => ({
    send: jest.fn()
}));
jest.mock('../../src/config/cloudinary', () => ({
    api: {
        usage: jest.fn()
    }
}));
jest.mock('../../src/config/appwrite', () => ({
    bucketId: '',
    configError: 'Missing config',
    isConfigured: false,
    storage: {}
}));
jest.mock('@aws-sdk/client-s3', () => ({
    ListObjectsV2Command: jest.fn()
}));

describe('Admin Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.CLOUDINARY_API_KEY = 'test_key';
        process.env.R2_BUCKET_NAME = 'test_bucket';
    });

    describe('getDashboardStats', () => {
        it('should return aggregated dashboard statistics successfully', async () => {
            User.countDocuments.mockResolvedValue(10);
            Design.countDocuments.mockResolvedValue(50);
            Order.aggregate.mockResolvedValue([{ total: 300 }]);

            mongoose.connection.db = {
                command: jest.fn().mockResolvedValue({
                    dataSize: 1048576,
                    storageSize: 2097152
                })
            };

            cloudinary.api.usage.mockResolvedValue({
                plan: 'Free',
                bandwidth: { usage: 1048576 },
                storage: { usage: 1048576 },
                credits: { usage: 5 }
            });

            r2.send.mockResolvedValue({
                Contents: [
                    { Size: 1048576 },
                    { Size: 1048576 }
                ]
            });

            const stats = await adminService.getDashboardStats();

            expect(stats.counts.users).toBe(10);
            expect(stats.counts.designs).toBe(50);
            expect(stats.revenue).toBe(300);
            expect(stats.storage.mongodb.dataSize).toBe('1.00');
            expect(stats.storage.mongodb.storageSize).toBe('2.00');
            expect(stats.storage.cloudinary.status).toBe('Active');
            expect(stats.storage.r2.status).toBe('Active');
            expect(stats.storage.appwrite.status).toBe('Missing Config');
        });

        it('should handle errors in external services gracefully', async () => {
            User.countDocuments.mockResolvedValue(0);
            Design.countDocuments.mockResolvedValue(0);
            Order.aggregate.mockResolvedValue([]);

            mongoose.connection.db = { command: jest.fn().mockRejectedValue(new Error('Mongo error')) };
            cloudinary.api.usage.mockRejectedValue(new Error('Cloudinary error'));
            r2.send.mockRejectedValue(new Error('R2 error'));

            const stats = await adminService.getDashboardStats();

            expect(stats.storage.mongodb.error).toBe('Failed to fetch Mongo stats');
            expect(stats.storage.cloudinary.status).toBe('Error');
            expect(stats.storage.r2.status).toBe('Error');
        });
    });
});
