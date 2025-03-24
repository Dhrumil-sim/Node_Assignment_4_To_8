    import Joi from "joi";

    // Password Regex for strong passwords
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // User Registration Validation Schema
    export const registerUserSchema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                "string.empty": "Username is required",
                "string.min": "Username must be at least 3 characters",
                "string.max": "Username must be at most 30 characters",
                "string.alphanum": "Username can only contain alphanumeric characters",
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format",
            }),

        password: Joi.string()
            .pattern(passwordRegex)
            .required()
            .messages({
                "string.empty": "Password is required",
                "string.pattern.base": "Password must be at least 8 characters, include one uppercase letter, one number, and one special character",
            }),

        role: Joi.string()
            .valid("artist", "user")
            .required()
            .messages({
                "any.only": "Invalid role. Allowed roles are 'admin' and 'user'",
                "string.empty": "Role is required",
            }),

        profilePicture: Joi.string().optional(),
    });

    // User Login Validation Schema
    export const loginUserSchema = Joi.object({
        email: Joi.string().email().optional(),
        username: Joi.string().optional(),
        password: Joi.string().required().messages({
            "string.empty": "Password is required",
        }),
    }).or("email", "username").messages({
        "object.missing": "Either username or email is required",
    });
