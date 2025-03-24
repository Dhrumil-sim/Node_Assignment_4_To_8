import mongoose,{Schema} from "mongoose";
/**
 * @typedef PlaylistSong
 * @property {mongoose.Types.ObjectId} playlistId - The playlist this song belongs to (References Playlist model).
 * @property {mongoose.Types.ObjectId} songId - The song in the playlist (References Song model).
 * @property {Date} addedAt - Timestamp when the song was added to the playlist.
 */
const playlistSongSchema = new Schema({
  playlistId: { type: Schema.Types.ObjectId, ref: 'Playlist', required: true },
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlaylistSong', playlistSongSchema);
