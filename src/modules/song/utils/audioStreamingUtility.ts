import { Request, Response } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import SongService from "../services/song.service.js";
import { Song } from "../../../models/song.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const streamAudio = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const songId = req.params.id;
    const songData = await Song.findById(songId);
    console.log(songData);
    const __fileName = fileURLToPath(import.meta.url);
    const __dirName = dirname(__fileName);
    const songFile = songData?.filePath;
    const filePath = path.join(__dirName, "../../../../" + songFile);

    if (!fs.existsSync(filePath)) {
      res.status(404).send("Audio file not found.");
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res
          .status(416)
          .send("Requested range not satisfiable\n" + start + " " + end);
        return;
      }

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      };

      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  }
);
