import { Router, Request, Response } from "express";
import { validateRequest } from "../middlewares/validateRequest/validateRequest.js";
import {
  searchSongValidationSchema,
  songValidationSchema,
} from "../modules/song/utils/song.validator.js";
import SongController from "../modules/song/song.controller.js";
import { uploadSong } from "../modules/song/middlewares/songUpload.middleware.js";
import { upload } from "../middlewares/fileUpload/multer.middleware.js";
import { verifyJWT } from "../middlewares/authHandler/auth.middleware.js";
const router = Router();
import { Song } from "../models/song.model.js";

router.post(
  "/create",
  verifyJWT,
  uploadSong.fields([
    { name: "coverPicture", maxCount: 1 }, // Image field
    { name: "filePath", maxCount: 1 }, // Audio field
  ]),
  validateRequest(songValidationSchema),
  SongController.createSong
);

router.get("/", verifyJWT, SongController.getAllSong);
router.get("/artist/:artistID", verifyJWT, SongController.getArtistAllSongs);

// Search Songs API
router.get("/search", verifyJWT, SongController.searchedSongs);
router.get(
  "/search/song/:searchId",
  verifyJWT,
  SongController.searchedSongsById
);
export default router;
