import mongoose, {Schema} from "mongoose";

/**
 * @typedef Playlist
 * @property {string} name - Name of the playlist.
 * @property {string} description - Description of the playlist.
 * @property {mongoose.Types.ObjectId} createdBy - User ID of the creator (References User model).
 * @property {Date} dateCreated - Timestamp when the playlist was created.
 * @property {boolean} isShared - Whether the playlist is shared or private.
 */
const playlistSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateCreated: { type: Date, default: Date.now },
    isShared: { type: Boolean, default: false }
  });
  
  module.exports = mongoose.model('Playlist', playlistSchema);