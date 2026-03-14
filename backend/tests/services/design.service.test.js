const designService = require('../../src/services/design.service');
const Design = require('../../src/models/Design.model');
const Review = require('../../src/models/Review.model');
const cloudinary = require('../../src/config/cloudinary');
const uploadToAppwrite = require('../../src/utils/uploadToAppwrite');

jest.mock('../../src/models/Design.model');
jest.mock('../../src/models/Review.model');
jest.mock('../../src/config/cloudinary', () => ({
    url: jest.fn()
}));
jest.mock('../../src/utils/uploadToAppwrite');

describe('Design Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllDesigns', () => {
        it('should get serialized active designs with review stats', async () => {
            const mockDesigns = [
                {
                    _id: '1',
                    title: 'Design 1',
                    fileKey: 'appwrite/bucket/file/model.stl',
                    toObject: jest.fn().mockReturnValue({
                        _id: '1',
                        title: 'Design 1',
                        fileKey: 'appwrite/bucket/file/model.stl'
                    })
                }
            ];

            const mockLimit = jest.fn().mockResolvedValue(mockDesigns);
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
            const mockSelect = jest.fn().mockReturnValue({ sort: mockSort });
            const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });

            Design.countDocuments.mockResolvedValue(1);
            Design.find.mockReturnValue({ populate: mockPopulate });
            Review.aggregate.mockResolvedValue([{ _id: '1', avgRating: 4.5, count: 3 }]);

            const result = await designService.getAllDesigns();

            expect(Design.find).toHaveBeenCalledWith({ isActive: true });
            expect(mockPopulate).toHaveBeenCalledWith('uploadedBy', 'name sellerTier totalSales averageRating');
            expect(mockSelect).toHaveBeenCalledWith('+fileKey');
            expect(mockSort).toHaveBeenCalledWith('-createdAt');
            expect(result).toEqual({
                designs: [{
                    _id: '1',
                    title: 'Design 1',
                    fileKey: undefined,
                    format: 'STL',
                    avgRating: 4.5,
                    reviewCount: 3
                }],
                total: 1,
                page: 1,
                pages: 1
            });
        });
    });

    describe('createDesign', () => {
        it('should properly orchestrate the upload and DB creation', async () => {
            const mockDesignData = { title: 'Test Design', description: 'Desc', price: '1000', category: '3d-designs' };
            const mockPreviewFile = { filename: 'test.jpg' };
            const mockCncFile = { buffer: Buffer.from('test'), mimetype: 'application/octet-stream', originalname: 'test.stl' };
            const mockUserId = 'user123';

            cloudinary.url.mockReturnValue('https://cloudinary.com/watermarked.jpg');
            uploadToAppwrite.mockResolvedValue('appwrite/bucket/file/test.stl');

            const mockCreatedDesign = { _id: 'design123', title: 'Test Design' };
            Design.create.mockResolvedValue(mockCreatedDesign);

            const result = await designService.createDesign(mockDesignData, mockPreviewFile, mockCncFile, mockUserId);

            expect(cloudinary.url).toHaveBeenCalled();
            expect(uploadToAppwrite).toHaveBeenCalledWith(mockCncFile.buffer, mockCncFile.mimetype, mockCncFile.originalname);
            expect(Design.create).toHaveBeenCalledWith({
                title: 'Test Design',
                description: 'Desc',
                price: 1000,
                category: '3d-designs',
                previewImages: ['https://cloudinary.com/watermarked.jpg'],
                fileKey: 'appwrite/bucket/file/test.stl',
                uploadedBy: 'user123'
            });
            expect(result).toEqual(mockCreatedDesign);
        });
    });
});
