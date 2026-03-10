import { sendResetCode, verifyResetCode, resetPasswordWithCode } from '../src/app/service/passwordResetAPI';

describe('Password Reset API', () => {
    describe('sendResetCode', () => {
        it('should send a mock code successfully for a valid identifier', async () => {
            const start = Date.now();
            const result = await sendResetCode('validuser@example.com');
            const duration = Date.now() - start;

            // Check timing behavior (should wait approx 800ms)
            expect(duration).toBeGreaterThanOrEqual(700);

            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('message', 'Mock verification code sent.');
            expect(result).toHaveProperty('mockCode', '123456');
            expect(result).toHaveProperty('expiresIn', 300);
        });

        it('should throw an error for empty identifier', async () => {
            await expect(sendResetCode('')).rejects.toThrow('Please enter your username or email.');
            await expect(sendResetCode('   ')).rejects.toThrow('Please enter your username or email.');
            await expect(sendResetCode(null)).rejects.toThrow('Please enter your username or email.');
        });

        it('should throw an error for specific not found mock users', async () => {
            await expect(sendResetCode('notfound')).rejects.toThrow('User not found.');
            await expect(sendResetCode('notFound@example.com')).rejects.toThrow('User not found.');
        });
    });

    describe('verifyResetCode', () => {
        it('should verify correct mock code successfully', async () => {
            const result = await verifyResetCode('validuser@example.com', '123456');
            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('message', 'Code verified successfully.');
        });

        it('should throw an error for missing identifier', async () => {
            await expect(verifyResetCode('', '123456')).rejects.toThrow('Missing identifier.');
            await expect(verifyResetCode(null, '123456')).rejects.toThrow('Missing identifier.');
        });

        it('should throw an error for missing code', async () => {
            await expect(verifyResetCode('validuser@example.com', '')).rejects.toThrow('Please enter the verification code.');
        });

        it('should throw an error for invalid code format', async () => {
            await expect(verifyResetCode('validuser@example.com', '123')).rejects.toThrow('Please enter a valid 6-digit code.');
            await expect(verifyResetCode('validuser@example.com', 'abcdee')).rejects.toThrow('Please enter a valid 6-digit code.');
        });

        it('should throw an error for incorrect verification code', async () => {
            await expect(verifyResetCode('validuser@example.com', '654321')).rejects.toThrow('Invalid verification code.');
        });
    });

    describe('resetPasswordWithCode', () => {
        it('should reset password successfully with correct inputs', async () => {
            const result = await resetPasswordWithCode('validuser@example.com', '123456', 'newPassword123', 'newPassword123');
            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('message', 'Password reset successful.');
        });

        it('should throw an error for missing identifier', async () => {
            await expect(resetPasswordWithCode('', '123456', 'pass123', 'pass123')).rejects.toThrow('Missing identifier.');
        });

        it('should throw an error for invalid verification code', async () => {
            await expect(resetPasswordWithCode('validuser@example.com', '654321', 'pass123', 'pass123')).rejects.toThrow('Verification code is invalid.');
        });

        it('should throw an error if password is too short or missing', async () => {
            await expect(resetPasswordWithCode('validuser@example.com', '123456', '12345', '12345')).rejects.toThrow('New password must be at least 6 characters.');
            await expect(resetPasswordWithCode('validuser@example.com', '123456', '', '')).rejects.toThrow('New password must be at least 6 characters.');
        });

        it('should throw an error if passwords do not match', async () => {
            await expect(resetPasswordWithCode('validuser@example.com', '123456', 'password123', 'mismatch123')).rejects.toThrow('The two passwords do not match.');
        });
    });
});
