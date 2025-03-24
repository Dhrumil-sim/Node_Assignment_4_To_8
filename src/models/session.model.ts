import mongoose,{Schema} from "mongoose";

const sessionSchema = new Schema(
   {
      user_id :{
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },

      session_token : {
         type:String,
         required:true,
      },
      
      expireAt : {
        type: Date,
        default: Date.now,
        required: true,
      }

   },{
     timestamps: true,
   }
);

export const Session = mongoose.model("Session",sessionSchema);