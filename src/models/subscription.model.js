import mongoose , {Schema} from "mongoose";

const subsciptionSchema = new Schema({
    subscriber : {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },

    channel : {
        type: Schema.Types.ObjectId,  // one to whom subscriber is suvscribing
        ref: "User"
    }
    
} , {timeseries: true})


export const Subsciption = mongoose.model("Subsciption" , subsciptionSchema)

