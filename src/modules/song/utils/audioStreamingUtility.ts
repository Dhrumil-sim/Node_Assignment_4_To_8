import { Request, Response } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Song } from "../../../models/song.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const streamAudio = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const songId = req.params.id;

    // Validate songId
    if (!songId) {
      res.status(400).send("Song ID is required.");
      throw new ApiError(StatusCodes.NOT_FOUND, "Song Id is required");
    }

    // Fetch song metadata from the database
    const songData = await Song.findById(songId);
    if (!songData || !songData.filePath) {
      throw new ApiError(StatusCodes.NOT_FOUND, "song data is not found");
    }

    // Resolve file path
    const __fileName = fileURLToPath(import.meta.url);
    const __dirName = dirname(__fileName);
    const filePath = path.resolve(__dirName, "../../../../", songData.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError(StatusCodes.NOT_FOUND, "music file is not found");
    }

    // Get file stats
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Handle range requests
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize || start > end) {
        throw new ApiError(
          StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE,
          `${ReasonPhrases.REQUESTED_RANGE_NOT_SATISFIABLE}: ${start}-${end}`
        );
      }

      // Define chunk size
      const chunkSize = 5 * 1024 * 1024;

      // Stream the requested range
      const file = fs.createReadStream(filePath, { start, end });
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline",
      };

      res.writeHead(206, headers);
      file.pipe(res);
    } else {
      // Stream the entire file
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline",
      };

      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  }
);
