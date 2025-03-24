import mongoose,{Schema} from "mongoose";
/**
 * @typedef ListeningHistory
 * @property {mongoose.Types.ObjectId} userId - The user who played the song (References User model).
 * @property {mongoose.Types.ObjectId} songId - The song that was played (References Song model).
 * @property {Date} playedAt - Timestamp when the song was played.
 */
const listeningHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
    playedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('ListeningHistory', listeningHistorySchema);