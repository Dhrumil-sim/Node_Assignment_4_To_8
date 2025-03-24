import mongoose ,{Schema} from "mongoose";
import { User } from "./user.model.js";

const notificationSchema = new Schema(
    
    {
       user_id : {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true,
       },

       message:{
           type:String,
       },

       read:{
         type: Boolean,
       },

       createdAt: {
        type: Date,
       }

    },{
        timestamps: true,
    }
);

export const Notification = mongoose.model("Notification",notificationSchema);
