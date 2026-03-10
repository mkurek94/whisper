import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1); //exit with failure
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1); //exit with failure
    //status code 1 means failure
    //status code 0 means sucess
  }
};
