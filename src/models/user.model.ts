import mongoose, { Schema , Document, model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from "node:process";
dotenv.config();


// Define the interface for the user document with your custom methods
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profile_picture?: string;
    joining_date: Date;
    role: 'user' | 'artist';
    last_password_update?: Date;
    refreshToken?: string;
    // Custom instance methods
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}



/**
 * @module Models
 * @description This module contains Mongoose models for the application, including the User model.
 */

/**
 * Represents the user schema for the application.
 * @typedef {Object} User
 * @property {string} username - The unique username for the user.
 * @property {string} email - The unique email address for the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} [profile_picture] - The URL of the user's profile picture (optional).
 * @property {Date} joining_date - The date the user joined (default is the current date).
 * @property {string} [refresh_token] - The refresh token associated with the user (optional).
 * @property {string} role - The role of the user, either 'user' or 'artist'.
 * @property {Date} createdAt - The timestamp when the user was created.
 * @property {Date} updatedAt - The timestamp when the user was last updated.
 */

/**
 * User Schema: Describes the structure for the User model, including validation, default values, and references.
 * 
 * @section UserSchema
 * @description The `UserSchema` includes user details such as `username`, `email`, `password`, and user role.
 * It also supports password hashing using a `pre-save` hook that hashes the password before saving the user.
 * 
 * @example
 * const user = new User({
 *     username: "john_doe",
 *     email: "john.doe@example.com",
 *     password: "plaintextpassword", // This will be hashed in the `pre` save hook.
 *     role: "user"
 * });
 */

/**
 * @submodule UserSchema/PreHooks
 * @description This submodule describes the `pre-save` hook attached to the User schema. 
 * The hook hashes the user's password before saving the user document to the database.
 * 
 * @function passwordHashing
 * @description This pre-save middleware hashes the password before saving it to the database.
 * @async
 * @param {Function} next - The callback function to move to the next middleware or save operation.
 * @returns {void} The next middleware is executed after hashing the password.
 * 
 * @example
 * userSchema.pre("save", async function (next) {
 *     this.password = await bcrypt.hash(this.password, 10);
 *     next();
 * });
 */

/**
 * User Schema definition
 * @function userSchema
 * @memberof module:Models/UserSchema
 */
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // Exclude password from being returned in queries by default
        },
        profile_picture: {
            type: String,
            trim: true,
        },
        joining_date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        role: {
            type: String,
            enum: ['user', 'artist'],
            required: true,
            default: 'user',
        },
        refreshToken: {
            type: String
        },
        last_password_update: {
            type: Date,
            default: Date.now, // Set to current date by default
          },

    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

/**
 * Pre-save hook to hash the user's password before saving.
 * This will be triggered before the `User` document is saved to the database.
 * 
 * @function passwordHashing
 * @memberof module:Models/UserSchema
 * @description Hashes the password using bcrypt before saving it.
 * @async
 * @param {Function} next - Callback to move to the next middleware function.
 */
userSchema.pre("save", async function (next) {
    // Check if the password is modified or newly set
    if (this.isModified("password")) {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, 10);
    }
    next(); // Move to the next middleware or save process
});

// Custom instance method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function(password: string){
    return bcrypt.compare(password, this.password);
};


/**
 * Instance method to generate a JSON Web Token (JWT) for the user.
 * 
 * @function generateAccessToken
 * @memberof module:Models/UserSchema
 * @returns {string} - Returns the generated JWT as a string.
 * @throws {Error} - Throws an error if token generation fails.
 */
userSchema.methods.generateAccessToken = function () {
    const payload = {
        _id: this.id,
        email: this.email,
        username: this.username,
        role: this.role,
    };

    const secret:any = process.env.ACCESS_TOKEN_SECRET;
    const expiry:any  = process.env.ACCESS_TOKEN_EXPIRY;
    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    
    return jwt.sign(payload, secret, {
        expiresIn: expiry,
    });
};


/**
 * Instance method to generate a JSON Web Token (JWT) for the user.
 * 
 * @function generateRefershToken
 * @memberof module:Models/UserSchema
 * @returns {string} - Returns the generated JWT as a string.
 * @throws {Error} - Throws an error if token generation fails.
 */
userSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this.id,
    
    };

    const secret:any = process.env.ACCESS_TOKEN_SECRET;
    const expiry: any = process.env.ACCESS_TOKEN_EXPIRY;
    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    return jwt.sign(payload, secret , {
        expiresIn: expiry,
    });
};



/**
 * @function User
 * @memberof module:Models
 * @description The Mongoose model representing a user in the application.
 * @returns {mongoose.Model} The User model.
 */
export const User = mongoose.model<IUser>("User", userSchema);
