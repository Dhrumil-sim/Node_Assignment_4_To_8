import mongoose from 'mongoose';
import { Song, ISong } from '../../../models/song.model.js';
import { ApiError } from '../../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

class SongService {
  /**
   * Creates a new song document in the database.
   * @param artist - The ID of the artist uploading the song.
   * @param title - The title of the song.
   * @param genre - An array of genres associated with the song.
   * @param releaseDate - The release date of the song.
   * @param duration - The duration of the song in seconds.
   * @param coverPicture - The URL or path to the cover picture.
   * @param filePath - The path to the song file.
   * @returns The created song document.
   */
  static async createSong(
    artist: mongoose.Types.ObjectId,
    title: string,
    genre: string[],
    releaseDate: Date,
    duration: number,
    coverPicture: string,
    filePath: string
  ): Promise<ISong> {
    const newSong = await Song.create({
      artist,
      title,
      genre,
      releaseDate,
      duration,
      coverPicture,
      filePath,
    });
    return newSong;
  }
  static async getAllSongs(): Promise<ISong[]> {
    try {
      // Fetch all songs and optionally populate artist information
      const songs = await Song.find().populate('artist', 'name'); // Adjust the fields based on your requirements
      return songs;
    } catch (error) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Music Not Found");
    }
  }

}

export default SongService;
