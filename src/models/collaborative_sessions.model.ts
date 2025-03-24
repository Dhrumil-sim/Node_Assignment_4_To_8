import mongoose, {Schema} from "mongoose";

const collaborativeSessionSchema = new Schema(
    {
        host_id : {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        participant_ids : [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            }
        ],
       
        song_queue : [
            {
                 type: Schema.Types.ObjectId,
                 ref: 'Song',
                 required: true,
            }
        ],

        isActive: {
            type: Boolean,
        }
    },
    {
        timestamps: true,
    }
);

export const ColloborativeSession = mongoose.model("ColloborativeSession",collaborativeSessionSchema);