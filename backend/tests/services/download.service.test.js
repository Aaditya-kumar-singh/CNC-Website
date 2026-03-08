const downloadService = require('../../src/services/download.service');
const generateSignedUrl = require('../../src/utils/generateSignedUrl');

jest.mock('../../src/utils/generateSignedUrl');

describe('Download Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('authorizeAndGenerateUrl', () => {
        it('should return URL for free design', async () => {
            const design = { price: 0, fileKey: 'free-file.txt' };
            const user = { id: 'user1', purchasedDesigns: [] };
            generateSignedUrl.mockResolvedValue('http://signed.url');

            const result = await downloadService.authorizeAndGenerateUrl(design, user);
            expect(result).toBe('http://signed.url');
        });

        it('should return URL if user is owner', async () => {
            const design = { price: 10, fileKey: 'paid-file.txt', uploadedBy: 'user1' };
            const user = { id: 'user1', purchasedDesigns: [] };
            generateSignedUrl.mockResolvedValue('http://signed.url');

            const result = await downloadService.authorizeAndGenerateUrl(design, user);
            expect(result).toBe('http://signed.url');
        });

        it('should return URL if user purchased design', async () => {
            const design = { price: 10, fileKey: 'paid-file.txt', uploadedBy: 'user2', _id: 'design1' };
            const user = { id: 'user1', purchasedDesigns: ['design1'] };
            generateSignedUrl.mockResolvedValue('http://signed.url');

            const result = await downloadService.authorizeAndGenerateUrl(design, user);
            expect(result).toBe('http://signed.url');
        });

        it('should return null if not authorized', async () => {
            const design = { price: 10, fileKey: 'paid-file.txt', uploadedBy: 'user2', _id: 'design2' };
            const user = { id: 'user1', purchasedDesigns: ['design1'] };

            const result = await downloadService.authorizeAndGenerateUrl(design, user);
            expect(result).toBeNull();
        });
    });
});
