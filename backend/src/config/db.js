import mongoose from "mongoose";

const dbConnect = async () => {
  try {

    // Important: Replace process.env.MONGODB_URI with your Atlas connection string
    //Connecting to mognodb atlas with uri string
    const db = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`\nMONGODB is connected to ${db.connection.host}`);
    
    
  } 
  // Handling error if occours during connectint to db
  catch (err) {
    console.log("MONGODB CONNECTION FAILED: ", err);
    process.exit(1);
  }
}

export default dbConnect;