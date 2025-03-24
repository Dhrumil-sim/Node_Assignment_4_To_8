import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest/validateRequest.js";
import { songValidationSchema } from "../modules/song/utils/song.validator.js";
import SongController from "../modules/song/song.controller.js";
import { uploadSong } from "../modules/song/middlewares/songUpload.middleware.js";
import { upload } from "../middlewares/fileUpload/multer.middleware.js";
import { verifyJWT } from "../middlewares/authHandler/auth.middleware.js";
const router = Router();


router.post('/create', verifyJWT, uploadSong.fields([
    { name: 'coverPicture', maxCount: 1 },  // Image field
    { name: 'filePath', maxCount: 1 },      // Audio field
  ]), validateRequest(songValidationSchema), SongController.createSong);
  
router.get('/',verifyJWT,SongController.getAllSong);
export default router;