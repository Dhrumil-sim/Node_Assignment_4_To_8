import { Request,Response,NextFunction, query } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import SongMetaData from "./utils/songMetadata.util.js";
import SongService from "./services/song.service.js";
import { Song } from "../../models/song.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { string } from "joi";
interface AuthenticatedRequest extends Request {
    cookies: { accessToken?: string, refreshToken?: string }; // Define cookies with accessToken
    user?: any;
    files: {
        coverPicture?: Express.Multer.File[]; // Array of image files
        filePath?: Express.Multer.File[]; // Array of audio files (filePath as array of files)
    };
}

class SongController {

    static createSong = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      
        const { role, _id: artistId, genre } = req.user; // Extract user details
      
        // Check if the user is an artist
      if (role !== "artist") {
        return res.status(403).json({ message: "Access denied: Only artists can upload songs" });
      }
      // Add the artist ID to the request body
      req.body.artist = artistId;

      const coverFile = req.files?.coverPicture?.[0].path;
      const songFile = req.files?.filePath?.[0]?.path; // Get the song file path  
      // Ensure the file exists before trying to get metadata
      if (!songFile) {
        return res.status(400).json({ message: "No song file uploaded" });
      }
      
      
      // Call the getMetadata function with path of songFile
      const songMetadata = await SongMetaData.getMetadata(songFile); 
      const { format: { duration } } = songMetadata;
      
      try {
        const {artist,title,genre} = req.body;
        const genreArray = JSON.parse(genre);
        const releaseDate = new Date();
        
        const newSong = await SongService.createSong(artistId,title,genreArray,releaseDate,duration!,coverFile!,songFile);


       // Proceed with song creation (e.g., saving to the database)
      res.status(201).json({ message: "Song created successfully", data: req.body });
    } catch (error) {
        return next(error);
    }

      
    });

    static getAllSong = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
         
        const allSongs = await SongService.getAllSongs();
        
        if(!allSongs)
        {
             throw new ApiError(StatusCodes.NOT_FOUND,"No music Founded");
        }
        else{

            res.status(200).json({
                allSongs
            });
        }

    });

    // controller to get individual artist own songs 


    static getArtistAllSongs = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
           const artistId = req.user?._id;
           const artistAllSongs = await SongService.getArtistAllSongs(artistId);
           if(!artistAllSongs)
           {
             throw new ApiError(StatusCodes.NOT_FOUND, "No music is created by you ..");
           }
           else {
               res.status(200).json({
                 artistAllSongs
               });
           }
    });

    static getSearchedSongs = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const query = req.query.query;
    
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
    
      try {
        const searchedSongs = await SongService.getSearchedSongs(query.toString());
        if (!searchedSongs || searchedSongs.length === 0) {
          return res.status(404).json({ message: "No songs match your search" });
        }
    
        res.status(200).json({ data: searchedSongs });
      } catch (error) {
        next(error); // Properly handle errors with middleware
      }
    });
    
  }

export default SongController;