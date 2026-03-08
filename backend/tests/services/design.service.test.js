const designService = require('../../src/services/design.service');
const Design = require('../../src/models/Design.model');
const cloudinary = require('../../src/config/cloudinary');
const uploadToR2 = require('../../src/utils/uploadToR2');

jest.mock('uuid', () => ({ v4: jest.fn(() => '1234') }));
jest.mock('../../src/models/Design.model');
jest.mock('../../src/config/cloudinary', () => ({
    url: jest.fn()
}));
jest.mock('../../src/utils/uploadToR2');

describe('Design Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllDesigns', () => {
        it('should get all active designs', async () => {
            const mockDesigns = [{ _id: '1', title: 'Design 1' }, { _id: '2', title: 'Design 2' }];

            const mockSort = jest.fn().mockResolvedValue(mockDesigns);
            const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
            Design.find.mockReturnValue({ populate: mockPopulate });

            const result = await designService.getAllDesigns();

            expect(Design.find).toHaveBeenCalledWith({ isActive: true });
            expect(mockPopulate).toHaveBeenCalledWith('uploadedBy', 'name');
            expect(mockSort).toHaveBeenCalledWith('-createdAt');
            expect(result).toEqual(mockDesigns);
        });
    });

    describe('createDesign', () => {
        it('should properly orchestrate the 3rd party uploads and DB creation', async () => {
            const mockDesignData = { title: 'Test Design', description: 'Desc', price: '1000' };
            const mockPreviewFile = { filename: 'test.jpg' };
            const mockCncFile = { buffer: Buffer.from('test'), mimetype: 'application/octet-stream', originalname: 'test.stl' };
            const mockUserId = 'user123';

            cloudinary.url.mockReturnValue('https://cloudinary.com/watermarked.jpg');
            uploadToR2.mockResolvedValue('r2-file-key.stl');

            const mockCreatedDesign = { _id: 'design123', title: 'Test Design' };
            Design.create.mockResolvedValue(mockCreatedDesign);

            const result = await designService.createDesign(mockDesignData, mockPreviewFile, mockCncFile, mockUserId);

            expect(cloudinary.url).toHaveBeenCalled();
            expect(uploadToR2).toHaveBeenCalledWith(mockCncFile.buffer, mockCncFile.mimetype, mockCncFile.originalname);
            expect(Design.create).toHaveBeenCalledWith({
                title: 'Test Design',
                description: 'Desc',
                price: 1000,
                previewImages: ['https://cloudinary.com/watermarked.jpg'],
                fileKey: 'r2-file-key.stl',
                uploadedBy: 'user123'
            });
            expect(result).toEqual(mockCreatedDesign);
        });
    });
});
