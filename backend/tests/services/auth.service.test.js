const authService = require('../../src/services/auth.service');
const User = require('../../src/models/User.model');

jest.mock('../../src/models/User.model');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should successfully create a new user', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            User.create.mockResolvedValue(mockUser);

            const result = await authService.createUser('John Doe', 'john@example.com', 'password123');

            expect(User.create).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate a valid user', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'john@example.com',
                password: 'hashedPassword',
                comparePassword: jest.fn().mockResolvedValue(true) // Simulating correct pwd
            };

            // Setting up chainable mock queries
            const mockSelect = jest.fn().mockResolvedValue(mockUser);
            User.findOne.mockReturnValue({ select: mockSelect });

            const result = await authService.authenticateUser('john@example.com', 'correctPassword');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(mockSelect).toHaveBeenCalledWith('+password');
            expect(mockUser.comparePassword).toHaveBeenCalledWith('correctPassword', 'hashedPassword');
            expect(result).toEqual(mockUser);
        });

        it('should return null for invalid email', async () => {
            const mockSelect = jest.fn().mockResolvedValue(null);
            User.findOne.mockReturnValue({ select: mockSelect });

            const result = await authService.authenticateUser('wrong@example.com', 'password');

            expect(result).toBeNull();
        });

        it('should return null for invalid password', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'john@example.com',
                password: 'hashedPassword',
                comparePassword: jest.fn().mockResolvedValue(false) // Validation fails
            };

            const mockSelect = jest.fn().mockResolvedValue(mockUser);
            User.findOne.mockReturnValue({ select: mockSelect });

            const result = await authService.authenticateUser('john@example.com', 'wrongPassword');

            expect(result).toBeNull();
        });
    });

    describe('getUserProfile', () => {
        it('should return a user with populated purchasedDesigns', async () => {
            const mockUser = {
                _id: 'user123',
                purchasedDesigns: ['design1', 'design2']
            };

            const mockPopulate = jest.fn().mockResolvedValue(mockUser);
            User.findById.mockReturnValue({ populate: mockPopulate });

            const result = await authService.getUserProfile('user123');

            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(mockPopulate).toHaveBeenCalledWith('purchasedDesigns');
            expect(result).toEqual(mockUser);
        });
    });
});
