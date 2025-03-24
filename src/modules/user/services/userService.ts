import { StatusCodes } from "http-status-codes";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";

class UserService {
    static async createUser(username: string, email: string, password: string, role: string, profilePicture: string) {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            throw new ApiError(StatusCodes.CONFLICT, 'User already exists');
        }

        const newUser = await User.create({ username, email, password, role, profile_picture: profilePicture });
        return newUser;
    }

    static async validateUserCredentials(emailOrUsername: string, password: string) {
        const user = await User.findOne({ $or: [{ username: emailOrUsername }, { email: emailOrUsername }] }).select('+password');
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
        }
        return user;
    }
}

export default UserService;
