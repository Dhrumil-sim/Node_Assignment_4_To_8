import mongoose,{Schema} from "mongoose";

/**
 * @typedef Favorite
 * @property {mongoose.Types.ObjectId} userId - The user who marked the song as favorite (References User model).
 * @property {mongoose.Types.ObjectId} songId - The song marked as favorite (References Song model).
 * @property {Date} addedAt - Timestamp when the song was added to favorites.
 */
const favoritesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoritesSchema);
