import Joi from "joi";
import { now } from "mongoose";

/**
 * Joi validation schema for the song model
 */
const songValidationSchema = Joi.object({
  artist: Joi.string().hex().length(24).optional().messages({
    "string.base": `"artist" should be a string`,
    "string.hex": `"artist" must be a valid ObjectId`,
    "any.required": `"artist" is required`,
  }),

  title: Joi.string().trim().required().messages({
    "string.base": `"title" should be a string`,
    "string.trim": `"title" should not have leading or trailing spaces`,
    "any.required": `"title" is required`,
  }),

  album: Joi.string().hex().length(24).allow(null).optional().messages({
    "string.base": `"album" should be a string`,
    "string.hex": `"album" must be a valid ObjectId`,
  }),

  genre: Joi.alternatives()
  .try(
    Joi.array().items(Joi.string()).min(1), // Accept array directly
    Joi.string().custom((value, helpers) => {
      // Try to parse JSON string into an array
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error();
        }
        return parsed;
      } catch (err) {
        return helpers.error("string.invalid");
      }
    }).messages({
      "string.invalid": `"genre" must be a valid JSON array`,
    })
  )
  .required()
  .messages({
    "array.base": `"genre" should be an array`,
    "array.min": `"genre" must contain at least one item`,
    "any.required": `"genre" is required`,
  }),

  

  coverPicture: Joi.string().uri().optional().messages({
    "string.base": `"cover_pic" should be a string`,
    "string.uri": `"cover_pic" should be a valid URL`,
    "any.required": `"cover_pic" is required`,
  }),

  filePath: Joi.string().optional().messages({
    "string.base": `"file_path" should be a string`,
    "any.required": `"file_path" is required`,
  }),
});

export { songValidationSchema };
