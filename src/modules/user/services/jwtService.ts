import jwt from 'jsonwebtoken';
import { User } from '../../../models/user.model.js';
import { ApiError } from '../../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

class JWTService {
    private static refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

    static async generateAccessAndRefreshTokens(userId: string) {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
            }

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } catch (error) {
            console.error(error);
            throw new ApiError(500, 'Something went wrong while generating tokens');
        }
    }

    static verifyRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, JWTService.refreshTokenSecret);
        } catch (error) {
            throw new ApiError(401, 'Invalid Refresh Token');
        }
    }
}

export default JWTService;
