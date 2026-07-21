import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dns from "dns"

// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"])

const connectDB = async () => {
    try {
       const connectionIonInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MongoDb connected !! DB HOST: ${connectionIonInstance.connection.host}`);
       
    }catch(error){
        console.log("MONGODB connection error:", error);
        process.exit(1)
    }
}


export default connectDB