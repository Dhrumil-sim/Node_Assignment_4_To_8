import mongoose, { Schema, Document } from 'mongoose';
import { User } from './user.model.js';

/**
 * Interface representing a Song document in MongoDB.
 */
export interface ISong extends Document {
  artist: mongoose.Types.ObjectId;
  title: string;
  album?: mongoose.Types.ObjectId | null;
  genre: string[];
  releaseDate: Date;
  duration: number;
  coverPicture: string;
  filePath: string;
}

/**
 * Mongoose schema for the Song model.
 */
const songSchema = new Schema<ISong>(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    coverPicture: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

/**
 * Mongoose model for the Song schema.
 */
export const Song = mongoose.model<ISong>('Song', songSchema);
