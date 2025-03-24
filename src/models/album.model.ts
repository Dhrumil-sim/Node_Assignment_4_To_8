import mongoose, { Schema, Document } from "mongoose";
import { User } from "./user.model.js";
import { Song } from "./song.model.js";

/**
 * Interface for Album Document
 */
export interface IAlbum extends Document {
  artist: mongoose.Types.ObjectId;
  title: string;
  genre: string[];
  release_date: Date;
  cover_pic: string;
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to Artist (User)
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    cover_pic: {
      type: String,
      required: true,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song", // Reference to Songs in Album
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export const Album = mongoose.model<IAlbum>("Album", albumSchema);
